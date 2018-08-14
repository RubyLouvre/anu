import { returnFalse } from "react-core/util";

export var eventSystem = {
    classCache: {},
    dispatchEvent: function(e) {
        var target = e.currentTarget;
        var dataset = target.dataset || {};
        var eventName = dataset[e.type + "Fn"]; //函数名
        var classCode = dataset.classCode; //类ID
        var componentClass = eventSystem.classCache[classCode]; //类
        var instanceCode = dataset.instanceCode; //实例ID
        var instance = componentClass.instances[instanceCode];
        var key = dataset["key"];
        if (instance) {
            try {
                var fn = instance.$$eventCached[eventName + (key !=null ? "-" + key : "")];

                fn && fn.call(instance, createEvent(e, target));
            } catch (e) {
                console.log(e.stack);
            }
        }
    }
};
//创建事件对象
function createEvent(e, target) {
    var event = e.detail || {};
    event.stopPropagation = function() {
        console.warn("小程序不支持这方法，请使用catchXXX");
    };
    event.preventDefault = returnFalse;
    event.type = e.type;
    event.currentTarget = event.target = target;
    event.touches = e.touches;
    event.timeStamp = e.timeStamp;
    return event;
}
