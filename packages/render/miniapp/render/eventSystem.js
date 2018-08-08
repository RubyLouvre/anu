export var eventSystem = {
    classCache: {},
    dispatchEvent: function(e) {
        var target = e.currentTarget;
        var dataset = target.dataset || {};
        var eventName = dataset[e.type + "Fn"]; //函数名
        var classCode = dataset.classCode; //类ID
        var event = e.detail || {}
        event.stopPropagation = function(){
            console.warn("小程序不支持这方法，请使用catchXXX")
        }
        event.preventDefault = function(){}
        event.type = e.type;
        event.target = target;
        event.touches = e.touches;
        event.timeStamp = e.timeStamp;
        var componentClass = eventSystem.classCache[classCode]; //类
        var instanceCode = dataset.instanceCode; //实例ID
        for (var i = 0, el; (el = componentClass.instances[i++]); ) {
            if (el.instanceCode === instanceCode) {
                //对应的实例
                var fn = el[eventName];
                fn && fn.call(el, event);
                break;
            }
        }
    }
};
