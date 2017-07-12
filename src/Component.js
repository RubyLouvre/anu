import { extend, isFn, options } from "./util";
import { scheduler } from "./scheduler";

/**
 *组件的基类
 *
 * @param {any} props
 * @param {any} context
 */

export function Component(props, context) {
  this.context = context;
  this.props = props;
  this.refs = {};
  this._disableSetState = true;
  /**
   * this._disableSetState = true 用于阻止组件在componentWillMount/componentWillReceiveProps进行render
   * this._updating = true 用于将componentDidMount发生setState/forceUpdate 延迟到整个render后再触发
   * this._disposed = true 阻止组件在销毁后还进行diff
   * this._asyncUpdating = true 让组件的异步更新在同一个时间段只触发一次
   * this._forceUpdate = true 用于强制组件更新，忽略shouldComponentUpdate的结果
   * this._hasDidMount = true 表示这个组件已经触发componentDidMount回调，
   * 如果用户没有指定，那么它在插入DOM树时，自动标识为true
   * 此flag是确保 component在update前就要执行componentDidMount
   */
  this._pendingCallbacks = [];
  this._pendingStates = [];
  this.state = {};
}

Component.prototype = {
  replaceState() {
    console.warn("此方法末实现");
  },
  setState(state, cb) {
    this._pendingStates.push(state);
    setStateProxy(this, cb);
  },

  forceUpdate(cb) {
    this._forceUpdate = true;
    setStateProxy(this, cb);
  },
  _processPendingState: function(props, context) {
    var n = this._pendingStates.length;
    if (n === 0) {
      return this.state;
    }
    var queue = this._pendingStates.concat();
    this._pendingStates.length = 0;

    var nextState = extend({}, this.state);
    for (var i = 0; i < n; i++) {
      var partial = queue[i];
      extend(
        nextState,
        isFn(partial) ? partial.call(this, nextState, props, context) : partial
      );
    }

    return nextState;
  },

  render() {}
};

/**
 * 让外面的setState与forceUpdate都共用同一通道
 *
 * @param {any} instance
 * @param {any} state
 * @param {any} cb fire by component did update
 * @param {any} force ignore shouldComponentUpdate
 */

function setStateProxy(instance, cb) {
  if (isFn(cb)) {
    instance._pendingCallbacks.push(cb);
  }
  if (instance._disableSetState === true) {
    this._forceUpdate = false;
    //只存储回调，但不会触发组件的更新
    return;
  }
  if (instance._updating) {
      scheduler.add(function() {
        options.refreshComponent(instance);
     });
      /*
    setTimeout(function() {
      if (instance._pendingStates.length) {
        options.refreshComponent(instance);
      }
    });*/
    return;
  }

  if (instance._forceUpdate) {
    options.refreshComponent(instance);
    return;
  }
  //var timeoutID = setTimeout(function() {
  //  clearTimeout(timeoutID);
    options.refreshComponent(instance);
 // }, 0);
}
