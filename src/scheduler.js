import { options } from "./util";
var list = [];
export var scheduler = {
  add: function(el) {
    list.push(el);
  },
  run: function() {
    var queue = list;
    if (!list.length) return;
    list = [];
    queue.forEach(function(instance) {
      if (typeof instance === "function") {
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
        instance._disabled = true;
        instance.componentDidMount();
        instance._fireDidMount = true
        instance._disabled = false;
        if (instance._pendingStates.length)
          if (!instance._dirty) {
            instance._dirty = true;
            var timeoutID = setTimeout(function() {
              clearTimeout(timeoutID);
              instance._dirty = false;
              options.refreshComponent(instance);
              //处理componentDidMount产生的回调
            }, 0);
          }
      }
    });
  }
};
