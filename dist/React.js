/**
 * by 司徒正美 Copyright 2019-05-20
 * IE9+
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.React = factory());
}(this, (function () {
    function bar(x) {
        return x.length;
    }
    bar('Hello, world!');
    var index = {
        bar: bar
    };

    return index;

})));
