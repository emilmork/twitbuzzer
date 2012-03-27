

/* jQuery Tiny Pub/Sub - v0.7 - 10/27/2011
 * http://benalman.com/
 * Copyright (c) 2011 "Cowboy" Ben Alman; Licensed MIT, GPL */

(function($) {

    var o = $({});

    $.subscribe = function() {
        o.on.apply(o, arguments);
    };

    $.unsubscribe = function() {
        o.off.apply(o, arguments);
    };

    $.publish = function() {
        o.trigger.apply(o, arguments);
    };

}(jQuery));

var App = (function ($, ko, window, document, io, undefined) {
    "use strict";

    var App = function () {

        this.init(arguments[0]);


        return this;
    };

    App.prototype = {

        isSearch: false,

        keyword: "",

        prevLen: 0, // Used for finding out if we have a new search
        timeoutSearch: undefined,

        isLoading: false,
        scrollingMargin: 10,
        isAtBottom: false,

        init: function (searchElm) {
            var self = this;


            this.$searchBox = $(searchElm) || $("#twitbuzzer-q");

            // Listen for socket messages
            self.socket = io.connect(window.location.hostname);

            // Activate infinite scrolling
            self._infiniteScroll();
            // Bind all events (socket listen etc.)
            self._bindEvents();
            // Fix loading indicator etc.
            self._ajaxSettings();


            ko.applyBindings(self.viewModel);
            self.viewModel.app = self;
            self.get();
        },

        _ajaxSettings: function () {
            var self = this;

            $.ajaxSetup({
                type: "GET",
                dataType: "json",
                contentType: "application/json"
            });

            // Using jQuery for Ajax loading indicator - nothing to do with Knockout
            $(".loading-indicator").hide().ajaxStart(function () {
                var $this = $(this);
                self.isLoading = true;
                setTimeout(function () {
                    $this.fadeIn();
                }, 0);
            }).ajaxComplete(function () {
                var $this = $(this);
                setTimeout(function () {
                    $this.fadeOut();
                }, 0);
                self.isLoading = false;
            });
        },

        _bindEvents: function () {
            var self = this;
            

            self.socket.on('tweeted_repo', function (data) {
                self.viewModel.updateRepo(data, function (updated, obj) {
                    // obj is the updated or the initial object.
                    if (updated) {
                        $.publish("repos.updatedRepo", obj);
                    } else {

                        // If a new repo and all repos are showing.
                        // Add a entierly new repo to the list
                        // only if object matches search if in search
                        if ( self.isAtBottom && self.matchesInSearch(obj) ) {
                            self.viewModel.addItem(obj);
                        }

                        $.publish("repos.newRepo", obj);
                    }
                });
            });

            $.subscribe('repos.loadMore', function () {
                self.get();
            });

            // Bind searching for keyword.
            self.$searchBox.on("keyup", function (e) {
                e.preventDefault();
                self.search($(this));

                return false;
            });

            self.$searchBox.parents("form").on("submit", function (e) {
                e.preventDefault();
                return false;
            });
        },

        matchesInSearch: function (obj) {
            if ( !this.isSearch ) {
                return true; // always true if not in search
            }

            var reg = new RegExp("^"+this.keyword, "i");
            return reg.test(obj.info.user) || reg.test(obj.info.repo);
        },

        search: function ($keyword) {

            if ( this.timeoutSearch ) {
                clearTimeout(this.timeoutSearch);
            }

            var val = $keyword.val(),
                len = val.length,
                self = this;

            if (len < 3 && this.prevLen > len && this.prevLen > 2) {
                this.keyword = "";
                this.isSearch = false;
                this.reset();
                this.get();
                self.prevLen = len;
                return;
            } else if ( len < 3 ) {

                self.prevLen = len;
                return; // Do nothing
            }

            if ( this.prevLen === len ) {
                return;
            }


            this.keyword = val;
            this.isSearch = true;

            this.timeoutSearch = setTimeout(function () {
                self.reset();
                self.get();
                self.prevLen = len;
            }, 500);
        },

        _infiniteScroll: function () {
            var self = this;


            $(window).scroll(function () {
                if ($(window).scrollTop() + self.scrollingMargin > $(document).height() - $(window).height() && !self.isLoading && !self.isAtBottom) {
                    $.publish("repos.loadMore");
                }
            });
        },


        reset: function () {
            var self = this;

            self.viewModel.clear();
            self.isAtBottom = false;
            self.prevLen = 0;
        },

        get: function () {

            if ( this.isSearch ) {
                this.viewModel.search( this.keyword );
            } else {
                this.viewModel.append();
            }

        },

        viewModel: {
            repos: ko.mapping.fromJS([], {
                "repos": {
                    key: function(data) {
                        return data._id;
                    }
                }
            }),

            sortFunc: function(left, right) {
                return left.tweet_count - right.tweet_count;
            },

            sortedRepos: ko.dependentObservable(function() {
                return this.instances.slice().sort(this.sortFunc);
            }, this.repos),
            
            currentPage: 0,
            loadNumber: 10,
            cache: [],

            app: null,

            clear: function () {
                this.repos.removeAll();
                this.cache = [];
                this.currentPage = 0;
            },

            addItem: function (obj) {
                var self = this;

                self.cache = $.merge(ko.utils.unwrapObservable(self.repos), [obj]);
                // Extend model
                ko.mapping.fromJS({"repos": self.cache}, self.mapping, self);
                $.publish("repos.rendered");
            },

            append: function () {
                var url = "/api/list/" + this.currentPage + "/" + this.loadNumber;
                this.currentPage += 1; // increase page number.

                this._fetch(url).done(function () {
                    $.publish("repos.rendered");
                });
            },

            search: function (keyword) {
                var url = "/api/search/" + keyword + "/" + this.currentPage + "/" + this.loadNumber;
                this.currentPage += 1; // increase page number.

                this._fetch(url).done(function () {
                    $.publish("repos.rendered");
                });
            },

            updateRepo: function (obj, cb) {
                // Check if it exists
                var repos = this.repos(),
                    reposLen = repos.length,
                    i, o;
                    

                for (i = 0; i < reposLen; i += 1) {
                    o = repos[i];
                    if (o._id() === obj._id) {
                        o.tweet_count(obj.tweet_count);
                        ko.mapping.fromJS(obj.repo_info, {}, o.repo_info);
                        o.dates(obj.dates);
                        this.repos.valueHasMutated();

                        // this.repos.sort( sortFunc );

                        cb.apply(o, [true, ko.utils.unwrapObservable(o)]);
                        return;
                    }
                }

                cb.apply(obj, [false, obj]);
            },

            _fetch: function (url) {
                var self = this;

                return $.ajax({
                    url: url
                }).done(function (data, status, xhr) {

                    if (xhr.status === 204) {
                        // No more content.
                        app.isAtBottom = true;
                        return;
                    }

                    self.cache = $.merge(ko.utils.unwrapObservable(self.repos), data);

                    // Extend model
                    ko.mapping.fromJS({"repos": self.cache}, self.mapping, self);

                    // self.repos.sort(function(left, right) {
                    //     return left.tweet_count - right.tweet_count;
                    // });

                });
            }
        }

    };

    return App;

})(jQuery, ko, window, document, io);

var app = new App($("#q"));

// events for doing extra special stuff.

$.subscribe("repos.rendered", function (){
    // Render all graphs
    $(".repo-graph").repoTweetGraph();
});

$.subscribe("repos.updatedRepo", function (repo){
    // Show indication of increased count.

    // Re-render the graph.
});

$.subscribe("repos.newRepo", function (repo){
    // Do notification
});
