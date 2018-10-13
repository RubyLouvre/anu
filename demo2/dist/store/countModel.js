"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var regeneratorRuntime = require("../npm/regenerator-runtime/runtime.js");

function _asyncToGenerator(fn) {
    return function () {
        var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {
            function step(key, arg) {
                try {
                    var info = gen[key](arg);var value = info.value;
                } catch (error) {
                    reject(error);return;
                }if (info.done) {
                    resolve(value);
                } else {
                    return Promise.resolve(value).then(function (value) {
                        step("next", value);
                    }, function (err) {
                        step("throw", err);
                    });
                }
            }return step("next");
        });
    };
}

var count = {
    state: 0, // initial state
    reducers: {
        // handle state changes with pure functions
        increment(state, payload) {
            return state + payload;
        }
    },
    effects: dispatch => ({
        // handle state changes with impure functions.
        // use async/await for async actions
        incrementAsync(payload) {
            return _asyncToGenerator(function* () {
                yield new Promise(function (resolve) {
                    return setTimeout(resolve, 1000);
                });
                dispatch.count.increment(payload);
            })();
        }
    })
};
exports.default = count;