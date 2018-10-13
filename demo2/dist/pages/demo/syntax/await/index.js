"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ReactWX = require("../../../../ReactWX.js");

var _ReactWX2 = _interopRequireDefault(_ReactWX);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var regeneratorRuntime = require('../../../../npm/regenerator-runtime/runtime.js');

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

const style = {
    'textAlign': 'center'
};

function P() {
    this.state = {
        status: ''
    };
}

P = _ReactWX2.default.toClass(P, _ReactWX2.default.Component, {
    say: function () {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve('屌爆了!!');
            }, 2000);
        });
    },
    tapHander: function () {
        var _this = this;

        return _asyncToGenerator(function* () {
            _this.setState({ status: 'waiting...' });
            let result = yield _this.say();
            _this.setState({
                status: result
            });
        })();
    },
    render: function () {
        var h = _ReactWX2.default.createElement;

        return h('view', null, h('view', { style: _ReactWX2.default.toStyle(style, this.props, 'style1233') }, 'async/await'), h('view', null, 'status: ', this.state.status), h('button', { onTap: this.tapHander,
            'data-tap-uid': 'e1464', 'data-class-uid': 'c867' }, '\u8BD5\u4E00\u8BD5'));
    },
    classUid: 'c867'
}, {});
Page(_ReactWX2.default.registerPage(P, 'pages/demo/syntax/await/index'));

exports.default = P;