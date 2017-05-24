'use strict';

exports.__esModule = true;
exports.afterHook = exports.beforeEachHook = exports.beforeHook = exports.browser = exports.config = exports.loadScript = undefined;

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _desc, _value, _class;

/**
 * load script async
 * @param {string} src
 * @return promise
 */
var loadScript = function () {
    var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(src) {
        var script, rs, rj, timer, prom;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        script = document.createElement('script');

                        script.type = 'text/javascript';
                        rs = void 0, rj = void 0, timer = void 0;

                        script.onload = function () {
                            script.onload = null;
                            clearTimeout(timer);
                            rs();
                        };
                        prom = new _promise2.default(function (resolve, reject) {
                            rs = resolve;
                            rj = reject;
                        });

                        script.src = src;
                        document.head.appendChild(script);
                        timer = setTimeout(function () {
                            return rj('load ' + src + ' time out');
                        }, 10000);
                        return _context6.abrupt('return', prom);

                    case 9:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, this);
    }));

    return function loadScript(_x7) {
        return _ref6.apply(this, arguments);
    };
}();

var wrapPromise = function () {
    var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(fn) {
        var wait = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        return _context7.abrupt('return', new _promise2.default(function (resolve, reject) {
                            wait ? fn(resolve, reject) : resolve();
                        }));

                    case 1:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, this);
    }));

    return function wrapPromise(_x8) {
        return _ref7.apply(this, arguments);
    };
}();
/**
 * run first in before()
 * @params {function} done if assigned, call done after promise resolved.
 * @return promise
 */


var beforeHook = function () {
    var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(done) {
        var _config2, url, host, port;

        return _regenerator2.default.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        // height & width : 100%
                        fullScreen();

                        if (!initialled) {
                            _context8.next = 3;
                            break;
                        }

                        return _context8.abrupt('return', done && done());

                    case 3:
                        _config2 = _config, url = _config2.url, host = _config2.host, port = _config2.port;

                        if (!url) url = host + ':' + port;
                        _context8.next = 7;
                        return loadScript('//' + url + '/socket.io/socket.io.js');

                    case 7:
                        // it's hard to share socket with karma
                        // Connection = (opener || parent).karma.socket;
                        Connection = io(url);
                        Connection.on('runBack', function (message) {
                            // console.log('runBack', message);
                            message && !message.status ? serialPromiseResolve() : serialPromiseReject(message.status);
                        });
                        // whether there is contextFrame, wait
                        waitingPromise = wrapPromise(function (resolve) {
                            Connection.on('ready', function (message) {
                                var _message$supportedDef = message.supportedDefs,
                                    supportedDefs = _message$supportedDef === undefined ? '' : _message$supportedDef;

                                supportedDefs.split(' ').map(function (def) {
                                    $$Browser[def] = function () {
                                        return this.__toRunnable.apply(this, [def].concat(Array.prototype.slice.call(arguments)));
                                    };
                                });
                                // console.log('ready', message);
                                resolve();
                            });
                        });
                        _context8.next = 12;
                        return waitingPromise;

                    case 12:
                        initialled = true;
                        done && done();

                    case 14:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, this);
    }));

    return function beforeHook(_x10) {
        return _ref8.apply(this, arguments);
    };
}();

/**
 * run last in after()
 * @params {function} done if assigned, call done after promise resolve
 * @return promise
 */
var afterHook = function () {
    var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(done) {
        return _regenerator2.default.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        fullScreen(false);
                        done && done();

                    case 2:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, _callee9, this);
    }));

    return function afterHook(_x11) {
        return _ref9.apply(this, arguments);
    };
}();

/**
 * run before each test, reset browser status
 * @return promise
 */
var beforeEachHook = function () {
    var _ref10 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee10(done) {
        return _regenerator2.default.wrap(function _callee10$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                        browser.__autoStart = browser.__prom = browser.__rejectSerial = browser.__resolveSerial = null;
                        done && done();

                    case 2:
                    case 'end':
                        return _context10.stop();
                }
            }
        }, _callee10, this);
    }));

    return function beforeEachHook(_x12) {
        return _ref10.apply(this, arguments);
    };
}();

