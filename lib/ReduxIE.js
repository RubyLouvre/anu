(function(global, factory) {
    typeof exports === "object" && typeof module !== "undefined"
        ? factory(exports)
        : typeof define === "function" && define.amd ? define(["exports"], factory) : factory((global.Redux = global.Redux || {}));
})(this, function(exports) {
    "use strict";

    /** Detect free variable `global` from Node.js. */
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root = freeGlobal || freeSelf || Function("return this")();

    /** Built-in value references. */
    var Symbol = root.Symbol;

    /** Used for built-in method references. */
    var objectProto$1 = Object.prototype;

    /** Used to check objects for own properties. */
    var hasOwn = objectProto$1.hasOwnProperty;

    function isPlainObject(obj) {
        var key;

        // Must be an Object.
        // Because of IE, we also have to check the presence of the constructor property.
        // Make sure that DOM nodes and window objects don't pass through, as well
        if (!obj || typeof obj !== "object" || obj.nodeType) {
            return false;
        }

        try {
            // Not own constructor property must be Object
            if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        } catch (e) {
            // IE8,9 Will throw exceptions on certain host objects #9897
            return false;
        }

        // Own properties are enumerated firstly, so to speed up,
        // if last one is own, then all properties are own.
        for (key in obj) {
        }

        return key === undefined || hasOwn.call(obj, key);
    }

    function symbolObservablePonyfill(root) {
        var result;
        var Symbol = root.Symbol;

        if (typeof Symbol === "function") {
            if (Symbol.observable) {
                result = Symbol.observable;
            } else {
                result = Symbol("observable");
                Symbol.observable = result;
            }
        } else {
            result = "@@observable";
        }

        return result;
    }

    /* global window */
    var root$2;

    if (typeof self !== "undefined") {
        root$2 = self;
    } else if (typeof window !== "undefined") {
        root$2 = window;
    } else if (typeof global !== "undefined") {
        root$2 = global;
    } else if (typeof module !== "undefined") {
        root$2 = module;
    } else {
        root$2 = Function("return this")();
    }

    var result = symbolObservablePonyfill(root$2);

    /**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
    var ActionTypes = {
        INIT: "@@redux/INIT"
    };

    function createStore(reducer, preloadedState, enhancer) {
        var _ref2;

        if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
            enhancer = preloadedState;
            preloadedState = undefined;
        }

        if (typeof enhancer !== "undefined") {
            if (typeof enhancer !== "function") {
                throw new Error("Expected the enhancer to be a function.");
            }

            return enhancer(createStore)(reducer, preloadedState);
        }

        if (typeof reducer !== "function") {
            throw new Error("Expected the reducer to be a function.");
        }

        var currentReducer = reducer;
        var currentState = preloadedState;
        var currentListeners = [];
        var nextListeners = currentListeners;
        var isDispatching = false;

        function ensureCanMutateNextListeners() {
            if (nextListeners === currentListeners) {
                nextListeners = currentListeners.slice();
            }
        }

        function getState() {
            return currentState;
        }

        function subscribe(listener) {
            if (typeof listener !== "function") {
                throw new Error("Expected listener to be a function.");
            }

            var isSubscribed = true;

            ensureCanMutateNextListeners();
            nextListeners.push(listener);

            return function unsubscribe() {
                if (!isSubscribed) {
                    return;
                }

                isSubscribed = false;

                ensureCanMutateNextListeners();
                var index = nextListeners.indexOf(listener);
                nextListeners.splice(index, 1);
            };
        }

        function dispatch(action) {
            if (!isPlainObject(action)) {
                throw new Error("Actions must be plain objects. " + "Use custom middleware for async actions.");
            }

            if (typeof action.type === "undefined") {
                throw new Error("Actions may not have an undefined \"type\" property. " + "Have you misspelled a constant?");
            }

            if (isDispatching) {
                throw new Error("Reducers may not dispatch actions.");
            }

            try {
                isDispatching = true;
                currentState = currentReducer(currentState, action);
            } finally {
                isDispatching = false;
            }

            var listeners = (currentListeners = nextListeners);
            for (var i = 0; i < listeners.length; i++) {
                var listener = listeners[i];
                listener();
            }

            return action;
        }

        function replaceReducer(nextReducer) {
            if (typeof nextReducer !== "function") {
                throw new Error("Expected the nextReducer to be a function.");
            }

            currentReducer = nextReducer;
            dispatch({ type: ActionTypes.INIT });
        }

        function observable() {
            var _ref;

            var outerSubscribe = subscribe;
            return (
                (_ref = {
                    subscribe: function subscribe(observer) {
                        if (typeof observer !== "object") {
                            throw new TypeError("Expected the observer to be an object.");
                        }

                        function observeState() {
                            if (observer.next) {
                                observer.next(getState());
                            }
                        }

                        observeState();
                        var unsubscribe = outerSubscribe(observeState);
                        return { unsubscribe: unsubscribe };
                    }
                }),
                (_ref[result] = function() {
                    return this;
                }),
                _ref
            );
        }

        dispatch({ type: ActionTypes.INIT });

        return (
            (_ref2 = {
                dispatch: dispatch,
                subscribe: subscribe,
                getState: getState,
                replaceReducer: replaceReducer
            }),
            (_ref2[result] = observable),
            _ref2
        );
    }

    function warning(message) {
        /* eslint-disable no-console */
        if (typeof console !== "undefined" && typeof console.error === "function") {
            console.error(message);
        }
        /* eslint-enable no-console */
        try {
            // This error was thrown as a convenience so that if you enable
            // "break on all exceptions" in your console,
            // it would pause the execution at this line.
            throw new Error(message);
            /* eslint-disable no-empty */
        } catch (e) {}
        /* eslint-enable no-empty */
    }

    function getUndefinedStateErrorMessage(key, action) {
        var actionType = action && action.type;
        var actionName = (actionType && "\"" + actionType.toString() + "\"") || "an action";

        return (
            "Given action " +
            actionName +
            ", reducer \"" +
            key +
            "\" returned undefined. " +
            "To ignore an action, you must explicitly return the previous state. " +
            "If you want this reducer to hold no value, you can return null instead of undefined."
        );
    }

    function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
        var reducerKeys = Object.keys(reducers);
        var argumentName = action && action.type === ActionTypes.INIT ? "preloadedState argument passed to createStore" : "previous state received by the reducer";

        if (reducerKeys.length === 0) {
            return "Store does not have a valid reducer. Make sure the argument passed " + "to combineReducers is an object whose values are reducers.";
        }

        if (!isPlainObject(inputState)) {
            return (
                "The " +
                argumentName +
                " has unexpected type of \"" +
                {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] +
                "\". Expected argument to be an object with the following " +
                ("keys: \"" + reducerKeys.join("\", \"") + "\"")
            );
        }

        var unexpectedKeys = Object.keys(inputState).filter(function(key) {
            return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
        });

        unexpectedKeys.forEach(function(key) {
            unexpectedKeyCache[key] = true;
        });

        if (unexpectedKeys.length > 0) {
            return (
                "Unexpected " +
                (unexpectedKeys.length > 1 ? "keys" : "key") +
                " " +
                ("\"" + unexpectedKeys.join("\", \"") + "\" found in " + argumentName + ". ") +
                "Expected to find one of the known reducer keys instead: " +
                ("\"" + reducerKeys.join("\", \"") + "\". Unexpected keys will be ignored.")
            );
        }
    }

    function assertReducerShape(reducers) {
        Object.keys(reducers).forEach(function(key) {
            var reducer = reducers[key];
            var initialState = reducer(undefined, { type: ActionTypes.INIT });

            if (typeof initialState === "undefined") {
                throw new Error(
                    "Reducer \"" +
                        key +
                        "\" returned undefined during initialization. " +
                        "If the state passed to the reducer is undefined, you must " +
                        "explicitly return the initial state. The initial state may " +
                        "not be undefined. If you don't want to set a value for this reducer, " +
                        "you can use null instead of undefined."
                );
            }

            var type =
                "@@redux/PROBE_UNKNOWN_ACTION_" +
                Math.random()
                    .toString(36)
                    .substring(7)
                    .split("")
                    .join(".");
            if (typeof reducer(undefined, { type: type }) === "undefined") {
                throw new Error(
                    "Reducer \"" +
                        key +
                        "\" returned undefined when probed with a random type. " +
                        ("Don't try to handle " + ActionTypes.INIT + " or other actions in \"redux/*\" ") +
                        "namespace. They are considered private. Instead, you must return the " +
                        "current state for any unknown actions, unless it is undefined, " +
                        "in which case you must return the initial state, regardless of the " +
                        "action type. The initial state may not be undefined, but can be null."
                );
            }
        });
    }

    function combineReducers(reducers) {
        var reducerKeys = Object.keys(reducers);
        var finalReducers = {};
        for (var i = 0; i < reducerKeys.length; i++) {
            var key = reducerKeys[i];

            {
                if (typeof reducers[key] === "undefined") {
                    warning("No reducer provided for key \"" + key + "\"");
                }
            }

            if (typeof reducers[key] === "function") {
                finalReducers[key] = reducers[key];
            }
        }
        var finalReducerKeys = Object.keys(finalReducers);

        var unexpectedKeyCache = void 0;
        {
            unexpectedKeyCache = {};
        }

        var shapeAssertionError = void 0;
        try {
            assertReducerShape(finalReducers);
        } catch (e) {
            shapeAssertionError = e;
        }

        return function combination() {
            var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var action = arguments[1];

            if (shapeAssertionError) {
                throw shapeAssertionError;
            }

            {
                var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
                if (warningMessage) {
                    warning(warningMessage);
                }
            }

            var hasChanged = false;
            var nextState = {};
            for (var _i = 0; _i < finalReducerKeys.length; _i++) {
                var _key = finalReducerKeys[_i];
                var reducer = finalReducers[_key];
                var previousStateForKey = state[_key];
                var nextStateForKey = reducer(previousStateForKey, action);
                if (typeof nextStateForKey === "undefined") {
                    var errorMessage = getUndefinedStateErrorMessage(_key, action);
                    throw new Error(errorMessage);
                }
                nextState[_key] = nextStateForKey;
                hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
            }
            return hasChanged ? nextState : state;
        };
    }

    function bindActionCreator(actionCreator, dispatch) {
        return function() {
            return dispatch(actionCreator.apply(undefined, arguments));
        };
    }

    function bindActionCreators(actionCreators, dispatch) {
        if (typeof actionCreators === "function") {
            return bindActionCreator(actionCreators, dispatch);
        }

        if (typeof actionCreators !== "object" || actionCreators === null) {
            throw new Error(
                "bindActionCreators expected an object or a function, instead received " +
                    (actionCreators === null ? "null" : typeof actionCreators) +
                    ". " +
                    "Did you write \"import ActionCreators from\" instead of \"import * as ActionCreators from\"?"
            );
        }

        var keys = Object.keys(actionCreators);
        var boundActionCreators = {};
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var actionCreator = actionCreators[key];
            if (typeof actionCreator === "function") {
                boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
            }
        }
        return boundActionCreators;
    }

    function compose() {
        for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
            funcs[_key] = arguments[_key];
        }

        if (funcs.length === 0) {
            return function(arg) {
                return arg;
            };
        }

        if (funcs.length === 1) {
            return funcs[0];
        }

        return funcs.reduce(function(a, b) {
            return function() {
                return a(b.apply(undefined, arguments));
            };
        });
    }

    var _extends =
        Object.assign ||
        function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };

    function applyMiddleware() {
        for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
            middlewares[_key] = arguments[_key];
        }

        return function(createStore) {
            return function(reducer, preloadedState, enhancer) {
                var store = createStore(reducer, preloadedState, enhancer);
                var _dispatch = store.dispatch;
                var chain = [];

                var middlewareAPI = {
                    getState: store.getState,
                    dispatch: function dispatch(action) {
                        return _dispatch(action);
                    }
                };
                chain = middlewares.map(function(middleware) {
                    return middleware(middlewareAPI);
                });
                _dispatch = compose.apply(undefined, chain)(store.dispatch);

                return _extends({}, store, {
                    dispatch: _dispatch
                });
            };
        };
    }

    exports.createStore = createStore;
    exports.combineReducers = combineReducers;
    exports.bindActionCreators = bindActionCreators;
    exports.applyMiddleware = applyMiddleware;
    exports.compose = compose;

    //  Object.defineProperty(exports, "__esModule", { value: true });
});
