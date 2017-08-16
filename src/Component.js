import { extend, isFn, options } from "./util";
import { CurrentOwner, dirtyComponents } from "./createElement";
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
    this._dirty = true
    this._pendingCallbacks = [];
    this._pendingStates = [];
    this._pendingRefs = [];
    /*
    * this._dirty = true 表示组件不能更新
    * this._hasRendred = true 表示组件已经渲染了一次
    * this._rerender = true 表示组件需要再渲染一次
    * this._hasDidMount = true 表示组件及子孙已经都插入DOM树
    * this._updating = true 表示组件处于componentWillUpdate与componentDidUpdate中
    * this._forceUpdate = true 用于强制组件更新，忽略shouldComponentUpdate的结果
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
    _collectRefs: function (a, b) {
        this
            ._pendingRefs
            .push(a, b)
    },
    _processPendingState: function (props, context) {
        var n = this._pendingStates.length;
        if (n === 0) {
            return this.state;
        }
        var states = this
            ._pendingStates
            .splice(0);
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
        this._pendingCallbacks.push(cb);
    }
    // forceUpate是同步渲染
    if (state === true) {
        if (!this._dirty && (this._dirty = true)) {
            this._forceUpdate = true;
            options.refreshComponent(this, []);
        }
    } else {
        // setState是异步渲染
        this._pendingStates.push(state);
        // 子组件在componentWillReiveProps调用父组件的setState方法
        if (this._updating) {
            devolveCallbacks.call(this, '_updateCallbacks')
            this._rerender = true
        } else if (!this._hasDidMount) {
            //如果在componentDidMount中调用setState方法，那么setState的所有回调，都会延迟到componentDidUpdate中执行
            if (this._hasRendered)
                devolveCallbacks.call(this, '_mountingCallbacks')
            if (!this._dirty && (this._dirty = true)) {
                defer(() => {
                    if (this._dirty) {
                        this._pendingCallbacks = this._mountingCallbacks
                        options.refreshComponent(this, []);
                    }
                });
            }
        } else if (!this._dirty && (this._dirty = true)) {
            //在DidMount钩子执行之前被子组件调用了setState方法
            options.refreshComponent(this, []);
        }
        /*  defer(() => {
            if (this._dirty) {
              console.log(this.constructor.name, "异步被刷新2");
              options.refreshComponent(this, []);
            }
          });*/
    }
}

function devolveCallbacks(name) {
    var args = this._pendingCallbacks
    var list = this[name] = this[name] || []
    list.push.apply(list, args)
    this._pendingCallbacks = []
}
var defer = win.requestAnimationFrame ||
    win.webkitRequestAnimationFrame ||
    function (job) {
        setTimeout(job, 16);
    };
