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
    },0);
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
        instance._updating = false;
        instance._hasDidMount = true;

        if (instance._pendingStates.length && !instance._disableSetState) {
          options.refreshComponent(instance);
        }
        //消灭里面的异步
        /*    if (instance._pendingStates.length && !instance._asyncUpdating) {
          instance._asyncUpdating = true;
          var timeoutID = setTimeout(function() {
            clearTimeout(timeoutID);
            instance._asyncUpdating = false;
            if (!instance._disableSetState) {
              options.refreshComponent(instance);
            }
            //处理componentDidMount产生的回调
          }, 0);
        }
        */
      }
    });
  }
};
