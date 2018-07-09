(function (global) {
    var oProto = Object.prototype;
    var toString = oProto.toString;
    var hasOwnProperty = oProto.hasOwnProperty;
    function needFix(fn) {
        return !/native code/.test(fn);
    }

    //修复 console
    if (!global.console) {
        global.console = {};
    }
    var con = global.console; //有的浏览器拥有console对象，但没有这么多方法
    var prop, method;
    var dummy = function () { };
    var properties = ["memory"];
    var methods = ("assert,clear,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEn" +
        "d,info,log,markTimeline,profile,profiles,profileEnd,show,table,time,timeEnd,time" +
        "line,timelineEnd,timeStamp,trace,warn").split(",");
    while ((prop = properties.pop())) {
        if (!con[prop]) {
            con[prop] = {};
        }
    }
    while ((method = methods.pop())) {
        if (!con[method]) {
            con[method] = dummy;
        }
    }
    // 修复console完毕！

    //https://github.com/flowersinthesand/stringifyJSON/blob/master/stringifyjson.js
    function quote(string) {
        return (
            "\"" +
            string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === "string"
                    ? c
                    : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) +
            "\""
        );
    }

    function f(n) {
        return n < 10 ? "0" + n : n;
    }

    function str(key, holder) {
        var i,
            v,
            len,
            partial,
            value = holder[key],
            type = typeof value;

        if (
            value &&
            typeof value === "object" &&
            typeof value.toJSON === "function"
        ) {
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

            switch (toString.call(value)) {
            case "[object Date]":
                return isFinite(value.valueOf())
                    ? "\"" +
                            value.getUTCFullYear() +
                            "-" +
                            f(value.getUTCMonth() + 1) +
                            "-" +
                            f(value.getUTCDate()) +
                            "T" +
                            f(value.getUTCHours()) +
                            ":" +
                            f(value.getUTCMinutes()) +
                            ":" +
                            f(value.getUTCSeconds()) +
                            "Z\""
                    : "null";
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
                    if (hasOwnProperty.call(value, i)) {
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
    if (typeof JSON === "undefined") {
        var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            meta = {
                "\b": "\\b",
                "\t": "\\t",
                "\n": "\\n",
                "\f": "\\f",
                "\r": "\\r",
                "\"": "\\\"",
                "\\": "\\\\"
            };



        global.JSON = {
            stringify: function (value) {
                return str("", { "": value });
            },
            //http://www.cnblogs.com/fengzekun/p/3940918.html
            parse: function () {
                return new Function("return " + data)();
            }
        };
    }
    //支持 Function.prototype.bind
    var fProto = Function.prototype;
    if (needFix(fProto.bind)) {
        fProto.bind = function () {
            var fn = this;
            var presetArgs = [].slice.call(arguments);
            var context = presetArgs.shift();
            var curry = function () {
                for (var i = 0, n = arguments.length; i < n; i++) {
                    presetArgs.push(arguments[i]);
                }
                return fn.apply(context, presetArgs);
            };
            curry.name = "bound " + (fn.name || "anonymous");
            return curry;
        };
    }

    //修正 Array.prototype.splice
    var arrayProto = Array.prototype;
    if (0 === [1, 2].splice(0).length) {
        var _splice = arrayProto.splice;
        arrayProto.splice = function (a) {
            var args = arrayProto.slice.call(arguments);
            if (typeof args[1] !== "number") {
                //IE6－8只能重写已经存在的索引值。比如aaa(1,2,3)，只有三个参数，不能以arguments[3] =88来添加第4个参数
                args[1] = this.length;
            }
            return _splice.apply(this, args);
        };
    }
    //支持 Array.prototype.forEach
    if (needFix(arrayProto.forEach)) {
        arrayProto.forEach = function (callback, thisArg) {
            var array = this;
            for (var i = 0, n = array.length; i < n; i++) {
                if (i in array) {
                    callback.call(thisArg, array[i], i, array);
                }
            }
        };
    }

    //支持 Array.isArray
    if (needFix(Array.isArray)) {
        Array.isArray = function (arr) {
            return toString.call(arr) == "[object Array]";
        };
    }
    //支持 Object.is
    if (needFix(Object.is)) {
        Object.is = function is(x, y) {
            if (x === y) {
                // Steps 1-5, 7-10 Steps 6.b-6.e: +0 != -0 Added the nonzero y check to make
                // Flow happy, but it is redundant
                return x !== 0 || y !== 0 || 1 / x === 1 / y;
            } else {
                // Step 6.a: NaN == NaN
                return x !== x && y !== y;
            }
        };
    }

    if (needFix(Object.create)) {
        Object.create = function (o) {
            function F() { }
            F.prototype = o;
            return new F();
        };
    }

    //支持 Object.assign
    if (needFix(Object.assign)) {
        Object.assign = function (target) {
            if (target === undefined || target === null) {
                throw new TypeError("Cannot convert undefined or null to object");
            }
            var output = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source !== undefined && source !== null) {
                    for (var nextKey in source) {
                        if (hasOwnProperty.call(source,nextKey)) {
                            output[nextKey] = source[nextKey];
                        }
                    }
                }
            }
            return output;
        };
    }

    if (needFix(Object.keys)) {
        var hasDontEnumBug = !{ toString: null }.propertyIsEnumerable("toString");
        var dontEnums = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor"
        ];

        Object.keys = function (obj) {
            if (Object(obj) !== obj) {
                throw new TypeError("Object.keys called on non-object");
            }
            var result = [],
                prop,
                i;

            for (prop in obj) {
                if (hasOwnProperty.call(obj, prop)) {
                    result.push(prop);
                }
            }

            if (hasDontEnumBug) {
                for (i = 0; i < 7; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) {
                        result.push(dontEnums[i]);
                    }
                }
            }
            return result;
        };
    }
})(typeof window === "undefined" ? this : window);
