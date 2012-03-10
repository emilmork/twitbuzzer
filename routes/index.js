
var RepoProvider  = require('../lib/repo-provider.mongoose').RepoProvider
  , repos = new RepoProvider();

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.partial('index', { title: 'Express' });
};

exports.list = function(req, res){
  var page = req.params[0] || 0,
      limit = req.params[1] || 10;

  console.log("HERAAA????????");

  repos.findSelected(page, limit, function (err, obj) {
    
    res.contentType('application/json');

    if (err || obj.length < 1) {
      // Not found. Show error
      res.send({error: true, message: "Not found"}, 204);
      return;
    }

    res.send(obj);
  });
};

exports.search = function(req, res){
  var page = req.params[1] || 0,
      limit = req.params[2] || 10,
      keyword = req.params[0];

  repos.search(keyword, page, limit, function (err, obj) {
    res.contentType('application/json');

    if (err || obj.length < 1) {
      // Not found. Show error

      res.send({error: true, message: "Not found"}, 204);
      return;
    }

    res.send(obj);
  });
};