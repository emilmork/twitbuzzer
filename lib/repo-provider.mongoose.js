
var config = require("./config"),
    mongoose = require('mongoose');

require('date-utils');

exports.RepoProvider = RepoProvider = function (){

  console.log("Now trying to connect to MongoDB");
  mongoose.connection.on("open", function() {
      console.log("Connected to MongoDB successfully!");
  });
  mongoose.connect(config.app.DB_URI);

  this.collection = "repos";

  return this;
};

RepoProvider.prototype.dayFilter = 7;

RepoProvider.prototype._getFilterQuery = function ( extra ) {
  var self = this,
      query = extra ? extra : {};

  // Add filter for days.
  if ( self.dayFilter < 1 ) {
    return query;
  }

  var now = (new Date()),
      then = now.clone().clearTime().addDays(-self.dayFilter);

  // Only select where dates are between now and self.dayFilter days ago.
  query.dates = {
    '$lte': now,
    '$gte': then
  };
  return query;

};

RepoProvider.prototype._filterOutputCallback = function ( cb ) {
  var self = this,
      output = [], obj;

  return function (err, objs) {
    

    if ( !objs ) {
      cb.apply(cb, [err, [] ]);
      return;
    }

    // Add filter for days.
    if ( self.dayFilter < 1 ) {
      cb.apply(cb, [err, objs]);
      return;
    }

    var now = (new Date()),
        then = now.clone().clearTime().addDays(-self.dayFilter),
        date;

    for ( var i = 0, ln = objs.length; i < ln; i += 1 ) {

      output = [];
      obj = objs[i];
      for ( var j = 0, lnj = obj.dates.length; j < lnj; j += 1 ) {
        date = new Date(obj.dates[j]);
        if ( date.between(then, now) ) {
          output.push( date );
        }
        
      }
      obj.dates = output;

    }

    cb.apply(cb, [err, objs]);
  };

};

RepoProvider.prototype.find = function ( query, cb ) {
  var self = this;

  mongoose.connection.db.collection(this.collection, function (err, collection) {
    collection.find(query).sort({"tweet_count": -1}).toArray(function (data) {
      cb.apply(self, [err, data || []]);
    });
  });
};

/**
 *
 **/
RepoProvider.prototype.findSelected = function ( page, lim, cb ) {
  var self = this,
      query = self._getFilterQuery();

  lim =  (lim) ? parseInt(lim, 10) : 10;
  page =  (page) ? parseInt(page, 10) : 0;

  mongoose.connection.db.collection(this.collection, function (err, collection) {
    if (err) throw err;
    collection.find(query).sort({"tweet_count": -1}).limit(lim).skip(page*lim).toArray(self._filterOutputCallback(cb));
  });

};

RepoProvider.prototype.search = function ( q, page, lim, cb ) {
  var self = this,
      regex = { "$regex" : new RegExp("^"+q, "i") },
      query = self._getFilterQuery({
      "$or": [
        {"info.user": regex},
        {"info.repo": regex}
      ]
    });

  lim =  parseInt(lim, 10);
  page =  parseInt(page, 10);

  mongoose.connection.db.collection(this.collection, function (err, collection) {
    collection.find(query).sort({"tweet_count": -1}).skip(page*lim).skip(page*lim).toArray(self._filterOutputCallback(cb));
  });
};

RepoProvider.prototype.get = function ( id, cb ) {

  mongoose.connection.db.collection(this.collection, function (err, collection) {
    collection.find({"_id":id}).toArray(cb);
  });
};

RepoProvider.prototype.update = function ( repo, cb ) {
  var self = this;
  repo = repo.repo_info || repo;

  if (repo.message) {
    cb.apply(self, [repo.message, repo]);
    return;
  }

  var id = repo.id;

  mongoose.connection.db.collection(this.collection, function (err, collection) {
    // collection.findAndModify(query, sort, doc, options, callback);
    collection.findAndModify({"_id": id}, [], {
        "$inc": {"tweet_count": 1},
        "$push": {"dates": new Date()},
        "$set": {"repo_info": repo}
      }, {"new": true}, cb);
  });

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
    collection.save(obj);
    cb.apply(self, [err, obj]);
  });
};


RepoProvider.prototype.save = function ( repo, cb ) {
  var self = this;

  // Maybe use findAndModifies upsert instead of multiple queries?

  if (repo.message) {
    cb.apply(self, [repo.message, repo]);
    return;
  }

  this.update(repo, function (err, obj) {
    if (err || !obj) {
      self.insert (repo, cb);
    } else {
      cb.apply(this, [err, obj]);
    }
  });
  return self;
};