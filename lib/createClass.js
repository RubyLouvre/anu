(function umd(root, factory) {
    if (typeof exports === "object" && typeof module === "object") {
        module.exports = factory(require("react"));
    } else if (typeof define === "function" && define.amd) {
        define(["react"], factory);
    } else if (typeof exports === "object") {
        exports["createReactClass"] = factory(require("react"));
    } else {
        root["createReactClass"] = factory(root["React"]);
    }
})(this, function(ReactInAnujs) {
    return ReactInAnujs.createClass;
});
