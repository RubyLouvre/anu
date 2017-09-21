(function umd(root, factory) {
    if (typeof exports === "object" && typeof module === "object") {
        module.exports = factory(require("react"));
    } else if (typeof define === "function" && define.amd) {
        define(["react"], factory);
    } else if (typeof exports === "object") {
        exports["EventEmitter"] = factory(require("react"));
    } else {
        root["EventEmitter"] = factory(root["React"]);
    }
})(this, function(ReactInAnujs) {
    var eventSystem = ReactInAnujs.eventSystem;
    if (!eventSystem) {
        throw new Error("请确保你加载的是anujs");
    }
    return {
        ReactEventListener: {
            dispatchEvent: function(name, event) {
                eventSystem.dispatchEvent(event);
            }
        }
    };
});
