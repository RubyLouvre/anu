import { extend, isFn, options, noop, deprecatedWarn } from "./util";
import { CurrentOwner } from "./createElement";

/**
 *组件的基类
 *
 * @param {any} props
 * @param {any} context
 */
export function Component(props, context) {
    //防止用户在构造器生成JSX
    CurrentOwner.cur = this;
    this.context = context;
    this.props = props;
    this.refs = {};
    this.state = null;
}

Component.prototype = {
    constructor: Component, //必须重写constructor,防止别人在子类中使用Object.getPrototypeOf时找不到正确的基类
    replaceState() {
        deprecatedWarn("replaceState");
    },

    setState(state, cb) {
        debounceSetState(this.updater, state, cb);
    },
    isMounted() {
        deprecatedWarn("isMounted");
        return !!(this.updater || {})._hostNode;
    },
    forceUpdate(cb) {
        debounceSetState(this.updater, true, cb);
    },
    render() {}
};

function debounceSetState(updater, state, cb) {
    if(!updater){
        return;
    }
    if (updater._didUpdate) {
        //如果用户在componentDidUpdate中使用setState，要防止其卡死
        setTimeout(function() {
            updater._didUpdate = false;
            setStateImpl(updater, state, cb);
        }, 300);
        return;
    }
    setStateImpl(updater, state, cb);
}
function setStateImpl(updater, state, cb) {
    if (isFn(cb)) {
        updater._pendingCallbacks.push(cb);
    }
    let hasDOM = updater._hostNode;
    if (state === true) {
        //forceUpdate
        updater._forceUpdate = true;
    } else {
        //setState
        updater._pendingStates.push(state);
    }
    if (!hasDOM) {
        //组件挂载期
        //componentWillUpdate中的setState/forceUpdate应该被忽略
        if (updater._hydrating) {
            //在render方法中调用setState也会被延迟到下一周期更新.这存在两种情况，
            //1. 组件直接调用自己的setState
            //2. 子组件调用父组件的setState，
            updater._renderInNextCycle = true;
        }
    } else {
        //组件更新期
        if (updater._receiving) {
            //componentWillReceiveProps中的setState/forceUpdate应该被忽略
            return;
        }
        updater._renderInNextCycle = true;
        if (options.async) {
            //在事件句柄中执行setState会进行合并
            options.enqueueUpdater(updater);
            return;
        }
        if (updater._hydrating) {
            // 在componentDidMount里调用自己的setState，延迟到下一周期更新
            // 在更新过程中， 子组件在componentWillReceiveProps里调用父组件的setState，延迟到下一周期更新
            return;
        }
        //  不在生命周期钩子内执行setState
        options.flushUpdaters([updater]);
    }
}
