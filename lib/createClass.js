/**
 * React.createClass补丁 by 司徒正美 Copyright 2018-05-25
 * IE9+
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.createReactClass = factory());
}(this, (function () {

var hasOwnProperty = Object.prototype.hasOwnProperty;



var hasSymbol = typeof Symbol === "function" && Symbol["for"];
var REACT_ELEMENT_TYPE = hasSymbol ? Symbol["for"]("react.element") : 0xeac7;







var fakeWindow = {};
function getWindow() {
    try {
        return window;
    } catch (e) {
        try {
            return global;
        } catch (e) {
            return fakeWindow;
        }
    }
}

function toWarnDev(msg, deprecated) {
    msg = deprecated ? msg + " is deprecated" : msg;
    var process = getWindow().process;
    if (process && process.env.NODE_ENV === "development") {
        throw msg;
    }
}
function extend(obj, props) {
    for (var i in props) {
        if (hasOwnProperty.call(props, i)) {
            obj[i] = props[i];
        }
    }
    return obj;
}


var __type = Object.prototype.toString;

function inherit(SubClass, SupClass) {
    function Bridge() {}
    var orig = SubClass.prototype;
    Bridge.prototype = SupClass.prototype;
    var fn = SubClass.prototype = new Bridge();
    extend(fn, orig);
    fn.constructor = SubClass;
    return fn;
}


function isFn(obj) {
    return __type.call(obj) === "[object Function]";
}

var NOBIND = {
    render: 1,
    shouldComponentUpdate: 1,
    componentWillReceiveProps: 1,
    componentWillUpdate: 1,
    componentDidUpdate: 1,
    componentWillMount: 1,
    componentDidMount: 1,
    componentWillUnmount: 1,
    componentDidUnmount: 1
};
function collectMixins(mixins) {
    var keyed = {};
    for (var i = 0; i < mixins.length; i++) {
        var mixin = mixins[i];
        if (mixin.mixins) {
            applyMixins(mixin, collectMixins(mixin.mixins));
        }
        for (var key in mixin) {
            if (mixin.hasOwnProperty(key) && key !== "mixins") {
                (keyed[key] || (keyed[key] = [])).push(mixin[key]);
            }
        }
    }
    return keyed;
}
var MANY_MERGED = {
    getInitialState: 1,
    getDefaultProps: 1,
    getChildContext: 1
};
function flattenHooks(key, hooks) {
    var hookType = __type.call(hooks[0]).slice(8, -1);
    if (hookType === "Object") {
        var ret = {};
        for (var i = 0; i < hooks.length; i++) {
            extend(ret, hooks[i]);
        }
        return ret;
    } else if (hookType === "Function" && hooks.length > 1) {
        return function () {
            var ret = {},
                r = void 0,
                hasReturn = MANY_MERGED[key];
            for (var _i = 0; _i < hooks.length; _i++) {
                r = hooks[_i].apply(this, arguments);
                if (hasReturn && r) {
                    extend(ret, r);
                }
            }
            if (hasReturn) {
                return ret;
            }
            return r;
        };
    } else {
        return hooks[0];
    }
}
function applyMixins(proto, mixins) {
    for (var key in mixins) {
        if (mixins.hasOwnProperty(key)) {
            proto[key] = flattenHooks(key, mixins[key].concat(proto[key] || []));
        }
    }
}
function newCtor(className, spec, Component) {
    var curry = Function("ReactComponent", "blacklist", "spec", "return function " + className + "(props, context) {\n      ReactComponent.call(this, props, context);\n     if(!(this instanceof ReactComponent)){\n         throw \"muse new Component(...)\"\n     }\n     for (var methodName in this) {\n        var method = this[methodName];\n        if (typeof method  === \"function\"&& !blacklist[methodName]) {\n          this[methodName] = method.bind(this);\n        }\n      }\n\n      if (spec.getInitialState) {\n        var test = this.state = spec.getInitialState.call(this);\n        if(!(test === null || ({}).toString.call(test) == \"[object Object]\")){\n          throw \"Component.getInitialState(): must return an object or null\"\n        }\n      }\n  };");
    return curry(Component, NOBIND, spec);
}
function createClass(spec) {
    if (!isFn(spec.render)) {
        throw "createClass(...): Class specification must implement a `render` method.";
    }
    var window = getWindow();
    if (!window.React || !window.React.Component) {
        throw "Please load the React first.";
    }
    window.React.createClass = createClass;
    var Component = window.React.Component;
    var Constructor = newCtor(spec.displayName || "Component", spec, Component);
    var proto = inherit(Constructor, Component);
    if (spec.mixins) {
        applyMixins(spec, collectMixins(spec.mixins));
    }
    extend(proto, spec);
    if (spec.statics) {
        extend(Constructor, spec.statics);
        if (spec.statics.getDefaultProps) {
            throw "getDefaultProps is not statics";
        }
    }
    "propTypes,contextTypes,childContextTypes,displayName".replace(/\w+/g, function (name) {
        if (spec[name]) {
            var props = Constructor[name] = spec[name];
            if (name !== "displayName") {
                for (var i in props) {
                    if (!isFn(props[i])) {
                        toWarnDev(i + " in " + name + " must be a function");
                    }
                }
            }
        }
    });
    if (isFn(spec.getDefaultProps)) {
        Constructor.defaultProps = spec.getDefaultProps();
    }
    return Constructor;
}

return createClass;

})));
