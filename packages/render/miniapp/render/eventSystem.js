export var eventSystem = {
  classCache: {},
  dispatchEvent: function(e) {
    //在存在bindxxx的元素中，添加一个data-eventid="xxx$yyy"的属性，
    //bindxxx的回调名统一改成dispatchEvent;
    var dataset = e.target.dataset || {};
    var eventName = dataset[e.type+"Fn"];
    var classCode = dataset.classCode
    var componentClass = classCache[classCode];
    var fn = componentClass && componentClass.prototype[eventName];
    if (fn) {
      var instanceCode = dataset.instanceCode
      var instance = componentClass.instances.find(function(el){
         return el.instanceCode === instanceCode
      })
      fn.call(instance || e.target, e);
    }
  }
};
