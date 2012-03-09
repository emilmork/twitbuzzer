
var config = require("./config")
  , databaseUrl = "mongodb://" + config.app.DB_USER + ":" + config.app.DB_PASS + "@" + config.app.DB_URL + "/" + config.app.DB_NAME
  , collections = ["repos"]
  , db = require("mongojs").connect(databaseUrl, collections);

console.log(db)
exports.RepoProvider = RepoProvider = function () { };


RepoProvider.prototype.find = function ( query, cb ) {
  var self = this;

  db.repos.find(query).sort({"tweet_count": -1}, function (err, data) {
    cb.apply(self, [err, data]);
  });
};

/**
 * 
 **/
RepoProvider.prototype.findSelected = function ( page, lim, cb ) {
  var self = this;

  lim =  parseInt(lim);
  page =  parseInt(page);

  db.repos.find().sort({"tweet_count": -1}).limit(lim).skip(page*lim, function (err, data) {
    cb.apply(self, [err, data]);
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

  db.repos.find(query).sort({"tweet_count": -1}).skip(page*lim).limit(lim, function (err, data) {
    cb.apply(self, [err, data]);
  });
};

RepoProvider.prototype.get = function ( id, cb ) {
  db.repos.find({"_id":id}, function (err, data) {
    cb.apply(self, [err, data]);
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

  db.repos.save(obj, function (err, saved) {
    cb.apply(self, [err, obj]);
  })

};


RepoProvider.prototype.save = function ( repo, cb ) {
  var self = this;

  // Maybe use findAndModifies upsert instead of multiple queries?

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