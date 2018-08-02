export var eventSystem = {
    classCache: {},
    dispatchEvent: function(e) {
        var target = e.currentTarget;
        var dataset = target.dataset || {};
        var eventName = dataset[e.type + "Fn"];//函数名
        var classCode = dataset.classCode;//类ID
        var componentClass = eventSystem.classCache[classCode];//类
        var fn = componentClass && componentClass.prototype[eventName];//函数
        if (fn) {
            var instanceCode = dataset.instanceCode;//实例ID
            for (var i = 0, el; (el = componentClass.instances[i++]); ) {
                if (el.instanceCode === instanceCode) {//对应的实例
                    fn.call(el, e);
                    break;
                }
            }
        }
    }
};
