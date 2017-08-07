import { extend, isFn, options } from "./util";
//import {scheduler} from "./scheduler";
import { CurrentOwner } from "./createElement";
import { win } from "./browser";

let dirtyComponents = []
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
  /**
   * this._disableSetState = true 用于阻止组件在componentWillMount/componentWillReceiveProps
   * 被setState，从而提前发生render;
   * this._updating = true 用于将componentDidMount发生setState/forceUpdate 延迟到整个render后再触发
   * this._disposed = true 阻止组件在销毁后还进行diff
   * this._forceUpdate = true 用于强制组件更新，忽略shouldComponentUpdate的结果
   * this._hasDidMount = true 表示这个组件已经触发componentDidMount回调，
   * 如果用户没有指定，那么它在插入DOM树时，自动标识为true
   * 此flag是确保 component在update前就要执行componentDidMount
   */
  this._pendingCallbacks = [];
  this._pendingStates = [];
  this._pendingRefs = [];
  this.state = {};
}

Component.prototype = {
  replaceState() {
    console.warn("此方法末实现"); // eslint-disable-line
  },
  _collectRefs: function (a, b) {
    this
      ._pendingRefs
      .push(a, b)
  },
  setState(state, cb) {

    setStateImpl.call(this, state, cb)
  },

  forceUpdate(cb) {
    setStateImpl.call(this, true, cb)
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
    this
      ._pendingCallbacks
      .push(cb);
  }
  //forceUpate是同步渲染
  if (state === true) {
    this._forceUpdate = true;
    options.refreshComponent(this);
  } else {
    //setState是异步渲染

    this._pendingStates
      .push(state);

    //子组件在componentWillReiveProps调用父组件的setState方法
    if (this._updating && CurrentOwner.cur) {
      CurrentOwner.cur.after = this
      return
    }

    if (!this._dirty && (this._dirty = true)) {
      var el = this
      defer(function () {
        options.refreshComponent(el);
      }, 16)
      // defer(rerender);
    }
  }
}
var defer = win.requestAnimationFrame || win.webkitRequestAnimationFrame || function (job) {
  setTimeout(job, 16)
}

function rerender() {
  dirtyComponents
    .forEach(function (el) {
      if (el._dirty) {
        options.refreshComponent(el);
      }
    })
}
