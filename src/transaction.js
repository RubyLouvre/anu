import { options } from "./util";
var queue = [];

export var transaction = {
  isInTransation: false,
  queueComponent: function(instance) {
    this.count = queue.push(instance);
  },
  dequeue: function(recursion) {
    this.isInTransation = true;
    var renderQueue = queue;
    queue = [];
    this.count = 0;
    var refreshComponent = options.immune.refreshComponent;
    for (var i = 0, n = renderQueue.length; i < n; i++) {
      var inst = renderQueue[i];
      inst._disabled = false;
      try {
        refreshComponent(inst);
      } catch (e) {
        /* istanbul ignore next */
        console.warn(e);
      }
    }
    this.isInTransation = false;

    /* istanbul ignore next */
    if (this.count) {
      this.dequeue(); //用于递归调用自身)
    }
  }
};
