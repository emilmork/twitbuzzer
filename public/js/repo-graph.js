
(function ($, graph, console) {

    "use strict";

    var addGraphView = function (elm, labels, data, width, height) {
        graph(elm[0], labels, data, width, height);
    };

    var createStats = function (time, dates) {
        var key = [], value = [],
            len = dates.length,
            i, cur, k, j,
            history = Date.today().addDays(-time), // Date.parse("4 weeks ago"),
            currentDate = history.clone();

        for (i = 0; i < len; i += 1) {
            cur = dates[i];

            if ( !cur.between( history, Date.today().addDays(1) ) ) {
                continue;
            }

            k = cur.getDate() + "-" + (cur.getMonth() + 1) + "-" + cur.getFullYear();

            j = key.indexOf(k);
            if (j >= 0) {
                value[j] += 1;
            } else {
                key.push(k);
                value.push(1);
            }
        }

        var resultDate = [],
            resultHits = [];

        // Generate table with last 31 days:
        while ( currentDate.between( history, Date.today() ) ) {

            k = currentDate.getDate() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getFullYear();

            resultDate.push(k);
            j = key.indexOf(k);

            if (j >= 0) {
                resultHits.push(value[j]);
            } else {
                resultHits.push(0);
            }

            currentDate.addDays(1);
        }

        return {labels: resultDate, data: resultHits};
    };

    var methods = {
        init: function (options) {

            return this.each(function () {
                var $this = $(this),
                    data = $this.data("tweet-graph");


                if (!data) {
                    var settings = $.extend({}, $.fn.repoTweetGraph.defaults, options);

                    if ( settings.time === 0 ) {
                        settings.time = 30;
                    }
                    else if ( settings.time < 4 ) {
                        settings.time = 7;
                    }

                    $this.data("tweet-graph", { _settings: settings });
                    methods.refresh.call(this);
                }
                
                return this;
            });
        },

        refresh: function (numNodes) {
            var $this = $(this),
                data = $this.data("tweet-graph");

            // Set new amount of nodes in stats viewed.
            if ( numNodes ) {

                if ( numNodes === 0 ) {
                    data._settings.time = 30;
                }
                else if ( numNodes < 4 ) {
                    data._settings.time = 7;
                }
                else {
                    data._settings.time = numNodes;
                }
            }

            $this.html("");
            var elm = $('<div />', {
                height: data._settings.height,
                width: data._settings.width
            }).appendTo($this);

            $this.data("tweet-graph", {
                _settings: data._settings,
                elm: elm
            });

            methods._render.call(this);
        },

        _extractStats: function () {
            var $this = $(this),
                dates = $this.attr("data-graph-dates");

            return createStats($this.data("tweet-graph")._settings.time, $.map(dates.split(","), function (val, i) {
                return new Date(val);
            }));

        },

        _render: function () {
            var $this = $(this),
                data = $this.data("tweet-graph");

            var stats = methods._extractStats.call(this);


            addGraphView(data.elm, stats.labels, stats.data, data._settings.width, data._settings.height);
        }
    };

        

    $.fn.repoTweetGraph = function (method) {
        // Check if elm has inited graph and trying to run method
        if ( !this.data("tweet-graph") && typeof method === "string") {
            $.error( 'Element not initiated as a jQuery.repoTweetGraph object' );
            return this;
        }
        
        // Allow method calls (but not prefixed by _)
        if ( typeof method === "string" && method.substr(0,1) !== "_" && methods[ method ] ) {
            return methods[method].apply(this, Array.prototype.slice.call( arguments, 1 ));
        }
        // If argument is object or not set, init plugin.
        else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        }
        // No method found by argument input. Could be a private method.
        else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.repoTweetGraph' );
            return this;
        }
    };


    $.fn.repoTweetGraph.defaults = {
        width: 300,
        height: 100,
        time: 30
    };

})(jQuery, graph, console);