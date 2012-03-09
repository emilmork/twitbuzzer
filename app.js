
/**
 * Module dependencies.
 */

var express       = require('express')
  , app           = module.exports = express.createServer()
  , routes        = require('./routes')
  , githubrepo    = require('github-repo')
  , io            = require('socket.io').listen(app)
  , ts            = require('./lib/repo-streamer').RepoStreamer
  , RepoProvider  = require('./lib/repo-provider').RepoProvider;


var repoStream = new ts()
  , repos = new RepoProvider();

// Configuration

// Heroku Socket.IO support. 
// assuming io is the Socket.IO server object
io.configure(function () { 
  io.enable('browser client minification');  // send minified client
  io.enable('browser client etag');          // apply etag caching logic based on version number
  io.enable('browser client gzip');          // gzip the file
  io.set('log level', 1);                    // reduce logging
    
});

io.configure('development', function () { 
  io.set('transports', [
    'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
  ]);
});

io.configure('production', function () { 
  // reduce logging
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});


app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set("view engine", "html");
  app.register(".html", require("jqtpl").express);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Main Page
app.get('/', routes.index);

// Serve API for fetching generated Github Repo objects
app.get(/^\/api\/list(?:\/(\d+))?(?:\/(\d+))?$/, routes.list);

// Serve API for fetching searched Github Repo objects
app.get(/^\/api\/search\/([a-zA-Z0-9\_\-]{3,})(?:\/(\d+))?(?:\/(\d+))?$/, routes.search);

// When new tweeted repo is availeble, first save it and then send saved object to all clients. 
repoStream.on('tweeted_repo', function (data) {
  if (data.message) {
    return;
  }
  repos.save(data, function (err, obj) {
    if (err) throw err;

    io.sockets.emit('tweeted_repo', obj);
  });
})

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);