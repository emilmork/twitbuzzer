// // Knockout Mapping plugin v2.1.0
// // (c) 2011 Steven Sanderson, Roy Jacobs - http://knockoutjs.com/
// // License: MIT (http://www.opensource.org/licenses/mit-license.php)

// (function(d){"function"===typeof require&&"object"===typeof exports&&"object"===typeof module?d(require("knockout"),exports):"function"===typeof define&&define.amd?define(["knockout","exports"],d):d(ko,ko.mapping={})})(function(d,f){function C(a,c){for(var b in c)c.hasOwnProperty(b)&&c[b]&&(b&&a[b]&&!(a[b]instanceof Array)?C(a[b],c[b]):a[b]=c[b])}function D(a,c){var b={};C(b,a);C(b,c);return b}function E(a,c){a=a||{};if(a.create instanceof Function||a.update instanceof Function||a.key instanceof Function||
// a.arrayChanged instanceof Function)a={"":a};c&&(a.ignore=i(c.ignore,a.ignore),a.include=i(c.include,a.include),a.copy=i(c.copy,a.copy));a.ignore=i(a.ignore,g.ignore);a.include=i(a.include,g.include);a.copy=i(a.copy,g.copy);a.mappedProperties=a.mappedProperties||{};return a}function i(a,c){a instanceof Array||(a="undefined"===f.getType(a)?[]:[a]);c instanceof Array||(c="undefined"===f.getType(c)?[]:[c]);return a.concat(c)}function M(a,c){var b=d.dependentObservable;d.dependentObservable=function(b,
// c,e){var e=e||{},f=e.deferEvaluation;b&&"object"==typeof b&&(e=b);var l=!1,k=function(b){var c=o({read:function(){l||(d.utils.arrayRemoveItem(a,b),l=!0);return b.apply(b,arguments)},write:function(a){return b(a)},deferEvaluation:!0});c.__ko_proto__=o;return c};e.deferEvaluation=!0;b=new o(b,c,e);b.__ko_proto__=o;f||(a.push(b),b=k(b));return b};d.computed=d.dependentObservable;var e=c();d.dependentObservable=b;d.computed=d.dependentObservable;return e}function z(a,c,b,e,v,g){var y=d.utils.unwrapObservable(c)instanceof
// Array,g=g||"";if(f.isMapped(a))var j=d.utils.unwrapObservable(a)[n],b=D(j,b);var l=function(){return b[e]&&b[e].create instanceof Function},k=function(a){return M(F,function(){return b[e].create({data:a||c,parent:v})})},s=function(){return b[e]&&b[e].update instanceof Function},q=function(a,f){var h={data:f||c,parent:v,target:d.utils.unwrapObservable(a)};d.isWriteableObservable(a)&&(h.observable=a);return b[e].update(h)};if(j=A.get(c))return j;e=e||"";if(y){var y=[],m=!1,h=function(a){return a};b[e]&&
// b[e].key&&(h=b[e].key,m=!0);d.isObservable(a)||(a=d.observableArray([]),a.mappedRemove=function(b){var c="function"==typeof b?b:function(a){return a===h(b)};return a.remove(function(a){return c(h(a))})},a.mappedRemoveAll=function(b){var c=w(b,h);return a.remove(function(a){return-1!=d.utils.arrayIndexOf(c,h(a))})},a.mappedDestroy=function(b){var c="function"==typeof b?b:function(a){return a===h(b)};return a.destroy(function(a){return c(h(a))})},a.mappedDestroyAll=function(b){var c=w(b,h);return a.destroy(function(a){return-1!=
// d.utils.arrayIndexOf(c,h(a))})},a.mappedIndexOf=function(b){var c=w(a(),h),b=h(b);return d.utils.arrayIndexOf(c,b)},a.mappedCreate=function(b){if(-1!==a.mappedIndexOf(b))throw Error("There already is an object with the key that you specified.");var c=l()?k(b):b;s()&&(b=q(c,b),d.isWriteableObservable(c)?c(b):c=b);a.push(c);return c});var j=w(d.utils.unwrapObservable(a),h).sort(),i=w(c,h);m&&i.sort();for(var m=d.utils.compareArrays(j,i),j={},i=[],o=0,u=m.length;o<u;o++){var t=m[o],p,r=g+"["+o+"]";switch(t.status){case "added":var x=
// B(d.utils.unwrapObservable(c),t.value,h);p=z(void 0,x,b,e,a,r);l()||(p=d.utils.unwrapObservable(p));r=I(d.utils.unwrapObservable(c),x,j);i[r]=p;j[r]=!0;break;case "retained":x=B(d.utils.unwrapObservable(c),t.value,h);p=B(a,t.value,h);z(p,x,b,e,a,r);r=I(d.utils.unwrapObservable(c),x,j);i[r]=p;j[r]=!0;break;case "deleted":p=B(a,t.value,h)}y.push({event:t.status,item:p})}a(i);b[e]&&b[e].arrayChanged&&d.utils.arrayForEach(y,function(a){b[e].arrayChanged(a.event,a.item)})}else if(G(c)){a=d.utils.unwrapObservable(a);
// if(!a){if(l())return m=k(),s()&&(m=q(m)),m;if(s())return q(m);a={}}s()&&(a=q(a));A.save(c,a);J(c,function(e){var f=g.length?g+"."+e:e;if(-1==d.utils.arrayIndexOf(b.ignore,f))if(-1!=d.utils.arrayIndexOf(b.copy,f))a[e]=c[e];else{var v=A.get(c[e])||z(a[e],c[e],b,e,a,f);if(d.isWriteableObservable(a[e]))a[e](d.utils.unwrapObservable(v));else a[e]=v;b.mappedProperties[f]=!0}})}else switch(f.getType(c)){case "function":s()?d.isWriteableObservable(c)?(c(q(c)),a=c):a=q(c):a=c;break;default:d.isWriteableObservable(a)?
// s()?a(q(a)):a(d.utils.unwrapObservable(c)):(a=l()?k():d.observable(d.utils.unwrapObservable(c)),s()&&a(q(a)))}return a}function I(a,c,b){for(var e=0,d=a.length;e<d;e++)if(!0!==b[e]&&a[e]===c)return e;return null}function K(a,c){var b;c&&(b=c(a));"undefined"===f.getType(b)&&(b=a);return d.utils.unwrapObservable(b)}function B(a,c,b){a=d.utils.arrayFilter(d.utils.unwrapObservable(a),function(a){return K(a,b)===c});if(0==a.length)throw Error("When calling ko.update*, the key '"+c+"' was not found!");
// if(1<a.length&&G(a[0]))throw Error("When calling ko.update*, the key '"+c+"' was not unique!");return a[0]}function w(a,c){return d.utils.arrayMap(d.utils.unwrapObservable(a),function(a){return c?K(a,c):a})}function J(a,c){if(a instanceof Array)for(var b=0;b<a.length;b++)c(b);else for(b in a)c(b)}function G(a){var c=f.getType(a);return"object"===c&&null!==a&&"undefined"!==c}function L(){var a=[],c=[];this.save=function(b,e){var f=d.utils.arrayIndexOf(a,b);0<=f?c[f]=e:(a.push(b),c.push(e))};this.get=
// function(b){b=d.utils.arrayIndexOf(a,b);return 0<=b?c[b]:void 0}}var n="__ko_mapping__",o=d.dependentObservable,H=0,F,A,u={include:["_destroy"],ignore:[],copy:[]},g=u;f.isMapped=function(a){return(a=d.utils.unwrapObservable(a))&&a[n]};f.fromJS=function(a){if(0==arguments.length)throw Error("When calling ko.fromJS, pass the object you want to convert.");window.setTimeout(function(){H=0},0);H++||(F=[],A=new L);var c,b;2==arguments.length&&(arguments[1][n]?b=arguments[1]:c=arguments[1]);3==arguments.length&&
// (c=arguments[1],b=arguments[2]);b&&(c=D(c,b[n]));c=E(c);var e=z(b,a,c);b&&(e=b);--H||window.setTimeout(function(){d.utils.arrayForEach(F,function(a){a&&a()})},0);e[n]=D(e[n],c);return e};f.fromJSON=function(a){var c=d.utils.parseJson(a);arguments[0]=c;return f.fromJS.apply(this,arguments)};f.updateFromJS=function(){throw Error("ko.mapping.updateFromJS, use ko.mapping.fromJS instead. Please note that the order of parameters is different!");};f.updateFromJSON=function(){throw Error("ko.mapping.updateFromJSON, use ko.mapping.fromJSON instead. Please note that the order of parameters is different!");
// };f.toJS=function(a,c){g||f.resetDefaultOptions();if(0==arguments.length)throw Error("When calling ko.mapping.toJS, pass the object you want to convert.");if(!(g.ignore instanceof Array))throw Error("ko.mapping.defaultOptions().ignore should be an array.");if(!(g.include instanceof Array))throw Error("ko.mapping.defaultOptions().include should be an array.");if(!(g.copy instanceof Array))throw Error("ko.mapping.defaultOptions().copy should be an array.");c=E(c,a[n]);return f.visitModel(a,function(a){return d.utils.unwrapObservable(a)},
// c)};f.toJSON=function(a,c){var b=f.toJS(a,c);return d.utils.stringifyJson(b)};f.defaultOptions=function(){if(0<arguments.length)g=arguments[0];else return g};f.resetDefaultOptions=function(){g={include:u.include.slice(0),ignore:u.ignore.slice(0),copy:u.copy.slice(0)}};f.getType=function(a){return a&&"object"===typeof a&&a.constructor==(new Date).constructor?"date":typeof a};f.visitModel=function(a,c,b){b=b||{};b.visitedObjects=b.visitedObjects||new L;b.parentName||(b=E(b));var e,g=d.utils.unwrapObservable(a);
// if(G(g))c(a,b.parentName),e=g instanceof Array?[]:{};else return c(a,b.parentName);b.visitedObjects.save(a,e);var i=b.parentName;J(g,function(a){if(!(b.ignore&&-1!=d.utils.arrayIndexOf(b.ignore,a))){var j=g[a],l=b,k=i||"";g instanceof Array?i&&(k+="["+a+"]"):(i&&(k+="."),k+=a);l.parentName=k;if(!(-1===d.utils.arrayIndexOf(b.copy,a)&&-1===d.utils.arrayIndexOf(b.include,a)&&g[n]&&g[n].mappedProperties&&!g[n].mappedProperties[a]&&!(g instanceof Array)))switch(f.getType(d.utils.unwrapObservable(j))){case "object":case "undefined":l=
// b.visitedObjects.get(j);e[a]="undefined"!==f.getType(l)?l:f.visitModel(j,c,b);break;default:e[a]=c(j,b.parentName)}}});return e}});

