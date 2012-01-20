var express = require('express'),
    app = express.createServer(),
    twitter = require('ntwitter'),
    io  = require('socket.io').listen(app),
    spotify = require('./spotify.js'),
    github = require('./github.js'),
    mongoose = require('mongoose'),
    config = require('./config');


// Start connection to MongoDb
initializeDb();

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
    
var GithubSchema = new Schema(
  {
    type : String,
    info: [ String, String ],
    date: Date,
    data: {
        language: String,
        html_url: String,
        name: String,
        description: String,
        owner: {
            avatar_url: String,
            login: String,
            url: String
        },
        forks: Number,
        watchers: Number
    }
  });
mongoose.model('GithubModel', GithubSchema); //tell mongoose about the Ping schema
var GithubModel = mongoose.model('GithubModel'); //ask mongoose to create an instance of the Ping model




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
    res.sendfile(__dirname + '/web/index.html');
});

// Serve static files
app.use("/css", express.static(__dirname + '/web/css'));
app.use("/js", express.static(__dirname + '/web/js'));

app.use("/test", function (req, res) {
    mapReduce("twitbuzzer", function (err, data) {
        if (err) console.log(err);
        
        res.send(JSON.stringify(data));
    });
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

    // spotifyData.forEach(function (elm) {
    //     obj.info = elm;
    //     spotify.lookup({ type: elm[0], id: elm[1] }, emitData(obj));
    // });
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

function count (collectionIdent, json, callback) {
    mongoose.connection.db.collection(collectionIdent, function (err, collection) {
        callback(err, collection.find(json).count());
    });
}

function get (collectionIdent, json, callback) {
    mongoose.connection.db.collection(collectionIdent, function (err, collection) {
        var res = collection.group({"data.html_url": true}, {"type": "github"}, {count: 0}, function(doc, out){ out.count++; }, function(doc) {}, true, callback);
    });
}

function mapReduce (collectionIdent, callback) {

    urlMap = function() { //map function
        emit(this.data.html_url, {
                data: this.data,
                count: 1
            }); //sends the url 'key' and a 'value' of 1 to the reduce function
    } 

    urlReduce = function(previous, current) { //reduce function
        var count = 0;
        for (index in current) {  //in this example, 'current' will only have 1 index and the 'value' is 1
            count += current[index].count; //increments the counter by the 'value' of 1
        }
        return count;
    };

    // current date
    var now = new Date();
    // 7 days earlier
    now.setDate(now.getDate()-10);

    // var command = {
    //     mapreduce: "githubmodels", //the name of the collection we are map-reducing *note, this is the model Ping we defined above...mongoose automatically appends an 's' to the model name within mongoDB
    //     query: { 'date' : { $gt: now } }, //I've included this as an example of how to query for parameters outside of the map-reduced variable
    //     map: urlMap.toString(), //a function we'll define next for mapping
    //     reduce: urlReduce.toString(), //a function we'll define next for reducing
    //     sort: {url: 1}, //let's sort descending...it makes the operation run faster
    //     out: "pingjar" //the collection that will contain the map-reduce results *note, this must be a different collection than the map-reduce input
    // };

    // mongoose.connection.db.executeDbCommand(command, function(err, dbres) {
        
    // });

    /*

    {
    type : String,
    info: [ String, String ],
    date: Date,
    data: {
        language: String,
        html_url: String,
        name: String,
        description: String,
        owner: {
            avatar_url: String,
            login: String,
            url: String
        },
        forks: Number,
        watchers: Number
    }
  }

  */
    var options = {  query: {'date' : { $gt: now }} };
    mongoose.connection.db.collection(collectionIdent, function (err, collection) {

        if(err) console.log( err );

        console.log("Collection:");
        console.log(collection);

        collection.mapReduce(urlMap.toString(), urlReduce.toString(), options, function (err, collection) {
            if(err) console.log( err );

            console.log("Collection:");
            console.log(collection);

            collection.find({}).sort({'value.count': -1}).limit(10).toArray(callback);
        });
    });

    // mongoose.connection.db.collection(collectionIdent, function (err, collection) {
    //     var res = collection.group({"data.html_url": true}, {"type": "github"}, {count: 0}, function(doc, out){ out.count++; }, function(doc) {}, true, callback);
    // });
}

function remove (collectionIdent, json, callback) {
    mongoose.connection.db.collection(collectionIdent, function (err, collection) {
        collection.remove(json);
    });
}
//
// Inserts into a MongoDB collection and returns inserted data
//
function insert (collectionIdent, json, callback) {
    mongoose.connection.db.collection(collectionIdent, function (err, collection) {
        collection.insert(json);
        callback(err, collection);
    });
}



