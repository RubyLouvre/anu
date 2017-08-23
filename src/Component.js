import { extend, isFn, options, clearArray, devolveCallbacks, cbs } from "./util";
import { CurrentOwner } from "./createElement";
import { win } from "./browser";


/**
 *组件的基类
 *
 * @param {any} props
 * @param {any} context
 */

export function Component(props, context) {
    CurrentOwner.cur = this //防止用户在构造器生成JSX
    this.context = context;
    this.props = props;
    this.refs = {};
    this.state = null
    this.__dirty = true
    this[cbs] = [];
    this.__pendingStates = [];
    this.__pendingRefs = [];
    this._currentElement = {}
    /*
    * this.__dirty = true 表示组件不能更新
    * this.__hasRendred = true 表示组件已经渲染了一次
    * this.__rerender = true 表示组件需要再渲染一次
    * this.__hasDidMount = true 表示组件及子孙已经都插入DOM树
    * this.__updating = true 表示组件处于componentWillUpdate与componentDidUpdate中
    * this.__forceUpdate = true 用于强制组件更新，忽略shouldComponentUpdate的结果
    */
}

Component.prototype = {
    replaceState() {
        console.warn("此方法末实现"); // eslint-disable-line
    },

    setState(state, cb) {
        setStateImpl.call(this, state, cb)
    },

    forceUpdate(cb) {
        setStateImpl.call(this, true, cb)
    },
    __collectRefs: function (fn) {
        this
            .__pendingRefs
            .push(fn)
    },
    __mergeStates: function (props, context) {
        var n = this.__pendingStates.length;
        if (n === 0) {
            return this.state;
        }
        var states = clearArray(this
            .__pendingStates)
        var nextState = extend({}, this.state);
        for (var i = 0; i < n; i++) {
            var partial = states[i];
            extend(nextState, isFn(partial)
                ? partial.call(this, nextState, props, context)
                : partial);
        }
        return nextState;
    },

    render() { }
};

function setStateImpl(state, cb) {

    if (isFn(cb)) {
        this.__pendingCallbacks.push(cb);
    }
    // forceUpate是同步渲染
    if (state === true) {
        if (this._currentElement._hostNode && !this.__dirty && (this.__dirty = true)) {
            this.__forceUpdate = true;
            options.refreshComponent(this, []);
        }
    } else {
        // setState是异步渲染
        this.__pendingStates.push(state);
        // 子组件在componentWillReiveProps调用父组件的setState方法
        if (this.__updating) {
            devolveCallbacks(this, cbs, '__tempUpdateCbs')
            this.__rerender = true
        } else if (!this.__hasDidMount) {
            //如果在componentDidMount中调用setState方法，那么setState的所有回调，都会延迟到componentDidUpdate中执行
            //componentWillMount时__dirty为true
            if (this.__hasRendered) {
                devolveCallbacks(this, cbs, '__tempMountCbs')
            }
            if (!this.__dirty && (this.__dirty = true)) {
                defer(() => {
                    if (!this._currentElement._hostNode) {
                        setStateImpl(this, {})
                        return
                    }
                    if (this.__dirty) {
                        devolveCallbacks(this, '__tempMountCbs', cbs)
                        options.refreshComponent(this, []);
                    }
                });
            }
        } else if (!this.__dirty && (this.__dirty = true)) {
            options.refreshComponent(this, []);
        }
    }
}

var defer = win.requestAnimationFrame ||
    win.webkitRequestAnimationFrame ||
    function (job) {
        setTimeout(job, 16);
    };