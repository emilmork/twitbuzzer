var mongoose = require('mongoose'),
    config = require('./config');


/*********************
 * MongoDB Handling 
 *********************/

 module.exports = {

    initializeDb: function () {
        mongoose.connection.on("open", function() {
            console.log("Connected to MongoDB successfully!");
        });
        mongoose.connect("mongodb://" + config.DB_USER + ":" + config.DB_PASS + "@" + config.DB_URL + "/" + config.DB_NAME);   
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

    mapReduce: function  (collectionIdent, daylimit, limit, page, callback) {

        urlMap = function() { //map function
            emit(this.data.id, {
                data: { // Github Model
                    language: this.data.language,
                    html_url: this.data.html_url,
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
            }); //sends the url 'key' and a 'value' of 1 to the reduce function
        } 

        urlReduce = function(key, values) { //reduce function
            var reduced = {"data":{}, count: 0, "date": 0};
            reduced.date = values[0].date;
            reduced.data = values[0].data;

            for (var i in values) {
                reduced.count += values[i].count;
            }

            return reduced;
        };

        mongoose.connection.db.collection(collectionIdent, function (err, collection) {

            if(err) console.log( "Error", err );

            // current date
            var now = new Date();
            now.setDate(now.getDate()-daylimit);

            var query = {'date' : { $gt: now }};
            var options = {  query: query };

            collection.mapReduce(urlMap.toString(), urlReduce.toString(), options, function (err, collection) {
                if(err) console.log( "Error", err );

                collection.find({}).sort({'value.count': -1}).limit(10).toArray(callback);
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


