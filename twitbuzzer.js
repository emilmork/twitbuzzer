var express     = require('express'),
    app         = express.createServer(),
    twitter     = require('ntwitter'),
    io          = require('socket.io').listen(app),
    spotify     = require('./lib/spotify'),
    github      = require('./lib/github'),
    config      = require('./config'),
    mongodb     = require('./lib/mongodb');


// Start connection to MongoDb
console.log("Connecting to MongoDB");
mongodb.initializeDb();

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
  consumer_key:  config.app.consumer_key,
  consumer_secret:  config.app.consumer_secret,
  access_token_key:  config.app.access_token_key,
  access_token_secret: config.app.access_token_secret
});

app.listen(process.env.PORT || 40825);

console.log("Node running at http://localhost:" + (process.env.PORT || 40825));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/web/index.html');
});

// Serve static files
app.use("/css", express.static(__dirname + '/web/css'));
app.use("/js", express.static(__dirname + '/web/js'));
app.use("/media", express.static(__dirname + '/web/media'));

// Serve API for fetching generated Github Repo objects
app.get(/^\/github(?:\/(\d+)(?:\/(\d+))(?:\/(\d+))?)?/, function (req, res) {
    getAPIData('listGithub', req, res);
});

// Serve API for fetching generated Spotify objects
app.get(/^\/spotify(?:\/(\d+)(?:\/(\d+))(?:\/(\d+))?)?/, function (req, res) {
    getAPIData('listSpotify', req, res);
});


function getAPIData (type, req, res) {
    res.contentType('application/json');
    var params = req.params;
    var daylimit = 1000,
        limit = 10,
        offset = 0;
    
    if(typeof params[0] != "undefined") {
        daylimit = parseInt(params[0]);
        limit = parseInt(params[1]);
    }

    if(params[2] > 0) {
        offset = parseInt(limit*(params[2]-1));
    }

    mongodb[type]("twitbuzzer", daylimit, limit, offset, function (err, data) {
        if (err) console.log(err);
        
        res.send(JSON.stringify(data));
    });
}

// Listen to twitter stream data.
twit.stream('statuses/filter', {'track':'github,spotify'}, function(stream) {
    stream.on('data', handleStream());
});

/*****************************************************
 *                Tweet Stream handling              *
 *               And sending through IO!             *
 *****************************************************/

function handleStream () {

    return function (data) {

        if(data.entities.urls.length < 1) return;

        var githubData  = getGithubID(data.entities.urls);
        var spotifyData = getSpotifyID(data.entities.urls);

        if (githubData.length > 0) {
            // console.log("---- githubData:");
            // console.log(data.text);
            // console.log(githubData);
            emitGithub(githubData);
        } 
        
        if (spotifyData.length > 0 ) {
            // console.log("---- SpotifyData:");
            // console.log(data.text);
            // console.log(spotifyData);
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
        
        mongodb.insert ("twitbuzzer", obj, function (err, docs) {
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
    return getID(urls, config.app.SPOTIFY_REGEX, filter(config.app.SPOTIFY_REGEX));
}

function getGithubID (urls) {
    return getID(urls, config.app.GITHUB_REGEX, filter(config.app.GITHUB_REGEX));
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

/*****************************************************
 *              END Tweet Stream handling            *
 *****************************************************/
