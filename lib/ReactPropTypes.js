(function umd(root, factory) {
    if (typeof exports === "object" && typeof module === "object") {
        module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof exports === "object") {
        exports["ReactPropTypes"] = factory();
    } else {
        root["ReactPropTypes"] = factory();
    }
})(this, function () {
    var check = function () {
        return check;
    };
    check.isRequired = check;
    return {
        array: check,
        bool: check,
        func: check,
        number: check,
        object: check,
        string: check,
        any: check,
        arrayOf: check,
        element: check,
        instanceOf: check,
        node: check,
        objectOf: check,
        oneOf: check,
        oneOfType: check,
        shape: check
    };
});
