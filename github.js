var https = require('https');

/**
 * Internal method for creating response hollabacks, should not be used on
 * its own
 */
var makeResponse = function(callback) {
    var chunks = '';

    return function(response) {

        // Should do something more elegant. 
        if (response.statusCode != 200) {
            return;
        }

        response.setEncoding('utf8');

        response.on('data', function(chunk) {
            chunks += chunk;
        });

        response.on('end', function() {
            var json = JSON.parse( chunks ),
                err = typeof json.code !== 'undefined' ?
                    'Invalid web service call: '+json.description :
                    null;

            callback(err, json);
        });
    };
}

module.exports = {
    /**
     * Reverse-lookup a track, artist or album URI
     *
     * @param {Object} Options that should be used to do this query
     *                 `type` and `id` is required
     * @param {Function} The hollaback that'll be invoked once there's data
     */
    lookup: function(username, repo, callback) {
        var query = '/repos/' +username+'/'+repo;
        console.log("Query: " + query);
        this.get(query, callback);
    },

    /**
     * Send a request to the Spotify web service API
     *
     * @param {String} The path for this query, see http://developer.spotify.com/en/metadata-api/overview/
     * @param {Function} The hollaback that'll be invoked once there's data
     */
    get: function(query, callback) {
        var opts = {
            host: "api.github.com",
            path: query,
            method: "GET"
        },
        request = https.request(opts, makeResponse( callback ));
        request.end();
    }
};
