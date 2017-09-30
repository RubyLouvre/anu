//by 司徒正美
(function umd(root, factory) {
    if (typeof exports === "object" && typeof module === "object") {
        module.exports = factory();
    } else if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof exports === "object") {
        exports.shallowCompare = factory();
    } else {
        root.shallowCompare = factory();
    }
})(this, function() {

    const hasOwn = Object.prototype.hasOwnProperty;

    function is(x, y) {
        if (x === y) {
            return x !== 0 || y !== 0 || 1 / x === 1 / y;
        } else {
            return x !== x && y !== y;
        }
    }
    //https://github.com/reactjs/react-redux/blob/master/src/utils/shallowEqual.js
    function shallowEqual(objA, objB) {
        if (is(objA, objB)) {
            return true;
        }

        if (typeof objA !== "object" || objA === null ||
      typeof objB !== "object" || objB === null) {
            return false;
        }

        const keysA = Object.keys(objA);
        const keysB = Object.keys(objB);

        if (keysA.length !== keysB.length) {
            return false;
        }

        for (let i = 0; i < keysA.length; i++) {
            if (!hasOwn.call(objB, keysA[i]) ||
        !is(objA[keysA[i]], objB[keysA[i]])) {
                return false;
            }
        }

        return true;
    }
    return function shallowCompare(instance, nextProps, nextState) {
        var a = shallowEqual(instance.props, nextProps); 
        var b = shallowEqual(instance.state, nextState);
        return !a || !b;
    };
});
