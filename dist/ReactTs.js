(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.React = factory());
}(this, (function () {
    var a = 1;

    var hello = "Hello World!";
    console.log(hello);
    console.log(a + 1);
    var A = /** @class */ (function () {
        function A(a$$1, b) {
            this.a = a$$1;
            this.b = b;
        }
        return A;
    }());
    var main = {
        A: A,
        a1: hello
    };

    return main;

})));
