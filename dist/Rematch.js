/**
 * Rematch的anujs适配版 文档见这里 https://reach.tech/router
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('redux')) :
        typeof define === 'function' && define.amd ? define(['exports', 'redux'], factory) :
            (factory((global.Rematch = {}), global.Redux));
}(this, (function (exports, Redux) {

    var validate = function validate(validations) {
    };
    function isListener(reducer) {
        return reducer.indexOf('/') !== -1;
    }
    var tos = Object.prototype.toString;
    function isFn(a) {
        return tos.call(a) === "[object Function]";
    }
    function isNotFn(obj) {
        return obj && !isFn(obj);
    }
    function merge(original, next) {
        original = original || {};
        return next ? Object.assign({}, next, original) : original;
    } var mergeConfig = function mergeConfig(initConfig) {
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
        config.plugins.forEach(function (plugin) {
            if (plugin.config) {
                config.models = merge(config.models, plugin.config.models);
                config.plugins = config.plugins.concat(plugin.config.plugins || []);
                var pluginRedux = config.plugin.redux;
                if (pluginRedux) {
                    var configRedux = config.redux;
                    configRedux.initialState = merge(config.redux.initialState, pluginRedux.initialState);
                    configRedux.reducers = merge(config.redux.reducers, pluginRedux.reducers);
                    configRedux.rootReducers = merge(config.redux.rootReducers, pluginRedux.reducers);
                    configRedux.enhancers = configRedux.enhancers.concat(pluginRedux.enhancers || []);
                    configRedux.middlewares = configRedux.middlewares.concat(pluginRedux.middlewares || []);
                    configRedux.combineReducers = configRedux.combineReducers || pluginRedux.combineReducers;
                    configRedux.createStore = configRedux.createStore || pluginRedux.createStore;
                }
            }
        });
        return config;
    };

    function pluginFactory() {
        return {
            validate: validate,
            create: function create(plugin) {
                validate([[isNotFn(plugin.onStoreCreated), 'Plugin onStoreCreated must be a function'], [isNotFn(plugin.onModel), 'Plugin onModel must be a function'], [isNotFn(plugin.middleware), 'Plugin middleware must be a function']]);
                if (plugin.onInit) {
                    plugin.onInit.call(this);
                }
                var result = {};
                if (plugin.exposed) {
                    Object.keys(plugin.exposed).forEach(function (key) {
                        this[key] = isFn(plugin.exposed[key]) ? plugin.exposed[key].bind(this)
                            : Object.create(plugin.exposed[key]);
                    }, this);
                }
                Array('onModel', 'middleware', 'onStoreCreated').forEach(function (method) {
                    if (plugin[method]) {
                        result[method] = plugin[method].bind(this);
                    }
                }, this);
                return result;
            }
        };
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : new P(function (resolve) {
                    resolve(result.value);
                }).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = {
            label: 0,
            sent: function sent() {
                if (t[0] & 1) {
                    throw t[1];
                }
                return t[1];
            },
            trys: [],
            ops: []
        },
            f,
            y,
            t,
            g;
        return g = {
            next: verb(0),
            'throw': verb(1),
            'return': verb(2)
        }, typeof Symbol === 'function' && (g[Symbol.iterator] = function () {
            return this;
        }), g;
        function verb(n) {
            return function (v) {
                return step([n, v]);
            };
        }
        function step(op) {
            if (f) {
                throw new TypeError('Generator is already executing.');
            }
            while (_) {
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y['return'] : op[0] ? y['throw'] || ((t = y['return']) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) {
                        return t;
                    }
                    if (y = 0, t) {
                        op = [op[0] & 2, t.value];
                    }
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return {
                                value: op[1],
                                done: false
                            };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2]) {
                                _.ops.pop();
                            }
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                } catch (e) {
                    op = [6, e];
                    y = 0;
                } finally {
                    f = t = 0;
                }
            }
            if (op[0] & 5) {
                throw op[1];
            }
            return {
                value: op[0] ? op[1] : void 0,
                done: true
            };
        }
    }
    var dispatchPlugin = {
        exposed: {
            storeDispatch: function storeDispatch(action, state) {
                console.warn('Warning: store not yet loaded');
            },
            storeGetState: function storeGetState() {
                console.warn('Warning: store not yet loaded');
            },
            dispatch: function dispatch(action) {
                return this.storeDispatch(action);
            },
            createDispatcher: function createDispatcher(modelName, reducerName) {
                var _this = this;
                return function (payload, meta) {
                    return __awaiter(_this, void 0, void 0, function () {
                        var action;
                        return __generator(this, function (_a) {
                            action = {
                                type: modelName + '/' + reducerName
                            };
                            if (typeof payload !== 'undefined') {
                                action.payload = payload;
                            }
                            if (typeof meta !== 'undefined') {
                                action.meta = meta;
                            }
                            if (this.dispatch[modelName][reducerName].isEffect) {
                                return [2, this.dispatch(action)];
                            }
                            return [2, this.dispatch(action)];
                        });
                    });
                };
            }
        },
        onStoreCreated: function onStoreCreated(store) {
            this.storeDispatch = store.dispatch;
            this.storeGetState = store.getState;
        },
        onModel: function onModel(model) {
            var modelName = model.name;
            var reducers = model.reducers;
            this.dispatch[modelName] = {};
            if (!reducers) {
                return;
            }
            for (var reducerName in reducers) {
                if (reducers.hasOwnProperty(reducerName)) {
                    this.validate([[!!reducerName.match(/\/.+\//), 'Invalid reducer name (' + modelName + '/' + reducerName + ')'], [!isFn(reducers[reducerName]), 'Invalid reducer (' + modelName + '/' + reducerName + '). Must be a function']]);
                    this.dispatch[modelName][reducerName] = this.createDispatcher.apply(this, [modelName, reducerName]);
                }
            }
        }
    };
    var effectsPlugin = {
        exposed: {
            effects: {}
        },
        onModel: function onModel(model) {
            if (!model.effects) {
                return;
            }
            var effects = isFn(model.effects) ? model.effects(this.dispatch) : model.effects;
            var modelName = model.name;
            for (var effectName in effects) {
                if (effects.hasOwnProperty(effectName)) {
                    this.validate([[!!effectName.match(/\//), 'Invalid effect name (' + modelName + '/' + effectName + ')'], [!isFn(effects[effectName]), 'Invalid effect (' + modelName + '/' + effectName + '). Must be a function']]);
                    this.effects[modelName + '/' + effectName] = effects[effectName].bind(this.dispatch[modelName]);
                    var effect = this.dispatch[modelName][effectName] = this.createDispatcher.apply(this, [modelName, effectName]);
                    effect.isEffect = true;
                }
            }
        },
        middleware: function middleware(store) {
            var _this = this;
            return function (next) {
                return function (action) {
                    return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(action.type in this.effects)) {
                                        return [3, 2];
                                    }
                                    return [4, next(action)];
                                case 1:
                                    _a.sent();
                                    return [2, this.effects[action.type](action.payload, store.getState(), action.meta)];
                                case 2:
                                    return [2, next(action)];
                            }
                        });
                    });
                };
            };
        }
    };

    var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
    var composeEnhancersWithDevtools = function composeEnhancersWithDevtools(devtoolOptions) {
        if (devtoolOptions === void 666) {
            devtoolOptions = {};
        }
        return (typeof window === 'undefined' ? 'undefined' : _typeof$1(window)) === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(devtoolOptions) : Redux.compose;
    };
    function createRedux(ref) {
        var _this = this;
        var redux = ref.redux,
            models = ref.models;
        var combineReducers = redux.combineReducers || Redux.combineReducers;
        var createStore = redux.createStore || Redux.createStore;
        var initialState = typeof redux.initialState !== 'undefined' ? redux.initialState : {};
        this.reducers = redux.reducers;
        this.mergeReducers = function (nextReducers) {
            if (nextReducers === void 0) {
                nextReducers = {};
            }
            _this.reducers = Object.assign({}, _this.reducers, nextReducers);
            if (isEmptyObject(_this.reducers)) {
                return function (state) {
                    return state;
                };
            }
            return combineReducers(_this.reducers);
        };
        this.createModelReducer = function (model) {
            var modelReducers = {};
            var reducers = model.reducers;
            for (var modelReducer in reducers) {
                if (reducers.hasOwnProperty(modelReducer)) {
                    var action = isListener(modelReducer) ? modelReducer : model.name + '/' + modelReducer;
                    modelReducers[action] = model.reducers[modelReducer];
                }
            }
            _this.reducers[model.name] = function (state, action) {
                if (state === void 0) {
                    state = model.state;
                }
                if (isFn(modelReducers[action.type])) {
                    return modelReducers[action.type](state, action.payload, action.meta);
                }
                return state;
            };
        };
        models.forEach(function (model) {
            _this.createModelReducer(model);
        });
        this.createRootReducer = function (rootReducers) {
            if (rootReducers === void 0) {
                rootReducers = {};
            }
            var mergedReducers = _this.mergeReducers();
            if (isEmptyObject(rootReducers)) {
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
        var rootReducer = this.createRootReducer(redux.rootReducers);
        var middlewares = Redux.applyMiddleware.apply(Redux, redux.middlewares);
        var enhancers = composeEnhancersWithDevtools(redux.devtoolOptions).apply(void 0, redux.enhancers.concat([middlewares]));
        this.store = createStore(rootReducer, initialState, enhancers);
        return this;
    }
    function isEmptyObject(obj) {
        for (var k in obj) {
            return false;
        }
        return true;
    }

    var corePlugins = [dispatchPlugin, effectsPlugin];
    function Rematch(config) {
        var _this = this;
        this.plugins = [];
        this.pluginFactory = pluginFactory();
        this.config = config;
        for (var _i = 0, _a = corePlugins.concat(this.config.plugins); _i < _a.length; _i++) {
            var plugin = _a[_i];
            this.plugins.push(this.pluginFactory.create(plugin));
        }
        this.forEachPlugin('middleware', function (middleware) {
            _this.config.redux.middlewares.push(middleware);
        });
    }
    Rematch.prototype = {
        constructor: Rematch,
        forEachPlugin: function forEachPlugin(method, fn) {
            this.plugins.forEach(function (plugin) {
                if (plugin[method]) {
                    fn(plugin[method]);
                }
            });
        },
        getModels: function getModels(models) {
            return Object.keys(models).map(function (name) {
                return Object.assign({
                    name: name
                }, models[name]);
            });
        },
        addModel: function addModel(model) {
            validate([[!model, 'model config is required'], [model.name !== model.name + "", 'model "name" [string] is required'], [model.state === void 666, 'model "state" is required']]);
            this.forEachPlugin('onModel', function (onModel) {
                return onModel(model);
            });
        },
        init: function init() {
            var _this = this;
            this.models = this.getModels(this.config.models);
            this.models.forEach(function (model) {
                _this.addModel(model);
            });
            var redux = createRedux.call(this, {
                redux: this.config.redux,
                models: this.models
            });
            var rematchStore = Object.assign({}, redux.store, {
                model: function model(_model) {
                    _this.addModel(_model);
                    redux.mergeReducers(redux.createModelReducer(_model));
                    redux.store.replaceReducer(redux.createRootReducer(_this.config.redux.rootReducers));
                }
            });
            this.forEachPlugin('onStoreCreated', function (onStoreCreated) {
                return onStoreCreated(rematchStore);
            });
            rematchStore.dispatch = this.pluginFactory.dispatch;
            return rematchStore;
        }
    };

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
    function init() {
        var initConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        if (initConfig === void 0) {
            initConfig = {};
        }
        var name = initConfig.name || Object.keys(stores).length.toString();
        var config = mergeConfig(Object.assign({}, initConfig, { name: name }));
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
                    var curAction = dispatches[modelName][actionName] || (dispatches[modelName][actionName] = {});
                    curAction[name] = action;
                    dispatch[modelName][actionName] = function (payload, meta) {
                        for (var storeName in curAction) {
                            stores[storeName].dispatch[modelName][actionName](payload, meta);
                        }
                    };
                }
            };
            for (var actionName in store.dispatch[modelName]) {
                _loop2(actionName);
            }
        };
        for (var modelName in store.dispatch) {
            _loop(modelName);
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
    exports.init = init;
    exports.default = index;

})));