var _coreDecorators = require('core-decorators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
        return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
        desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
        Object['define' + 'Property'](target, property, desc);
        desc = null;
    }

    return desc;
}

/**
 * browser side hooks for webdriver based event drive test
 */
var config = function config(conf) {
    _config = (0, _extends3.default)({}, _config, conf);
};
var _config = {
    port: 8848,
    host: '127.0.0.1'
};
var idCount = 0;
var Connection = void 0;
// get browserId
var browserId = ((opener || parent).location.search || '').replace(/^\S+id=([0-9]+)\S*/g, function (mat, id) {
    return id;
});
var switchFrame = parent !== window;

// this ext can only run in karma default tap with an iframe#context
var contextFrame = parent.document.getElementById('context');
contextFrame = contextFrame && contextFrame.nodeName === 'IFRAME' ? contextFrame : null;
var fullScreenStyle = { position: 'absolute', left: 0, top: 0, background: '#fff' },
    originalStyle = {};
if (contextFrame) {
    for (var pro in fullScreenStyle) {
        originalStyle[pro] = contextFrame.style[pro];
    }
}

function noop() {}

var initialled = void 0,
    $$Browser = void 0;

// webdriver api serial
var waitingPromise = _promise2.default.resolve();
// promise ensure serial
var serialPromiseResolve = void 0,
    serialPromiseReject = void 0;

