
var config = require("./config")
  , mongoose = require('mongoose');

console.log(databaseUrl)
exports.RepoProvider = RepoProvider = function () { 

  console.log("Now trying to connect to MongoDB");
  mongoose.connection.on("open", function() {
      console.log("Connected to MongoDB successfully!");
  });
  mongoose.connect(config.app.MONGOLAB_URI); 

  this.collection = "repos";
};


RepoProvider.prototype.find = function ( query, cb ) {
  var self = this;

  mongoose.connection.db.collection(this.collection, function (err, collection) {
    collection.find(query).sort({"tweet_count": -1}.toArray(function (data) {
      cb.apply(self, [err, data]);
    });
  });

  
};

/**
 * 
 **/
RepoProvider.prototype.findSelected = function ( page, lim, cb ) {
  var self = this;

  lim =  parseInt(lim);
  page =  parseInt(page);

  console.log("should be here", db.repos);

  mongoose.connection.db.collection(this.collection, function (err, collection) {
    collection.find().sort({"tweet_count": -1}).limit(lim).skip(page*lim).toArray(function (data) {
      cb.apply(self, [err, data]);
    });
  });

};

RepoProvider.prototype.search = function ( q, page, lim, cb ) {
  var self = this
    , regex = { "$regex" : new RegExp("^"+q, "i") }
    , query = {
      "$or": [
        {"info.user": regex}, 
        {"info.repo": regex}
      ]
    };

  lim =  parseInt(lim);
  page =  parseInt(page);

  mongoose.connection.db.collection(this.collection, function (err, collection) {
    collection.find(query).sort({"tweet_count": -1}).skip(page*lim).skip(page*lim).toArray(function (data) {
      cb.apply(self, [err, data]);
    });
  });
};

RepoProvider.prototype.get = function ( id, cb ) {

  mongoose.connection.db.collection(this.collection, function (err, collection) {
    collection.find({"_id":id}).toArray(function (data) {
      cb.apply(self, [err, data]);
    });
  });
};

RepoProvider.prototype.update = function ( repo, cb ) {
  var self = this;
  repo = repo.repo_info || repo;

  cb.apply(self, ["foo", repo]);return;

  if (repo.message) {
    cb.apply(self, [repo.message, repo]);
    return;
  }

  var id = repo.id;


  db.repos.findAndModify(
    {
      query: {"_id": id},
      update: {
        "$inc": {"tweet_count": 1}, 
        "$push": {"dates": new Date()}, 
        "$set": {"repo_info": repo}
      },
      "new": true
    }, 
    function (err, obj) {
      console.log("but probably never here");
      cb.apply(self, [err, obj])
    }
  );
};

RepoProvider.prototype.insert = function ( repo, cb ) {
  repo = repo.repo_info || repo;

  var self = this;
  
  repo = repo.repo_info || repo;

  if (repo.message) {
    cb.apply(self, [repo.message, repo]);
    return;
  }

  var id = repo.id;

  var obj = {
    _id: repo.id,
    info: {
      "user": repo.owner.login,
      "repo": repo.name
    },
    dates: [
      new Date()
    ],
    tweet_count: 1,
    repo_info: repo
  };

  mongoose.connection.db.collection(this.collection, function (err, collection) {
    collection.insert(obj);
    cb.apply(self, [err, obj]);
  });
};


RepoProvider.prototype.save = function ( repo, cb ) {
  var self = this;

  // Maybe use findAndModifies upsert instead of multiple queries?

  console.log("all up in save");

  if (repo.message) {
    cb.apply(self, [repo.message, repo]);
    return;
  }

  this.update(repo, function (err, obj) {
    if (err || !obj) {
      self.insert (repo, cb);
    } else {
      cb.apply(this, [err, obj]);
    }
  });
  return self;
};