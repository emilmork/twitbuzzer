var app = require('express').createServer(),
    twitter = require('ntwitter'),
    io  = require('socket.io').listen(app),
    spotify = require('./spotify.js'),
    github = require('./github.js');


// Heroku Socket.IO support. 
// assuming io is the Socket.IO server object
io.configure(function () { 
    io.enable('browser client minification');  // send minified client
    io.enable('browser client etag');          // apply etag caching logic based on version number
    io.enable('browser client gzip');          // gzip the file
    io.set('log level', 1);                    // reduce logging
    io.set("transports", ["xhr-polling"]); 
    io.set("polling duration", 10); 
});

var twit = new twitter({
  consumer_key: 'd45dmERqPcgbhXUXtXciQ',
  consumer_secret: 'YVw7xoMzVC6p7RNrTsTFcd2VPxQN0oTnilcHmH8cs',
  access_token_key: '40382389-AWpD5CVziGPIrrvTFmNp6YffLrEShUvzNQ1iRQuc8',
  access_token_secret: 'Zz39fgkdezr7ZX0xOPdIR7pf7zrpKkYz3S9CEk1E'
});

app.listen(process.env.PORT || 40825);

console.log("Node running at http://localhost:" + (process.env.PORT || 40825));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

// new mongodb.Db('test', server, {}).open(function (error, client) {
//     if (error) throw error;

//     var collection = new mongodb.Collection(client, 'test_collection');
    var collection = "";
    twit.stream('statuses/filter', {'track':'github,spotify'}, function(stream) {
        stream.on('data', handleStream(collection));
    });

// });

var SPOTIFY_REGEX   = /http(?:s?):\/\/open\.spotify\.com\/([a-z]+)\/([a-zA-Z0-9]{22})/,
    GITHUB_REGEX    = /http(?:s?):\/\/github\.com\/([a-zA-Z0-9\_\-]+)\/([a-zA-Z0-9\_\-]+)\/?/

function handleStream (collection) {

    return function (data) {

        if(data.entities.urls.length < 1) return;

        var githubData  = getGithubID(data.entities.urls),
            spotifyData = getSpotifyID(data.entities.urls);

        if (githubData.length > 0) {
            console.log("---- githubData:");
            console.log(data.text);
            console.log(githubData);
            emitGithub(githubData, collection);
        } 
        
        if (spotifyData.length > 0 ) {
            console.log("---- SpotifyData:");
            console.log(data.text);
            console.log(spotifyData);
            emitSpotify(spotifyData, collection);
        }
    }
}



function emitData (sendObj, collection) {
    var obj = sendObj;

    return function (err, data) {
        if ( err ) {
            console.log('Error occurred: ' + err);
            return;
        }

        // obj.data = data;
        // obj.date = new Date();

        // collection.insert(obj, {safe:true}, function(error, objects) {
        //     if (err) console.warn(err.message);
        //     if (err && err.message.indexOf('E11000 ') !== -1) {
        //         // this _id was already inserted in the database
        //     }

            io.sockets.emit('new_tweet', obj);
        // });
    }
}

function emitGithub(githubData, collection) {
    var obj = {
        type: "github"
    };

    githubData.forEach(function (elm) {
        obj.info = elm;
        github.lookup(elm[0], elm[1], emitData(obj, collection));
    });
}

function emitSpotify(spotifyData, collection) {
    var obj = {
        type: "spotify"
    };

    spotifyData.forEach(function (elm) {
        obj.info = elm;
        spotify.lookup({ type: elm[0], id: elm[1] }, emitData(obj, collection));
    });
}

function filter(regex) {
    var reg = regex;
    return function (url) {
        var matches = url.match(reg);
        if(matches.length < 1) return;
        return [matches[1], matches[2]];
    }; 
}

function getSpotifyID (urls) {
    return getID(urls, SPOTIFY_REGEX, filter(SPOTIFY_REGEX));
}

function getGithubID (urls) {
    return getID(urls, GITHUB_REGEX, filter(GITHUB_REGEX));
}

function getID(urls, regex, filter) {
    var id = [];
    urls.forEach(function (elm) {
        if(regex.test(elm.expanded_url)) {
            id.push(filter(elm.expanded_url));
        }
    });
    return id;
}