var $Browser = (_class = function () {
    function $Browser() {
        (0, _classCallCheck3.default)(this, $Browser);

        this.__tests;
        this.__stack;
    }
    /**
     * @public $next execute next serial test or resolve/reject a waiting promise
     * @param {any} status !!status ? reject(status) : resolve()
     */


    $Browser.prototype.$next = function () {
        var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(status) {
            var action;
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            action = this.__tests.shift();
                            // call before $serial

                            if (!action && !this.__autoStart) this.__autoStart = true;

                            if (!action) {
                                _context.next = 7;
                                break;
                            }

                            _context.next = 5;
                            return action(status).then(noop, this.__rejectSerial);

                        case 5:
                            _context.next = 8;
                            break;

                        case 7:
                            if (this.__resolveSerial) {
                                this.__resolveSerial();
                            }

                        case 8:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        function $next(_x) {
            return _ref.apply(this, arguments);
        }

        return $next;
    }();
    /**
     * @public $serial register serial test
     * @param {Function} tests as many functions as u want
     * @return {Promise} 
     */


    $Browser.prototype.$serial = function $serial() {
        var _this = this;

        this.__prom = this.__prom || new _promise2.default(function (rs, rj) {
            _this.__resolveSerial = function () {
                rs();
                beforeEachHook();
            };
            _this.__rejectSerial = function (e) {
                rj(e);
                beforeEachHook();
            };
        });

        for (var _len = arguments.length, tests = Array(_len), _key = 0; _key < _len; _key++) {
            tests[_key] = arguments[_key];
        }

        tests.forEach(function (test) {
            _this.__tests.push((0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return test(_this);

                            case 2:
                                _context2.next = 4;
                                return _this.$next();

                            case 4:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, _this);
            })));
        });
        if (this.__autoStart) {
            this.$next();
            this.__autoStart = false;
        }
        return this.__prom;
    };
    /**
     * @public $apply execute right now
     * @param {Boolean} applyAndWaitForNext wait for calling browser.$next
     * @param {Function} done callback
     * @return {Promise} if !!applyAndWaitForNext === false return a resolved promise, else a promise not resolved until browser.$next being called
     */


    $Browser.prototype.$apply = function () {
        var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(applyAndWaitForNext, done) {
            var _this2 = this;

            var actions, executerPromiseResolve, executerPromiseReject, prom;
            return _regenerator2.default.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            actions = this.__stack.splice(0);

                            if (initialled) {
                                _context4.next = 3;
                                break;
                            }

                            return _context4.abrupt('return', console.error('ensure beforeHook has been called'));

                        case 3:
                            executerPromiseResolve = void 0, executerPromiseReject = void 0;
                            prom = void 0;

                            if (applyAndWaitForNext) {
                                prom = new _promise2.default(function (resolve, reject) {
                                    executerPromiseResolve = resolve;
                                    executerPromiseReject = reject;
                                });
                                console.log('add a waiting promise, ensure browser.$next(status) is called at right time');
                                // !!status === true, then reject
                                this.__tests.unshift(function () {
                                    var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(status) {
                                        return _regenerator2.default.wrap(function _callee3$(_context3) {
                                            while (1) {
                                                switch (_context3.prev = _context3.next) {
                                                    case 0:
                                                        !!status ? executerPromiseReject(status) : executerPromiseResolve();

                                                    case 1:
                                                    case 'end':
                                                        return _context3.stop();
                                                }
                                            }
                                        }, _callee3, _this2);
                                    }));

                                    return function (_x4) {
                                        return _ref4.apply(this, arguments);
                                    };
                                }());
                            };
                            _context4.next = 9;
                            return waitingPromise;

                        case 9:
                            if (!actions.length) {
                                _context4.next = 14;
                                break;
                            }

                            waitingPromise = wrapPromise(function (resolve, reject) {
                                serialPromiseResolve = resolve;
                                serialPromiseReject = reject;
                            }, contextFrame);
                            this.__callDriver(actions);
                            _context4.next = 14;
                            return waitingPromise;

                        case 14:
                            _context4.next = 16;
                            return prom;

                        case 16:
                            done && done();

                        case 17:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        function $apply(_x2, _x3) {
            return _ref3.apply(this, arguments);
        }

        return $apply;
    }();
    /**
     * @public $applyAndWaitForNext equal to $$action('applyAndWaitForNext')
     */


    $Browser.prototype.$applyAndWaitForNext = function () {
        var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(done) {
            return _regenerator2.default.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            _context5.next = 2;
                            return this.$apply(true, done);

                        case 2:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, this);
        }));

        function $applyAndWaitForNext(_x5) {
            return _ref5.apply(this, arguments);
        }

        return $applyAndWaitForNext;
    }();
    /**
     * @private __callDriver send Command to server
     * @param {Array} actions
     */


    $Browser.prototype.__callDriver = function __callDriver(actions) {
        if (!contextFrame) return console.warn('webdriver driving test can\'t run in current tab', location.href);
        Connection.emit('runCommand', {
            actions: actions,
            browserId: browserId,
            switchFrame: switchFrame
        });
    };
    /**
     * parse browser.api(a, b, c) => ['api', [b, c]], so can be sent to the server and executed by the webdriver.
     * @private __toRunnable
     * @param {string} def api name
     * @param {any} args arguments
     */


    $Browser.prototype.__toRunnable = function __toRunnable(def) {
        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
        }

        this.__stack.push([def, args.map(function (ele) {
            if (ele instanceof Element) {
                // if no id, allocate one
                ele.id = ele.id || (ele.className && ele.className.split(' ')[0] || 'WebDriverID').replace(/\-/g, '_') + idCount++;
                return '#' + ele.id;
            } else if (typeof ele === 'function') {
                throw Error('can\'t use function ' + ele);
            } else {
                return ele;
            }
        })]);
        return this;
    };

    return $Browser;
}(), (_applyDecoratedDescriptor(_class.prototype, '$next', [_coreDecorators.autobind], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, '$next'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, '$serial', [_coreDecorators.autobind], (0, _getOwnPropertyDescriptor2.default)(_class.prototype, '$serial'), _class.prototype)), _class);


function Browser() {
    this.__tests = []; // for register tests
    this.__stack = []; // tmp stack for browser[api]
    this.__prom = null;
}

$$Browser = Browser.prototype = new $Browser();

var browser = new Browser();

function fullScreen() {
    var full = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

    if (!contextFrame) return;
    var tar = full ? fullScreenStyle : originalStyle;
    for (var _pro in tar) {
        contextFrame.style[_pro] = tar[_pro];
    }
};;exports.default = {
    loadScript: loadScript,
    config: config,
    browser: browser,
    beforeHook: beforeHook,
    beforeEachHook: beforeEachHook,
    afterHook: afterHook
};
exports.loadScript = loadScript;
exports.config = config;
exports.browser = browser;
exports.beforeHook = beforeHook;
exports.beforeEachHook = beforeEachHook;
exports.afterHook = afterHook;
