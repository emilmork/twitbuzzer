var mongoose = require('mongoose'),
    config = require('../config');


/*********************
 * MongoDB Handling 
 *********************/

 module.exports = {

    initializeDb: function () {
        console.log("Now trying to connect to MongoDB");
        mongoose.connection.on("open", function() {
            console.log("Connected to MongoDB successfully!");
        });
        mongoose.connect("mongodb://" + config.app.DB_USER + ":" + config.app.DB_PASS + "@" + config.app.DB_URL + "/" + config.app.DB_NAME);   
    },

    query: function  (collectionIdent, json, callback) {
        mongoose.connection.db.collection(collectionIdent, function (err, collection) {
            collection.find(json).toArray(callback);
        });
    },

    count: function  (collectionIdent, json, callback) {
        mongoose.connection.db.collection(collectionIdent, function (err, collection) {
            callback(err, collection.find(json).count());
        });
    },

    get: function  (collectionIdent, json, callback) {
        mongoose.connection.db.collection(collectionIdent, function (err, collection) {
            var res = collection.group({"data.html_url": true}, {"type": "github"}, {count: 0}, function(doc, out){ out.count++; }, function(doc) {}, true, callback);
        });
    },

    listSpotify: function  (collectionIdent, daylimit, limit, offset, callback) {

        var urlMap = function() { //map function
            // Check if Spotify data
            var track = this.data.track;
            emit(track.href, {
                data: { // Github Model
                    album: track.album,
                    artists: track.artists,
                    href: track.href,
                    name: track.name,
                    popularity: track.popularity,
                    length: track.length
                },
                count: 1,
                date: this.date
            }); //sends the url 'key' and a 'value' to the reduce function
        };

        var urlReduce = function(key, values) { //reduce function
            var reduced = {"data":{}, count: 0, "date": 0};
            reduced.date = values[0].date;
            reduced.data = values[0].data;

            for (var i in values) {

                if( reduced.data.popularity != values[i].data.popularity ) {
                    reduced.data.popularity = values[i].data.popularity;
                }
                
                reduced.count += values[i].count;
            }

            return reduced;
        };


        // current date
        var now = new Date();
        now.setDate(now.getDate()-daylimit);

        var query = {'date' : { $gt: now }, 'type' : "spotify"};

        this.mapReduce(collectionIdent, urlMap, urlReduce, query, limit, offset, callback);

    },

    listGithubByKeyword: function (collection, keyword, daylimit, limit, offset, callback) {
        
        // current date
        var now = new Date();
        now.setDate(now.getDate()-daylimit);

        var query = {'date' : { $gt: now }, 'type' : "github", "info" : keyword };

        this.mapReduce(collectionIdent, this.mapGithub, this.reduceGithub, query, limit, offset, callback);
    },

    mapGithub: function() { //map function
        // Check if Github data
        emit(this.data.id, {
            data: { // Github Model
                language: this.data.language,
                html_url: this.data.html_url,
                api_url: this.data.url,
                name: this.data.name,
                description: this.data.description,
                owner: {
                    avatar_url: this.data.owner.avatar_url,
                    login: this.data.owner.login,
                    url: this.data.owner.url
                },
                forks: this.data.forks,
                watchers: this.data.watchers
            },
            count: 1,
            date: this.date
        }); //sends the url 'key' and a 'value' to the reduce function
    },

    reduceGithub: function(key, values) { //reduce function
        var reduced = {
            "data": values[values.length-1].data, 
            "date": values[values.length-1].date,
            count: 0
        };

        for (var i in values) {
            reduced.count += values[i].count;
        }

        return reduced;
    },

    listGithub: function  (collectionIdent, daylimit, limit, offset, callback) {
        // current date
        var now = new Date();
        now.setDate(now.getDate()-daylimit);

        var query = {'date' : { $gt: now }, 'type' : "github"};

        this.mapReduce(collectionIdent, this.mapGithub, this.reduceGithub, query, limit, offset, callback);

    },

    mapReduce: function (collectionIdent, map, reduce, query, limit, offset, callback) {
        mongoose.connection.db.collection(collectionIdent, function (err, collection) {

            if(err) console.log( "Error", err );

            var options = {  query: query };

            collection.mapReduce(map.toString(), reduce.toString(), options, function (err, collection) {
                if(err) console.log( "Error", err );

                collection.find({}).sort({'value.count': -1, 'value.date': 1}).skip(offset).limit(limit).toArray(callback);
            });
        });
    },

    remove: function  (collectionIdent, json, callback) {
        mongoose.connection.db.collection(collectionIdent, function (err, collection) {
            collection.remove(json);
        });
    },
    //
    // Inserts into a MongoDB collection and returns inserted data
    //
    insert: function  (collectionIdent, json, callback) {
        mongoose.connection.db.collection(collectionIdent, function (err, collection) {
            collection.insert(json);
            callback(err, collection);
        });
    }

}


