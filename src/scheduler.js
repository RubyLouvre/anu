import { options, typeNumber } from "./util";

export var scheduler = {
  list: [],
  add: function(el) {
    this.count = this.list.push(el);
  },
  addAndRun: function(fn) {
    this.add(fn);
    setTimeout(function() {
      scheduler.run();
    }, 0);
  },
  run: function(no) {
    if (this.count === 0) return;
    this.count = 0;
    var queue = this.list;
    this.list = [];
    queue.forEach(function(instance) {
      if (typeNumber(instance) === 5) {
        instance(); //处理ref方法
        return;
      }
      if (instance._pendingCallbacks.length) {
        //处理componentWillMount产生的回调
        instance._pendingCallbacks.forEach(function(fn) {
          fn.call(instance);
        });
        instance._pendingCallbacks.length = 0;
      }
      if (instance.componentDidMount) {
        instance._updating = true;
        instance.componentDidMount();
        instance.componentDidMount = instance._updating = false;
        instance._hasDidMount = true;
        //处理componentDidMount里调用 setState产生重绘
        if (instance._pendingStates.length && !instance._disableSetState) {
          options.refreshComponent(instance);
        }
      }
    });
  }
};
