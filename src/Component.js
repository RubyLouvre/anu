import { extend, isFn, options, clearArray } from "./util";
import { CurrentOwner } from "./createElement";
import { win } from "./browser";

/**
 *组件的基类
 *
 * @param {any} props
 * @param {any} context
 */

export function Component(props, context) {
    CurrentOwner.set(this) // = this //防止用户在构造器生成JSX
    this.context = context;
    this.props = props;
    this.refs = {};
    this.state = null
    this.__pendingCallbacks = [];
    this.__pendingStates = [];
    this.__current = {}
    /*
    * this.__hydrating = true 表示组件正在根据虚拟DOM合成真实DOM
    * this.__renderInNextCycle = true 表示组件需要在下一周期重新渲染
    * this.__forceUpdate = true 表示会无视shouldComponentUpdate的结果
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
    __mergeStates: function (props, context) {
        var n = this.__pendingStates.length;
        if (n === 0) {
            return this.state;
        }
        var states = clearArray(this.__pendingStates)
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
        this
            .__pendingCallbacks
            .push(cb);
    }
    let hasDOM = this.__current._hostNode
    if (state === true) {//forceUpdate
        this.__forceUpdate = true
    } else {//setState
        this
            .__pendingStates
            .push(state);
    }
    if (!hasDOM) { //组件挂载期
        //componentWillUpdate中的setState/forceUpdate应该被忽略 
        if (this.__hydrating) {
            //在挂载过程中，子组件在componentWillReceiveProps里调用父组件的setState，延迟到下一周期更新
            this.__renderInNextCycle = true
        }

    } else { //组件更新期
        if (this.__receiving) {
            //componentWillReceiveProps中的setState/forceUpdate应该被忽略 
            return
        }
        this.__renderInNextCycle = true
        if (options.async) {
            //在事件句柄中执行setState会进行合并
            options.enqueueUpdate(this)
            return
        }
        if (this.__hydrating) {
            // 在componentDidMount里调用自己的setState，延迟到下一周期更新
            // 在更新过程中， 子组件在componentWillReceiveProps里调用父组件的setState，延迟到下一周期更新
            return
        }
        //  不在生命周期钩子内执行setState
        options.flushBatchedUpdates([this])
    }
}
