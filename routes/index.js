
var RepoProvider  = require('../lib/repo-provider.mongoose').RepoProvider,
    repos = new RepoProvider();

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'TwitBuzzer - Tweeted Repo Live Count' });
};


// /^\/api\/list(?:\/(\d+))?(?:\/(\d+))?$/
// /^\/api\/list\/?(?:page:\/(\d+))?(?:limit:\/(\d+))?$/
exports.list = function(req, res){
  var page = req.param("page") || 0,
      limit = req.param("limit") || 10,
      dayLimit = req.param("days") || 0;

  repos.dayFilter = dayLimit;

  repos.findSelected(page, limit, function (err, obj) {
    res.contentType('application/json');

    if (err || obj.length < 1) {
      // Not found. Show error
      res.send({error: true, message: "Not found"}, 204);
      return;
    }

    res.send(obj);
  });
};

exports.search = function(req, res){

  res.contentType('application/json');

  var page = req.param("page") || 0,
      limit = req.param("limit") || 10,
      keyword = req.param("keyword"),
      dayLimit = req.param("days") || 0;

  if ( !keyword ) {
    res.send({error: true, message: "Not found"}, 204);
  }

  repos.dayFilter = dayLimit;

  repos.search(keyword, page, limit, function (err, obj) {
    
    if (err || obj.length < 1) {
      // Not found. Show error
      res.send({error: true, message: "Not found"}, 204);
      return;
    }

    res.send(obj);
  });
};