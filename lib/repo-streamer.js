var twitter      = require('ntwitter'),
    util     = require('util'),
    events  = require('events'),
    config  = require('./config'),
    github = require("github-repo");


var twit = new twitter({
  consumer_key:  config.app.consumer_key,
  consumer_secret:  config.app.consumer_secret,
  access_token_key:  config.app.access_token_key,
  access_token_secret: config.app.access_token_secret
});

function RepoStreamer() {

  if(false === (this instanceof RepoStreamer)) {
    return new RepoStreamer();
  }

  events.EventEmitter.call(this);
  this.init();
}
util.inherits(RepoStreamer, events.EventEmitter);


RepoStreamer.prototype.handleStream = function (data) {

  if(data.entities.urls.length < 1) return;

  var githubData  = this.getGithubID(data.entities.urls);

  if (githubData.length > 0) {
    this.emitGithub(githubData);
  }
};

RepoStreamer.prototype.init = function () {
  var self = this;

  console.log(" *** In error **** ");

  // Listen to twitter stream data.
  twit.stream('statuses/filter', {'track':'github'}, function(st) {
    console.log(" *** In Wrapper **** ");

    st.on('data', function (data) {
      self.handleStream.apply(self, [data]);
    });

    st.on("error", function (data) {
      console.log(" *** In error **** ");
      self.handleStream.apply(self, [data]);
    });
  });
};

RepoStreamer.prototype.emitGithub = function (githubData) {
  var self = this;

  console.log("Githubdata: ", githubData);

  githubData.forEach(function (elm) {
    github.open(elm.user, elm.repo, function (err, repoData) {
      if (err || repoData.message) return;

      self.emit('tweeted_repo', repoData);
    });
  });
};

RepoStreamer.prototype.getGithubID = function (urls) {

  return this.getAllID(urls, function (url) {

    if (url === null) {
      return false;
    }
      
    var matches = url.match(config.app.GITHUB_REGEX);
    if(!matches || matches.length < 1) return false;

    return {'user': matches[1], 'repo': matches[2]};

  });
};

RepoStreamer.prototype.getAllID = function (urls, filter) {
  var id = [];
  urls.forEach(function (elm) {

    var filt = filter(elm.expanded_url);

    if (filt) {
      id.push(filt);
    }
  });

  return id;
};

exports.RepoStreamer = RepoStreamer;
