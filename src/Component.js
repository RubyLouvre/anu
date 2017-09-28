import { extend, isFn, options, clearArray, noop,deprecatedWarn } from "./util";
import { CurrentOwner } from "./createElement";

/**
 *组件的基类
 *
 * @param {any} props
 * @param {any} context
 */
var mountOrder = 1;
export function Component(props, context) {
    //防止用户在构造器生成JSX
    CurrentOwner.cur = this;
    this.__mountOrder = mountOrder++;
    this.context = context;
    this.props = props;
    this.refs = {};
    this.state = null;
    this.__pendingCallbacks = [];
    this.__pendingStates = [];
    this.__current = noop;//用于DevTools工具中，通过实例找到生成它的那个虚拟DOM
    this.__lifestage = 0; //判断生命周期
    /*
    * this.__dom = dom 用于isMounted或ReactDOM.findDOMNode方法
    * this.__hydrating = true 表示组件正在根据虚拟DOM合成真实DOM
    * this.__renderInNextCycle = true 表示组件需要在下一周期重新渲染
    * this.__forceUpdate = true 表示会无视shouldComponentUpdate的结果
    */
}

Component.prototype = {
    constructor: Component,//必须重写constructor,防止别人在子类中使用Object.getPrototypeOf时找不到正确的基类
    replaceState() {
        deprecatedWarn("replaceState");
    },

    setState(state, cb) {
        debounceSetState(this, state, cb);
    },
    isMounted() {
        deprecatedWarn("isMounted");
        return !!this.__dom;
    },
    forceUpdate(cb) {
        debounceSetState(this, true, cb);
    },
    __mergeStates: function (props, context) {
        var n = this.__pendingStates.length;
        if (n === 0) {
            return this.state;
        }
        var states = clearArray(this.__pendingStates);
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

function debounceSetState(a, b, c) {
    if (a.__didUpdate) {//如果用户在componentDidUpdate中使用setState，要防止其卡死
        setTimeout(function () {
            a.__didUpdate = false;
            setStateImpl.call(a, b, c);
        }, 300);
        return;
    }
    setStateImpl.call(a, b, c);
}
function setStateImpl(state, cb) {
    if (isFn(cb)) {
        this
            .__pendingCallbacks
            .push(cb);
    }
    let hasDOM = this.__dom;
    if (state === true) {//forceUpdate
        this.__forceUpdate = true;
    } else {//setState
        this
            .__pendingStates
            .push(state);
    }
    if (!hasDOM) { //组件挂载期
        //componentWillUpdate中的setState/forceUpdate应该被忽略 
        if (this.__hydrating) {
            //在render方法中调用setState也会被延迟到下一周期更新.这存在两种情况， 
            //1. 组件直接调用自己的setState
            //2. 子组件调用父组件的setState，
            this.__renderInNextCycle = true;
        }
    } else { //组件更新期
        if (this.__receiving) {
            //componentWillReceiveProps中的setState/forceUpdate应该被忽略 
            return;
        }
        this.__renderInNextCycle = true;
        if (options.async) {
            //在事件句柄中执行setState会进行合并
            options.addTask(this);
            return;
        }
        if (this.__hydrating) {
            // 在componentDidMount里调用自己的setState，延迟到下一周期更新
            // 在更新过程中， 子组件在componentWillReceiveProps里调用父组件的setState，延迟到下一周期更新
            return;
        }
        //  不在生命周期钩子内执行setState
        options.flushBatchedUpdates([this]);
    }
}
