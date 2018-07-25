export var eventSystem = {
  classCache: {},
  dispatchEvent: function(e) {
    //在存在bindxxx的元素中，添加一个data-eventid="xxx$yyy"的属性，
    //bindxxx的回调名统一改成dispatchEvent;
    var dataset = e.target.dataset || {};
    var eventId = dataset[e.type+"Fn"];
    var classId = eventid.match(/[^$]+/)[0];
    var eventName = eventid.slice(classId.length + 1);
    var clazz = classCache[classId];
    var fn = clazz && clazz.prototype[eventName];
    if (fn) {
      fn.call(e.target, e);
    }
  }
};
