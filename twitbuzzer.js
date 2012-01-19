var app = require('express').createServer(),
    twitter = require('ntwitter'),
    io  = require('socket.io').listen(app),
    spotify = require('./spotify.js'),
    github = require('./github.js'),
    mongoose = require('mongoose'),
    config = require('./config');


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
    res.sendfile(__dirname + '/public/index.html');
});

twit.stream('statuses/filter', {'track':'github,spotify'}, function(stream) {
    stream.on('data', handleStream());
});

function handleStream () {

    return function (data) {

        if(data.entities.urls.length < 1) return;

        var githubData  = getGithubID(data.entities.urls),
            spotifyData = getSpotifyID(data.entities.urls);

        if (githubData.length > 0) {
            console.log("---- githubData:");
            console.log(data.text);
            console.log(githubData);
            emitGithub(githubData);
        } 
        
        if (spotifyData.length > 0 ) {
            console.log("---- SpotifyData:");
            console.log(data.text);
            console.log(spotifyData);
            emitSpotify(spotifyData);
        }
    }
}



function emitData (sendObj) {
    var obj = sendObj;

    return function (err, data) {
        if ( err ) {
            console.log('Error occurred: ' + err);
            return;
        }

        obj.data = data;
        obj.date = new Date();
        
        insert ("twitbuzzer", obj, function (err, docs) {
            if (err) {
                console.log("Insert error", err);
                return;
            }

            io.sockets.emit('new_tweet', obj);
        });
    }
}

function emitGithub(githubData) {
    var obj = {
        type: "github"
    };

    githubData.forEach(function (elm) {
        obj.info = elm;
        github.lookup(elm[0], elm[1], emitData(obj));
    });
}

function emitSpotify(spotifyData) {
    var obj = {
        type: "spotify"
    };

    spotifyData.forEach(function (elm) {
        obj.info = elm;
        spotify.lookup({ type: elm[0], id: elm[1] }, emitData(obj));
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
    return getID(urls, config.SPOTIFY_REGEX, filter(config.SPOTIFY_REGEX));
}

function getGithubID (urls) {
    return getID(urls, config.GITHUB_REGEX, filter(config.GITHUB_REGEX));
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


/*********************
 * MongoDB Handling 
 *********************/



//
// Opens connection to MongoDB database, authenticates, logs successful connection.
//
function initializeDb() {
    mongoose.connection.on("open", function() {
        console.log("Connected to MongoDB successfully!");
    });
    mongoose.connect("mongodb://" + config.DB_USER + ":" + config.DB_PASS + "@" + config.DB_URL + "/" + config.DB_NAME);   
}


//
// Queries a MongoDB collection to retrieve data based on
// properties supplied by json parameter.
//
function query (collectionIdent, json, callback) {
    mongoose.connection.db.collection(collectionIdent, function (err, collection) {
        collection.find(json).toArray(callback);
    });
}

//
// Inserts into a MongoDB collection and returns inserted data
//
function insert (collectionIdent, json, callback) {
    mongoose.connection.db.collection(collectionIdent, function (err, collection) {
        collection.insert(json);
        });
}



