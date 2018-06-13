import {
    extend,
    isFn,
    getWindow,
    miniCreateClass,
    toWarnDev,
    __type
} from "./util";

/**
 * 为了兼容0.13之前的版本
 */
const NOBIND = {
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
    let keyed = {};

    for (let i = 0; i < mixins.length; i++) {
        let mixin = mixins[i];
        if (mixin.mixins) {
            applyMixins(mixin, collectMixins(mixin.mixins));
        }

        for (let key in mixin) {
            if (mixin.hasOwnProperty(key) && key !== "mixins") {
                (keyed[key] || (keyed[key] = [])).push(mixin[key]);
            }
        }
    }

    return keyed;
}
const MANY_MERGED = {
    getInitialState: 1,
    getDefaultProps: 1,
    getChildContext: 1
};

function flattenHooks(key, hooks) {
    let hookType = __type.call(hooks[0]).slice(8, -1);
    if (hookType === "Object") {
        // Merge objects
        let ret = {};
        for (let i = 0; i < hooks.length; i++) {
            extend(ret, hooks[i]);
        }
        return ret;
    } else if (hookType === "Function" && hooks.length > 1) {
        return function() {
            let ret = {},
                r,
                hasReturn = MANY_MERGED[key];
            for (let i = 0; i < hooks.length; i++) {
                r = hooks[i].apply(this, arguments);
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
    for (let key in mixins) {
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

export default function createClass(spec) {
    if (!isFn(spec.render)) {
        throw "createClass(...): Class specification must implement a `render` method.";
    }
    //创建一个构造器,有四个参数
    let statics = spec.statics;
    let Constructor = miniCreateClass(function Ctor() {
        if (!(this instanceof Component)) {
            throw "must new Component(...)";
        }
        for (let methodName in this) {
            let method = this[methodName];
            if (typeof method === "function" && !NOBIND[methodName]) {
                this[methodName] = method.bind(this);
            }
        }

        if (spec.getInitialState) {
            let test = this.state = spec.getInitialState.call(this);
            if (!(test === null || ({}).toString.call(test) == "[object Object]")) {
                throw "Component.getInitialState(): must return an object or null";
            }
        }
    }, Component, spec, statics);
    //如果mixins里面非常复杂，可能mixin还包含其他mixin
    if (spec.mixins) {
        applyMixins(spec, collectMixins(spec.mixins));
        extend(Constructor.prototype, spec);
    }

    if (statics && statics.getDefaultProps) {
        throw "getDefaultProps is not statics";
    }

    "propTypes,contextTypes,childContextTypes,displayName".replace(
        /\w+/g,
        function(name) {
            if (spec[name]) {
                let props = (Constructor[name] = spec[name]);
                if (name !== "displayName") {
                    for (let i in props) {
                        if (!isFn(props[i])) {
                            toWarnDev(`${i} in ${name} must be a function`); // eslint-disable-line
                        }
                    }
                }
            }
        }
    );

    if (isFn(spec.getDefaultProps)) {
        Constructor.defaultProps = spec.getDefaultProps();
    }

    return Constructor;
}