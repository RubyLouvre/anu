import { transaction } from "./transaction";

import { extend, noop, isFn, options } from "./util";

/**
 *组件的基因
 *
 * @param {any} props
 * @param {any} context
 */

export function Component(props, context) {
  this.context = context;
  this.props = props;
  this.refs = {};
  this._hasMount = false;
  this._pendingCallbacks = [];
  this._pendingStates = [];
  this.state = {};
}

Component.prototype = {
  setState(state, cb) {
    this._pendingStates.push(state);

    setStateProxy(this, cb);
  },

  forceUpdate(cb) {
    if (!this._hasMount) {
      return;
    }
    this._pendingForceUpdate = true;
    setStateProxy(this, cb);
  },
  _processPendingState: function(props, context) {
    var n = this._pendingStates.length;
    if (n == 0) {
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
  if (!instance._hasMount || instance._disabled === true) {
    //如果是componentWillMount钩子中使用了setState 或forceUpdate，那么不应该放进列队
    //如果是componentWillReceiveProps钩子中使用了setState 或forceUpdate，那么也不应该放进列队
    return;
  }
  instance._disabled = true;
  transaction.queueComponent(instance);
  if (!transaction.isInTransation) {
    transaction.dequeue();
  }
}
