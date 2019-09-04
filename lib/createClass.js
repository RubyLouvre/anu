/**
 * React.createClass补丁 by 司徒正美 Copyright 2018-06-222
 * IE9+
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.createReactClass = factory());
}(this, (function () {

var hasOwnProperty = Object.prototype.hasOwnProperty;
var __type = Object.prototype.toString;
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
    msg = deprecated ? msg + ' is deprecated' : msg;
    var process = getWindow().process;
    if (process && process.env.NODE_ENV === 'development') {
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
function inherit(SubClass, SupClass) {
    function Bridge() {}
    var orig = SubClass.prototype;
    Bridge.prototype = SupClass.prototype;
    var fn = SubClass.prototype = new Bridge();
    extend(fn, orig);
    fn.constructor = SubClass;
    return fn;
}
function miniCreateClass(ctor, superClass, methods, statics) {
    var className = ctor.name || 'IEComponent';
    var Ctor = Function('superClass', 'ctor', 'return function ' + className + ' (props, context) {\n            superClass.apply(this, arguments); \n            ctor.apply(this, arguments);\n      }')(superClass, ctor);
    var fn = inherit(Ctor, superClass);
    extend(fn, methods);
    if (statics) {
        extend(Ctor, statics);
    }
    return Ctor;
}
function isFn(obj) {
    return __type.call(obj) === '[object Function]';
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
var win = getWindow();
if (!win.React || !win.React.Component) {
    throw "Please load the React first.";
}
win.React.createClass = createClass;
var Component = win.React.Component;
function createClass(spec) {
    if (!isFn(spec.render)) {
        throw "createClass(...): Class specification must implement a `render` method.";
    }
    var statics = spec.statics;
    var Constructor = miniCreateClass(function Ctor() {
        if (!(this instanceof Component)) {
            throw "must new Component(...)";
        }
        for (var methodName in this) {
            var method = this[methodName];
            if (typeof method === "function" && !NOBIND[methodName]) {
                this[methodName] = method.bind(this);
            }
        }
        if (spec.getInitialState) {
            var test = this.state = spec.getInitialState.call(this);
            if (!(test === null || {}.toString.call(test) == "[object Object]")) {
                throw "Component.getInitialState(): must return an object or null";
            }
        }
    }, Component, spec, statics);
    if (spec.mixins) {
        applyMixins(spec, collectMixins(spec.mixins));
        extend(Constructor.prototype, spec);
    }
    if (statics && statics.getDefaultProps) {
        throw "getDefaultProps is not statics";
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
