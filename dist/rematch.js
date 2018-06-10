/**
 * Rematch的anujs适配版 文档见这里 https://reach.tech/router
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('redux')) :
	typeof define === 'function' && define.amd ? define(['exports', 'redux'], factory) :
	(factory((global.Rematch = {}),global.Redux));
}(this, (function (exports,Redux) {

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
var dispatchPlugin = {
    exposed: {
        storeDispatch: function storeDispatch(action) {
            console.warn('Warning: store not yet loaded');
        },
        storeGetState: function storeGetState() {
            console.warn('Warning: store not yet loaded');
        },
        dispatch: function dispatch(action, state) {
            return this.storeDispatch(action, state);
        },
        createDispatcher: function createDispatcher(modelName, reducerName) {
            var _this = this;
            return function () {
                var _ref = _asyncToGenerator(              regeneratorRuntime.mark(function _callee(payload, meta) {
                    var action;
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    action = {
                                        type: modelName + '/' + reducerName
                                    };
                                    if (typeof payload !== 'undefined') {
                                        action.payload = payload;
                                    }
                                    if (typeof meta !== 'undefined') {
                                        action.meta = meta;
                                    }
                                    if (!_this.dispatch[modelName][reducerName].isEffect) {
                                        _context.next = 5;
                                        break;
                                    }
                                    return _context.abrupt('return', _this.dispatch(action, _this.storeGetState()));
                                case 5:
                                    return _context.abrupt('return', _this.dispatch(action));
                                case 6:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, _this);
                }));
                return function (_x, _x2) {
                    return _ref.apply(this, arguments);
                };
            }();
        }
    },
    onStoreCreated: function onStoreCreated(store) {
        this.storeDispatch = store.dispatch;
        this.storeGetState = store.getState;
    },
    onModel: function onModel(model) {
        this.dispatch[model.name] = {};
        if (!model.reducers) {
            return;
        }
        for (var reducerName in model.reducers) {
            this.validate([[!!reducerName.match(/\/.+\//), 'Invalid reducer name (' + model.name + '/' + reducerName + ')'], [typeof model.reducers[reducerName] !== 'function', 'Invalid reducer (' + model.name + '/' + reducerName + '). Must be a function']]);
            this.dispatch[model.name][reducerName] = this.createDispatcher.apply(this, [model.name, reducerName]);
        }
    }
};

function _asyncToGenerator$1(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
var effectsPlugin = {
    exposed: {
        effects: {}
    },
    onModel: function onModel(model) {
        if (!model.effects) {
            return;
        }
        for (var effectName in model.effects) {
            this.validate([[!!effectName.match(/\//), 'Invalid effect name (' + model.name + '/' + effectName + ')'], [typeof model.effects[effectName] !== 'function', 'Invalid effect (' + model.name + '/' + effectName + '). Must be a function']]);
            this.effects[model.name + '/' + effectName] = model.effects[effectName].bind(this.dispatch[model.name]);
            this.dispatch[model.name][effectName] = this.createDispatcher.apply(this, [model.name, effectName]);
            this.dispatch[model.name][effectName].isEffect = true;
        }
    },
    middleware: function middleware(store) {
        var _this = this;
        return function (next) {
            return function () {
                var _ref = _asyncToGenerator$1(              regeneratorRuntime.mark(function _callee(action, state) {
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    if (!(action.type in _this.effects)) {
                                        _context.next = 6;
                                        break;
                                    }
                                    _context.next = 3;
                                    return next(action);
                                case 3:
                                    return _context.abrupt('return', _this.effects[action.type](action.payload, state, action.meta));
                                case 6:
                                    return _context.abrupt('return', next(action));
                                case 7:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, _this);
                }));
                return function (_x, _x2) {
                    return _ref.apply(this, arguments);
                };
            }();
        };
    }
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
function validate(validations) {
    if (process.env.NODE_ENV !== 'production') {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;
        try {
            for (var _iterator = validations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var validation = _step.value;
                var condition = validation[0];
                var errorMessage = validation[1];
                if (condition) {
                    throw new Error(errorMessage);
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
}
function isListener(reducer) {
    return reducer.includes('/');
}
function merge(original, next) {
    return next ? Object.assign({}, next, original || {}) : original || {};
}
function isObject(obj) {
    return Array.isArray(obj) || (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object';
}
function mergeConfig(initConfig) {
    var config = Object.assign({
        name: initConfig.name,
        models: {},
        plugins: []
    }, initConfig, {
        redux: Object.assign({
            reducers: {},
            rootReducers: {},
            enhancers: [],
            middlewares: []
        }, initConfig.redux, {
            devtoolOptions: Object.assign({
                name: initConfig.name
            }, initConfig.redux && initConfig.redux.devtoolOptions ? initConfig.redux.devtoolOptions : {})
        })
    });
    if (process.env.NODE_ENV !== 'production') {
        validate([[!Array.isArray(config.plugins), 'init config.plugins must be an array'], [isObject(config.models), 'init config.models must be an object'], [isObject(config.redux.reducers), 'init config.redux.reducers must be an object'], [!Array.isArray(config.redux.middlewares), 'init config.redux.middlewares must be an array'], [!Array.isArray(config.redux.enhancers), 'init config.redux.enhancers must be an array of functions'], [config.redux.combineReducers && typeof config.redux.combineReducers !== 'function', 'init config.redux.combineReducers must be a function'], [config.redux.createStore && typeof config.redux.createStore !== 'function', 'init config.redux.createStore must be a function']]);
    }
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;
    try {
        for (var _iterator2 = config.plugins[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var plugin = _step2.value;
            if (plugin.config) {
                config.models = merge(config.models, plugin.config.models);
                config.plugins = [].concat(_toConsumableArray(config.plugins), _toConsumableArray(plugin.config.plugins || []));
                if (plugin.config.redux) {
                    config.redux.initialState = merge(config.redux.initialState, plugin.config.redux.initialState);
                    config.redux.reducers = merge(config.redux.reducers, plugin.config.redux.reducers);
                    config.redux.rootReducers = merge(config.redux.rootReducers, plugin.config.redux.reducers);
                    config.redux.enhancers = [].concat(_toConsumableArray(config.redux.enhancers), _toConsumableArray(plugin.config.redux.enhancers || []));
                    config.redux.middlewares = [].concat(_toConsumableArray(config.redux.middlewares), _toConsumableArray(plugin.config.redux.middlewares || []));
                    config.redux.combineReducers = config.redux.combineReducers || plugin.config.redux.combineReducers;
                    config.redux.createStore = config.redux.createStore || plugin.config.redux.createStore;
                }
            }
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }
    return config;
}

var _this = undefined;
var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
function _toConsumableArray$1(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
function composeEnhancersWithDevtools() {
    var devtoolOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return (typeof window === 'undefined' ? 'undefined' : _typeof$1(window)) === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(devtoolOptions) : Redux.compose;
}
var createRedux = (function (_ref) {
    var redux = _ref.redux,
        models = _ref.models;
    var combineReducers = redux.combineReducers || Redux.combineReducers;
    var createStore = redux.createStore || Redux.createStore;
    var initialState = typeof redux.initialState !== 'undefined' ? redux.initialState : {};
    _this.reducers = redux.reducers;
    _this.mergeReducers = function () {
        var nextReducers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        _this.reducers = Object.assign({}, _this.reducers, nextReducers);
        if (!isEmptyObject(_this.reducers)) {
            return function (state) {
                return state;
            };
        }
        return combineReducers(_this.reducers);
    };
    _this.createModelReducer = function (model) {
        var newReducers = {};
        var oldReducers = model.reducers || {};
        for (var modelReducer in oldReducers) {
            var action = isListener(modelReducer) ? modelReducer : model.name + '/' + modelReducer;
            newReducers[action] = model.reducers[modelReducer];
        }
        _this.reducers[model.name] = function (state, action) {
            if (typeof newReducers[action.type] === 'function') {
                return newReducers[action.type](state, action.payload, action.meta);
            }
            return state;
        };
    };
    for (var model in models) {
        _this.createModelReducer(model);
    }
    _this.createRootReducer = function () {
        var rootReducers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var mergedReducers = _this.mergeReducers();
        if (!isEmptyObject(rootReducers)) {
            return function (state, action) {
                var rootReducerAction = rootReducers[action.type];
                if (rootReducers[action.type]) {
                    return mergedReducers(rootReducerAction(state, action), action);
                }
                return mergedReducers(state, action);
            };
        }
        return mergedReducers;
    };
    var rootReducer = _this.createRootReducer(redux.rootReducers);
    var middlewares = Redux.applyMiddleware.apply(Redux, _toConsumableArray$1(redux.middlewares));
    var enhancers = composeEnhancersWithDevtools(redux.devtoolOptions).apply(undefined, _toConsumableArray$1(redux.enhancers).concat([middlewares]));
    _this.store = createStore(rootReducer, initialState, enhancers);
    return _this;
});
function isEmptyObject(obj) {
    for (var i in obj) {
        return false;
    }
    return true;
}

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var corePlugins = [dispatchPlugin, effectsPlugin];
var Rematch = function () {
    function Rematch(config) {
        var _this = this;
        _classCallCheck(this, Rematch);
        this.config = config;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;
        try {
            for (var _iterator = corePlugins.concat(this.config.plugins)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var plugin = _step.value;
                this.plugins.push(this.pluginFactory.create(plugin));
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
        this.forEachPlugin('middleware', function (middleware) {
            _this.config.redux.middlewares.push(middleware);
        });
    }
    _createClass(Rematch, [{
        key: 'forEachPlugin',
        value: function forEachPlugin(method, fn) {
            this.plugins.forEach(function (plugin) {
                if (plugin[method]) {
                    fn(plugin[method]);
                }
            });
        }
    }, {
        key: 'getModels',
        value: function getModels(models) {
            return Object.keys(models).map(function (name) {
                return Object.assign({
                    name: name
                }, models[name]);
            });
        }
    }, {
        key: 'addModel',
        value: function addModel(model) {
            validate([[!model, 'model config is required'], [typeof model.name !== 'string', 'model "name" [string] is required'], [model.state === undefined, 'model "state" is required']]);
            this.forEachPlugin('onModel', function (onModel) {
                return onModel(model);
            });
        }
    }, {
        key: 'init',
        value: function init() {
            var _this2 = this;
            this.models = this.getModels(this.config.models);
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;
            try {
                for (var _iterator2 = this.models[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var model = _step2.value;
                    this.addModel(model);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
            var redux = createRedux({
                redux: this.config.redux,
                models: this.models
            });
            var rematchStore = Object.assign({}, redux.store, {
                model: function model(_model) {
                    _this2.addModel(_model);
                    redux.mergeReducers(redux.createModelReducer(_model));
                    redux.store.replaceReducer(redux.createRootReducer(_this2.config.redux.rootReducers));
                }
            });
            this.forEachPlugin('onStoreCreated', function (onStoreCreated) {
                return onStoreCreated(rematchStore);
            });
            rematchStore.dispatch = this.pluginFactory.dispatch;
            return rematchStore;
        }
    }]);
    return Rematch;
}();

var stores = {};
var dispatches = {};
function dispatch(action) {
    for (var name in stores) {
        if (stores.hasOwnProperty(name)) {
            stores[name].dispatch(action);
        }
    }
}
function getState() {
    var state = {};
    for (var name in stores) {
        if (stores.hasOwnProperty(name)) {
            state[name] = stores[name].getState();
        }
    }
    return state;
}
function createModel(model) {
    return model;
}
function init() {
    var initConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var name = initConfig.name || Object.keys(stores).length.toString();
    var config = mergeConfig(Object.assign({}, initConfig, {
        name: name
    }));
    var store = new Rematch(config).init();
    stores[name] = store;
    var _loop = function _loop(modelName) {
        if (!dispatch[modelName]) {
            dispatch[modelName] = {};
        }
        var _loop2 = function _loop2(actionName) {
            if (!isListener(actionName)) {
                var action = store.dispatch[modelName][actionName];
                if (!dispatches[modelName]) {
                    dispatches[modelName] = {};
                }
                if (!dispatches[modelName][actionName]) {
                    dispatches[modelName][actionName] = {};
                }
                dispatches[modelName][actionName][name] = action;
                dispatch[modelName][actionName] = function (payload, meta) {
                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;
                    try {
                        for (var _iterator3 = Object.keys(dispatches[modelName][actionName])[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var storeName = _step3.value;
                            stores[storeName].dispatch[modelName][actionName](payload, meta);
                        }
                    } catch (err) {
                        _didIteratorError3 = true;
                        _iteratorError3 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                _iterator3.return();
                            }
                        } finally {
                            if (_didIteratorError3) {
                                throw _iteratorError3;
                            }
                        }
                    }
                };
            }
        };
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;
        try {
            for (var _iterator2 = Object.keys(store.dispatch[modelName])[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var actionName = _step2.value;
                _loop2(actionName);
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }
    };
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;
    try {
        for (var _iterator = Object.keys(store.dispatch)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var modelName = _step.value;
            _loop(modelName);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    return store;
}
var index = {
    dispatch: dispatch,
    getState: getState,
    init: init
};

exports.dispatch = dispatch;
exports.getState = getState;
exports.createModel = createModel;
exports.init = init;
exports.default = index;

Object.defineProperty(exports, '__esModule', { value: true });

})));
