export var eventSystem = {
    classCache: {},
    dispatchEvent: function(e) {
        //在存在bindxxx的元素中，添加一个data-eventid="xxx$yyy"的属性，
        //bindxxx的回调名统一改成dispatchEvent;
        var target = e.currentTarget;
        var dataset = target.dataset || {};
        var eventName = dataset[e.type + "Fn"];
        var classCode = dataset.classCode;
        var componentClass = eventSystem.classCache[classCode];
        var fn = componentClass && componentClass.prototype[eventName];
        if (fn) {
            var instanceCode = dataset.instanceCode;
            for (var i = 0, el; (el = componentClass.instances[i++]); ) {
                if (el.instanceCode === instanceCode) {
                    fn.call(el || e.target, e);
                    break;
                }
            }
        }
    }
};
