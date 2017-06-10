(function (global) {
   
    if (!global.console) {
        global.console = {};
    }
    var con = global.console;
    var prop, method;
    var dummy = function () {};
    var properties = ['memory'];
    var methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
        'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' +
        'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
    while (prop = properties.pop())
        if (!con[prop]) con[prop] = {};
    while (method = methods.pop())
        if (!con[method]) con[method] = dummy;
    // Using `this` for web workers & supports Browserify / Webpack.

    //https://github.com/flowersinthesand/stringifyJSON/blob/master/stringifyjson.js
    if (typeof JSON === 'undefined') {


        var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            meta = {
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"': '\\"',
                '\\': '\\\\'
            };

        function quote(string) {
            return '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"';
        }

        function f(n) {
            return n < 10 ? "0" + n : n;
        }

        function str(key, holder) {
            var i, v, len, partial, value = holder[key],
                type = typeof value;

            if (value && typeof value === "object" && typeof value.toJSON === "function") {
                value = value.toJSON(key);
                type = typeof value;
            }

            switch (type) {
                case "string":
                    return quote(value);
                case "number":
                    return isFinite(value) ? String(value) : "null";
                case "boolean":
                    return String(value);
                case "object":
                    if (!value) {
                        return "null";
                    }

                    switch (Object.prototype.toString.call(value)) {
                        case "[object Date]":
                            return isFinite(value.valueOf()) ?
                                '"' + value.getUTCFullYear() + "-" + f(value.getUTCMonth() + 1) + "-" + f(value.getUTCDate()) +
                                "T" + f(value.getUTCHours()) + ":" + f(value.getUTCMinutes()) + ":" + f(value.getUTCSeconds()) + "Z" + '"' :
                                "null";
                        case "[object Array]":
                            len = value.length;
                            partial = [];
                            for (i = 0; i < len; i++) {
                                partial.push(str(i, value) || "null");
                            }

                            return "[" + partial.join(",") + "]";
                        default:
                            partial = [];
                            for (i in value) {
                                if (Object.prototype.hasOwnProperty.call(value, i)) {
                                    v = str(i, value);
                                    if (v) {
                                        partial.push(quote(i) + ":" + v);
                                    }
                                }
                            }

                            return "{" + partial.join(",") + "}";
                    }
            }
        }


        global.JSON = {
            stringify: function (value) {
                return str("", {
                    "": value
                });
            },
            //http://www.cnblogs.com/fengzekun/p/3940918.html
            parse: function () {
                return (new Function('return ' + data))()
            }
        }

    }
    //https://github.com/ryanhefner/Object.assign/blob/master/index.js
    if (typeof Object.assign != 'function') {

        Object.assign = function (target) {
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }
            var output = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source !== undefined && source !== null) {
                    for (var nextKey in source) {
                        if (source.hasOwnProperty(nextKey)) {
                            output[nextKey] = source[nextKey];
                        }
                    }
                }
            }
            return output;
        };

    }
    var toString = {}.toString;

    Array.isArray || (Array.isArray = function (arr) {
        return toString.call(arr) == '[object Array]';
    });


    function Map() {
        this.map = {}
    }

    function tos(a) {
        return Object.prototype.toString.call(a).slice(8, -1)
    }

    var idN = 1

    function getID(a) {
        var _type = typeof a
        var complex = a && _type === 'object'
        if (complex) {
            if (a.nodeType) {
                if (a.uniqueID) {
                    return 'Node' + a.uniqueID
                }
                if (!a.uniqueID) {
                    a.uniqueID = "_" + (idN++)
                    return 'Node' + a.uniqueID
                }
            } else {
                var type = tos(a)
                if (a.uniqueID) {
                    return type + a.uniqueID
                }
                if (!a.uniqueID) {
                    a.uniqueID = "_" + (idN++)
                    return type + a.uniqueID
                }
            }
        } else {
            return _type + a
        }
    }
    Map.prototype = {
        get: function (a) {
            var id = getID(a)
            return this.map[id]
        },
        set: function (a, v) {
            var id = getID(a)
            this.map[id] = v
        },
        "delete": function () {
            var id = getID(a)
            delete this.map[id]
        }
    }

    window.Map = window.Map || Map


})(typeof window === 'undefined' ? this : window);