(function (factory) {
  // Module systems magic dance.

  if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
    // CommonJS or Node: hard-coded dependency on "knockout"
    factory(require("knockout"), exports);
  } else if (typeof define === "function" && define["amd"]) {
    // AMD anonymous module with hard-coded dependency on "knockout"
    define(["knockout", "exports"], factory);
  } else {
    // <script> tag: use the global `ko` object, attaching a `mapping` property
    factory(ko, ko.mapping = {});
  }
}(function (ko, exports) {
  var mappingProperty = "__ko_mapping__";
  var realKoDependentObservable = ko.dependentObservable;
  var mappingNesting = 0;
  var dependentObservables;
  var visitedObjects;

  var _defaultOptions = {
    include: ["_destroy"],
    ignore: [],
    copy: []
  };
  var defaultOptions = _defaultOptions;

  function extendObject(destination, source) {
    for (var key in source) {
      if (source.hasOwnProperty(key) && source[key]) {
        
        if (key && destination[key] && !(destination[key] instanceof Array)) {
          extendObject(destination[key], source[key]);
        } else {
          destination[key] = source[key];
        }
      }
    }
  }

  function merge(obj1, obj2) {
    var merged = {};
    extendObject(merged, obj1);
    extendObject(merged, obj2);

    return merged;
  }

  exports.isMapped = function (viewModel) {
    var unwrapped = ko.utils.unwrapObservable(viewModel);
    return unwrapped && unwrapped[mappingProperty];
  }

  exports.fromJS = function (jsObject /*, inputOptions, target*/ ) {
    if (arguments.length == 0) throw new Error("When calling ko.fromJS, pass the object you want to convert.");

    // When mapping is completed, even with an exception, reset the nesting level
    window.setTimeout(function () {
      mappingNesting = 0;
    }, 0);

    if (!mappingNesting++) {
      dependentObservables = [];
      visitedObjects = new objectLookup();
    }

    var options;
    var target;

    if (arguments.length == 2) {
      if (arguments[1][mappingProperty]) {
        target = arguments[1];
      } else {
        options = arguments[1];
      }
    }
    if (arguments.length == 3) {
      options = arguments[1];
      target = arguments[2];
    }

    if (target) {
      options = merge(options, target[mappingProperty]);
    }
    options = fillOptions(options);

    var result = updateViewModel(target, jsObject, options);
    if (target) {
      result = target;
    }

    // Evaluate any dependent observables that were proxied.
    // Do this in a timeout to defer execution. Basically, any user code that explicitly looks up the DO will perform the first evaluation. Otherwise,
    // it will be done by this code.
    if (!--mappingNesting) {
      window.setTimeout(function () {
        ko.utils.arrayForEach(dependentObservables, function (DO) {
          if (DO) DO();
        });
      }, 0);
    }

    // Save any new mapping options in the view model, so that updateFromJS can use them later.
    result[mappingProperty] = merge(result[mappingProperty], options);

    return result;
  };

  exports.fromJSON = function (jsonString /*, options, target*/ ) {
    var parsed = ko.utils.parseJson(jsonString);
    arguments[0] = parsed;
    return exports.fromJS.apply(this, arguments);
  };

  exports.updateFromJS = function (viewModel) {
    throw new Error("ko.mapping.updateFromJS, use ko.mapping.fromJS instead. Please note that the order of parameters is different!");
  };

  exports.updateFromJSON = function (viewModel) {
    throw new Error("ko.mapping.updateFromJSON, use ko.mapping.fromJSON instead. Please note that the order of parameters is different!");
  };

  exports.toJS = function (rootObject, options) {
    if (!defaultOptions) exports.resetDefaultOptions();

    if (arguments.length == 0) throw new Error("When calling ko.mapping.toJS, pass the object you want to convert.");
    if (!(defaultOptions.ignore instanceof Array)) throw new Error("ko.mapping.defaultOptions().ignore should be an array.");
    if (!(defaultOptions.include instanceof Array)) throw new Error("ko.mapping.defaultOptions().include should be an array.");
    if (!(defaultOptions.copy instanceof Array)) throw new Error("ko.mapping.defaultOptions().copy should be an array.");

    // Merge in the options used in fromJS
    options = fillOptions(options, rootObject[mappingProperty]);

    // We just unwrap everything at every level in the object graph
    return exports.visitModel(rootObject, function (x) {
      return ko.utils.unwrapObservable(x)
    }, options);
  };

  exports.toJSON = function (rootObject, options) {
    var plainJavaScriptObject = exports.toJS(rootObject, options);
    return ko.utils.stringifyJson(plainJavaScriptObject);
  };

  exports.defaultOptions = function () {
    if (arguments.length > 0) {
      defaultOptions = arguments[0];
    } else {
      return defaultOptions;
    }
  };

  exports.resetDefaultOptions = function () {
    defaultOptions = {
      include: _defaultOptions.include.slice(0),
      ignore: _defaultOptions.ignore.slice(0),
      copy: _defaultOptions.copy.slice(0)
    };
  };

  exports.getType = function(x) {
    if ((x) && (typeof (x) === "object") && (x.constructor == (new Date).constructor)) return "date";
    return typeof x;
  }

  function fillOptions(options, otherOptions) {
    options = options || {};

    // Is there only a root-level mapping present?
    if ((options.create instanceof Function) || (options.update instanceof Function) || (options.key instanceof Function) || (options.arrayChanged instanceof Function)) {
      options = {
        "": options
      };
    }

    if (otherOptions) {
      options.ignore = mergeArrays(otherOptions.ignore, options.ignore);
      options.include = mergeArrays(otherOptions.include, options.include);
      options.copy = mergeArrays(otherOptions.copy, options.copy);
    }
    options.ignore = mergeArrays(options.ignore, defaultOptions.ignore);
    options.include = mergeArrays(options.include, defaultOptions.include);
    options.copy = mergeArrays(options.copy, defaultOptions.copy);

    options.mappedProperties = options.mappedProperties || {};
    return options;
  }

  function mergeArrays(a, b) {
    if (!(a instanceof Array)) {
      if (exports.getType(a) === "undefined") a = [];
      else a = [a];
    }
    if (!(b instanceof Array)) {
      if (exports.getType(b) === "undefined") b = [];
      else b = [b];
    }
    return a.concat(b);
  }

  // When using a 'create' callback, we proxy the dependent observable so that it doesn't immediately evaluate on creation.
  // The reason is that the dependent observables in the user-specified callback may contain references to properties that have not been mapped yet.
  function withProxyDependentObservable(dependentObservables, callback) {
    var localDO = ko.dependentObservable;
    ko.dependentObservable = function (read, owner, options) {
      options = options || {};

      var realDeferEvaluation = options.deferEvaluation;

      if (read && typeof read == "object") { // mirrors condition in knockout implementation of DO's
        options = read;
      }

      var isRemoved = false;

      // We wrap the original dependent observable so that we can remove it from the 'dependentObservables' list we need to evaluate after mapping has
      // completed if the user already evaluated the DO themselves in the meantime.
      var wrap = function (DO) {
        var wrapped = realKoDependentObservable({
          read: function () {
            if (!isRemoved) {
              ko.utils.arrayRemoveItem(dependentObservables, DO);
              isRemoved = true;
            }
            return DO.apply(DO, arguments);
          },
          write: function (val) {
            return DO(val);
          },
          deferEvaluation: true
        });
        wrapped.__ko_proto__ = realKoDependentObservable;
        return wrapped;
      };
      
      options.deferEvaluation = true; // will either set for just options, or both read/options.
      var realDependentObservable = new realKoDependentObservable(read, owner, options);
      realDependentObservable.__ko_proto__ = realKoDependentObservable;

      if (!realDeferEvaluation) {
        dependentObservables.push(realDependentObservable);
        realDependentObservable = wrap(realDependentObservable);
      }

      return realDependentObservable;
    }
    ko.computed = ko.dependentObservable;
    var result = callback();
    ko.dependentObservable = localDO;
    ko.computed = ko.dependentObservable;
    return result;
  }

  function updateViewModel(mappedRootObject, rootObject, options, parentName, parent, parentPropertyName) {
    var isArray = ko.utils.unwrapObservable(rootObject) instanceof Array;

    parentPropertyName = parentPropertyName || "";

    // If this object was already mapped previously, take the options from there and merge them with our existing ones.
    if (exports.isMapped(mappedRootObject)) {
      var previousMapping = ko.utils.unwrapObservable(mappedRootObject)[mappingProperty];
      options = merge(previousMapping, options);
    }

    var callbackParams = {
      data: rootObject,
      parent: parent
    };

    var hasCreateCallback = function () {
      return options[parentName] && options[parentName].create instanceof Function;
    };

    var createCallback = function (data) {
      return withProxyDependentObservable(dependentObservables, function () {
        return options[parentName].create({
          data: data || callbackParams.data,
          parent: callbackParams.parent
        });
      });
    };

    var hasUpdateCallback = function () {
      return options[parentName] && options[parentName].update instanceof Function;
    };

    var updateCallback = function (obj, data) {
      var params = {
        data: data || callbackParams.data,
        parent: callbackParams.parent,
        target: ko.utils.unwrapObservable(obj)
      };

      if (ko.isWriteableObservable(obj)) {
        params.observable = obj;
      }

      return options[parentName].update(params);
    }

    var alreadyMapped = visitedObjects.get(rootObject);
    if (alreadyMapped) {
      return alreadyMapped;
    }

    parentName = parentName || "";

    if (!isArray) {
      // For atomic types, do a direct update on the observable
      if (!canHaveProperties(rootObject)) {
        switch (exports.getType(rootObject)) {
        case "function":
          if (hasUpdateCallback()) {
            if (ko.isWriteableObservable(rootObject)) {
              rootObject(updateCallback(rootObject));
              mappedRootObject = rootObject;
            } else {
              mappedRootObject = updateCallback(rootObject);
            }
          } else {
            mappedRootObject = rootObject;
          }
          break;
        default:
          if (ko.isWriteableObservable(mappedRootObject)) {
            if (hasUpdateCallback()) {
              mappedRootObject(updateCallback(mappedRootObject));
            } else {
              mappedRootObject(ko.utils.unwrapObservable(rootObject));
            }
          } else {
            if (hasCreateCallback()) {
              mappedRootObject = createCallback();
            } else {
              mappedRootObject = ko.observable(ko.utils.unwrapObservable(rootObject));
            }

            if (hasUpdateCallback()) {
              mappedRootObject(updateCallback(mappedRootObject));
            }
          }
          break;
        }

      } else {
        mappedRootObject = ko.utils.unwrapObservable(mappedRootObject);
        if (!mappedRootObject) {
          if (hasCreateCallback()) {
            var result = createCallback();

            if (hasUpdateCallback()) {
              result = updateCallback(result);
            }

            return result;
          } else {
            if (hasUpdateCallback()) {
              return updateCallback(result);
            }

            mappedRootObject = {};
          }
        }

        if (hasUpdateCallback()) {
          mappedRootObject = updateCallback(mappedRootObject);
        }

        visitedObjects.save(rootObject, mappedRootObject);

        // For non-atomic types, visit all properties and update recursively
        visitPropertiesOrArrayEntries(rootObject, function (indexer) {
          var fullPropertyName = parentPropertyName.length ? parentPropertyName + "." + indexer : indexer;

          if (ko.utils.arrayIndexOf(options.ignore, fullPropertyName) != -1) {
            return;
          }

          if (ko.utils.arrayIndexOf(options.copy, fullPropertyName) != -1) {
            mappedRootObject[indexer] = rootObject[indexer];
            return;
          }

          // In case we are adding an already mapped property, fill it with the previously mapped property value to prevent recursion.
          // If this is a property that was generated by fromJS, we should use the options specified there
          var prevMappedProperty = visitedObjects.get(rootObject[indexer]);
          var value = prevMappedProperty || updateViewModel(mappedRootObject[indexer], rootObject[indexer], options, indexer, mappedRootObject, fullPropertyName);

          if (ko.isWriteableObservable(mappedRootObject[indexer])) {
            mappedRootObject[indexer](ko.utils.unwrapObservable(value));
          } else {
            mappedRootObject[indexer] = value;
          }

          options.mappedProperties[fullPropertyName] = true;
        });
      }
    } else {
      var changes = [];

      var hasKeyCallback = false;
      var keyCallback = function (x) {
        return x;
      }
      if (options[parentName] && options[parentName].key) {
        keyCallback = options[parentName].key;
        hasKeyCallback = true;
      }

      if (!ko.isObservable(mappedRootObject)) {
        // When creating the new observable array, also add a bunch of utility functions that take the 'key' of the array items into account.
        mappedRootObject = ko.observableArray([]);

        mappedRootObject.mappedRemove = function (valueOrPredicate) {
          var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate : function (value) {
              return value === keyCallback(valueOrPredicate);
            };
          return mappedRootObject.remove(function (item) {
            return predicate(keyCallback(item));
          });
        }

        mappedRootObject.mappedRemoveAll = function (arrayOfValues) {
          var arrayOfKeys = filterArrayByKey(arrayOfValues, keyCallback);
          return mappedRootObject.remove(function (item) {
            return ko.utils.arrayIndexOf(arrayOfKeys, keyCallback(item)) != -1;
          });
        }

        mappedRootObject.mappedDestroy = function (valueOrPredicate) {
          var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate : function (value) {
              return value === keyCallback(valueOrPredicate);
            };
          return mappedRootObject.destroy(function (item) {
            return predicate(keyCallback(item));
          });
        }

        mappedRootObject.mappedDestroyAll = function (arrayOfValues) {
          var arrayOfKeys = filterArrayByKey(arrayOfValues, keyCallback);
          return mappedRootObject.destroy(function (item) {
            return ko.utils.arrayIndexOf(arrayOfKeys, keyCallback(item)) != -1;
          });
        }

        mappedRootObject.mappedIndexOf = function (item) {
          var keys = filterArrayByKey(mappedRootObject(), keyCallback);
          var key = keyCallback(item);
          return ko.utils.arrayIndexOf(keys, key);
        }

        mappedRootObject.mappedCreate = function (value) {
          if (mappedRootObject.mappedIndexOf(value) !== -1) {
            throw new Error("There already is an object with the key that you specified.");
          }

          var item = hasCreateCallback() ? createCallback(value) : value;
          if (hasUpdateCallback()) {
            var newValue = updateCallback(item, value);
            if (ko.isWriteableObservable(item)) {
              item(newValue);
            } else {
              item = newValue;
            }
          }
          mappedRootObject.push(item);
          return item;
        }
      }

      var currentArrayKeys = filterArrayByKey(ko.utils.unwrapObservable(mappedRootObject), keyCallback).sort();
      var newArrayKeys = filterArrayByKey(rootObject, keyCallback);
      if (hasKeyCallback) newArrayKeys.sort();
      var editScript = ko.utils.compareArrays(currentArrayKeys, newArrayKeys);

      var ignoreIndexOf = {};

      var newContents = [];
      for (var i = 0, j = editScript.length; i < j; i++) {
        var key = editScript[i];
        var mappedItem;
        var fullPropertyName = parentPropertyName + "[" + i + "]";
        switch (key.status) {
        case "added":
          var item = getItemByKey(ko.utils.unwrapObservable(rootObject), key.value, keyCallback);
          mappedItem = updateViewModel(undefined, item, options, parentName, mappedRootObject, fullPropertyName);
          if(!hasCreateCallback()) {
            mappedItem = ko.utils.unwrapObservable(mappedItem);
          }

          var index = ignorableIndexOf(ko.utils.unwrapObservable(rootObject), item, ignoreIndexOf);
          newContents[index] = mappedItem;
          ignoreIndexOf[index] = true;
          break;
        case "retained":
          var item = getItemByKey(ko.utils.unwrapObservable(rootObject), key.value, keyCallback);
          mappedItem = getItemByKey(mappedRootObject, key.value, keyCallback);
          updateViewModel(mappedItem, item, options, parentName, mappedRootObject, fullPropertyName);

          var index = ignorableIndexOf(ko.utils.unwrapObservable(rootObject), item, ignoreIndexOf);
          newContents[index] = mappedItem;
          ignoreIndexOf[index] = true;
          break;
        case "deleted":
          mappedItem = getItemByKey(mappedRootObject, key.value, keyCallback);
          break;
        }

        changes.push({
          event: key.status,
          item: mappedItem
        });
      }

      mappedRootObject(newContents);

      if (options[parentName] && options[parentName].arrayChanged) {
        ko.utils.arrayForEach(changes, function (change) {
          options[parentName].arrayChanged(change.event, change.item);
        });
      }
    }

    return mappedRootObject;
  }

  function ignorableIndexOf(array, item, ignoreIndices) {
    for (var i = 0, j = array.length; i < j; i++) {
      if (ignoreIndices[i] === true) continue;
      if (array[i] === item) return i;
    }
    return null;
  }

  function mapKey(item, callback) {
    var mappedItem;
    if (callback) mappedItem = callback(item);
    if (exports.getType(mappedItem) === "undefined") mappedItem = item;

    return ko.utils.unwrapObservable(mappedItem);
  }

  function getItemByKey(array, key, callback) {
    var filtered = ko.utils.arrayFilter(ko.utils.unwrapObservable(array), function (item) {
      return mapKey(item, callback) === key;
    });

    if (filtered.length == 0) throw new Error("When calling ko.update*, the key '" + key + "' was not found!");
    if ((filtered.length > 1) && (canHaveProperties(filtered[0]))) throw new Error("When calling ko.update*, the key '" + key + "' was not unique!");

    return filtered[0];
  }

  function filterArrayByKey(array, callback) {
    return ko.utils.arrayMap(ko.utils.unwrapObservable(array), function (item) {
      if (callback) {
        return mapKey(item, callback);
      } else {
        return item;
      }
    });
  }

  function visitPropertiesOrArrayEntries(rootObject, visitorCallback) {
    if (rootObject instanceof Array) {
      for (var i = 0; i < rootObject.length; i++)
      visitorCallback(i);
    } else {
      for (var propertyName in rootObject)
      visitorCallback(propertyName);
    }
  };

  function canHaveProperties(object) {
    var type = exports.getType(object);
    return (type === "object") && (object !== null) && (type !== "undefined");
  }

  // Based on the parentName, this creates a fully classified name of a property

  function getPropertyName(parentName, parent, indexer) {
    var propertyName = parentName || "";
    if (parent instanceof Array) {
      if (parentName) {
        propertyName += "[" + indexer + "]";
      }
    } else {
      if (parentName) {
        propertyName += ".";
      }
      propertyName += indexer;
    }
    return propertyName;
  }

  exports.visitModel = function (rootObject, callback, options) {
    options = options || {};
    options.visitedObjects = options.visitedObjects || new objectLookup();

    if (!options.parentName) {
      options = fillOptions(options);
    }

    var mappedRootObject;
    var unwrappedRootObject = ko.utils.unwrapObservable(rootObject);
    if (!canHaveProperties(unwrappedRootObject)) {
      return callback(rootObject, options.parentName);
    } else {
      // Only do a callback, but ignore the results
      callback(rootObject, options.parentName);
      mappedRootObject = unwrappedRootObject instanceof Array ? [] : {};
    }

    options.visitedObjects.save(rootObject, mappedRootObject);

    var parentName = options.parentName;
    visitPropertiesOrArrayEntries(unwrappedRootObject, function (indexer) {
      if (options.ignore && ko.utils.arrayIndexOf(options.ignore, indexer) != -1) return;

      var propertyValue = unwrappedRootObject[indexer];
      options.parentName = getPropertyName(parentName, unwrappedRootObject, indexer);

      // If we don't want to explicitly copy the unmapped property...
      if (ko.utils.arrayIndexOf(options.copy, indexer) === -1) {
        // ...find out if it's a property we want to explicitly include
        if (ko.utils.arrayIndexOf(options.include, indexer) === -1) {
          // The mapped properties object contains all the properties that were part of the original object.
          // If a property does not exist, and it is not because it is part of an array (e.g. "myProp[3]"), then it should not be unmapped.
          if (unwrappedRootObject[mappingProperty] && unwrappedRootObject[mappingProperty].mappedProperties && !unwrappedRootObject[mappingProperty].mappedProperties[indexer] && !(unwrappedRootObject instanceof Array)) {
            return;
          }
        }
      }

      var outputProperty;
      switch (exports.getType(ko.utils.unwrapObservable(propertyValue))) {
      case "object":
      case "undefined":
        var previouslyMappedValue = options.visitedObjects.get(propertyValue);
        mappedRootObject[indexer] = (exports.getType(previouslyMappedValue) !== "undefined") ? previouslyMappedValue : exports.visitModel(propertyValue, callback, options);
        break;
      default:
        mappedRootObject[indexer] = callback(propertyValue, options.parentName);
      }
    });

    return mappedRootObject;
  }

  function objectLookup() {
    var keys = [];
    var values = [];
    this.save = function (key, value) {
      var existingIndex = ko.utils.arrayIndexOf(keys, key);
      if (existingIndex >= 0) values[existingIndex] = value;
      else {
        keys.push(key);
        values.push(value);
      }
    };
    this.get = function (key) {
      var existingIndex = ko.utils.arrayIndexOf(keys, key);
      return (existingIndex >= 0) ? values[existingIndex] : undefined;
    };
  };
}));