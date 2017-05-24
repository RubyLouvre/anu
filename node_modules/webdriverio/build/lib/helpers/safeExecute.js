'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * executes methods in try/catch block
 */
var safeExecute = function safeExecute(f, param) {
    return function exec() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var result = void 0;
        args = param || args;

        if (typeof f !== 'function') {
            return args[0];
        }

        /**
         * we need to catch errors here as we would stop the
         * execution and the promise (and the test) will never
         * finish
         */
        try {
            result = f.apply(this, args);
        } catch (e) {
            var error = e;

            if (e instanceof Error === false) {
                error = new Error(e);
            }

            return error;
        }

        return result;
    };
};

exports.default = safeExecute;
module.exports = exports['default'];