(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
        (global.qreact = factory());
}(this, function() {

    /* eslint-disable no-unused-vars */
    var getOwnPropertySymbols = Object.getOwnPropertySymbols;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var propIsEnumerable = Object.prototype.propertyIsEnumerable;

    function toObject(val) {
        if (val === null || val === undefined) {
            throw new TypeError('Object.assign cannot be called with null or undefined');
        }

        return Object(val);
    }

    function shouldUseNative() {
        try {
            if (!Object.assign) {
                return false;
            }

            // Detect buggy property enumeration order in older V8 versions.

            // https://bugs.chromium.org/p/v8/issues/detail?id=4118
            var test1 = new String('abc'); // eslint-disable-line no-new-wrappers
            test1[5] = 'de';
            if (Object.getOwnPropertyNames(test1)[0] === '5') {
                return false;
            }

            // https://bugs.chromium.org/p/v8/issues/detail?id=3056
            var test2 = {};
            for (var i = 0; i < 10; i++) {
                test2['_' + String.fromCharCode(i)] = i;
            }
            var order2 = Object.getOwnPropertyNames(test2).map(function(n) {
                return test2[n];
            });
            if (order2.join('') !== '0123456789') {
                return false;
            }

            // https://bugs.chromium.org/p/v8/issues/detail?id=3056
            var test3 = {};
            'abcdefghijklmnopqrst'.split('').forEach(function(letter) {
                test3[letter] = letter;
            });
            if (Object.keys(Object.assign({}, test3)).join('') !==
                'abcdefghijklmnopqrst') {
                return false;
            }

            return true;
        } catch (err) {
            // We don't expect any of the above to throw, but better to be safe.
            return false;
        }
    }

    var index = shouldUseNative() ? Object.assign : function(target, source) {
        var from;
        var to = toObject(target);
        var symbols;

        for (var s = 1; s < arguments.length; s++) {
            from = Object(arguments[s]);

            for (var key in from) {
                if (hasOwnProperty.call(from, key)) {
                    to[key] = from[key];
                }
            }

            if (getOwnPropertySymbols) {
                symbols = getOwnPropertySymbols(from);
                for (var i = 0; i < symbols.length; i++) {
                    if (propIsEnumerable.call(from, symbols[i])) {
                        to[symbols[i]] = from[symbols[i]];
                    }
                }
            }
        }

        return to;
    };

    var PropTypes = {};

    function noop() {
        return PropTypes;
    }
    'array bool func number object string any arrayOf element instanceOf node objectOf oneOf oneOfType shape'.split(' ').forEach(function(f) {
        PropTypes[f] = noop;
    });

    /** Virtual DOM Node */
    function VNode$1(nodeName, attributes, children) {
        /** @type {string|function} */
        this.nodeName = nodeName;

        /** @type {object<string>|undefined} */
        this.attributes = attributes;

        /** @type {array<VNode>|undefined} */
        this.children = children;

        /** Reference to the given key. */
        this.key = attributes && attributes.key;
    }

    // render modes

    var NO_RENDER = 0;
    var SYNC_RENDER = 1;
    var FORCE_RENDER = 2;
    var ASYNC_RENDER = 3;

    var EMPTY = {};

    var ATTR_KEY = typeof Symbol !== 'undefined' ? Symbol.for('preactattr') : '__preactattr_';

    // m-start
    var not_dimension_props_without_profixes = {
        animationIterationCount: 1,
        borderImageOutset: 1,
        borderImageSlice: 1,
        borderImageWidth: 1,
        boxFlex: 1,
        boxFlexGroup: 1,
        boxOrdinalGroup: 1,
        columnCount: 1,
        fillOpacity: 1,
        flex: 1,
        flexGrow: 1,
        flexPositive: 1,
        flexShrink: 1,
        flexNegative: 1,
        flexOrder: 1,
        gridRow: 1,
        gridColumn: 1,
        fontWeight: 1,
        lineClamp: 1,
        lineHeight: 1,
        opacity: 1,
        order: 1,
        orphans: 1,
        strokeOpacity: 1,
        tabSize: 1,
        widows: 1,
        zIndex: 1,
        zoom: 1
            // fillOpacity: 1,
            // floodOpacity: 1,
            // stopOpacity: 1,
            // strokeDasharray: 1,
            // strokeDashoffset: 1,
            // strokeMiterlimit: 1,
            // strokeOpacity: 1,
            // strokeWidth: 1
    };

    function prefixKey(prefix, key) {
        return prefix + key.charAt(0).toUpperCase() + key.substring(1);
    }

    var prefixes = ['Webkit', 'ms', 'Moz', 'O'];

    Object.keys(not_dimension_props_without_profixes).forEach(function(prop) {
        prefixes.forEach(function(prefix) {
            not_dimension_props_without_profixes[prefixKey(prefix, prop)] = 1;
        });
    });

    var NON_DIMENSION_PROPS = not_dimension_props_without_profixes;
    // m-end


    // DOM event types that do not bubble and should be attached via useCapture
    var NON_BUBBLING_EVENTS = { blur: 1, error: 1, focus: 1, load: 1, resize: 1, scroll: 1 };

    /**
     * Use invariant() to assert state which your program assumes to be true.
     *
     * Provide sprintf-style format (only %s is supported) and arguments
     * to provide information about what broke and what you were
     * expecting.
     *
     * The invariant message will be stripped in production, but the invariant
     * will remain to ensure logic does not differ in production.
     */

    var validateFormat = function validateFormat(format) {};

    function invariant$1(condition, format, a, b, c, d, e, f) {
        validateFormat(format);

        if (!condition) {
            var error;
            if (format === undefined) {
                error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
            } else {
                var args = [a, b, c, d, e, f];
                var argIndex = 0;
                error = new Error(format.replace(/%s/g, function() {
                    return args[argIndex++];
                }));
                error.name = 'Invariant Violation';
            }

            error.framesToPop = 1; // we don't care about invariant's own frame
            throw error;
        }
    }

    var __moduleExports = invariant$1;

    var invariant = __moduleExports;

    /**
     * Constructs an enumeration with keys equal to their value.
     *
     * For example:
     *
     *   var COLORS = keyMirror({blue: null, red: null});
     *   var myColor = COLORS.blue;
     *   var isColorValid = !!COLORS[myColor];
     *
     * The last line could not be performed if the values of the generated enum were
     * not equal to their keys.
     *
     *   Input:  {key1: val1, key2: val2}
     *   Output: {key1: key1, key2: key2}
     *
     * @param {object} obj
     * @return {object}
     */
    var keyMirror = function keyMirror(obj) {
        var ret = {};
        var key;
        !(obj instanceof Object && !Array.isArray(obj)) ? invariant(false): void 0;
        for (key in obj) {
            if (!obj.hasOwnProperty(key)) {
                continue;
            }
            ret[key] = key;
        }
        return ret;
    };

    var keyMirror_1 = keyMirror;

    var PropagationPhases = { bubbled: 'bubbled', captured: 'captured' };

    /**
     * Types of raw signals from the browser caught at the top level.
     */
    var topLevelTypes = keyMirror_1({
        topAbort: null,
        topAnimationEnd: null,
        topAnimationIteration: null,
        topAnimationStart: null,
        topBlur: null,
        topCanPlay: null,
        topCanPlayThrough: null,
        topChange: null,
        topClick: null,
        topCompositionEnd: null,
        topCompositionStart: null,
        topCompositionUpdate: null,
        topContextMenu: null,
        topCopy: null,
        topCut: null,
        topDoubleClick: null,
        topDrag: null,
        topDragEnd: null,
        topDragEnter: null,
        topDragExit: null,
        topDragLeave: null,
        topDragOver: null,
        topDragStart: null,
        topDrop: null,
        topDurationChange: null,
        topEmptied: null,
        topEncrypted: null,
        topEnded: null,
        topError: null,
        topFocus: null,
        topInput: null,
        topInvalid: null,
        topKeyDown: null,
        topKeyPress: null,
        topKeyUp: null,
        topLoad: null,
        topLoadedData: null,
        topLoadedMetadata: null,
        topLoadStart: null,
        topMouseDown: null,
        topMouseMove: null,
        topMouseOut: null,
        topMouseOver: null,
        topMouseUp: null,
        topPaste: null,
        topPause: null,
        topPlay: null,
        topPlaying: null,
        topProgress: null,
        topRateChange: null,
        topReset: null,
        topScroll: null,
        topSeeked: null,
        topSeeking: null,
        topSelectionChange: null,
        topStalled: null,
        topSubmit: null,
        topSuspend: null,
        topTextInput: null,
        topTimeUpdate: null,
        topTouchCancel: null,
        topTouchEnd: null,
        topTouchMove: null,
        topTouchStart: null,
        topTransitionEnd: null,
        topVolumeChange: null,
        topWaiting: null,
        topWheel: null
    });

    var EventConstants = {
        topLevelTypes: topLevelTypes,
        PropagationPhases: PropagationPhases,
        touchSupport: 'ontouchstart' in window
    };

    function prodInvariant() {}

    /**
     * Injectable ordering of event plugins.
     */
    var EventPluginOrder = null;

    /**
     * Injectable mapping from names to event plugin modules.
     */
    var namesToPlugins = {};

    /**
     * Recomputes the plugin list using the injected plugins and plugin ordering.
     *
     * @private
     */
    function recomputePluginOrdering() {
        if (!EventPluginOrder) {
            // Wait until an `EventPluginOrder` is injected.
            return;
        }
        for (var pluginName in namesToPlugins) {
            var PluginModule = namesToPlugins[pluginName];
            var pluginIndex = EventPluginOrder.indexOf(pluginName);
            !(pluginIndex > -1) ? prodInvariant('96', pluginName): void 0;
            if (EventPluginRegistry.plugins[pluginIndex]) {
                continue;
            }!PluginModule.extractEvents ? prodInvariant('97', pluginName) : void 0;
            EventPluginRegistry.plugins[pluginIndex] = PluginModule;
            var publishedEvents = PluginModule.eventTypes;
            for (var eventName in publishedEvents) {
                !publishEventForPlugin(publishedEvents[eventName], PluginModule, eventName) ? prodInvariant('98', eventName, pluginName) : void 0;
            }
        }
    }

    /**
     * Publishes an event so that it can be dispatched by the supplied plugin.
     *
     * @param {object} dispatchConfig Dispatch configuration for the event.
     * @param {object} PluginModule Plugin publishing the event.
     * @return {boolean} True if the event was successfully published.
     * @private
     */
    function publishEventForPlugin(dispatchConfig, PluginModule, eventName) {
        !!EventPluginRegistry.eventNameDispatchConfigs.hasOwnProperty(eventName) ? prodInvariant('99', eventName) : void 0;
        EventPluginRegistry.eventNameDispatchConfigs[eventName] = dispatchConfig;

        var phasedRegistrationNames = dispatchConfig.phasedRegistrationNames;
        if (phasedRegistrationNames) {
            for (var phaseName in phasedRegistrationNames) {
                if (phasedRegistrationNames.hasOwnProperty(phaseName)) {
                    var phasedRegistrationName = phasedRegistrationNames[phaseName];
                    publishRegistrationName(phasedRegistrationName, PluginModule, eventName);
                }
            }
            return true;
        } else if (dispatchConfig.registrationName) {
            publishRegistrationName(dispatchConfig.registrationName, PluginModule, eventName);
            return true;
        }
        return false;
    }

    /**
     * Publishes a registration name that is used to identify dispatched events and
     * can be used with `EventPluginHub.putListener` to register listeners.
     *
     * @param {string} registrationName Registration name to add.
     * @param {object} PluginModule Plugin publishing the event.
     * @private
     */
    function publishRegistrationName(registrationName, PluginModule, eventName) {
        !!EventPluginRegistry.registrationNameModules[registrationName] ? prodInvariant('100', registrationName) : void 0;
        EventPluginRegistry.registrationNameModules[registrationName] = PluginModule;
        EventPluginRegistry.registrationNameDependencies[registrationName] = PluginModule.eventTypes[eventName].dependencies;

        if ("production" !== 'production') {}
    }

    /**
     * Registers plugins so that they can extract and dispatch events.
     *
     * @see {EventPluginHub}
     */
    var EventPluginRegistry = {

        /**
         * Ordered list of injected plugins.
         */
        plugins: [],

        /**
         * Mapping from event name to dispatch config
         */
        eventNameDispatchConfigs: {},

        /**
         * Mapping from registration name to plugin module
         */
        registrationNameModules: {},

        /**
         * Mapping from registration name to event name
         */
        registrationNameDependencies: {},

        /**
         * Mapping from lowercase registration names to the properly cased version,
         * used to warn in the case of missing event handlers. Available
         * only in __DEV__.
         * @type {Object}
         */
        possibleRegistrationNames: null,

        /**
         * Injects an ordering of plugins (by plugin name). This allows the ordering
         * to be decoupled from injection of the actual plugins so that ordering is
         * always deterministic regardless of packaging, on-the-fly injection, etc.
         *
         * @param {array} InjectedEventPluginOrder
         * @internal
         * @see {EventPluginHub.injection.injectEventPluginOrder}
         */
        injectEventPluginOrder: function injectEventPluginOrder(InjectedEventPluginOrder) {
            !!EventPluginOrder ? prodInvariant('101') : void 0;
            // Clone the ordering so it cannot be dynamically mutated.
            EventPluginOrder = Array.prototype.slice.call(InjectedEventPluginOrder);
            recomputePluginOrdering();
        },

        /**
         * Injects plugins to be used by `EventPluginHub`. The plugin names must be
         * in the ordering injected by `injectEventPluginOrder`.
         *
         * Plugins can be injected as part of page initialization or on-the-fly.
         *
         * @param {object} injectedNamesToPlugins Map from names to plugin modules.
         * @internal
         * @see {EventPluginHub.injection.injectEventPluginsByName}
         */
        injectEventPluginsByName: function injectEventPluginsByName(injectedNamesToPlugins) {
            var isOrderingDirty = false;
            for (var pluginName in injectedNamesToPlugins) {
                if (!injectedNamesToPlugins.hasOwnProperty(pluginName)) {
                    continue;
                }
                var PluginModule = injectedNamesToPlugins[pluginName];
                if (!namesToPlugins.hasOwnProperty(pluginName) || namesToPlugins[pluginName] !== PluginModule) {
                    !!namesToPlugins[pluginName] ? prodInvariant('102', pluginName) : void 0;
                    namesToPlugins[pluginName] = PluginModule;
                    isOrderingDirty = true;
                }
            }
            if (isOrderingDirty) {
                recomputePluginOrdering();
            }
        },

        /**
         * Looks up the plugin for the supplied event.
         *
         * @param {object} event A synthetic event.
         * @return {?object} The plugin that created the supplied event.
         * @internal
         */
        getPluginModuleForEvent: function getPluginModuleForEvent(event) {
            var dispatchConfig = event.dispatchConfig;
            if (dispatchConfig.registrationName) {
                return EventPluginRegistry.registrationNameModules[dispatchConfig.registrationName] || null;
            }
            for (var phase in dispatchConfig.phasedRegistrationNames) {
                if (!dispatchConfig.phasedRegistrationNames.hasOwnProperty(phase)) {
                    continue;
                }
                var PluginModule = EventPluginRegistry.registrationNameModules[dispatchConfig.phasedRegistrationNames[phase]];
                if (PluginModule) {
                    return PluginModule;
                }
            }
            return null;
        },

        /**
         * Exposed for unit testing.
         * @private
         */
        _resetEventPlugins: function _resetEventPlugins() {
            EventPluginOrder = null;
            for (var pluginName in namesToPlugins) {
                if (namesToPlugins.hasOwnProperty(pluginName)) {
                    delete namesToPlugins[pluginName];
                }
            }
            EventPluginRegistry.plugins.length = 0;

            var eventNameDispatchConfigs = EventPluginRegistry.eventNameDispatchConfigs;
            for (var eventName in eventNameDispatchConfigs) {
                if (eventNameDispatchConfigs.hasOwnProperty(eventName)) {
                    delete eventNameDispatchConfigs[eventName];
                }
            }

            var registrationNameModules = EventPluginRegistry.registrationNameModules;
            for (var registrationName in registrationNameModules) {
                if (registrationNameModules.hasOwnProperty(registrationName)) {
                    delete registrationNameModules[registrationName];
                }
            }

            if ("production" !== 'production') {}
        }

    };

    var caughtError = null;

    /**
     * Call a function while guarding against errors that happens within it.
     *
     * @param {?String} name of the guard to use for logging or debugging
     * @param {Function} func The function to invoke
     * @param {*} a First argument
     * @param {*} b Second argument
     */
    function invokeGuardedCallback(name, func, a, b) {
        try {
            return func(a, b);
        } catch (x) {
            if (caughtError === null) {
                caughtError = x;
            }
            return undefined;
        }
    }

    var ReactErrorUtils = {
        invokeGuardedCallback: invokeGuardedCallback,

        /**
         * Invoked by ReactTestUtils.Simulate so that any errors thrown by the event
         * handler are sure to be rethrown by rethrowCaughtError.
         */
        invokeGuardedCallbackWithCatch: invokeGuardedCallback,

        /**
         * During execution of guarded functions we will capture the first error which
         * we will rethrow to be handled by the top level error handler.
         */
        rethrowCaughtError: function rethrowCaughtError() {
            if (caughtError) {
                var error = caughtError;
                caughtError = null;
                throw error;
            }
        }
    };

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * 
     */

    function makeEmptyFunction(arg) {
        return function() {
            return arg;
        };
    }

    /**
     * This function accepts and discards inputs; it has no side effects. This is
     * primarily useful idiomatically for overridable function endpoints which
     * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
     */
    var emptyFunction$1 = function emptyFunction() {};

    emptyFunction$1.thatReturns = makeEmptyFunction;
    emptyFunction$1.thatReturnsFalse = makeEmptyFunction(false);
    emptyFunction$1.thatReturnsTrue = makeEmptyFunction(true);
    emptyFunction$1.thatReturnsNull = makeEmptyFunction(null);
    emptyFunction$1.thatReturnsThis = function() {
        return this;
    };
    emptyFunction$1.thatReturnsArgument = function(arg) {
        return arg;
    };

    var __moduleExports$1 = emptyFunction$1;

    var emptyFunction = __moduleExports$1;

    /**
     * Similar to invariant but only logs a warning if the condition is not met.
     * This can be used to log issues in development environments in critical
     * paths. Removing the logging code for production environments will keep the
     * same logic and follow the same code paths.
     */

    var warning = emptyFunction;

    var warning_1 = warning;

    /**
     * Injected dependencies:
     */

    /**
     * - `ComponentTree`: [required] Module that can convert between React instances
     *   and actual node references.
     */
    var ComponentTree;
    var TreeTraversal;
    var injection = {
        injectComponentTree: function injectComponentTree(Injected) {
            ComponentTree = Injected;
            if ("production" !== 'production') {}
        },
        injectTreeTraversal: function injectTreeTraversal(Injected) {
            TreeTraversal = Injected;
            if ("production" !== 'production') {}
        }
    };

    var topLevelTypes$1 = EventConstants.topLevelTypes;

    function isEndish(topLevelType) {
        return topLevelType === topLevelTypes$1.topMouseUp || topLevelType === topLevelTypes$1.topTouchEnd || topLevelType === topLevelTypes$1.topTouchCancel;
    }

    function isMoveish(topLevelType) {
        return topLevelType === topLevelTypes$1.topMouseMove || topLevelType === topLevelTypes$1.topTouchMove;
    }

    function isStartish(topLevelType) {
        return topLevelType === topLevelTypes$1.topMouseDown || topLevelType === topLevelTypes$1.topTouchStart;
    }

    /**
     * Dispatch the event to the listener.
     * @param {SyntheticEvent} event SyntheticEvent to handle
     * @param {boolean} simulated If the event is simulated (changes exn behavior)
     * @param {function} listener Application-level callback
     * @param {*} inst Internal component instance
     */
    function executeDispatch(event, simulated, listener, inst) {
        var type = event.type || 'unknown-event';
        event.currentTarget = EventPluginUtils.getNodeFromInstance(inst);
        if (simulated) {
            ReactErrorUtils.invokeGuardedCallbackWithCatch(type, listener, event);
        } else {
            ReactErrorUtils.invokeGuardedCallback(type, listener, event);
        }
        event.currentTarget = null;
    }

    /**
     * Standard/simple iteration through an event's collected dispatches.
     */
    function executeDispatchesInOrder(event, simulated) {
        var dispatchListeners = event._dispatchListeners;
        var dispatchInstances = event._dispatchInstances;
        if ("production" !== 'production') {}
        if (Array.isArray(dispatchListeners)) {
            for (var i = 0; i < dispatchListeners.length; i++) {
                if (event.isPropagationStopped()) {
                    break;
                }
                // Listeners and Instances are two parallel arrays that are always in sync.
                executeDispatch(event, simulated, dispatchListeners[i], dispatchInstances[i]);
            }
        } else if (dispatchListeners) {
            executeDispatch(event, simulated, dispatchListeners, dispatchInstances);
        }
        event._dispatchListeners = null;
        event._dispatchInstances = null;
    }

    /**
     * Standard/simple iteration through an event's collected dispatches, but stops
     * at the first dispatch execution returning true, and returns that id.
     *
     * @return {?string} id of the first dispatch execution who's listener returns
     * true, or null if no listener returned true.
     */
    function executeDispatchesInOrderStopAtTrueImpl(event) {
        var dispatchListeners = event._dispatchListeners;
        var dispatchInstances = event._dispatchInstances;
        if ("production" !== 'production') {}
        if (Array.isArray(dispatchListeners)) {
            for (var i = 0; i < dispatchListeners.length; i++) {
                if (event.isPropagationStopped()) {
                    break;
                }
                // Listeners and Instances are two parallel arrays that are always in sync.
                if (dispatchListeners[i](event, dispatchInstances[i])) {
                    return dispatchInstances[i];
                }
            }
        } else if (dispatchListeners) {
            if (dispatchListeners(event, dispatchInstances)) {
                return dispatchInstances;
            }
        }
        return null;
    }

    /**
     * @see executeDispatchesInOrderStopAtTrueImpl
     */
    function executeDispatchesInOrderStopAtTrue(event) {
        var ret = executeDispatchesInOrderStopAtTrueImpl(event);
        event._dispatchInstances = null;
        event._dispatchListeners = null;
        return ret;
    }

    /**
     * Execution of a "direct" dispatch - there must be at most one dispatch
     * accumulated on the event or it is considered an error. It doesn't really make
     * sense for an event with multiple dispatches (bubbled) to keep track of the
     * return values at each dispatch execution, but it does tend to make sense when
     * dealing with "direct" dispatches.
     *
     * @return {*} The return value of executing the single dispatch.
     */
    function executeDirectDispatch(event) {
        if ("production" !== 'production') {}
        var dispatchListener = event._dispatchListeners;
        var dispatchInstance = event._dispatchInstances;
        !!Array.isArray(dispatchListener) ? prodInvariant('103') : void 0;
        event.currentTarget = dispatchListener ? EventPluginUtils.getNodeFromInstance(dispatchInstance) : null;
        var res = dispatchListener ? dispatchListener(event) : null;
        event.currentTarget = null;
        event._dispatchListeners = null;
        event._dispatchInstances = null;
        return res;
    }

    /**
     * @param {SyntheticEvent} event
     * @return {boolean} True iff number of dispatches accumulated is greater than 0.
     */
    function hasDispatches(event) {
        return !!event._dispatchListeners;
    }

    /**
     * General utilities that are useful in creating custom Event Plugins.
     */
    var EventPluginUtils = {
        isEndish: isEndish,
        isMoveish: isMoveish,
        isStartish: isStartish,

        executeDirectDispatch: executeDirectDispatch,
        executeDispatchesInOrder: executeDispatchesInOrder,
        executeDispatchesInOrderStopAtTrue: executeDispatchesInOrderStopAtTrue,
        hasDispatches: hasDispatches,

        getInstanceFromNode: function getInstanceFromNode(node) {
            return ComponentTree.getInstanceFromNode(node);
        },
        getNodeFromInstance: function getNodeFromInstance(node) {
            return ComponentTree.getNodeFromInstance(node);
        },
        isAncestor: function isAncestor(a, b) {
            return TreeTraversal.isAncestor(a, b);
        },
        getLowestCommonAncestor: function getLowestCommonAncestor(a, b) {
            return TreeTraversal.getLowestCommonAncestor(a, b);
        },
        getParentInstance: function getParentInstance(inst) {
            return TreeTraversal.getParentInstance(inst);
        },
        traverseTwoPhase: function traverseTwoPhase(target, fn, arg) {
            return TreeTraversal.traverseTwoPhase(target, fn, arg);
        },
        traverseEnterLeave: function traverseEnterLeave(from, to, fn, argFrom, argTo) {
            return TreeTraversal.traverseEnterLeave(from, to, fn, argFrom, argTo);
        },

        injection: injection
    };

    /**
     * Accumulates items that must not be null or undefined into the first one. This
     * is used to conserve memory by avoiding array allocations, and thus sacrifices
     * API cleanness. Since `current` can be null before being passed in and not
     * null after this function, make sure to assign it back to `current`:
     *
     * `a = accumulateInto(a, b);`
     *
     * This API should be sparingly used. Try `accumulate` for something cleaner.
     *
     * @return {*|array<*>} An accumulation of items.
     */

    function accumulateInto(current, next) {

        if (current == null) {
            return next;
        }

        // Both are not empty. Warning: Never call x.concat(y) when you are not
        // certain that x is an Array (x could be a string with concat method).
        if (Array.isArray(current)) {
            if (Array.isArray(next)) {
                current.push.apply(current, next);
                return current;
            }
            current.push(next);
            return current;
        }

        if (Array.isArray(next)) {
            // A bit too dangerous to mutate `next`.
            return [current].concat(next);
        }

        return [current, next];
    }

    /**
     * @param {array} arr an "accumulation" of items which is either an Array or
     * a single item. Useful when paired with the `accumulate` module. This is a
     * simple utility that allows us to reason about a collection of items, but
     * handling the case when there is exactly one item (and we do not need to
     * allocate an array).
     */

    function forEachAccumulated(arr, cb, scope) {
        if (Array.isArray(arr)) {
            arr.forEach(cb, scope);
        } else if (arr) {
            cb.call(scope, arr);
        }
    }

    /**
     * Internal store for event listeners
     */
    var listenerBank = {};

    /**
     * Internal queue of events that have accumulated their dispatches and are
     * waiting to have their dispatches executed.
     */
    var eventQueue = null;

    /**
     * Dispatches an event and releases it back into the pool, unless persistent.
     *
     * @param {?object} event Synthetic event to be dispatched.
     * @param {boolean} simulated If the event is simulated (changes exn behavior)
     * @private
     */
    var executeDispatchesAndRelease = function executeDispatchesAndRelease(event, simulated) {
        if (event) {
            EventPluginUtils.executeDispatchesInOrder(event, simulated);

            if (!event.isPersistent()) {
                event.constructor.release(event);
            }
        }
    };
    var executeDispatchesAndReleaseSimulated = function executeDispatchesAndReleaseSimulated(e) {
        return executeDispatchesAndRelease(e, true);
    };
    var executeDispatchesAndReleaseTopLevel = function executeDispatchesAndReleaseTopLevel(e) {
        return executeDispatchesAndRelease(e, false);
    };

    var getDictionaryKey = function getDictionaryKey(inst) {
        // Prevents V8 performance issue:
        // https://github.com/facebook/react/pull/7232
        return '.' + inst._rootNodeID;
    };

    /**
     * This is a unified interface for event plugins to be installed and configured.
     *
     * Event plugins can implement the following properties:
     *
     *   `extractEvents` {function(string, DOMEventTarget, string, object): *}
     *     Required. When a top-level event is fired, this method is expected to
     *     extract synthetic events that will in turn be queued and dispatched.
     *
     *   `eventTypes` {object}
     *     Optional, plugins that fire events must publish a mapping of registration
     *     names that are used to register listeners. Values of this mapping must
     *     be objects that contain `registrationName` or `phasedRegistrationNames`.
     *
     *   `executeDispatch` {function(object, function, string)}
     *     Optional, allows plugins to override how an event gets dispatched. By
     *     default, the listener is simply invoked.
     *
     * Each plugin that is injected into `EventsPluginHub` is immediately operable.
     *
     * @public
     */
    var EventPluginHub = {

        /**
         * Methods for injecting dependencies.
         */
        injection: {

            /**
             * @param {array} InjectedEventPluginOrder
             * @public
             */
            injectEventPluginOrder: EventPluginRegistry.injectEventPluginOrder,

            /**
             * @param {object} injectedNamesToPlugins Map from names to plugin modules.
             */
            injectEventPluginsByName: EventPluginRegistry.injectEventPluginsByName

        },

        /**
         * Stores `listener` at `listenerBank[registrationName][key]`. Is idempotent.
         *
         * @param {object} inst The instance, which is the source of events.
         * @param {string} registrationName Name of listener (e.g. `onClick`).
         * @param {function} listener The callback to store.
         */
        putListener: function putListener(inst, registrationName, listener) {

            var key = getDictionaryKey(inst);
            var bankForRegistrationName = listenerBank[registrationName] || (listenerBank[registrationName] = {});
            bankForRegistrationName[key] = listener;

            var PluginModule = EventPluginRegistry.registrationNameModules[registrationName];
            if (PluginModule && PluginModule.didPutListener) {
                PluginModule.didPutListener(inst, registrationName, listener);
            }
        },

        /**
         * @param {object} inst The instance, which is the source of events.
         * @param {string} registrationName Name of listener (e.g. `onClick`).
         * @return {?function} The stored callback.
         */
        getListener: function getListener(inst, registrationName) {
            var bankForRegistrationName = listenerBank[registrationName];
            var key = getDictionaryKey(inst);
            return bankForRegistrationName && bankForRegistrationName[key];
        },

        /**
         * Deletes a listener from the registration bank.
         *
         * @param {object} inst The instance, which is the source of events.
         * @param {string} registrationName Name of listener (e.g. `onClick`).
         */
        deleteListener: function deleteListener(inst, registrationName) {
            var PluginModule = EventPluginRegistry.registrationNameModules[registrationName];
            if (PluginModule && PluginModule.willDeleteListener) {
                PluginModule.willDeleteListener(inst, registrationName);
            }

            var bankForRegistrationName = listenerBank[registrationName];
            // TODO: This should never be null -- when is it?
            if (bankForRegistrationName) {
                var key = getDictionaryKey(inst);
                delete bankForRegistrationName[key];
            }
        },

        /**
         * Deletes all listeners for the DOM element with the supplied ID.
         *
         * @param {object} inst The instance, which is the source of events.
         */
        deleteAllListeners: function deleteAllListeners(inst) {
            var key = getDictionaryKey(inst);
            for (var registrationName in listenerBank) {
                if (!listenerBank.hasOwnProperty(registrationName)) {
                    continue;
                }

                if (!listenerBank[registrationName][key]) {
                    continue;
                }

                var PluginModule = EventPluginRegistry.registrationNameModules[registrationName];
                if (PluginModule && PluginModule.willDeleteListener) {
                    PluginModule.willDeleteListener(inst, registrationName);
                }

                delete listenerBank[registrationName][key];
            }
        },

        /**
         * Allows registered plugins an opportunity to extract events from top-level
         * native browser events.
         *
         * @return {*} An accumulation of synthetic events.
         * @internal
         */
        extractEvents: function extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
            var events;
            var plugins = EventPluginRegistry.plugins;
            for (var i = 0; i < plugins.length; i++) {
                // Not every plugin in the ordering may be loaded at runtime.
                var possiblePlugin = plugins[i];
                if (possiblePlugin) {
                    var extractedEvents = possiblePlugin.extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
                    if (extractedEvents) {
                        events = accumulateInto(events, extractedEvents);
                    }
                }
            }
            return events;
        },

        /**
         * Enqueues a synthetic event that should be dispatched when
         * `processEventQueue` is invoked.
         *
         * @param {*} events An accumulation of synthetic events.
         * @internal
         */
        enqueueEvents: function enqueueEvents(events) {
            if (events) {
                eventQueue = accumulateInto(eventQueue, events);
            }
        },

        /**
         * Dispatches all synthetic events on the event queue.
         *
         * @internal
         */
        processEventQueue: function processEventQueue(simulated) {
            // Set `eventQueue` to null before processing it so that we can tell if more
            // events get enqueued while processing.
            var processingEventQueue = eventQueue;
            eventQueue = null;
            if (simulated) {
                forEachAccumulated(processingEventQueue, executeDispatchesAndReleaseSimulated);
            } else {
                forEachAccumulated(processingEventQueue, executeDispatchesAndReleaseTopLevel);
            }
            // This would be a good time to rethrow if any of the event handlers threw.
            ReactErrorUtils.rethrowCaughtError();
        },

        /**
         * These are needed for tests only. Do not use!
         */
        __purge: function __purge() {
            listenerBank = {};
        },

        __getListenerBank: function __getListenerBank() {
            return listenerBank;
        }

    };

    function runEventQueueInBatch(events) {
        EventPluginHub.enqueueEvents(events);
        EventPluginHub.processEventQueue(false);
    }

    var ReactEventEmitterMixin = {

        /**
         * Streams a fired top-level event to `EventPluginHub` where plugins have the
         * opportunity to create `ReactEvent`s to be dispatched.
         */
        handleTopLevel: function handleTopLevel(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
            var events = EventPluginHub.extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget);
            runEventQueueInBatch(events);
        }
    };

    var ViewportMetrics = {

        currentScrollLeft: 0,

        currentScrollTop: 0,

        refreshScrollValues: function refreshScrollValues(scrollPosition) {
            ViewportMetrics.currentScrollLeft = scrollPosition.x;
            ViewportMetrics.currentScrollTop = scrollPosition.y;
        }

    };

    var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

    /**
     * Simple, lightweight module assisting with the detection and context of
     * Worker. Helps avoid circular dependencies and allows code to reason about
     * whether or not they are in a Worker, even if they never include the main
     * `ReactWorker` dependency.
     */
    var ExecutionEnvironment = {

        canUseDOM: canUseDOM,

        canUseWorkers: typeof Worker !== 'undefined',

        canUseEventListeners: canUseDOM && !!(window.addEventListener || window.attachEvent),

        canUseViewport: canUseDOM && !!window.screen,

        isInWorker: !canUseDOM // For now, this is true - might change in the future.

    };

    var ExecutionEnvironment_1 = ExecutionEnvironment;

    /**
     * Generate a mapping of standard vendor prefixes using the defined style property and event name.
     *
     * @param {string} styleProp
     * @param {string} eventName
     * @returns {object}
     */
    function makePrefixMap(styleProp, eventName) {
        var prefixes = {};

        prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
        prefixes['Webkit' + styleProp] = 'webkit' + eventName;
        prefixes['Moz' + styleProp] = 'moz' + eventName;
        prefixes['ms' + styleProp] = 'MS' + eventName;
        prefixes['O' + styleProp] = 'o' + eventName.toLowerCase();

        return prefixes;
    }

    /**
     * A list of event names to a configurable list of vendor prefixes.
     */
    var vendorPrefixes = {
        animationend: makePrefixMap('Animation', 'AnimationEnd'),
        animationiteration: makePrefixMap('Animation', 'AnimationIteration'),
        animationstart: makePrefixMap('Animation', 'AnimationStart'),
        transitionend: makePrefixMap('Transition', 'TransitionEnd')
    };

    /**
     * Event names that have already been detected and prefixed (if applicable).
     */
    var prefixedEventNames = {};

    /**
     * Element to check for prefixes on.
     */
    var style = {};

    /**
     * Bootstrap if a DOM exists.
     */
    if (ExecutionEnvironment_1.canUseDOM) {
        style = document.createElement('div').style;

        // On some platforms, in particular some releases of Android 4.x,
        // the un-prefixed "animation" and "transition" properties are defined on the
        // style object but the events that fire will still be prefixed, so we need
        // to check if the un-prefixed events are usable, and if not remove them from the map.
        if (!('AnimationEvent' in window)) {
            delete vendorPrefixes.animationend.animation;
            delete vendorPrefixes.animationiteration.animation;
            delete vendorPrefixes.animationstart.animation;
        }

        // Same as above
        if (!('TransitionEvent' in window)) {
            delete vendorPrefixes.transitionend.transition;
        }
    }

    /**
     * Attempts to determine the correct vendor prefixed event name.
     *
     * @param {string} eventName
     * @returns {string}
     */
    function getVendorPrefixedEventName(eventName) {
        if (prefixedEventNames[eventName]) {
            return prefixedEventNames[eventName];
        } else if (!vendorPrefixes[eventName]) {
            return eventName;
        }

        var prefixMap = vendorPrefixes[eventName];

        for (var styleProp in prefixMap) {
            if (prefixMap.hasOwnProperty(styleProp) && styleProp in style) {
                return prefixedEventNames[eventName] = prefixMap[styleProp];
            }
        }

        return '';
    }

    var useHasFeature;
    if (ExecutionEnvironment_1.canUseDOM) {
        useHasFeature = document.implementation && document.implementation.hasFeature &&
            // always returns true in newer browsers as per the standard.
            // @see http://dom.spec.whatwg.org/#dom-domimplementation-hasfeature
            document.implementation.hasFeature('', '') !== true;
    }

    /**
     * Checks if an event is supported in the current execution environment.
     *
     * NOTE: This will not work correctly for non-generic events such as `change`,
     * `reset`, `load`, `error`, and `select`.
     *
     * Borrows from Modernizr.
     *
     * @param {string} eventNameSuffix Event name, e.g. "click".
     * @param {?boolean} capture Check if the capture phase is supported.
     * @return {boolean} True if the event is supported.
     * @internal
     * @license Modernizr 3.0.0pre (Custom Build) | MIT
     */
    function isEventSupported(eventNameSuffix, capture) {
        if (!ExecutionEnvironment_1.canUseDOM || capture && !('addEventListener' in document)) {
            return false;
        }

        var eventName = 'on' + eventNameSuffix;
        var isSupported = eventName in document;

        if (!isSupported) {
            var element = document.createElement('div');
            element.setAttribute(eventName, 'return;');
            isSupported = typeof element[eventName] === 'function';
        }

        if (!isSupported && useHasFeature && eventNameSuffix === 'wheel') {
            // This is the only way to test support for the `wheel` event in IE9+.
            isSupported = document.implementation.hasFeature('Events.wheel', '3.0');
        }

        return isSupported;
    }

    /**
     * Summary of `ReactBrowserEventEmitter` event handling:
     *
     *  - Top-level delegation is used to trap most native browser events. This
     *    may only occur in the main thread and is the responsibility of
     *    ReactEventListener, which is injected and can therefore support pluggable
     *    event sources. This is the only work that occurs in the main thread.
     *
     *  - We normalize and de-duplicate events to account for browser quirks. This
     *    may be done in the worker thread.
     *
     *  - Forward these native events (with the associated top-level type used to
     *    trap it) to `EventPluginHub`, which in turn will ask plugins if they want
     *    to extract any synthetic events.
     *
     *  - The `EventPluginHub` will then process each event by annotating them with
     *    "dispatches", a sequence of listeners and IDs that care about that event.
     *
     *  - The `EventPluginHub` then dispatches the events.
     *
     * Overview of React and the event system:
     *
     * +------------+    .
     * |    DOM     |    .
     * +------------+    .
     *       |           .
     *       v           .
     * +------------+    .
     * | ReactEvent |    .
     * |  Listener  |    .
     * +------------+    .                         +-----------+
     *       |           .               +--------+|SimpleEvent|
     *       |           .               |         |Plugin     |
     * +-----|------+    .               v         +-----------+
     * |     |      |    .    +--------------+                    +------------+
     * |     +-----------.--->|EventPluginHub|                    |    Event   |
     * |            |    .    |              |     +-----------+  | Propagators|
     * | ReactEvent |    .    |              |     |TapEvent   |  |------------|
     * |  Emitter   |    .    |              |<---+|Plugin     |  |other plugin|
     * |            |    .    |              |     +-----------+  |  utilities |
     * |     +-----------.--->|              |                    +------------+
     * |     |      |    .    +--------------+
     * +-----|------+    .                ^        +-----------+
     *       |           .                |        |Enter/Leave|
     *       +           .                +-------+|Plugin     |
     * +-------------+   .                         +-----------+
     * | application |   .
     * |-------------|   .
     * |             |   .
     * |             |   .
     * +-------------+   .
     *                   .
     *    React Core     .  General Purpose Event Plugin System
     */

    var hasEventPageXY;
    var alreadyListeningTo = {};
    var isMonitoringScrollValue = false;
    var reactTopListenersCounter = 0;

    // For events like 'submit' which don't consistently bubble (which we trap at a
    // lower node than `document`), binding at `document` would cause duplicate
    // events so we don't include them here
    var topEventMapping = {
        topAbort: 'abort',
        topAnimationEnd: getVendorPrefixedEventName('animationend') || 'animationend',
        topAnimationIteration: getVendorPrefixedEventName('animationiteration') || 'animationiteration',
        topAnimationStart: getVendorPrefixedEventName('animationstart') || 'animationstart',
        topBlur: 'blur',
        topCanPlay: 'canplay',
        topCanPlayThrough: 'canplaythrough',
        topChange: 'change',
        topClick: 'click',
        topCompositionEnd: 'compositionend',
        topCompositionStart: 'compositionstart',
        topCompositionUpdate: 'compositionupdate',
        topContextMenu: 'contextmenu',
        topCopy: 'copy',
        topCut: 'cut',
        topDoubleClick: 'dblclick',
        topDrag: 'drag',
        topDragEnd: 'dragend',
        topDragEnter: 'dragenter',
        topDragExit: 'dragexit',
        topDragLeave: 'dragleave',
        topDragOver: 'dragover',
        topDragStart: 'dragstart',
        topDrop: 'drop',
        topDurationChange: 'durationchange',
        topEmptied: 'emptied',
        topEncrypted: 'encrypted',
        topEnded: 'ended',
        topError: 'error',
        topFocus: 'focus',
        topInput: 'input',
        topKeyDown: 'keydown',
        topKeyPress: 'keypress',
        topKeyUp: 'keyup',
        topLoadedData: 'loadeddata',
        topLoadedMetadata: 'loadedmetadata',
        topLoadStart: 'loadstart',
        topMouseDown: 'mousedown',
        topMouseMove: 'mousemove',
        topMouseOut: 'mouseout',
        topMouseOver: 'mouseover',
        topMouseUp: 'mouseup',
        topPaste: 'paste',
        topPause: 'pause',
        topPlay: 'play',
        topPlaying: 'playing',
        topProgress: 'progress',
        topRateChange: 'ratechange',
        topScroll: 'scroll',
        topSeeked: 'seeked',
        topSeeking: 'seeking',
        topSelectionChange: 'selectionchange',
        topStalled: 'stalled',
        topSuspend: 'suspend',
        topTextInput: 'textInput',
        topTimeUpdate: 'timeupdate',
        topTouchCancel: 'touchcancel',
        topTouchEnd: 'touchend',
        topTouchMove: 'touchmove',
        topTouchStart: 'touchstart',
        topTransitionEnd: getVendorPrefixedEventName('transitionend') || 'transitionend',
        topVolumeChange: 'volumechange',
        topWaiting: 'waiting',
        topWheel: 'wheel'
    };

    /**
     * To ensure no conflicts with other potential React instances on the page
     */
    var topListenersIDKey = '_reactListenersID' + String(Math.random()).slice(2);

    function getListeningForDocument(mountAt) {
        // In IE8, `mountAt` is a host object and doesn't have `hasOwnProperty`
        // directly.
        if (!Object.prototype.hasOwnProperty.call(mountAt, topListenersIDKey)) {
            mountAt[topListenersIDKey] = reactTopListenersCounter++;
            alreadyListeningTo[mountAt[topListenersIDKey]] = {};
        }
        return alreadyListeningTo[mountAt[topListenersIDKey]];
    }

    /**
     * `ReactBrowserEventEmitter` is used to attach top-level event listeners. For
     * example:
     *
     *   EventPluginHub.putListener('myID', 'onClick', myFunction);
     *
     * This would allocate a "registration" of `('onClick', myFunction)` on 'myID'.
     *
     * @internal
     */
    var ReactBrowserEventEmitter = index({}, ReactEventEmitterMixin, {

        /**
         * Injectable event backend
         */
        ReactEventListener: null,

        injection: {
            /**
             * @param {object} ReactEventListener
             */
            injectReactEventListener: function injectReactEventListener(ReactEventListener) {
                ReactEventListener.setHandleTopLevel(ReactBrowserEventEmitter.handleTopLevel);
                ReactBrowserEventEmitter.ReactEventListener = ReactEventListener;
            }
        },

        /**
         * Sets whether or not any created callbacks should be enabled.
         *
         * @param {boolean} enabled True if callbacks should be enabled.
         */
        setEnabled: function setEnabled(enabled) {
            if (ReactBrowserEventEmitter.ReactEventListener) {
                ReactBrowserEventEmitter.ReactEventListener.setEnabled(enabled);
            }
        },

        /**
         * @return {boolean} True if callbacks are enabled.
         */
        isEnabled: function isEnabled() {
            return !!(ReactBrowserEventEmitter.ReactEventListener && ReactBrowserEventEmitter.ReactEventListener.isEnabled());
        },

        /**
         * We listen for bubbled touch events on the document object.
         *
         * Firefox v8.01 (and possibly others) exhibited strange behavior when
         * mounting `onmousemove` events at some node that was not the document
         * element. The symptoms were that if your mouse is not moving over something
         * contained within that mount point (for example on the background) the
         * top-level listeners for `onmousemove` won't be called. However, if you
         * register the `mousemove` on the document object, then it will of course
         * catch all `mousemove`s. This along with iOS quirks, justifies restricting
         * top-level listeners to the document object only, at least for these
         * movement types of events and possibly all events.
         *
         * @see http://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
         *
         * Also, `keyup`/`keypress`/`keydown` do not bubble to the window on IE, but
         * they bubble to document.
         *
         * @param {string} registrationName Name of listener (e.g. `onClick`).
         * @param {object} contentDocumentHandle Document which owns the container
         */
        listenTo: function listenTo(registrationName, contentDocumentHandle) {
            var mountAt = contentDocumentHandle;
            var isListening = getListeningForDocument(mountAt);
            var dependencies = EventPluginRegistry.registrationNameDependencies[registrationName];
            if (!dependencies) return; //"production" !== 'production' ? console.log('not found', registrationName) : ''

            var topLevelTypes = EventConstants.topLevelTypes;
            for (var i = 0; i < dependencies.length; i++) {
                var dependency = dependencies[i];
                if (!(isListening.hasOwnProperty(dependency) && isListening[dependency])) {
                    if (dependency === topLevelTypes.topWheel) {
                        if (isEventSupported('wheel')) {
                            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(topLevelTypes.topWheel, 'wheel', mountAt);
                        } else if (isEventSupported('mousewheel')) {
                            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(topLevelTypes.topWheel, 'mousewheel', mountAt);
                        } else {
                            // Firefox needs to capture a different mouse scroll event.
                            // @see http://www.quirksmode.org/dom/events/tests/scroll.html
                            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(topLevelTypes.topWheel, 'DOMMouseScroll', mountAt);
                        }
                    } else if (dependency === topLevelTypes.topScroll) {

                        if (isEventSupported('scroll', true)) {
                            ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent(topLevelTypes.topScroll, 'scroll', mountAt);
                        } else {
                            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(topLevelTypes.topScroll, 'scroll', ReactBrowserEventEmitter.ReactEventListener.WINDOW_HANDLE);
                        }
                    } else if (dependency === topLevelTypes.topFocus || dependency === topLevelTypes.topBlur) {

                        //          if (isEventSupported('focus', true)) {
                        ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent(topLevelTypes.topFocus, 'focus', mountAt);
                        ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent(topLevelTypes.topBlur, 'blur', mountAt);
                        //          } else if (isEventSupported('focusin')) {
                        //            // IE has `focusin` and `focusout` events which bubble.
                        //            // @see http://www.quirksmode.org/blog/archives/2008/04/delegating_the.html
                        //            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(topLevelTypes.topFocus, 'focusin', mountAt);
                        //            ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(topLevelTypes.topBlur, 'focusout', mountAt);
                        //          }

                        // to make sure blur and focus event listeners are only attached once
                        isListening[topLevelTypes.topBlur] = true;
                        isListening[topLevelTypes.topFocus] = true;
                    } else if (topEventMapping.hasOwnProperty(dependency)) {
                        ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(dependency, topEventMapping[dependency], mountAt);
                    }

                    isListening[dependency] = true;
                }
            }
        },

        trapBubbledEvent: function trapBubbledEvent(topLevelType, handlerBaseName, handle) {
            return ReactBrowserEventEmitter.ReactEventListener.trapBubbledEvent(topLevelType, handlerBaseName, handle);
        },

        trapCapturedEvent: function trapCapturedEvent(topLevelType, handlerBaseName, handle) {
            return ReactBrowserEventEmitter.ReactEventListener.trapCapturedEvent(topLevelType, handlerBaseName, handle);
        },

        /**
         * Protect against document.createEvent() returning null
         * Some popup blocker extensions appear to do this:
         * https://github.com/facebook/react/issues/6887
         */
        supportsEventPageXY: function supportsEventPageXY() {
            return true;
            //    if (!document.createEvent) {
            //      return false;
            //    }
            //    var ev = document.createEvent('MouseEvent');
            //    return ev != null && 'pageX' in ev;
        },

        /**
         * Listens to window scroll and resize events. We cache scroll values so that
         * application code can access them without triggering reflows.
         *
         * ViewportMetrics is only used by SyntheticMouse/TouchEvent and only when
         * pageX/pageY isn't supported (legacy browsers).
         *
         * NOTE: Scroll events do not bubble.
         *
         * @see http://www.quirksmode.org/dom/events/scroll.html
         */
        ensureScrollValueMonitoring: function ensureScrollValueMonitoring() {
            if (hasEventPageXY === undefined) {
                hasEventPageXY = ReactBrowserEventEmitter.supportsEventPageXY();
            }
            if (!hasEventPageXY && !isMonitoringScrollValue) {
                var refresh = ViewportMetrics.refreshScrollValues;
                ReactBrowserEventEmitter.ReactEventListener.monitorScrollValue(refresh);
                isMonitoringScrollValue = true;
            }
        }

    });

    var ReactDOMComponentFlags = {
        hasCachedChildNodes: 1 << 0
    };

    var ATTR_NAME = 'data-reactid'; //DOMProperty.ID_ATTRIBUTE_NAME;
    var Flags = ReactDOMComponentFlags;

    var internalInstanceKey$1 = '__reactInternalInstance$' + Math.random().toString(36).slice(2);

    /**
     * Drill down (through composites and empty components) until we get a host or
     * host text component.
     *
     * This is pretty polymorphic but unavoidable with the current structure we have
     * for `_renderedChildren`.
     */
    function getRenderedHostOrTextFromComponent(component) {
        var rendered;
        while (rendered = component._renderedComponent) {
            component = rendered;
        }
        return component;
    }

    /**
     * Populate `_hostNode` on the rendered host/text component with the given
     * DOM node. The passed `inst` can be a composite.
     */
    function precacheNode(inst, node) {
        var hostInst = getRenderedHostOrTextFromComponent(inst);
        hostInst._hostNode = node;
        if (node[internalInstanceKey$1]) {
            hostInst._rootNodeID = node[internalInstanceKey$1]._rootNodeID;
        }
        node[internalInstanceKey$1] = hostInst;
    }

    function uncacheNode(inst) {
        var node = inst._hostNode;
        if (node) {
            delete node[internalInstanceKey$1];
            inst._hostNode = null;
        }
    }

    /**
     * Populate `_hostNode` on each child of `inst`, assuming that the children
     * match up with the DOM (element) children of `node`.
     *
     * We cache entire levels at once to avoid an n^2 problem where we access the
     * children of a node sequentially and have to walk from the start to our target
     * node every time.
     *
     * Since we update `_renderedChildren` and the actual DOM at (slightly)
     * different times, we could race here and see a newer `_renderedChildren` than
     * the DOM nodes we see. To avoid this, ReactMultiChild calls
     * `prepareToManageChildren` before we change `_renderedChildren`, at which
     * time the container's child nodes are always cached (until it unmounts).
     */
    function precacheChildNodes(inst, node) {
        if (inst._flags & Flags.hasCachedChildNodes) {
            return;
        }
        var children = inst._renderedChildren;
        var childNode = node.firstChild;
        outer: for (var name in children) {
            if (!children.hasOwnProperty(name)) {
                continue;
            }
            var childInst = children[name];
            var childID = getRenderedHostOrTextFromComponent(childInst)._domID;
            if (childID == null) {
                // We're currently unmounting this child in ReactMultiChild; skip it.
                continue;
            }
            // We assume the child nodes are in the same order as the child instances.
            for (; childNode !== null; childNode = childNode.nextSibling) {
                if (childNode.nodeType === 1 && childNode.getAttribute(ATTR_NAME) === String(childID) || childNode.nodeType === 8 && childNode.nodeValue === ' react-text: ' + childID + ' ' || childNode.nodeType === 8 && childNode.nodeValue === ' react-empty: ' + childID + ' ') {
                    precacheNode(childInst, childNode);
                    continue outer;
                }
            }
            // We reached the end of the DOM children without finding an ID match.
            prodInvariant('32', childID);
        }
        inst._flags |= Flags.hasCachedChildNodes;
    }

    // 需要频繁读取 dom
    // 看情况是否需要改成构建整个 tree
    function __buildCacheTree(node, findParent) {
        // console.time()
        var now,
            last,
            closest = last = node && node[internalInstanceKey$1] || null;
        // 不确定之前缓存的 _hostParent 是否需要更新
        while (node = node && node.parentNode) {
            now = node[internalInstanceKey$1];
            if (now) {
                closest = closest || now;
                if (last) last._hostParent = now;
                last = now;
            }
            if (node.body) break;
        }
        // console.timeEnd()
        return findParent ? last : closest;
    }

    /**
     * Given a DOM node, return the closest ReactDOMComponent or
     * ReactDOMTextComponent instance ancestor.
     */
    function getClosestInstanceFromNode(node) {
        if (node[internalInstanceKey$1]) {
            return node[internalInstanceKey$1];
        }

        // 实际只有绑定了事件的才会有 internalInstanceKey，所以应该：
        // 找出节点所在分支上所有绑定了事件的节点
        // 直接从父节点开始
        return __buildCacheTree(node.parentNode);

        // Walk up the tree until we find an ancestor whose instance we have cached.
        // var parents = [];
        // while (!node[internalInstanceKey]) {
        //   parents.push(node);
        //   if (node.parentNode) {
        //     node = node.parentNode;
        //   } else {
        //     // Top of the tree. This node must not be part of a React tree (or is
        //     // unmounted, potentially).
        //     return null;
        //   }
        // }

        // var closest;
        // var inst;
        // for (; node && (inst = node[internalInstanceKey]); node = parents.pop()) {
        //   closest = inst;
        //   if (parents.length) {
        //     precacheChildNodes(inst, node);
        //   }
        // }

        // return closest;
    }

    /**
     * Given a DOM node, return the ReactDOMComponent or ReactDOMTextComponent
     * instance, or null if the node was not rendered by this React.
     */
    function getInstanceFromNode(node) {
        var inst = getClosestInstanceFromNode(node);
        if (inst != null && inst._hostNode === node) {
            return inst;
        } else {
            return null;
        }
    }

    /**
     * Given a ReactDOMComponent or ReactDOMTextComponent, return the corresponding
     * DOM node.
     */
    function getNodeFromInstance(inst) {
        // Without this first invariant, passing a non-DOM-component triggers the next
        // invariant for a missing parent, which is super confusing.
        !(inst._hostNode !== undefined) ? prodInvariant('33'): void 0;

        if (inst._hostNode) {
            return inst._hostNode;
        }

        // Walk up the tree until we find an ancestor whose DOM node we have cached.
        var parents = [];
        while (!inst._hostNode) {
            parents.push(inst);
            !inst._hostParent ? prodInvariant('34') : void 0;
            inst = inst._hostParent;
        }

        // Now parents contains each ancestor that does *not* have a cached native
        // node, and `inst` is the deepest ancestor that does.
        for (; parents.length; inst = parents.pop()) {
            precacheChildNodes(inst, inst._hostNode);
        }

        return inst._hostNode;
    }

    var ReactDOMComponentTree = {
        getClosestInstanceFromNode: getClosestInstanceFromNode,
        getInstanceFromNode: getInstanceFromNode,
        getNodeFromInstance: getNodeFromInstance,
        precacheChildNodes: precacheChildNodes,
        precacheNode: precacheNode,
        uncacheNode: uncacheNode,
        internalInstanceKey: internalInstanceKey$1,
        __buildCacheTree: __buildCacheTree
    };

    var ReactEventBridge = {};

    ReactEventBridge.birdge = function(node, name, listener, inst) {
        name = 'on' + name.substring(2).replace(/^[a-z]/g, function(a) {
            return a.toUpperCase();
        });
        if (name === 'onLayout') return;
        ReactBrowserEventEmitter.listenTo(name, document);
        ReactEventBridge.precacheNode(inst, node);
        if (listener) {
            EventPluginHub.putListener(inst, name, listener);
        } else {
            EventPluginHub.deleteListener(inst, name);
        }
    };

    var _rootNodeID = 0;
    ReactEventBridge.precacheNode = function(inst, node) {
        if (inst._rootNodeID === null) inst._rootNodeID = _rootNodeID++;
        ReactDOMComponentTree.precacheNode(inst, node);
    };

    ReactEventBridge.recycle = function(node, key) {
        var inst = node[key];
        if (inst) {
            node[key] = node[key]._hostNode = node[key]._hostParent = null;
            EventPluginHub.deleteAllListeners(inst);
        }
    };

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
        return typeof obj;
    } : function(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    var asyncGenerator = function() {
        function AwaitValue(value) {
            this.value = value;
        }

        function AsyncGenerator(gen) {
            var front, back;

            function send(key, arg) {
                return new Promise(function(resolve, reject) {
                    var request = {
                        key: key,
                        arg: arg,
                        resolve: resolve,
                        reject: reject,
                        next: null
                    };

                    if (back) {
                        back = back.next = request;
                    } else {
                        front = back = request;
                        resume(key, arg);
                    }
                });
            }

            function resume(key, arg) {
                try {
                    var result = gen[key](arg);
                    var value = result.value;

                    if (value instanceof AwaitValue) {
                        Promise.resolve(value.value).then(function(arg) {
                            resume("next", arg);
                        }, function(arg) {
                            resume("throw", arg);
                        });
                    } else {
                        settle(result.done ? "return" : "normal", result.value);
                    }
                } catch (err) {
                    settle("throw", err);
                }
            }

            function settle(type, value) {
                switch (type) {
                    case "return":
                        front.resolve({
                            value: value,
                            done: true
                        });
                        break;

                    case "throw":
                        front.reject(value);
                        break;

                    default:
                        front.resolve({
                            value: value,
                            done: false
                        });
                        break;
                }

                front = front.next;

                if (front) {
                    resume(front.key, front.arg);
                } else {
                    back = null;
                }
            }

            this._invoke = send;

            if (typeof gen.return !== "function") {
                this.return = undefined;
            }
        }

        if (typeof Symbol === "function" && Symbol.asyncIterator) {
            AsyncGenerator.prototype[Symbol.asyncIterator] = function() {
                return this;
            };
        }

        AsyncGenerator.prototype.next = function(arg) {
            return this._invoke("next", arg);
        };

        AsyncGenerator.prototype.throw = function(arg) {
            return this._invoke("throw", arg);
        };

        AsyncGenerator.prototype.return = function(arg) {
            return this._invoke("return", arg);
        };

        return {
            wrap: function(fn) {
                return function() {
                    return new AsyncGenerator(fn.apply(this, arguments));
                };
            },
            await: function(value) {
                return new AwaitValue(value);
            }
        };
    }();

    var classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    };

    var createClass$1 = function() {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function(Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    /* window internalInstanceKey:false */

    // m-start
    function getInternalInstanceKey() {
        if (typeof internalInstanceKey !== 'undefined') {
            return internalInstanceKey;
        }
    }

    function loseup(inst, node) {
        var key = getInternalInstanceKey();
        // @for fucking typeof null === 'object'
        if (key && (typeof inst === 'undefined' ? 'undefined' : _typeof(inst)) === 'object' && inst !== null) {
            ReactEventBridge.precacheNode(inst, node);
        }
    }

    function recycle(node) {
        var key = getInternalInstanceKey();
        if (node[key]) {
            ReactEventBridge.recycle(node, key);
        }
    }

    function resetNode(node) {
        if (node && node.style) {
            options.processStyle(node, 'name', '', node[ATTR_KEY] ? node[ATTR_KEY].style || '' : ''); // reset style 
        }
    }

    /*
     * @private
     * @description ensure each vnode has a stable and unique key
     */
    function recomputeKey(children) {
        children = children || [];
        var keyMap = {},
            outerKey = 0,
            keyArr = [];

        // set key and reset keyMap, keyArr
        function setKey() {
            keyArr.splice(0).forEach(function(info) {
                info[2].key = info[0].key = '.' + outerKey + ':$' + String(info[1]).replace(/^\.[\S]+:\$/g, '');
            });
            keyMap = {};
        }
        children.forEach(function(vnode) {
            var props = vnode && vnode.attributes || {},
                key = props.key,
                invalidKey = key === undefined && ++outerKey; // has no key & outerKey > 0
            // duplicate key
            /* // better to understand
            if (key in keyMap){
                outerKey++;
                setKey();
            }
            */
            if (key in keyMap) ++outerKey && setKey();
            // vnode has no key
            if (invalidKey) {
                setKey();
                // props, origin key, vnode
            } else {
                keyArr.push([props, keyMap[key] = key, vnode]);
            }
        });
        // last !! outerKey++ NOT ++outerKey
        outerKey++ && setKey();
    }

    // m-end


    /** Copy own-properties from `props` onto `obj`.
     *	@returns obj
     *	@private
     */

    function extend$1(obj, props) {
        if (props) {
            for (var i in props) {
                obj[i] = props[i];
            }
        }
        return obj;
    }

    /** Fast clone. Note: does not filter out non-own properties.
     *	@see https://esbench.com/bench/56baa34f45df6895002e03b6
     */
    function clone(obj) {
        return extend$1({}, obj);
    }

    /** Get a deep property value from the given object, expressed in dot-notation.
     *	@private
     */
    function delve(obj, key) {
        for (var p = key.split('.'), i = 0; i < p.length && obj; i++) {
            obj = obj[p[i]];
        }
        return obj;
    }

    /** @private is the given object a Function? */
    function isFunction(obj) {
        return 'function' === typeof obj;
    }

    /** @private is the given object a String? */
    function isString(obj) {
        return 'string' === typeof obj;
    }

    /** Convert a hashmap of CSS classes to a space-delimited className string
     *	@private
     */
    function hashToClassName(c) {
        var str = '';
        for (var prop in c) {
            if (c[prop]) {
                if (str) str += ' ';
                str += prop;
            }
        }
        return str;
    }

    /** Just a memoized String#toLowerCase */
    var lcCache = {};
    var toLowerCase = function toLowerCase(s) {
        return lcCache[s] || (lcCache[s] = s.toLowerCase());
    };

    /** Call a function asynchronously, as soon as possible.
     *	@param {Function} callback
     */
    var resolved = typeof Promise !== 'undefined' && Promise.resolve();
    var defer = resolved ? function(f) {
        resolved.then(f);
    } : setTimeout;

    // m-start
    /**
     * set style
     */
    function processStyle(node, name, old, value) {
        // if value is string set cssText directly
        if (!value || isString(value) || isString(old)) {
            node.style.cssText = value || '';
        }
        // if value is an object
        if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
            // if old tyle exist, diff style
            if (!isString(old)) {
                for (var i in old) {
                    if (!(i in value)) node.style[i] = '';
                }
            }
            for (var _i in value) {
                if (!value.hasOwnProperty(_i)) {
                    continue;
                }
                var styleValue = transStyleValue(_i, value[_i]);
                // mobile不用考虑IE8，直接转换为cssFloat，也不用做细拆分
                if (_i === 'float') {
                    _i = 'cssFloat';
                }
                node.style[_i] = styleValue || '';
            }
        }
    }

    function transStyleValue(name, value) {
        if (value == null || typeof value === 'boolean' || value === '') {
            return '';
        }

        if (isNaN(value) || value === 0 || NON_DIMENSION_PROPS.hasOwnProperty(name) && NON_DIMENSION_PROPS[name]) {
            return '' + value;
        }
        if (typeof value === 'string') {
            value = value.trim();
        }
        return value + 'px';
    }

    var event = function event() {
        ReactEventBridge.birdge.apply(null, arguments);
    };

    /** Global options
     *	@public
     *	@namespace options {Object}
     */
    var options = {

        /** If `true`, `prop` changes trigger synchronous component updates.
         *	@name syncComponentUpdates
         *	@type Boolean
         *	@default true
         */
        //syncComponentUpdates: true,

        /** Processes all created VNodes.
         *	@param {VNode} vnode	A newly-created VNode to normalize/process
         */
        vnode: function vnode(_vnode) {
            // fork add to support react event sys
            _vnode._hostParent = null;
            _vnode._hostNode = null;
            _vnode._rootNodeID = null;
            recomputeKey(_vnode.children);
        },


        /** Hook for style process */
        processStyle: processStyle,

        /** Hook for event handle */
        handleEvent: event

        /** Hook invoked after a component is mounted. */
        // afterMount(component) { }

        /** Hook invoked after the DOM is updated with a component's latest render. */
        // afterUpdate(component) { }

        /** Hook invoked immediately before a component is unmounted. */
        // beforeUnmount(component) { }
    };

    var stack = [];

    var EMPTY_CHILDREN = [];

    /** JSX/hyperscript reviver
     *	Benchmarks: https://esbench.com/bench/57ee8f8e330ab09900a1a1a0
     *	@see http://jasonformat.com/wtf-is-jsx
     *	@public
     *  @example
     *  /** @jsx h *\/
     *  import { render, h } from 'preact';
     *  render(<span>foo</span>, document.body);
     */
    function h(nodeName, attributes) {
        var children = void 0,
            lastSimple = void 0,
            child = void 0,
            simple = void 0,
            i = void 0;
        for (i = arguments.length; i-- > 2;) {
            stack.push(arguments[i]);
        }
        if (attributes && attributes.children) {
            if (!stack.length) stack.push(attributes.children);
            delete attributes.children;
        }
        while (stack.length) {
            if ((child = stack.pop()) instanceof Array) {
                for (i = child.length; i--;) {
                    stack.push(child[i]);
                }
            } else if (child != null && child !== true && child !== false) {
                if (typeof child == 'number') child = String(child);
                simple = typeof child == 'string';
                if (simple && lastSimple) {
                    children[children.length - 1] += child;
                } else {
                    (children || (children = [])).push(child);
                    lastSimple = simple;
                }
            }
        }

        var p = new VNode$1(nodeName, attributes || undefined, children || EMPTY_CHILDREN);

        // if a "vnode hook" is defined, pass every created VNode to it
        if (options.vnode) options.vnode(p);

        return p;
    }

    /** Create an Event handler function that sets a given state property.
     *	@param {Component} component	The component whose state should be updated
     *	@param {string} key				A dot-notated key path to update in the component's state
     *	@param {string} eventPath		A dot-notated key path to the value that should be retrieved from the Event or component
     *	@returns {function} linkedStateHandler
     *	@private
     */
    function createLinkedState(component, key, eventPath) {
        var path = key.split('.');
        return function(e) {
            var t = e && e.target || this,
                state = {},
                obj = state,
                v = isString(eventPath) ? delve(e, eventPath) : t.nodeName ? t.type.match(/^che|rad/) ? t.checked : t.value : e,
                i = 0;
            for (; i < path.length - 1; i++) {
                obj = obj[path[i]] || (obj[path[i]] = !i && component.state[path[i]] || {});
            }
            obj[path[i]] = v;
            component.setState(state);
        };
    }

    /** Managed queue of dirty components to be re-rendered */

    // items/itemsOffline swap on each rerender() call (just a simple pool technique)
    var items = [];

    function enqueueRender(component) {
        if (!component._dirty && (component._dirty = true) && items.push(component) == 1) {
            (options.debounceRendering || defer)(rerender);
        }
    }

    function rerender() {
        var p = void 0,
            list = items;
        items = [];
        while (p = list.pop()) {
            if (p._dirty) renderComponent(p);
        }
    }

    /** Check if a VNode is a reference to a stateless functional component.
     *	A function component is represented as a VNode whose `nodeName` property is a reference to a function.
     *	If that function is not a Component (ie, has no `.render()` method on a prototype), it is considered a stateless functional component.
     *	@param {VNode} vnode	A VNode
     *	@private
     */
    function isFunctionalComponent(vnode) {
        var nodeName = vnode && vnode.nodeName;
        return nodeName && isFunction(nodeName) && !(nodeName.prototype && nodeName.prototype.render);
    }

    /** Construct a resultant VNode from a VNode referencing a stateless functional component.
     *	@param {VNode} vnode	A VNode with a `nodeName` property that is a reference to a function.
     *	@private
     */
    function buildFunctionalComponent(vnode, context) {
        return vnode.nodeName(getNodeProps(vnode), context || EMPTY);
    }

    /** Check if two nodes are equivalent.
     *	@param {Element} node
     *	@param {VNode} vnode
     *	@private
     */
    function isSameNodeType(node, vnode) {
        if (isString(vnode)) {
            return node instanceof Text;
        }
        if (isString(vnode.nodeName)) {
            return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
        }
        if (isFunction(vnode.nodeName)) {
            return (node._componentConstructor ? node._componentConstructor === vnode.nodeName : true) || isFunctionalComponent(vnode);
        }
    }

    function isNamedNode(node, nodeName) {
        return node.normalizedNodeName === nodeName || toLowerCase(node.nodeName) === toLowerCase(nodeName);
    }

    /**
     * Reconstruct Component-style `props` from a VNode.
     * Ensures default/fallback values from `defaultProps`:
     * Own-properties of `defaultProps` not present in `vnode.attributes` are added.
     * @param {VNode} vnode
     * @returns {Object} props
     */
    function getNodeProps(vnode) {
        var props = clone(vnode.attributes);
        props.children = vnode.children;

        var defaultProps = vnode.nodeName.defaultProps;
        if (defaultProps) {
            for (var i in defaultProps) {
                if (props[i] === undefined) {
                    props[i] = defaultProps[i];
                }
            }
        }

        return props;
    }

    // m-end


    /** Removes a given DOM Node from its parent. */
    function removeNode(node) {
        var p = node.parentNode;
        // m-start
        recycle(node);
        // m-end
        if (p) p.removeChild(node);
    }

    /** Set a named attribute on the given Node, with special behavior for some names and event handlers.
     *	If `value` is `null`, the attribute/handler will be removed.
     *	@param {Element} node	An element to mutate
     *	@param {string} name	The name/key to set, such as an event or attribute name
     *	@param {any} old	The last value that was set for this name/node pair
     *	@param {any} value	An attribute value, such as a function to be used as an event handler
     *	@param {Boolean} isSvg	Are we currently diffing inside an svg?
     *	@param {Object} inst VNode instance
     *	@private
     */
    function setAccessor(node, name, old, value, isSvg, inst) {

        if (name === 'className') name = 'class';

        if (name === 'class' && value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
            value = hashToClassName(value);
        }

        if (name === 'key') {
            // ignore
        } else if (name === 'class' && !isSvg) {
            node.className = value || '';
        } else if (name === 'style') {
            // m-start
            if (options.processStyle) {
                return options.processStyle(node, name, old, value);
            }
            // m-end

            if (!value || isString(value) || isString(old)) {
                node.style.cssText = value || '';
            }
            if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
                if (!isString(old)) {
                    for (var i in old) {
                        if (!(i in value)) node.style[i] = '';
                    }
                }
                for (var _i in value) {
                    node.style[_i] = typeof value[_i] === 'number' && !NON_DIMENSION_PROPS[_i] ? value[_i] + 'px' : value[_i];
                }
            }
        } else if (name === 'dangerouslySetInnerHTML') {
            if (value) node.innerHTML = value.__html || '';
        } else if (name[0] == 'o' && name[1] == 'n') {
            // m-start
            if (options.handleEvent) {
                return options.handleEvent(node, name, value, inst);
            }
            // m-end

            var l = node._listeners || (node._listeners = {});
            name = toLowerCase(name.substring(2));
            // @TODO: this might be worth it later, un-breaks focus/blur bubbling in IE9:
            // if (node.attachEvent) name = name=='focus'?'focusin':name=='blur'?'focusout':name;
            if (value) {
                if (!l[name]) node.addEventListener(name, eventProxy, !!NON_BUBBLING_EVENTS[name]);
            } else if (l[name]) {
                node.removeEventListener(name, eventProxy, !!NON_BUBBLING_EVENTS[name]);
            }
            l[name] = value;
        } else if (name !== 'list' && name !== 'type' && !isSvg && name in node) {
            setProperty(node, name, value == null ? '' : value);
            if (value == null || value === false) node.removeAttribute(name);
        } else {
            var ns = isSvg && name.match(/^xlink\:?(.+)/);
            if (value == null || value === false) {
                if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', toLowerCase(ns[1]));
                else node.removeAttribute(name);
            } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object' && !isFunction(value)) {
                if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', toLowerCase(ns[1]), value);
                else node.setAttribute(name, value);
            }
        }
    }

    /** Attempt to set a DOM property to the given value.
     *	IE & FF throw for certain property-value combinations.
     */
    function setProperty(node, name, value) {
        try {
            node[name] = value;
        } catch (e) {}
    }

    /** Proxy an event to hooked event handlers
     *	@private
     */
    function eventProxy(e) {
        return this._listeners[e.type](options.event && options.event(e) || e);
    }

    /** DOM node pool, keyed on nodeName. */

    var nodes = {};

    function collectNode(node) {
        removeNode(node);

        if (node instanceof Element) {
            // m-start
            resetNode(node);
            // m-end

            node._component = node._componentConstructor = null;

            var name = node.normalizedNodeName || toLowerCase(node.nodeName);
            (nodes[name] || (nodes[name] = [])).push(node);
        }
    }

    function createNode(nodeName, isSvg) {
        var name = toLowerCase(nodeName),
            node = nodes[name] && nodes[name].pop() || (isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName));
        node.normalizedNodeName = name;
        return node;
    }

    /** Queue of components that have been mounted and are awaiting componentDidMount */
    var mounts = [];

    /** Diff recursion count, used to track the end of the diff cycle. */
    var diffLevel = 0;

    /** Global flag indicating if the diff is currently within an SVG */
    var isSvgMode = false;

    /** Global flag indicating if the diff is performing hydration */
    var hydrating = false;

    /** Invoke queued componentDidMount lifecycle methods */
    function flushMounts() {
        var c = void 0;
        while (c = mounts.pop()) {
            if (options.afterMount) options.afterMount(c);
            if (c.componentDidMount) c.componentDidMount();
        }
    }

    /** Apply differences in a given vnode (and it's deep children) to a real DOM Node.
     *	@param {Element} [dom=null]		A DOM node to mutate into the shape of the `vnode`
     *	@param {VNode} vnode			A VNode (with descendants forming a tree) representing the desired DOM structure
     *	@returns {Element} dom			The created/mutated element
     *	@private
     */

    /**
     * vnode
     *
     * export function render(vnode, parent, merge) {
     *	 return diff(merge, vnode, {}, false, parent);
     * }
     */

    function diff(dom, vnode, context, mountAll, parent, componentRoot) {
        // diffLevel having been 0 here indicates initial entry into the diff (not a subdiff)
        if (!diffLevel++) {
            // when first starting the diff, check if we're diffing an SVG or within an SVG
            isSvgMode = parent instanceof SVGElement;

            // hydration is inidicated by the existing element to be diffed not having a prop cache
            hydrating = dom && !(ATTR_KEY in dom);
        }
        console.log(dom, vnode, context, mountAll)
        var ret = idiff(dom, vnode, context, mountAll);

        // append the element if its a new parent
        if (parent && ret.parentNode !== parent) {
            parent.appendChild(ret);
            // m-start
            loseup(vnode, ret);
            // m-end
        }

        // diffLevel being reduced to 0 means we're exiting the diff
        if (!--diffLevel) {
            hydrating = false;
            // invoke queued componentDidMount lifecycle methods
            if (!componentRoot) flushMounts();
        }

        return ret;
    }

    function idiff(dom, vnode, context, mountAll) {
        var originalAttributes = vnode && vnode.attributes;

        // Resolve ephemeral Pure Functional Components
        while (isFunctionalComponent(vnode)) {
            vnode = buildFunctionalComponent(vnode, context);
        }

        // empty values (null & undefined) render as empty Text nodes
        if (vnode == null) vnode = '';

        // Fast case: Strings create/update Text nodes.
        if (isString(vnode)) {
            // update if it's already a Text node
            if (dom && dom instanceof Text) {
                if (dom.nodeValue != vnode) {
                    dom.nodeValue = vnode;
                }
            } else {
                // it wasn't a Text node: replace it with one and recycle the old Element
                if (dom) recollectNodeTree(dom);
                dom = document.createTextNode(vnode);
            }

            // Mark for non-hydration updates
            dom[ATTR_KEY] = true;
            return dom;
        }

        // If the VNode represents a Component, perform a component diff.
        if (isFunction(vnode.nodeName)) {
            return buildComponentFromVNode(dom, vnode, context, mountAll);
        }

        var out = dom,
            nodeName = String(vnode.nodeName),
            // @TODO this masks undefined component errors as `<undefined>`
            prevSvgMode = isSvgMode,
            vchildren = vnode.children;

        // SVGs have special namespace stuff.
        // This tracks entering and exiting that namespace when descending through the tree.
        isSvgMode = nodeName === 'svg' ? true : nodeName === 'foreignObject' ? false : isSvgMode;

        if (!dom) {
            // case: we had no element to begin with
            // - create an element with the nodeName from VNode
            out = createNode(nodeName, isSvgMode);
            // m-start
            vnode && loseup(vnode, out);
            // m-end
        } else if (!isNamedNode(dom, nodeName)) {
            // case: Element and VNode had different nodeNames
            // - need to create the correct Element to match VNode
            // - then migrate children from old to new

            out = createNode(nodeName, isSvgMode);
            // m-start
            vnode && loseup(vnode, out);
            // m-end

            // move children into the replacement node
            while (dom.firstChild) {
                out.appendChild(dom.firstChild);
            } // if the previous Element was mounted into the DOM, replace it inline
            if (dom.parentNode) dom.parentNode.replaceChild(out, dom);

            // recycle the old element (skips non-Element node types)
            recollectNodeTree(dom);
        }

        var fc = out.firstChild,
            props = out[ATTR_KEY];

        // Attribute Hydration: if there is no prop cache on the element,
        // ...create it and populate it with the element's attributes.
        if (!props) {
            out[ATTR_KEY] = props = {};
            for (var a = out.attributes, i = a.length; i--;) {
                props[a[i].name] = a[i].value;
            }
        }

        // Optimization: fast-path for elements containing a single TextNode:
        if (!hydrating && vchildren && vchildren.length === 1 && typeof vchildren[0] === 'string' && fc && fc instanceof Text && !fc.nextSibling) {
            if (fc.nodeValue != vchildren[0]) {
                fc.nodeValue = vchildren[0];
            }
        }
        // otherwise, if there are existing or new children, diff them:
        else if (vchildren && vchildren.length || fc) {
            innerDiffNode(out, vchildren, context, mountAll, !!props.dangerouslySetInnerHTML);
        }

        // Apply attributes/props from VNode to the DOM Element:
        diffAttributes(out, vnode.attributes, props, vnode);

        // invoke original ref (from before resolving Pure Functional Components):

        /**
         * <div
         * 	ref={(ref) => this.div = ref}
         * >
         * </div>
         */
        if (originalAttributes && typeof originalAttributes.ref === 'function') {
            (props.ref = originalAttributes.ref)(out);
        }

        isSvgMode = prevSvgMode;

        return out;
    }

    /** Apply child and attribute changes between a VNode and a DOM Node to the DOM.
     *	@param {Element} dom		Element whose children should be compared & mutated
     *	@param {Array} vchildren	Array of VNodes to compare to `dom.childNodes`
     *	@param {Object} context		Implicitly descendant context object (from most recent `getChildContext()`)
     *	@param {Boolean} mountAll
     *	@param {Boolean} absorb		If `true`, consumes externally created elements similar to hydration
     */
    function innerDiffNode(dom, vchildren, context, mountAll, absorb) {
        var originalChildren = dom.childNodes,
            children = [],
            keyed = {},
            keyedLen = 0,
            min = 0,
            len = originalChildren.length,
            childrenLen = 0,
            vlen = vchildren && vchildren.length,
            j = void 0,
            c = void 0,
            vchild = void 0,
            child = void 0;

        if (len) {
            for (var i = 0; i < len; i++) {
                var _child = originalChildren[i],
                    props = _child[ATTR_KEY],
                    key = vlen ? (c = _child._component) ? c.__key : props ? props.key : null : null;
                if (key != null) {
                    keyedLen++;
                    keyed[key] = _child;
                } else if (hydrating || absorb || props) {
                    children[childrenLen++] = _child;
                }
            }
        }

        if (vlen) {
            for (var _i = 0; _i < vlen; _i++) {
                vchild = vchildren[_i];
                child = null;

                // if (isFunctionalComponent(vchild)) {
                // 	vchild = buildFunctionalComponent(vchild);
                // }

                // attempt to find a node based on key matching
                var _key = vchild.key;
                if (_key != null) {
                    if (keyedLen && _key in keyed) {
                        child = keyed[_key];
                        keyed[_key] = undefined;
                        keyedLen--;
                    }
                }
                // attempt to pluck a node of the same type from the existing children
                else if (!child && min < childrenLen) {
                    for (j = min; j < childrenLen; j++) {
                        c = children[j];
                        if (c && isSameNodeType(c, vchild)) {
                            child = c;
                            children[j] = undefined;
                            if (j === childrenLen - 1) childrenLen--;
                            if (j === min) min++;
                            break;
                        }
                    }
                }

                // morph the matched/found/created DOM child to match vchild (deep)
                child = idiff(child, vchild, context, mountAll);

                if (child && child !== dom) {
                    if (_i >= len) {
                        dom.appendChild(child);
                    } else if (child !== originalChildren[_i]) {
                        if (child === originalChildren[_i + 1]) {
                            removeNode(originalChildren[_i]);
                        } else {
                            dom.insertBefore(child, originalChildren[_i] || null);
                        }
                    }
                }
            }
        }

        // 如果还有没有用完的 child 回收之
        if (keyedLen) {
            for (var _i2 in keyed) {
                if (keyed[_i2]) recollectNodeTree(keyed[_i2]);
            }
        }

        // remove orphaned children
        while (min <= childrenLen) {
            child = children[childrenLen--];
            if (child) recollectNodeTree(child);
        }
        document.body.scrollTop;
    }

    /** Recursively recycle (or just unmount) a node an its descendants.
     *	@param {Node} node						DOM node to start unmount/removal from
     *	@param {Boolean} [unmountOnly=false]	If `true`, only triggers unmount lifecycle, skips removal
     */
    function recollectNodeTree(node, unmountOnly) {
        var component = node._component;
        // m-start
        recycle(node);
        // m-end
        if (component) {
            // if node is owned by a Component, unmount that component (ends up recursing back here)
            unmountComponent(component, !unmountOnly);
        } else {
            // If the node's VNode had a ref function, invoke it with null here.
            // (this is part of the React spec, and smart for unsetting references)
            // 置空 ref 函数
            if (node[ATTR_KEY] && node[ATTR_KEY].ref) node[ATTR_KEY].ref(null);

            if (!unmountOnly) {
                collectNode(node);
            }

            // Recollect/unmount all children.
            // - we use .lastChild here because it causes less reflow than .firstChild
            // - it's also cheaper than accessing the .childNodes Live NodeList
            // 递归地回收所有子节点
            var c = void 0;
            while (c = node.lastChild) {
                recollectNodeTree(c, unmountOnly);
            }
        }
    }

    /** Apply differences in attributes from a VNode to the given DOM Element.
     *	@param {Element} dom		Element with attributes to diff `attrs` against
     *	@param {Object} attrs		The desired end-state key-value attribute pairs
     *	@param {Object} old			Current/previous attributes (from previous VNode or element's prop cache)
     */
    function diffAttributes(dom, attrs, old, inst) {
        // remove attributes no longer present on the vnode by setting them to undefined
        var name = void 0;
        for (name in old) {
            if (!(attrs && name in attrs) && old[name] != null) {
                setAccessor(dom, name, old[name], old[name] = undefined, isSvgMode, inst);
            }
        }

        // add new & update changed attributes
        if (attrs) {
            for (name in attrs) {
                if (name !== 'children' && name !== 'innerHTML' && (!(name in old) || attrs[name] !== (name === 'value' || name === 'checked' ? dom[name] : old[name]))) {
                    setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode, inst);
                }
            }
        }
    }

    /** Retains a pool of Components for re-use, keyed on component name.
     *	Note: since component names are not unique or even necessarily available, these are primarily a form of sharding.
     *	@private
     */
    var components = {};

    function collectComponent(component) {
        var name = component.constructor.name,
            list = components[name];
        if (list) list.push(component);
        else components[name] = [component];
    }

    function createComponent(Ctor, props, context) {
        var inst = new Ctor(props, context),
            list = components[Ctor.name];

        Component$1.call(inst, props, context);
        if (list) {
            for (var i = list.length; i--;) {
                if (list[i].constructor === Ctor) {
                    inst.nextBase = list[i].nextBase;
                    list.splice(i, 1);
                    break;
                }
            }
        }
        return inst;
    }

    /** Set a component's `props` (generally derived from JSX attributes).
     *	@param {Object} props
     *	@param {Object} [opts]
     *	@param {boolean} [opts.renderSync=false]	If `true` and {@link options.syncComponentUpdates} is `true`, triggers synchronous rendering.
     *	@param {boolean} [opts.render=true]			If `false`, no render will be triggered.
     */
    function setComponentProps(component, props, opts, context, mountAll) {
        if (component._disable) return;
        component._disable = true;

        // 保存下 ref 和 key
        if (component.__ref = props.ref) delete props.ref;
        if (component.__key = props.key) delete props.key;

        // 如果没有对应的 DOM 节点，说明是首次挂载
        if (!component.base || mountAll) {
            if (component.componentWillMount) component.componentWillMount();
        }
        // 否则是更新
        else if (component.componentWillReceiveProps) {
            component.componentWillReceiveProps(props, context);
        }

        if (context && context !== component.context) {
            if (!component.prevContext) component.prevContext = component.context;
            component.context = context;
        }

        if (!component.prevProps) component.prevProps = component.props;
        component.props = props;

        component._disable = false;

        if (opts !== NO_RENDER) {
            if (opts === SYNC_RENDER || options.syncComponentUpdates !== false || !component.base) {
                renderComponent(component, SYNC_RENDER, mountAll);
            } else {
                enqueueRender(component);
            }
        }

        // 执行 ref
        if (component.__ref) component.__ref(component);
    }

    /** Render a Component, triggering necessary lifecycle events and taking High-Order Components into account.
     *	@param {Component} component
     *	@param {Object} [opts]
     *	@param {boolean} [opts.build=false]		If `true`, component will build and store a DOM node if not already associated with one.
     *	@private
     */
    //diff(merge, vnode, {}, false, parent)
    function renderComponent(component, opts, mountAll, isChild) {
        if (component._disable) return;
        //base改成dom, nextBase改成nextDom
        var skip = void 0,
            rendered = void 0,
            props = component.props,
            state = component.state,
            context = component.context,
            previousProps = component.prevProps || props,
            previousState = component.prevState || state,
            previousContext = component.prevContext || context,
            isUpdate = component.base,
            nextBase = component.nextBase,
            initialBase = isUpdate || nextBase,
            initialChildComponent = component._component,
            inst = void 0,
            cbase = void 0;

        // if updating
        console.log('isUpdate', isUpdate, component)
        if (isUpdate) {
            component.props = previousProps;
            component.state = previousState;
            component.context = previousContext;
            // 执行 shouldComponentUpdate
            if (opts !== FORCE_RENDER && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === false) {
                skip = true;
                console.log('change to true')
            } else if (component.componentWillUpdate) {
                component.componentWillUpdate(props, state, context);
            }
            component.props = props;
            component.state = state;
            component.context = context;
        }

        component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
        component._dirty = false;

        if (!skip) {

            // common component
            if (component.render)
                rendered = component.render(props, state, context);

            // context to pass to the child, can be updated via (grand-)parent component
            if (component.getChildContext) {
                context = extend$1(clone(context), component.getChildContext());
            }
            // pure function component
            while (isFunctionalComponent(rendered)) {
                rendered = buildFunctionalComponent(rendered, context);
            }

            var childComponent = rendered && rendered.nodeName,
                toUnmount = void 0,
                base = void 0;

            if (isFunction(childComponent)) {
                // set up high order component link

                var childProps = getNodeProps(rendered);
                inst = initialChildComponent;

                if (inst && inst.constructor === childComponent && childProps.key == inst.__key) {
                    setComponentProps(inst, childProps, SYNC_RENDER, context);
                } else {
                    toUnmount = inst;

                    inst = createComponent(childComponent, childProps, context);
                    inst.nextBase = inst.nextBase || nextBase;
                    inst._parentComponent = component;
                    component._component = inst;
                    setComponentProps(inst, childProps, NO_RENDER, context);
                    renderComponent(inst, SYNC_RENDER, mountAll, true);
                }

                base = inst.base;
            } else {
                cbase = initialBase;

                // destroy high order component link
                toUnmount = initialChildComponent;
                if (toUnmount) {
                    cbase = component._component = null;
                }

                if (initialBase || opts === SYNC_RENDER) {
                    if (cbase) cbase._component = null;
                    base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, true);
                }
            }

            if (initialBase && base !== initialBase && inst !== initialChildComponent) {
                var baseParent = initialBase.parentNode;
                if (baseParent && base !== baseParent) {
                    baseParent.replaceChild(base, initialBase);

                    if (!toUnmount) {
                        initialBase._component = null;
                        recollectNodeTree(initialBase);
                    }
                }
            }

            if (toUnmount) {
                unmountComponent(toUnmount, base !== initialBase);
            }

            component.base = base;
            if (base && !isChild) {
                var componentRef = component,
                    t = component;
                while (t = t._parentComponent) {
                    (componentRef = t).base = base;
                }
                base._component = componentRef;
                base._componentConstructor = componentRef.constructor;
            }
        }
        if (!isUpdate || mountAll) {
            mounts.unshift(component);
        } else if (!skip) {
            if (component.componentDidUpdate) {
                component.componentDidUpdate(previousProps, previousState, previousContext);
            }
            if (options.afterUpdate) options.afterUpdate(component);
        }

        var cb = component._renderCallbacks,
            fn = void 0;
        if (cb)
            while (fn = cb.pop()) {
                fn.call(component);
            }
        if (!diffLevel && !isChild) flushMounts();
    }

    /** Apply the Component referenced by a VNode to the DOM.
     *	@param {Element} dom	The DOM node to mutate
     *	@param {VNode} vnode	A Component-referencing VNode
     *	@returns {Element} dom	The created/mutated element
     *	@private
     */
    function buildComponentFromVNode(dom, vnode, context, mountAll) {
        var c = dom && dom._component,
            originalComponent = c,
            oldDom = dom,
            isDirectOwner = c && dom._componentConstructor === vnode.nodeName,
            isOwner = isDirectOwner,
            props = getNodeProps(vnode);

        while (c && !isOwner && (c = c._parentComponent)) {
            isOwner = c.constructor === vnode.nodeName;
        }

        if (c && isOwner && (!mountAll || c._component)) {
            setComponentProps(c, props, ASYNC_RENDER, context, mountAll);
            dom = c.base;
        } else {
            if (originalComponent && !isDirectOwner) {
                unmountComponent(originalComponent, true);
                dom = oldDom = null;
            }
            c = createComponent(vnode.nodeName, props, context);
            if (dom && !c.nextBase) {
                c.nextBase = dom;
                // passing dom/oldDom as nextBase will recycle it if unused, so bypass recycling on L241:
                oldDom = null;
            }
            setComponentProps(c, props, SYNC_RENDER, context, mountAll);
            dom = c.base;
            if (oldDom && dom !== oldDom) {
                oldDom._component = null;
                recollectNodeTree(oldDom);
            }
        }

        return dom;
    }

    /** Remove a component from the DOM and recycle it.
     *	@param {Element} dom			A DOM node from which to unmount the given Component
     *	@param {Component} component	The Component instance to unmount
     *	@private
     */
    function unmountComponent(component, remove) {
        if (options.beforeUnmount) options.beforeUnmount(component);

        // console.log(`${remove?'Removing':'Unmounting'} component: ${component.constructor.name}`);
        var base = component.base;

        component._disable = true;

        if (component.componentWillUnmount) component.componentWillUnmount();

        // m-start
        resetNode(component.base);
        // m-end
        component.base = null;

        // recursively tear down & recollect high-order component children:
        var inner = component._component;
        if (inner) {
            unmountComponent(inner, remove);
        } else if (base) {
            if (base[ATTR_KEY] && base[ATTR_KEY].ref) base[ATTR_KEY].ref(null);

            component.nextBase = base;

            if (remove) {
                removeNode(base);
                collectComponent(component);
            }
            var c = void 0;
            while (c = base.lastChild) {
                recollectNodeTree(c, !remove);
            } // removeOrphanedChildren(base.childNodes, true);
        }

        if (component.__ref) component.__ref(null);
        if (component.componentDidUnmount) component.componentDidUnmount();
    }

    /** Base Component class, for the ES6 Class method of creating Components
     *	@public
     *
     *	@example
     *	class MyFoo extends Component {
     *		render(props, state) {
     *			return <div />;
     *		}
     *	}
     */
    function Component$1(props, context) {
        /** @private */
        this._dirty = true;
        // /** @public */
        // this._disableRendering = false;
        // /** @public */
        // this.prevState = this.prevProps = this.prevContext = this.base = this.nextBase = this._parentComponent = this._component = this.__ref = this.__key = this._linkedStates = this._renderCallbacks = null;
        /** @public */
        this.context = context;
        /** @type {object} */
        this.props = props;
        /** @type {object} */
        if (!this.state) this.state = {};
    }

    extend$1(Component$1.prototype, {

        /** Returns a `boolean` value indicating if the component should re-render when receiving the given `props` and `state`.
         *	@param {object} nextProps
         *	@param {object} nextState
         *	@param {object} nextContext
         *	@returns {Boolean} should the component re-render
         *	@name shouldComponentUpdate
         *	@function
         */
        // shouldComponentUpdate() {
        // 	return true;
        // },


        /** Returns a function that sets a state property when called.
         *	Calling linkState() repeatedly with the same arguments returns a cached link function.
         *
         *	Provides some built-in special cases:
         *		- Checkboxes and radio buttons link their boolean `checked` value
         *		- Inputs automatically link their `value` property
         *		- Event paths fall back to any associated Component if not found on an element
         *		- If linked value is a function, will invoke it and use the result
         *
         *	@param {string} key		The path to set - can be a dot-notated deep key
         *	@param {string} [eventPath]	If set, attempts to find the new state value at a given dot-notated path within the object passed to the linkedState setter.
         *	@returns {function} linkStateSetter(e)
         *
         *	@example Update a "text" state value when an input changes:
         *		<input onChange={ this.linkState('text') } />
         *
         *	@example Set a deep state value on click
         *		<button onClick={ this.linkState('touch.coords', 'touches.0') }>Tap</button
         */
        linkState: function linkState(key, eventPath) {
            var c = this._linkedStates || (this._linkedStates = {});
            return c[key + eventPath] || (c[key + eventPath] = createLinkedState(this, key, eventPath));
        },


        /** Update component state by copying properties from `state` to `this.state`.
         *	@param {object} state		A hash of state properties to update with new values
         */
        setState: function setState(state, callback) {
            var s = this.state;
            if (!this.prevState) this.prevState = clone(s);
            extend$1(s, isFunction(state) ? state(s, this.props) : state);
            if (callback)(this._renderCallbacks = this._renderCallbacks || []).push(callback);
            enqueueRender(this);
        },


        /** Immediately perform a synchronous re-render of the component.
         *	@private
         */
        forceUpdate: function forceUpdate(callback) {
            renderComponent(this, FORCE_RENDER);
            // eslint-disable-next-line
            if (typeof callback === 'function') callback();
        },


        /** Accepts `props` and `state`, and returns a new Virtual DOM tree to build.
         *	Virtual DOM is generally constructed via [JSX](http://jasonformat.com/wtf-is-jsx).
         *	@param {object} props		Props (eg: JSX attributes) received from parent element/component
         *	@param {object} state		The component's current state
         *	@param {object} context		Context object (if a parent component has provided context)
         *	@returns VNode
         */
        render: function render() {}
    });

    /** Render JSX into a `parent` Element.
     *	@param {VNode} vnode		A (JSX) VNode to render
     *	@param {Element} parent		DOM element to render into
     *	@param {Element} [merge]	Attempt to re-use an existing DOM tree rooted at `merge`
     *	@public
     *
     *	@example
     *	// render a div into <body>:
     *	render(<div id="hello">hello!</div>, document.body);
     *
     *	@example
     *	// render a "Thing" component into #foo:
     *	const Thing = ({ name }) => <span>{ name }</span>;
     *	render(<Thing name="one" />, document.querySelector('#foo'));
     */
    function render$1(vnode, parent, merge) {
        return diff(merge, vnode, {}, false, parent);
    }

    var PropagationPhases$1 = EventConstants.PropagationPhases;
    var getListener = EventPluginHub.getListener;

    /**
     * Some event types have a notion of different registration names for different
     * "phases" of propagation. This finds listeners by a given phase.
     */
    function listenerAtPhase(inst, event, propagationPhase) {
        var registrationName = event.dispatchConfig.phasedRegistrationNames[propagationPhase];
        return getListener(inst, registrationName);
    }

    /**
     * Tags a `SyntheticEvent` with dispatched listeners. Creating this function
     * here, allows us to not have to bind or create functions for each event.
     * Mutating the event's members allows us to not have to create a wrapping
     * "dispatch" object that pairs the event with the listener.
     */
    function accumulateDirectionalDispatches(inst, upwards, event) {
        if ("production" !== 'production') {}
        var phase = upwards ? PropagationPhases$1.bubbled : PropagationPhases$1.captured;
        var listener = listenerAtPhase(inst, event, phase);
        if (listener) {
            event._dispatchListeners = accumulateInto(event._dispatchListeners, listener);
            event._dispatchInstances = accumulateInto(event._dispatchInstances, inst);
        }
    }

    /**
     * Collect dispatches (must be entirely collected before dispatching - see unit
     * tests). Lazily allocate the array to conserve memory.  We must loop through
     * each event and perform the traversal for each one. We cannot perform a
     * single traversal for the entire collection of events because each event may
     * have a different target.
     */
    function accumulateTwoPhaseDispatchesSingle(event) {
        if (event && event.dispatchConfig.phasedRegistrationNames) {
            EventPluginUtils.traverseTwoPhase(event._targetInst, accumulateDirectionalDispatches, event);
        }
    }

    /**
     * Same as `accumulateTwoPhaseDispatchesSingle`, but skips over the targetID.
     */
    function accumulateTwoPhaseDispatchesSingleSkipTarget(event) {
        if (event && event.dispatchConfig.phasedRegistrationNames) {
            var targetInst = event._targetInst;
            var parentInst = targetInst ? EventPluginUtils.getParentInstance(targetInst) : null;
            EventPluginUtils.traverseTwoPhase(parentInst, accumulateDirectionalDispatches, event);
        }
    }

    /**
     * Accumulates without regard to direction, does not look for phased
     * registration names. Same as `accumulateDirectDispatchesSingle` but without
     * requiring that the `dispatchMarker` be the same as the dispatched ID.
     */
    function accumulateDispatches(inst, ignoredDirection, event) {
        if (event && event.dispatchConfig.registrationName) {
            var registrationName = event.dispatchConfig.registrationName;
            var listener = getListener(inst, registrationName);
            if (listener) {
                event._dispatchListeners = accumulateInto(event._dispatchListeners, listener);
                event._dispatchInstances = accumulateInto(event._dispatchInstances, inst);
            }
        }
    }

    /**
     * Accumulates dispatches on an `SyntheticEvent`, but only for the
     * `dispatchMarker`.
     * @param {SyntheticEvent} event
     */
    function accumulateDirectDispatchesSingle(event) {
        if (event && event.dispatchConfig.registrationName) {
            accumulateDispatches(event._targetInst, null, event);
        }
    }

    function accumulateTwoPhaseDispatches(events) {
        forEachAccumulated(events, accumulateTwoPhaseDispatchesSingle);
    }

    function accumulateTwoPhaseDispatchesSkipTarget(events) {
        forEachAccumulated(events, accumulateTwoPhaseDispatchesSingleSkipTarget);
    }

    function accumulateEnterLeaveDispatches(leave, enter, from, to) {
        EventPluginUtils.traverseEnterLeave(from, to, accumulateDispatches, leave, enter);
    }

    function accumulateDirectDispatches(events) {
        forEachAccumulated(events, accumulateDirectDispatchesSingle);
    }

    /**
     * A small set of propagation patterns, each of which will accept a small amount
     * of information, and generate a set of "dispatch ready event objects" - which
     * are sets of events that have already been annotated with a set of dispatched
     * listener functions/ids. The API is designed this way to discourage these
     * propagation strategies from actually executing the dispatches, since we
     * always want to collect the entire set of dispatches before executing event a
     * single one.
     *
     * @constructor EventPropagators
     */
    var EventPropagators = {
        accumulateTwoPhaseDispatches: accumulateTwoPhaseDispatches,
        accumulateTwoPhaseDispatchesSkipTarget: accumulateTwoPhaseDispatchesSkipTarget,
        accumulateDirectDispatches: accumulateDirectDispatches,
        accumulateEnterLeaveDispatches: accumulateEnterLeaveDispatches
    };

    /**
     * Static poolers. Several custom versions for each potential number of
     * arguments. A completely generic pooler is easy to implement, but would
     * require accessing the `arguments` object. In each of these, `this` refers to
     * the Class itself, not an instance. If any others are needed, simply add them
     * here, or in their own files.
     */
    var oneArgumentPooler = function oneArgumentPooler(copyFieldsFrom) {
        var Klass = this;
        if (Klass.instancePool.length) {
            var instance = Klass.instancePool.pop();
            Klass.call(instance, copyFieldsFrom);
            return instance;
        } else {
            return new Klass(copyFieldsFrom);
        }
    };

    var twoArgumentPooler = function twoArgumentPooler(a1, a2) {
        var Klass = this;
        if (Klass.instancePool.length) {
            var instance = Klass.instancePool.pop();
            Klass.call(instance, a1, a2);
            return instance;
        } else {
            return new Klass(a1, a2);
        }
    };

    var threeArgumentPooler = function threeArgumentPooler(a1, a2, a3) {
        var Klass = this;
        if (Klass.instancePool.length) {
            var instance = Klass.instancePool.pop();
            Klass.call(instance, a1, a2, a3);
            return instance;
        } else {
            return new Klass(a1, a2, a3);
        }
    };

    var fourArgumentPooler = function fourArgumentPooler(a1, a2, a3, a4) {
        var Klass = this;
        if (Klass.instancePool.length) {
            var instance = Klass.instancePool.pop();
            Klass.call(instance, a1, a2, a3, a4);
            return instance;
        } else {
            return new Klass(a1, a2, a3, a4);
        }
    };

    var fiveArgumentPooler = function fiveArgumentPooler(a1, a2, a3, a4, a5) {
        var Klass = this;
        if (Klass.instancePool.length) {
            var instance = Klass.instancePool.pop();
            Klass.call(instance, a1, a2, a3, a4, a5);
            return instance;
        } else {
            return new Klass(a1, a2, a3, a4, a5);
        }
    };

    var standardReleaser = function standardReleaser(instance) {
        var Klass = this;
        !(instance instanceof Klass) ? prodInvariant('25'): void 0;
        instance.destructor();
        if (Klass.instancePool.length < Klass.poolSize) {
            Klass.instancePool.push(instance);
        }
    };

    var DEFAULT_POOL_SIZE = 10;
    var DEFAULT_POOLER = oneArgumentPooler;

    /**
     * Augments `CopyConstructor` to be a poolable class, augmenting only the class
     * itself (statically) not adding any prototypical fields. Any CopyConstructor
     * you give this may have a `poolSize` property, and will look for a
     * prototypical `destructor` on instances.
     *
     * @param {Function} CopyConstructor Constructor that can be used to reset.
     * @param {Function} pooler Customizable pooler.
     */
    var addPoolingTo = function addPoolingTo(CopyConstructor, pooler) {
        var NewKlass = CopyConstructor;
        NewKlass.instancePool = [];
        NewKlass.getPooled = pooler || DEFAULT_POOLER;
        if (!NewKlass.poolSize) {
            NewKlass.poolSize = DEFAULT_POOL_SIZE;
        }
        NewKlass.release = standardReleaser;
        return NewKlass;
    };

    var PooledClass = {
        addPoolingTo: addPoolingTo,
        oneArgumentPooler: oneArgumentPooler,
        twoArgumentPooler: twoArgumentPooler,
        threeArgumentPooler: threeArgumentPooler,
        fourArgumentPooler: fourArgumentPooler,
        fiveArgumentPooler: fiveArgumentPooler
    };

    var shouldBeReleasedProperties = ['dispatchConfig', '_targetInst', 'nativeEvent', 'isDefaultPrevented', 'isPropagationStopped', '_dispatchListeners', '_dispatchInstances'];

    /**
     * @interface Event
     * @see http://www.w3.org/TR/DOM-Level-3-Events/
     */
    var EventInterface = {
        type: null,
        target: null,
        // currentTarget is set when dispatching; no use in copying it here
        currentTarget: __moduleExports$1.thatReturnsNull,
        eventPhase: null,
        bubbles: null,
        cancelable: null,
        timeStamp: function timeStamp(event) {
            return event.timeStamp || Date.now();
        },
        defaultPrevented: null,
        isTrusted: null
    };

    /**
     * Synthetic events are dispatched by event plugins, typically in response to a
     * top-level event delegation handler.
     *
     * These systems should generally use pooling to reduce the frequency of garbage
     * collection. The system should check `isPersistent` to determine whether the
     * event should be released into the pool after being dispatched. Users that
     * need a persisted event should invoke `persist`.
     *
     * Synthetic events (and subclasses) implement the DOM Level 3 Events API by
     * normalizing browser quirks. Subclasses do not necessarily have to implement a
     * DOM interface; custom application-specific events can also subclass this.
     *
     * @param {object} dispatchConfig Configuration used to dispatch this event.
     * @param {*} targetInst Marker identifying the event target.
     * @param {object} nativeEvent Native browser event.
     * @param {DOMEventTarget} nativeEventTarget Target node.
     */
    function SyntheticEvent(dispatchConfig, targetInst, nativeEvent, nativeEventTarget) {
        if ("production" !== 'production') {}

        this.dispatchConfig = dispatchConfig;
        this._targetInst = targetInst;
        this.nativeEvent = nativeEvent;
        for (var i in nativeEvent) {
            var val = nativeEvent[i];
            if (typeof val !== 'function') {
                this[i] = val;
            }
        }
        var Interface = this.constructor.Interface;
        for (var propName in Interface) {
            if (!Interface.hasOwnProperty(propName)) {
                continue;
            }
            var normalize = Interface[propName];
            if (typeof normalize === 'function') {
                this[propName] = normalize(nativeEvent);
            }

            this.target = nativeEventTarget;
        }

        var defaultPrevented = nativeEvent.defaultPrevented != null ? nativeEvent.defaultPrevented : nativeEvent.returnValue === false;
        if (defaultPrevented) {
            this.isDefaultPrevented = __moduleExports$1.thatReturnsTrue;
        } else {
            this.isDefaultPrevented = __moduleExports$1.thatReturnsFalse;
        }
        this.isPropagationStopped = __moduleExports$1.thatReturnsFalse;
        return this;
    }

    index(SyntheticEvent.prototype, {

        preventDefault: function preventDefault() {
            this.defaultPrevented = true;
            var event = this.nativeEvent;
            if (!event) {
                return;
            }

            if (event.preventDefault) {
                event.preventDefault();
            } else if (typeof event.returnValue !== 'unknown') {
                // eslint-disable-line valid-typeof
                event.returnValue = false;
            }
            this.isDefaultPrevented = __moduleExports$1.thatReturnsTrue;
        },

        stopPropagation: function stopPropagation() {
            var event = this.nativeEvent;
            if (!event) {
                return;
            }

            if (event.stopPropagation) {
                event.stopPropagation();
            } else if (typeof event.cancelBubble !== 'unknown') {
                // eslint-disable-line valid-typeof
                // The ChangeEventPlugin registers a "propertychange" event for
                // IE. This event does not support bubbling or cancelling, and
                // any references to cancelBubble throw "Member not found".  A
                // typeof check of "unknown" circumvents this issue (and is also
                // IE specific).
                event.cancelBubble = true;
            }

            this.isPropagationStopped = __moduleExports$1.thatReturnsTrue;
        },

        /**
         * We release all dispatched `SyntheticEvent`s after each event loop, adding
         * them back into the pool. This allows a way to hold onto a reference that
         * won't be added back into the pool.
         */
        persist: function persist() {
            this.isPersistent = __moduleExports$1.thatReturnsTrue;
        },

        /**
         * Checks if this event should be released back into the pool.
         *
         * @return {boolean} True if this should not be released, false otherwise.
         */
        isPersistent: __moduleExports$1.thatReturnsFalse,

        /**
         * `PooledClass` looks for `destructor` on each instance it releases.
         */
        destructor: function destructor() {
            var Interface = this.constructor.Interface;
            for (var propName in Interface) {

                this[propName] = null;
            }
            for (var i = 0; i < shouldBeReleasedProperties.length; i++) {
                this[shouldBeReleasedProperties[i]] = null;
            }
        }

    });

    SyntheticEvent.Interface = EventInterface;

    /**
     * Helper to reduce boilerplate when creating subclasses.
     *
     * @param {function} Class
     * @param {?object} Interface
     */
    SyntheticEvent.augmentClass = function(Class, Interface) {
        var Super = this;

        var E = function E() {};
        E.prototype = Super.prototype;
        var prototype = new E();

        index(prototype, Class.prototype);
        Class.prototype = prototype;
        Class.prototype.constructor = Class;

        Class.Interface = index({}, Super.Interface, Interface);
        Class.augmentClass = Super.augmentClass;

        PooledClass.addPoolingTo(Class, PooledClass.fourArgumentPooler);
    };

    PooledClass.addPoolingTo(SyntheticEvent, PooledClass.fourArgumentPooler);

    var END_KEYCODES = [9, 13, 27, 32]; // Tab, Return, Esc, Space
    var START_KEYCODE = 229;

    var canUseCompositionEvent = ExecutionEnvironment_1.canUseDOM && 'CompositionEvent' in window;

    // Webkit offers a very useful `textInput` event that can be used to
    // directly represent `beforeInput`. The IE `textinput` event is not as
    // useful, so we don't use it.
    // var canUseTextInputEvent = ExecutionEnvironment.canUseDOM && 'TextEvent' in window && !documentMode && !isPresto();
    // 不处理IE
    // In IE9+, we have access to composition events, but the data supplied
    // by the native compositionend event may be incorrect. Japanese ideographic
    // spaces, for instance (\u3000) are not recorded correctly.
    // var useFallbackCompositionData = ExecutionEnvironment.canUseDOM && (!canUseCompositionEvent || documentMode && documentMode > 8 && documentMode <= 11);

    /**
     * 不再支持旧的opera
     * Opera <= 12 includes TextEvent in window, but does not fire
     * text input events. Rely on keypress instead.
     */

    var SPACEBAR_CODE = 32;
    var SPACEBAR_CHAR = String.fromCharCode(SPACEBAR_CODE);

    // var topLevelTypes = EventConstants.topLevelTypes;

    // Events and their corresponding property names.
    var eventTypes = {
        beforeInput: {
            phasedRegistrationNames: {
                bubbled: 'onBeforeInput',
                captured: 'onBeforeInputCapture'
            },
            dependencies: ['topCompositionEnd', 'topKeyPress', 'topTextInput', 'topPaste']
        },
        compositionEnd: {
            phasedRegistrationNames: {
                bubbled: 'onCompositionEnd',
                captured: 'onCompositionEndCapture'
            },
            dependencies: ['topBlur', 'topCompositionEnd', 'topKeyDown', 'topKeyPress', 'topKeyUp', 'topMouseDown']
        },
        compositionStart: {
            phasedRegistrationNames: {
                bubbled: 'onCompositionStart',
                captured: 'onCompositionStartCapture'
            },
            dependencies: ['topBlur', 'topCompositionStart', 'topKeyDown', 'topKeyPress', 'topKeyUp', 'topMouseDown']
        },
        compositionUpdate: {
            phasedRegistrationNames: {
                bubbled: 'onCompositionUpdate',
                captured: 'onCompositionUpdateCapture'
            },
            dependencies: ['topBlur', 'topCompositionUpdate', 'topKeyDown', 'topKeyPress', 'topKeyUp', 'topMouseDown']
        }
    };

    // Track whether we've ever handled a keypress on the space key.
    var hasSpaceKeypress = false;

    /**
     * Translate native top level events into event types.
     *
     * @param {string} topLevelType
     * @return {object}
     */
    function getCompositionEventType(topLevelType) {
        switch (topLevelType) {
            case 'topCompositionStart':
                return eventTypes.compositionStart;
            case 'topCompositionEnd':
                return eventTypes.compositionEnd;
            case 'topCompositionUpdate':
                return eventTypes.compositionUpdate;
        }
    }

    /**
     * Does our fallback best-guess model think this event signifies that
     * composition has begun?
     *
     * @param {string} topLevelType
     * @param {object} nativeEvent
     * @return {boolean}
     */
    function isFallbackCompositionStart(topLevelType, nativeEvent) {
        return topLevelType === 'topKeyDown' && nativeEvent.keyCode === START_KEYCODE;
    }

    /**
     * Does our fallback mode think that this event is the end of composition?
     *
     * @param {string} topLevelType
     * @param {object} nativeEvent
     * @return {boolean}
     */
    function isFallbackCompositionEnd(topLevelType, nativeEvent) {
        switch (topLevelType) {
            case 'topKeyUp':
                // Command keys insert or clear IME input.
                return END_KEYCODES.indexOf(nativeEvent.keyCode) !== -1;
            case 'topKeyDown':
                // Expect IME keyCode on each keydown. If we get any other
                // code we must have exited earlier.
                return nativeEvent.keyCode !== START_KEYCODE;
            case 'topKeyPress':
            case 'topMouseDown':
            case 'topBlur':
                // Events are not possible without cancelling IME.
                return true;
            default:
                return false;
        }
    }

    /**
     * Google Input Tools provides composition data via a CustomEvent,
     * with the `data` property populated in the `detail` object. If this
     * is available on the event object, use it. If not, this is a plain
     * composition event and we have nothing special to extract.
     *
     * @param {object} nativeEvent
     * @return {?string}
     */
    function getDataFromCustomEvent(nativeEvent) {
        var detail = nativeEvent.detail;
        if ((typeof detail === 'undefined' ? 'undefined' : _typeof(detail)) === 'object' && 'data' in detail) {
            return detail.data;
        }
        return null;
    }

    // Track the current IME composition fallback object, if any.
    var currentComposition = null;

    /**
     * @return {?object} A SyntheticCompositionEvent.
     */
    function extractCompositionEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
        var eventType;
        var fallbackData;

        if (canUseCompositionEvent) {
            eventType = getCompositionEventType(topLevelType);
        } else if (!currentComposition) {
            if (isFallbackCompositionStart(topLevelType, nativeEvent)) {
                eventType = eventTypes.compositionStart;
            }
        } else if (isFallbackCompositionEnd(topLevelType, nativeEvent)) {
            eventType = eventTypes.compositionEnd;
        }

        if (!eventType) {
            return null;
        }

        var event = SyntheticEvent.getPooled(eventType, targetInst, nativeEvent, nativeEventTarget);

        var customData = getDataFromCustomEvent(nativeEvent);
        if (customData !== null) {
            event.data = customData;
        }

        EventPropagators.accumulateTwoPhaseDispatches(event);
        return event;
    }

    /**
     * @param {string} topLevelType Record from `EventConstants`.
     * @param {object} nativeEvent Native browser event.
     * @return {?string} The string corresponding to this `beforeInput` event.
     */
    function getNativeBeforeInputChars(topLevelType, nativeEvent) {
        switch (topLevelType) {
            case 'topCompositionEnd':
                return getDataFromCustomEvent(nativeEvent);
            case 'topKeyPress':
                /**
                 * If native `textInput` events are available, our goal is to make
                 * use of them. However, there is a special case: the spacebar key.
                 * In Webkit, preventing default on a spacebar `textInput` event
                 * cancels character insertion, but it *also* causes the browser
                 * to fall back to its default spacebar behavior of scrolling the
                 * page.
                 *
                 * Tracking at:
                 * https://code.google.com/p/chromium/issues/detail?id=355103
                 *
                 * To avoid this issue, use the keypress event as if no `textInput`
                 * event is available.
                 */
                var which = nativeEvent.which;
                if (which !== SPACEBAR_CODE) {
                    return null;
                }

                hasSpaceKeypress = true;
                return SPACEBAR_CHAR;

            case 'topTextInput':
                // Record the characters to be added to the DOM.
                var chars = nativeEvent.data;

                // If it's a spacebar character, assume that we have already handled
                // it at the keypress level and bail immediately. Android Chrome
                // doesn't give us keycodes, so we need to blacklist it.
                if (chars === SPACEBAR_CHAR && hasSpaceKeypress) {
                    return null;
                }

                return chars;

            default:
                // For other native event types, do nothing.
                return null;
        }
    }

    /**
     * Extract a SyntheticInputEvent for `beforeInput`, based on either native
     * `textInput` or fallback behavior.
     *
     * @return {?object} A SyntheticInputEvent.
     */
    function extractBeforeInputEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
        var chars;

        //   if (canUseTextInputEvent) {
        chars = getNativeBeforeInputChars(topLevelType, nativeEvent);
        //    } else {
        //        chars = getFallbackBeforeInputChars(topLevelType, nativeEvent);
        //    }

        // If no characters are being inserted, no BeforeInput event should
        // be fired.
        if (!chars) {
            return null;
        }

        var event = SyntheticEvent.getPooled(eventTypes.beforeInput, targetInst, nativeEvent, nativeEventTarget);

        event.data = chars;
        EventPropagators.accumulateTwoPhaseDispatches(event);
        return event;
    }

    /**
     * Create an `onBeforeInput` event to match
     * http://www.w3.org/TR/2013/WD-DOM-Level-3-Events-20131105/#events-inputevents.
     *
     * This event plugin is based on the native `textInput` event
     * available in Chrome, Safari, Opera, and IE. This event fires after
     * `onKeyPress` and `onCompositionEnd`, but before `onInput`.
     *
     * `beforeInput` is spec'd but not implemented in any browsers, and
     * the `input` event does not provide any useful information about what has
     * actually been added, contrary to the spec. Thus, `textInput` is the best
     * available event to identify the characters that have actually been inserted
     * into the target node.
     *
     * This plugin is also responsible for emitting `composition` events, thus
     * allowing us to share composition fallback code for both `beforeInput` and
     * `composition` event types.
     */
    var BeforeInputEventPlugin = {

        eventTypes: eventTypes,

        extractEvents: function extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
            return [extractCompositionEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget), extractBeforeInputEvent(topLevelType, targetInst, nativeEvent, nativeEventTarget)];
        }
    };

    /**
     * Copyright 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * Module getEventTarget
     */

    /**
     * Gets the target node from a native browser event by accounting for
     * inconsistencies in browser DOM APIs.
     *
     * @param {object} nativeEvent Native browser event.
     * @return {DOMEventTarget} Target node.
     */

    function getEventTarget(nativeEvent) {
        var target = nativeEvent.target || nativeEvent.srcElement || window;

        // Normalize SVG <use> element events #4963
        if (target.correspondingUseElement) {
            target = target.correspondingUseElement;
        }

        // Safari may fire events on text nodes (Node.TEXT_NODE is 3).
        // @see http://www.quirksmode.org/js/events_properties.html
        return target.nodeType === 3 ? target.parentNode : target;
    }

    /**
     * @see http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary
     */

    var supportedInputTypes = {
        'color': true,
        'date': true,
        'datetime': true,
        'datetime-local': true,
        'email': true,
        'month': true,
        'number': true,
        'password': true,
        'range': true,
        'search': true,
        'tel': true,
        'text': true,
        'time': true,
        'url': true,
        'week': true
    };

    function isTextInputElement(elem) {
        var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();

        if (nodeName === 'input') {
            return !!supportedInputTypes[elem.type];
        }

        if (nodeName === 'textarea') {
            return true;
        }

        return false;
    }

    var eventTypes$1 = {
        change: {
            phasedRegistrationNames: {
                bubbled: 'onChange',
                captured: 'onChangeCapture'
            },
            dependencies: ['topBlur', 'topChange', 'topClick', 'topFocus', 'topInput', 'topKeyDown', 'topKeyUp', 'topSelectionChange']
        }
    };

    /**
     * For IE shims
     */
    var activeElement = null;
    var activeElementInst = null;
    var activeElementValue = null;
    var activeElementValueProp = null;

    /**
     * SECTION: handle `change` event
     */
    function shouldUseChangeEvent(elem) {
        var nodeName = elem.nodeName && elem.nodeName.toLowerCase();
        return nodeName === 'select' || nodeName === 'input' && elem.type === 'file';
    }

    var doesChangeEventBubble = false;
    if (ExecutionEnvironment_1.canUseDOM) {
        // See `handleChange` comment below
        doesChangeEventBubble = isEventSupported('change') && (!document.documentMode || document.documentMode > 8);
    }

    function manualDispatchChangeEvent(nativeEvent) {
        var event = SyntheticEvent.getPooled(eventTypes$1.change, activeElementInst, nativeEvent, getEventTarget(nativeEvent));
        EventPropagators.accumulateTwoPhaseDispatches(event);

        // If change and propertychange bubbled, we'd just bind to it like all the
        // other events and have it go through ReactBrowserEventEmitter. Since it
        // doesn't, we manually listen for the events and so we have to enqueue and
        // process the abstract event manually.
        //
        // Batching is necessary here in order to ensure that all event handlers run
        // before the next rerender (including event handlers attached to ancestor
        // elements instead of directly on the input). Without this, controlled
        // components don't work properly in conjunction with event bubbling because
        // the component is rerendered and the value reverted before all the event
        // handlers can run. See https://github.com/facebook/react/issues/708.
        // ReactUpdates.batchedUpdates(runEventInBatch, event);
    }

    //function startWatchingForChangeEventIE8(target, targetInst) {
    //    activeElement = target;
    //    activeElementInst = targetInst;
    //    activeElement.attachEvent('onchange', manualDispatchChangeEvent);
    //}
    //
    //function stopWatchingForChangeEventIE8() {
    //    if (!activeElement) {
    //        return;
    //    }
    //    activeElement.detachEvent('onchange', manualDispatchChangeEvent);
    //    activeElement = null;
    //    activeElementInst = null;
    //}

    function getTargetInstForChangeEvent(topLevelType, targetInst) {
        if (topLevelType === 'topChange') {
            return targetInst;
        }
    }

    //function handleEventsForChangeEventIE8(topLevelType, target, targetInst) {
    //    if (topLevelType === 'topFocus') {
    //        // stopWatching() should be a noop here but we call it just in case we
    //        // missed a blur event somehow.
    //        stopWatchingForChangeEventIE8();
    //        startWatchingForChangeEventIE8(target, targetInst);
    //    } else if (topLevelType === 'topBlur') {
    //        stopWatchingForChangeEventIE8();
    //    }
    //}

    /**
     * SECTION: handle `input` event
     */
    var isInputEventSupported = false;
    if (ExecutionEnvironment_1.canUseDOM) {
        // IE9 claims to support the input event but fails to trigger it when
        // deleting text, so we ignore its input events.
        // IE10+ fire input events to often, such when a placeholder
        // changes or when an input with a placeholder is focused.
        isInputEventSupported = isEventSupported('input') && (!document.documentMode || document.documentMode > 11);
    }

    /**
     * (For IE <=11) Replacement getter/setter for the `value` property that gets
     * set on the active element.
     */
    var newValueProp = {
        get: function get() {
            return activeElementValueProp.get.call(this);
        },
        set: function set(val) {
            // Cast to a string so we can do equality checks.
            activeElementValue = '' + val;
            activeElementValueProp.set.call(this, val);
        }
    };

    /**
     * (For IE <=11) Starts tracking propertychange events on the passed-in element
     * and override the value property so that we can distinguish user events from
     * value changes in JS.
     */
    function startWatchingForValueChange(target, targetInst) {
        activeElement = target;
        activeElementInst = targetInst;
        activeElementValue = target.value;
        activeElementValueProp = Object.getOwnPropertyDescriptor(target.constructor.prototype, 'value');

        // Not guarded in a canDefineProperty check: IE8 supports defineProperty only
        // on DOM elements
        Object.defineProperty(activeElement, 'value', newValueProp);
        if (activeElement.attachEvent) {
            activeElement.attachEvent('onpropertychange', handlePropertyChange);
        } else {
            activeElement.addEventListener('propertychange', handlePropertyChange, false);
        }
    }

    /**
     * (For IE <=11) Removes the event listeners from the currently-tracked element,
     * if any exists.
     */
    function stopWatchingForValueChange() {
        if (!activeElement) {
            return;
        }

        // delete restores the original property definition
        delete activeElement.value;

        if (activeElement.detachEvent) {
            activeElement.detachEvent('onpropertychange', handlePropertyChange);
        } else {
            activeElement.removeEventListener('propertychange', handlePropertyChange, false);
        }

        activeElement = null;
        activeElementInst = null;
        activeElementValue = null;
        activeElementValueProp = null;
    }

    /**
     * (For IE <=11) Handles a propertychange event, sending a `change` event if
     * the value of the active element has changed.
     */
    function handlePropertyChange(nativeEvent) {
        if (nativeEvent.propertyName !== 'value') {
            return;
        }
        var value = nativeEvent.srcElement.value;
        if (value === activeElementValue) {
            return;
        }
        activeElementValue = value;

        manualDispatchChangeEvent(nativeEvent);
    }

    /**
     * If a `change` event should be fired, returns the target's ID.
     */
    function getTargetInstForInputEvent(topLevelType, targetInst) {
        if (topLevelType === 'topInput') {
            // In modern browsers (i.e., not IE8 or IE9), the input event is exactly
            // what we want so fall through here and trigger an abstract event
            return targetInst;
        }
    }

    function handleEventsForInputEventIE(topLevelType, target, targetInst) {
        if (topLevelType === 'topFocus') {
            // In IE8, we can capture almost all .value changes by adding a
            // propertychange handler and looking for events with propertyName
            // equal to 'value'
            // In IE9-11, propertychange fires for most input events but is buggy and
            // doesn't fire when text is deleted, but conveniently, selectionchange
            // appears to fire in all of the remaining cases so we catch those and
            // forward the event if the value has changed
            // In either case, we don't want to call the event handler if the value
            // is changed from JS so we redefine a setter for `.value` that updates
            // our activeElementValue variable, allowing us to ignore those changes
            //
            // stopWatching() should be a noop here but we call it just in case we
            // missed a blur event somehow.
            stopWatchingForValueChange();
            startWatchingForValueChange(target, targetInst);
        } else if (topLevelType === 'topBlur') {
            stopWatchingForValueChange();
        }
    }

    // For IE8 and IE9.
    function getTargetInstForInputEventIE(topLevelType, targetInst) {
        if (topLevelType === 'topSelectionChange' || topLevelType === 'topKeyUp' || topLevelType === 'topKeyDown') {
            // On the selectionchange event, the target is just document which isn't
            // helpful for us so just check activeElement instead.
            //
            // 99% of the time, keydown and keyup aren't necessary. IE8 fails to fire
            // propertychange on the first input event after setting `value` from a
            // script and fires only keydown, keypress, keyup. Catching keyup usually
            // gets it and catching keydown lets us fire an event for the first
            // keystroke if user does a key repeat (it'll be a little delayed: right
            // before the second keystroke). Other input methods (e.g., paste) seem to
            // fire selectionchange normally.
            if (activeElement && activeElement.value !== activeElementValue) {
                activeElementValue = activeElement.value;
                return activeElementInst;
            }
        }
    }

    /**
     * SECTION: handle `click` event
     */
    function shouldUseClickEvent(elem) {
        // Use the `click` event to detect changes to checkbox and radio inputs.
        // This approach works across all browsers, whereas `change` does not fire
        // until `blur` in IE8.
        return elem.nodeName && elem.nodeName.toLowerCase() === 'input' && (elem.type === 'checkbox' || elem.type === 'radio');
    }

    function getTargetInstForClickEvent(topLevelType, targetInst) {
        if (topLevelType === 'topClick') {
            return targetInst;
        }
    }

    /**
     * This plugin creates an `onChange` event that normalizes change events
     * across form elements. This event fires at a time when it's possible to
     * change the element's value without seeing a flicker.
     *
     * Supported elements are:
     * - input (see `isTextInputElement`)
     * - textarea
     * - select
     */
    var ChangeEventPlugin = {

        eventTypes: eventTypes$1,

        extractEvents: function extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
            var targetNode = targetInst ? ReactDOMComponentTree.getNodeFromInstance(targetInst) : window;

            var getTargetInstFunc, handleEventFunc;
            if (shouldUseChangeEvent(targetNode)) {
                if (doesChangeEventBubble) {
                    getTargetInstFunc = getTargetInstForChangeEvent;
                } else {
                    //  handleEventFunc = handleEventsForChangeEventIE8;
                }
            } else if (isTextInputElement(targetNode)) {
                if (isInputEventSupported) {
                    getTargetInstFunc = getTargetInstForInputEvent;
                } else {
                    getTargetInstFunc = getTargetInstForInputEventIE;
                    handleEventFunc = handleEventsForInputEventIE;
                }
            } else if (shouldUseClickEvent(targetNode)) {
                getTargetInstFunc = getTargetInstForClickEvent;
            }

            if (getTargetInstFunc) {
                var inst = getTargetInstFunc(topLevelType, targetInst);
                if (inst) {
                    var event = SyntheticEvent.getPooled(eventTypes$1.change, inst, nativeEvent, nativeEventTarget);
                    event.type = 'change';
                    EventPropagators.accumulateTwoPhaseDispatches(event);
                    return event;
                }
            }

            if (handleEventFunc) {
                handleEventFunc(topLevelType, targetNode, targetInst);
            }
        }

    };

    /**
     * Module that is injectable into `EventPluginHub`, that specifies a
     * deterministic ordering of `EventPlugin`s. A convenient way to reason about
     * plugins, without having to package every one of them. This is better than
     * having plugins be ordered in the same order that they are injected because
     * that ordering would be influenced by the packaging order.
     * `ResponderEventPlugin` must occur before `SimpleEventPlugin` so that
     * preventing default on events is convenient in `SimpleEventPlugin` handlers.
     */

    var DefaultEventPluginOrder = ['ResponderEventPlugin', 'SimpleEventPlugin', 'TapEventPlugin', 'EnterLeaveEventPlugin', 'ChangeEventPlugin', 'SelectEventPlugin', 'BeforeInputEventPlugin'];

    /**
     * Return the lowest common ancestor of A and B, or null if they are in
     * different trees.
     */
    function getLowestCommonAncestor(instA, instB) {
        !('_hostNode' in instA) ? prodInvariant('33'): void 0;
        !('_hostNode' in instB) ? prodInvariant('33'): void 0;

        var depthA = 0;
        for (var tempA = instA; tempA; tempA = tempA._hostParent) {
            depthA++;
        }
        var depthB = 0;
        for (var tempB = instB; tempB; tempB = tempB._hostParent) {
            depthB++;
        }

        // If A is deeper, crawl up.
        while (depthA - depthB > 0) {
            instA = instA._hostParent;
            depthA--;
        }

        // If B is deeper, crawl up.
        while (depthB - depthA > 0) {
            instB = instB._hostParent;
            depthB--;
        }

        // Walk in lockstep until we find a match.
        var depth = depthA;
        while (depth--) {
            if (instA === instB) {
                return instA;
            }
            instA = instA._hostParent;
            instB = instB._hostParent;
        }
        return null;
    }

    /**
     * Return if A is an ancestor of B.
     */
    function isAncestor(instA, instB) {
        !('_hostNode' in instA) ? prodInvariant('35'): void 0;
        !('_hostNode' in instB) ? prodInvariant('35'): void 0;

        while (instB) {
            if (instB === instA) {
                return true;
            }
            instB = instB._hostParent;
        }
        return false;
    }

    /**
     * Return the parent instance of the passed-in instance.
     */
    function getParentInstance(inst) {
        !('_hostNode' in inst) ? prodInvariant('36'): void 0;

        return inst._hostParent;
    }

    /**
     * Simulates the traversal of a two-phase, capture/bubble event dispatch.
     */
    function traverseTwoPhase(inst, fn, arg) {
        var path = [];
        while (inst) {
            path.push(inst);
            inst = inst._hostParent;
        }
        var i;
        for (i = path.length; i-- > 0;) {
            fn(path[i], false, arg);
        }
        for (i = 0; i < path.length; i++) {
            fn(path[i], true, arg);
        }
    }

    /**
     * Traverses the ID hierarchy and invokes the supplied `cb` on any IDs that
     * should would receive a `mouseEnter` or `mouseLeave` event.
     *
     * Does not invoke the callback on the nearest common ancestor because nothing
     * "entered" or "left" that element.
     */
    function traverseEnterLeave(from, to, fn, argFrom, argTo) {
        var common = from && to ? getLowestCommonAncestor(from, to) : null;
        var pathFrom = [];
        while (from && from !== common) {
            pathFrom.push(from);
            from = from._hostParent;
        }
        var pathTo = [];
        while (to && to !== common) {
            pathTo.push(to);
            to = to._hostParent;
        }
        var i;
        for (i = 0; i < pathFrom.length; i++) {
            fn(pathFrom[i], true, argFrom);
        }
        for (i = pathTo.length; i-- > 0;) {
            fn(pathTo[i], false, argTo);
        }
    }

    var ReactDOMTreeTraversal = {
        isAncestor: isAncestor,
        getLowestCommonAncestor: getLowestCommonAncestor,
        getParentInstance: getParentInstance,
        traverseTwoPhase: traverseTwoPhase,
        traverseEnterLeave: traverseEnterLeave
    };

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     *
     * @typechecks
     */

    var emptyFunction$2 = __moduleExports$1;

    /**
     * Upstream version of event listener. Does not take into account specific
     * nature of platform.
     */
    var EventListener = {
        /**
         * Listen to DOM events during the bubble phase.
         *
         * @param {DOMEventTarget} target DOM element to register listener on.
         * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
         * @param {function} callback Callback function.
         * @return {object} Object with a `remove` method.
         */
        listen: function listen(target, eventType, callback) {
            if (target.addEventListener) {
                target.addEventListener(eventType, callback, false);
                return {
                    remove: function remove() {
                        target.removeEventListener(eventType, callback, false);
                    }
                };
            } else if (target.attachEvent) {
                target.attachEvent('on' + eventType, callback);
                return {
                    remove: function remove() {
                        target.detachEvent('on' + eventType, callback);
                    }
                };
            }
        },

        /**
         * Listen to DOM events during the capture phase.
         *
         * @param {DOMEventTarget} target DOM element to register listener on.
         * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
         * @param {function} callback Callback function.
         * @return {object} Object with a `remove` method.
         */
        capture: function capture(target, eventType, callback) {
            if (target.addEventListener) {
                target.addEventListener(eventType, callback, true);
                return {
                    remove: function remove() {
                        target.removeEventListener(eventType, callback, true);
                    }
                };
            } else {
                if ("production" !== 'production') {}
                return {
                    remove: emptyFunction$2
                };
            }
        },

        registerDefault: function registerDefault() {}
    };

    var EventListener_1 = EventListener;

    /**
     * Gets the scroll position of the supplied element or window.
     *
     * The return values are unbounded, unlike `getScrollPosition`. This means they
     * may be negative or exceed the element boundaries (which is possible using
     * inertial scrolling).
     *
     * @param {DOMWindow|DOMElement} scrollable
     * @return {object} Map with `x` and `y` keys.
     */

    function getUnboundedScrollPosition(scrollable) {
        if (scrollable === window) {
            return {
                x: window.pageXOffset || document.documentElement.scrollLeft,
                y: window.pageYOffset || document.documentElement.scrollTop
            };
        }
        return {
            x: scrollable.scrollLeft,
            y: scrollable.scrollTop
        };
    }

    var getUnboundedScrollPosition_1 = getUnboundedScrollPosition;

    /**
     * Find the deepest React component completely containing the root of the
     * passed-in instance (for use when entire React trees are nested within each
     * other). If React trees are not nested, returns null.
     */
    function findParent(inst) {
        // TODO: It may be a good idea to cache this to prevent unnecessary DOM
        // traversal, but caching is difficult to do correctly without using a
        // mutation observer to listen for all DOM changes.
        // while (inst._hostParent) {
        //   inst = inst._hostParent;
        // }
        inst = ReactDOMComponentTree.__buildCacheTree(inst._hostNode, !!'findParent');
        var rootNode = ReactDOMComponentTree.getNodeFromInstance(inst);
        var container = rootNode.parentNode;
        return ReactDOMComponentTree.getClosestInstanceFromNode(container);
    }

    // Used to store ancestor hierarchy in top level callback
    function TopLevelCallbackBookKeeping(topLevelType, nativeEvent) {
        this.topLevelType = topLevelType;
        this.nativeEvent = nativeEvent;
        this.ancestors = [];
    }
    index(TopLevelCallbackBookKeeping.prototype, {
        destructor: function destructor() {
            this.topLevelType = null;
            this.nativeEvent = null;
            this.ancestors.length = 0;
        }
    });
    PooledClass.addPoolingTo(TopLevelCallbackBookKeeping, PooledClass.twoArgumentPooler);

    function handleTopLevelImpl(bookKeeping) {
        var nativeEventTarget = getEventTarget(bookKeeping.nativeEvent);
        var targetInst = ReactDOMComponentTree.getClosestInstanceFromNode(nativeEventTarget);

        // Loop through the hierarchy, in case there's any nested components.
        // It's important that we build the array of ancestors before calling any
        // event handlers, because event handlers can modify the DOM, leading to
        // inconsistencies with ReactMount's node cache. See #1105.
        var ancestor = targetInst;
        do {
            bookKeeping.ancestors.push(ancestor);
            ancestor = ancestor && findParent(ancestor);
        } while (ancestor);

        for (var i = 0; i < bookKeeping.ancestors.length; i++) {
            targetInst = bookKeeping.ancestors[i];
            ReactEventListener._handleTopLevel(bookKeeping.topLevelType, targetInst, bookKeeping.nativeEvent, getEventTarget(bookKeeping.nativeEvent));
        }
    }

    function scrollValueMonitor(cb) {
        var scrollPosition = getUnboundedScrollPosition_1(window);
        cb(scrollPosition);
    }

    var ReactEventListener = {
        _enabled: true,
        _handleTopLevel: null,

        WINDOW_HANDLE: ExecutionEnvironment_1.canUseDOM ? window : null,

        setHandleTopLevel: function setHandleTopLevel(handleTopLevel) {
            ReactEventListener._handleTopLevel = handleTopLevel;
        },

        setEnabled: function setEnabled(enabled) {
            ReactEventListener._enabled = !!enabled;
        },

        isEnabled: function isEnabled() {
            return ReactEventListener._enabled;
        },

        /**
         * Traps top-level events by using event bubbling.
         *
         * @param {string} topLevelType Record from `EventConstants`.
         * @param {string} handlerBaseName Event name (e.g. "click").
         * @param {object} handle Element on which to attach listener.
         * @return {?object} An object with a remove function which will forcefully
         *                  remove the listener.
         * @internal
         */
        trapBubbledEvent: function trapBubbledEvent(topLevelType, handlerBaseName, handle) {
            var element = handle;
            if (!element) {
                return null;
            }
            return EventListener_1.listen(element, handlerBaseName, ReactEventListener.dispatchEvent.bind(null, topLevelType));
        },

        /**
         * Traps a top-level event by using event capturing.
         *
         * @param {string} topLevelType Record from `EventConstants`.
         * @param {string} handlerBaseName Event name (e.g. "click").
         * @param {object} handle Element on which to attach listener.
         * @return {?object} An object with a remove function which will forcefully
         *                  remove the listener.
         * @internal
         */
        trapCapturedEvent: function trapCapturedEvent(topLevelType, handlerBaseName, handle) {
            var element = handle;
            if (!element) {
                return null;
            }
            return EventListener_1.capture(element, handlerBaseName, ReactEventListener.dispatchEvent.bind(null, topLevelType));
        },

        monitorScrollValue: function monitorScrollValue(refresh) {
            var callback = scrollValueMonitor.bind(null, refresh);
            EventListener_1.listen(window, 'scroll', callback);
        },

        dispatchEvent: function dispatchEvent(topLevelType, nativeEvent) {
            if (!ReactEventListener._enabled) {
                return;
            }

            var bookKeeping = TopLevelCallbackBookKeeping.getPooled(topLevelType, nativeEvent);
            try {
                // Event queue being processed in the same cycle allows
                // `preventDefault`.
                // ReactUpdates.batchedUpdates(handleTopLevelImpl, bookKeeping);
                handleTopLevelImpl(bookKeeping);
            } finally {
                TopLevelCallbackBookKeeping.release(bookKeeping);
            }
        }
    };

    /**
     * Given any node return the first leaf node without children.
     *
     * @param {DOMElement|DOMTextNode} node
     * @return {DOMElement|DOMTextNode}
     */

    function getLeafNode(node) {
        while (node && node.firstChild) {
            node = node.firstChild;
        }
        return node;
    }

    /**
     * Get the next sibling within a container. This will walk up the
     * DOM if a node's siblings have been exhausted.
     *
     * @param {DOMElement|DOMTextNode} node
     * @return {?DOMElement|DOMTextNode}
     */
    function getSiblingNode(node) {
        while (node) {
            if (node.nextSibling) {
                return node.nextSibling;
            }
            node = node.parentNode;
        }
    }

    /**
     * Get object describing the nodes which contain characters at offset.
     *
     * @param {DOMElement|DOMTextNode} root
     * @param {number} offset
     * @return {?object}
     */
    function getNodeForCharacterOffset(root, offset) {
        var node = getLeafNode(root);
        var nodeStart = 0;
        var nodeEnd = 0;

        while (node) {
            if (node.nodeType === 3) {
                nodeEnd = nodeStart + node.textContent.length;

                if (nodeStart <= offset && nodeEnd >= offset) {
                    return {
                        node: node,
                        offset: offset - nodeStart
                    };
                }

                nodeStart = nodeEnd;
            }

            node = getLeafNode(getSiblingNode(node));
        }
    }

    var getTextContentAccessor = function getTextContentAccessor() {
        return 'textContent';
    };

    /**
     * While `isCollapsed` is available on the Selection object and `collapsed`
     * is available on the Range object, IE11 sometimes gets them wrong.
     * If the anchor/focus nodes and offsets are the same, the range is collapsed.
     */
    function isCollapsed(anchorNode, anchorOffset, focusNode, focusOffset) {
        return anchorNode === focusNode && anchorOffset === focusOffset;
    }

    /**
     * @param {DOMElement} node
     * @return {?object}
     */
    function getModernOffsets(node) {
        var selection = window.getSelection && window.getSelection();

        if (!selection || selection.rangeCount === 0) {
            return null;
        }

        var anchorNode = selection.anchorNode;
        var anchorOffset = selection.anchorOffset;
        var focusNode = selection.focusNode;
        var focusOffset = selection.focusOffset;

        var currentRange = selection.getRangeAt(0);

        // In Firefox, range.startContainer and range.endContainer can be "anonymous
        // divs", e.g. the up/down buttons on an <input type="number">. Anonymous
        // divs do not seem to expose properties, triggering a "Permission denied
        // error" if any of its properties are accessed. The only seemingly possible
        // way to avoid erroring is to access a property that typically works for
        // non-anonymous divs and catch any error that may otherwise arise. See
        // https://bugzilla.mozilla.org/show_bug.cgi?id=208427
        try {
            /* eslint-disable no-unused-expressions */
            currentRange.startContainer.nodeType;
            currentRange.endContainer.nodeType;
            /* eslint-enable no-unused-expressions */
        } catch (e) {
            return null;
        }

        // If the node and offset values are the same, the selection is collapsed.
        // `Selection.isCollapsed` is available natively, but IE sometimes gets
        // this value wrong.
        var isSelectionCollapsed = isCollapsed(selection.anchorNode, selection.anchorOffset, selection.focusNode, selection.focusOffset);

        var rangeLength = isSelectionCollapsed ? 0 : currentRange.toString().length;

        var tempRange = currentRange.cloneRange();
        tempRange.selectNodeContents(node);
        tempRange.setEnd(currentRange.startContainer, currentRange.startOffset);

        var isTempRangeCollapsed = isCollapsed(tempRange.startContainer, tempRange.startOffset, tempRange.endContainer, tempRange.endOffset);

        var start = isTempRangeCollapsed ? 0 : tempRange.toString().length;
        var end = start + rangeLength;

        // Detect whether the selection is backward.
        var detectionRange = document.createRange();
        detectionRange.setStart(anchorNode, anchorOffset);
        detectionRange.setEnd(focusNode, focusOffset);
        var isBackward = detectionRange.collapsed;

        return {
            start: isBackward ? end : start,
            end: isBackward ? start : end
        };
    }

    /**
     * In modern non-IE browsers, we can support both forward and backward
     * selections.
     *
     * Note: IE10+ supports the Selection object, but it does not support
     * the `extend` method, which means that even in modern IE, it's not possible
     * to programmatically create a backward selection. Thus, for all IE
     * versions, we use the old IE API to create our selections.
     *
     * @param {DOMElement|DOMTextNode} node
     * @param {object} offsets
     */
    function setModernOffsets(node, offsets) {
        if (!window.getSelection) {
            return;
        }

        var selection = window.getSelection();
        var length = node[getTextContentAccessor()].length;
        var start = Math.min(offsets.start, length);
        var end = offsets.end === undefined ? start : Math.min(offsets.end, length);

        // IE 11 uses modern selection, but doesn't support the extend method.
        // Flip backward selections, so we can set with a single range.
        if (!selection.extend && start > end) {
            var temp = end;
            end = start;
            start = temp;
        }

        var startMarker = getNodeForCharacterOffset(node, start);
        var endMarker = getNodeForCharacterOffset(node, end);

        if (startMarker && endMarker) {
            var range = document.createRange();
            range.setStart(startMarker.node, startMarker.offset);
            selection.removeAllRanges();

            if (start > end) {
                selection.addRange(range);
                selection.extend(endMarker.node, endMarker.offset);
            } else {
                range.setEnd(endMarker.node, endMarker.offset);
                selection.addRange(range);
            }
        }
    }

    // var useIEOffsets = ExecutionEnvironment.canUseDOM && 'selection' in document && !('getSelection' in window);

    var ReactDOMSelection = {
        /**
         * @param {DOMElement} node
         */
        getOffsets: getModernOffsets, //useIEOffsets ? getIEOffsets : getModernOffsets,

        /**
         * @param {DOMElement|DOMTextNode} node
         * @param {object} offsets
         */
        setOffsets: setModernOffsets //useIEOffsets ? setIEOffsets : setModernOffsets
    };

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * @typechecks
     */

    /**
     * @param {*} object The object to check.
     * @return {boolean} Whether or not the object is a DOM node.
     */
    function isNode$1(object) {
        return !!(object && (typeof Node === 'function' ? object instanceof Node : typeof object === 'object' && typeof object.nodeType === 'number' && typeof object.nodeName === 'string'));
    }

    var __moduleExports$3 = isNode$1;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * @typechecks
     */

    var isNode = __moduleExports$3;

    /**
     * @param {*} object The object to check.
     * @return {boolean} Whether or not the object is a DOM text node.
     */
    function isTextNode$1(object) {
        return isNode(object) && object.nodeType == 3;
    }

    var __moduleExports$2 = isTextNode$1;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * 
     */

    var isTextNode = __moduleExports$2;

    /*eslint-disable no-bitwise */

    /**
     * Checks if a given DOM node contains or is another DOM node.
     */
    function containsNode(outerNode, innerNode) {
        if (!outerNode || !innerNode) {
            return false;
        } else if (outerNode === innerNode) {
            return true;
        } else if (isTextNode(outerNode)) {
            return false;
        } else if (isTextNode(innerNode)) {
            return containsNode(outerNode, innerNode.parentNode);
        } else if ('contains' in outerNode) {
            return outerNode.contains(innerNode);
        } else if (outerNode.compareDocumentPosition) {
            return !!(outerNode.compareDocumentPosition(innerNode) & 16);
        } else {
            return false;
        }
    }

    var containsNode_1 = containsNode;

    /**
     * @param {DOMElement} node input/textarea to focus
     */

    function focusNode(node) {
        // IE8 can throw "Can't move focus to the control because it is invisible,
        // not enabled, or of a type that does not accept the focus." for all kinds of
        // reasons that are too expensive and fragile to test.
        try {
            node.focus();
        } catch (e) {}
    }

    var focusNode_1 = focusNode;

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * @typechecks
     */

    /* eslint-disable fb-www/typeof-undefined */

    /**
     * Same as document.activeElement but wraps in a try-catch block. In IE it is
     * not safe to call document.activeElement if there is nothing focused.
     *
     * The activeElement will be null only if the document or document body is not
     * yet defined.
     */
    function getActiveElement() /*?DOMElement*/ {
        if (typeof document === 'undefined') {
            return null;
        }
        try {
            return document.activeElement || document.body;
        } catch (e) {
            return document.body;
        }
    }

    var getActiveElement_1 = getActiveElement;

    function isInDocument(node) {
        return containsNode_1(document.documentElement, node);
    }

    /**
     * @ReactInputSelection: React input selection module. Based on Selection.js,
     * but modified to be suitable for react and has a couple of bug fixes (doesn't
     * assume buttons have range selections allowed).
     * Input selection module for React.
     */
    var ReactInputSelection = {

        hasSelectionCapabilities: function hasSelectionCapabilities(elem) {
            var nodeName = elem && elem.nodeName && elem.nodeName.toLowerCase();
            return nodeName && (nodeName === 'input' && elem.type === 'text' || nodeName === 'textarea' || elem.contentEditable === 'true');
        },

        getSelectionInformation: function getSelectionInformation() {
            var focusedElem = getActiveElement_1();
            return {
                focusedElem: focusedElem,
                selectionRange: ReactInputSelection.hasSelectionCapabilities(focusedElem) ? ReactInputSelection.getSelection(focusedElem) : null
            };
        },

        /**
         * @restoreSelection: If any selection information was potentially lost,
         * restore it. This is useful when performing operations that could remove dom
         * nodes and place them back in, resulting in focus being lost.
         */
        restoreSelection: function restoreSelection(priorSelectionInformation) {
            var curFocusedElem = getActiveElement_1();
            var priorFocusedElem = priorSelectionInformation.focusedElem;
            var priorSelectionRange = priorSelectionInformation.selectionRange;
            if (curFocusedElem !== priorFocusedElem && isInDocument(priorFocusedElem)) {
                if (ReactInputSelection.hasSelectionCapabilities(priorFocusedElem)) {
                    ReactInputSelection.setSelection(priorFocusedElem, priorSelectionRange);
                }
                focusNode_1(priorFocusedElem);
            }
        },

        /**
         * @getSelection: Gets the selection bounds of a focused textarea, input or
         * contentEditable node.
         * -@input: Look up selection bounds of this input
         * -@return {start: selectionStart, end: selectionEnd}
         */
        getSelection: function getSelection(input) {
            var selection;

            if ('selectionStart' in input) {
                // Modern browser with input or textarea.
                selection = {
                    start: input.selectionStart,
                    end: input.selectionEnd
                };
            } else if (document.selection && input.nodeName && input.nodeName.toLowerCase() === 'input') {
                // IE8 input.
                var range = document.selection.createRange();
                // There can only be one selection per document in IE, so it must
                // be in our element.
                if (range.parentElement() === input) {
                    selection = {
                        start: -range.moveStart('character', -input.value.length),
                        end: -range.moveEnd('character', -input.value.length)
                    };
                }
            } else {
                // Content editable or old IE textarea.
                selection = ReactDOMSelection.getOffsets(input);
            }

            return selection || { start: 0, end: 0 };
        },

        /**
         * @setSelection: Sets the selection bounds of a textarea or input and focuses
         * the input.
         * -@input     Set selection bounds of this input or textarea
         * -@offsets   Object of same form that is returned from get*
         */
        setSelection: function setSelection(input, offsets) {
            var start = offsets.start;
            var end = offsets.end;
            if (end === undefined) {
                end = start;
            }

            if ('selectionStart' in input) {
                input.selectionStart = start;
                input.selectionEnd = Math.min(end, input.value.length);
            } else if (document.selection && input.nodeName && input.nodeName.toLowerCase() === 'input') {
                var range = input.createTextRange();
                range.collapse(true);
                range.moveStart('character', start);
                range.moveEnd('character', end - start);
                range.select();
            } else {
                ReactDOMSelection.setOffsets(input, offsets);
            }
        }
    };

    var hasOwnProperty$1 = Object.prototype.hasOwnProperty;

    /**
     * inlined Object.is polyfill to avoid requiring consumers ship their own
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
     */
    function is(x, y) {
        // SameValue algorithm
        if (x === y) {
            // Steps 1-5, 7-10
            // Steps 6.b-6.e: +0 != -0
            // Added the nonzero y check to make Flow happy, but it is redundant
            return x !== 0 || y !== 0 || 1 / x === 1 / y;
        } else {
            // Step 6.a: NaN == NaN
            return x !== x && y !== y;
        }
    }

    /**
     * Performs equality by iterating through keys on an object and returning false
     * when any key has values which are not strictly equal between the arguments.
     * Returns true when the values of all keys are strictly equal.
     */
    function shallowEqual(objA, objB) {
        if (is(objA, objB)) {
            return true;
        }

        if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
            return false;
        }

        var keysA = Object.keys(objA);
        var keysB = Object.keys(objB);

        if (keysA.length !== keysB.length) {
            return false;
        }

        // Test for A's keys different from B.
        for (var i = 0; i < keysA.length; i++) {
            if (!hasOwnProperty$1.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
                return false;
            }
        }

        return true;
    }

    var shallowEqual_1 = shallowEqual;

    var topLevelTypes$2 = EventConstants.topLevelTypes;

    var skipSelectionChangeEvent = ExecutionEnvironment_1.canUseDOM && 'documentMode' in document && document.documentMode <= 11;

    var eventTypes$2 = {
        select: {
            phasedRegistrationNames: {
                bubbled: 'onSelect',
                captured: 'onSelectCapture'
            },
            dependencies: [topLevelTypes$2.topBlur, topLevelTypes$2.topContextMenu, topLevelTypes$2.topFocus, topLevelTypes$2.topKeyDown, topLevelTypes$2.topKeyUp, topLevelTypes$2.topMouseDown, topLevelTypes$2.topMouseUp, topLevelTypes$2.topSelectionChange]
        }
    };

    var activeElement$1 = null;
    var activeElementInst$1 = null;
    var lastSelection = null;
    var mouseDown = false;

    // Track whether a listener exists for this plugin. If none exist, we do
    // not extract events. See #3639.
    var hasListener = false;
    var ON_SELECT_KEY = 'onSelect';

    /**
     * Get an object which is a unique representation of the current selection.
     *
     * The return value will not be consistent across nodes or browsers, but
     * two identical selections on the same node will return identical objects.
     *
     * @param {DOMElement} node
     * @return {object}
     */
    function getSelection(node) {
        if ('selectionStart' in node && ReactInputSelection.hasSelectionCapabilities(node)) {
            return {
                start: node.selectionStart,
                end: node.selectionEnd
            };
        } else if (window.getSelection) {
            var selection = window.getSelection();
            return {
                anchorNode: selection.anchorNode,
                anchorOffset: selection.anchorOffset,
                focusNode: selection.focusNode,
                focusOffset: selection.focusOffset
            };
        }
    }

    /**
     * Poll selection to see whether it's changed.
     *
     * @param {object} nativeEvent
     * @return {?SyntheticEvent}
     */
    function constructSelectEvent(nativeEvent, nativeEventTarget) {
        // Ensure we have the right element, and that the user is not dragging a
        // selection (this matches native `select` event behavior). In HTML5, select
        // fires only on input and textarea thus if there's no focused element we
        // won't dispatch.
        if (mouseDown || activeElement$1 == null || activeElement$1 !== getActiveElement_1()) {
            return null;
        }

        // Only fire when selection has actually changed.
        var currentSelection = getSelection(activeElement$1);
        if (!lastSelection || !shallowEqual_1(lastSelection, currentSelection)) {
            lastSelection = currentSelection;

            var syntheticEvent = SyntheticEvent.getPooled(eventTypes$2.select, activeElementInst$1, nativeEvent, nativeEventTarget);

            syntheticEvent.type = 'select';
            syntheticEvent.target = activeElement$1;

            EventPropagators.accumulateTwoPhaseDispatches(syntheticEvent);

            return syntheticEvent;
        }

        return null;
    }

    /**
     * This plugin creates an `onSelect` event that normalizes select events
     * across form elements.
     *
     * Supported elements are:
     * - input (see `isTextInputElement`)
     * - textarea
     * - contentEditable
     *
     * This differs from native browser implementations in the following ways:
     * - Fires on contentEditable fields as well as inputs.
     * - Fires for collapsed selection.
     * - Fires after user input.
     */
    var SelectEventPlugin = {

        eventTypes: eventTypes$2,

        extractEvents: function extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
            if (!hasListener) {
                return null;
            }

            var targetNode = targetInst ? ReactDOMComponentTree.getNodeFromInstance(targetInst) : window;

            switch (topLevelType) {
                // Track the input node that has focus.
                case topLevelTypes$2.topFocus:
                    if (isTextInputElement(targetNode) || targetNode.contentEditable === 'true') {
                        activeElement$1 = targetNode;
                        activeElementInst$1 = targetInst;
                        lastSelection = null;
                    }
                    break;
                case topLevelTypes$2.topBlur:
                    activeElement$1 = null;
                    activeElementInst$1 = null;
                    lastSelection = null;
                    break;

                    // Don't fire the event while the user is dragging. This matches the
                    // semantics of the native select event.
                case topLevelTypes$2.topMouseDown:
                    mouseDown = true;
                    break;
                case topLevelTypes$2.topContextMenu:
                case topLevelTypes$2.topMouseUp:
                    mouseDown = false;
                    return constructSelectEvent(nativeEvent, nativeEventTarget);

                    // Chrome and IE fire non-standard event when selection is changed (and
                    // sometimes when it hasn't). IE's event fires out of order with respect
                    // to key and input events on deletion, so we discard it.
                    //
                    // Firefox doesn't support selectionchange, so check selection status
                    // after each key entry. The selection changes after keydown and before
                    // keyup, but we check on keydown as well in the case of holding down a
                    // key, when multiple keydown events are fired but only one keyup is.
                    // This is also our approach for IE handling, for the reason above.
                case topLevelTypes$2.topSelectionChange:
                    if (skipSelectionChangeEvent) {
                        break;
                    }
                    // falls through
                case topLevelTypes$2.topKeyDown:
                case topLevelTypes$2.topKeyUp:
                    return constructSelectEvent(nativeEvent, nativeEventTarget);
            }

            return null;
        },

        didPutListener: function didPutListener(inst, registrationName, listener) {
            if (registrationName === ON_SELECT_KEY) {
                hasListener = true;
            }
        }
    };

    //var ViewportMetrics = require('./ViewportMetrics');
    //
    //var getEventModifierState = require('./getEventModifierState');

    /**
     * @interface MouseEvent
     * @see http://www.w3.org/TR/DOM-Level-3-Events/
     */
    var MouseEventInterface = {
        //  screenX: null,
        //  screenY: null,
        //  clientX: null,
        //  clientY: null,
        //  ctrlKey: null,
        //  shiftKey: null,
        //  altKey: null,
        //  metaKey: null,
        //  getModifierState: getEventModifierState,
        button: function button(event) {
            // Webkit, Firefox, IE9+
            // which:  1 2 3
            // button: 0 1 2 (standard)
            var button = event.button;
            if ('which' in event) {
                return button;
            }
            // IE<9
            // which:  undefined
            // button: 0 0 0
            // button: 1 4 2 (onmouseup)
            return button === 2 ? 2 : button === 4 ? 1 : 0;
        }
    };

    /**
     * @param {object} dispatchConfig Configuration used to dispatch this event.
     * @param {string} dispatchMarker Marker identifying the event target.
     * @param {object} nativeEvent Native browser event.
     * @extends {SyntheticUIEvent}
     */
    function SyntheticMouseEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
        return SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticEvent.augmentClass(SyntheticMouseEvent, MouseEventInterface);

    /**
     * `charCode` represents the actual "character code" and is safe to use with
     * `String.fromCharCode`. As such, only keys that correspond to printable
     * characters produce a valid `charCode`, the only exception to this is Enter.
     * The Tab-key is considered non-printable and does not have a `charCode`,
     * presumably because it does not produce a tab-character in browsers.
     *
     * @param {object} nativeEvent Native browser event.
     * @return {number} Normalized `charCode` property.
     */

    function getEventCharCode(nativeEvent) {
        var charCode;
        var keyCode = nativeEvent.keyCode;

        if ('charCode' in nativeEvent) {
            charCode = nativeEvent.charCode;

            // FF does not set `charCode` for the Enter-key, check against `keyCode`.
            if (charCode === 0 && keyCode === 13) {
                charCode = 13;
            }
        } else {
            // IE8 does not implement `charCode`, but `keyCode` has the correct value.
            charCode = keyCode;
        }

        // Some non-printable keys are reported in `charCode`/`keyCode`, discard them.
        // Must not discard the (non-)printable Enter-key.
        if (charCode >= 32 || charCode === 13) {
            return charCode;
        }

        return 0;
    }

    /**
     * Normalization of deprecated HTML5 `key` values
     * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
     */
    var normalizeKey = {
        'Esc': 'Escape',
        'Spacebar': ' ',
        'Left': 'ArrowLeft',
        'Up': 'ArrowUp',
        'Right': 'ArrowRight',
        'Down': 'ArrowDown',
        'Del': 'Delete',
        'Win': 'OS',
        'Menu': 'ContextMenu',
        'Apps': 'ContextMenu',
        'Scroll': 'ScrollLock',
        'MozPrintableKey': 'Unidentified'
    };

    /**
     * Translation from legacy `keyCode` to HTML5 `key`
     * Only special keys supported, all others depend on keyboard layout or browser
     * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
     */
    var translateToKey = {
        8: 'Backspace',
        9: 'Tab',
        12: 'Clear',
        13: 'Enter',
        16: 'Shift',
        17: 'Control',
        18: 'Alt',
        19: 'Pause',
        20: 'CapsLock',
        27: 'Escape',
        32: ' ',
        33: 'PageUp',
        34: 'PageDown',
        35: 'End',
        36: 'Home',
        37: 'ArrowLeft',
        38: 'ArrowUp',
        39: 'ArrowRight',
        40: 'ArrowDown',
        45: 'Insert',
        46: 'Delete',
        112: 'F1',
        113: 'F2',
        114: 'F3',
        115: 'F4',
        116: 'F5',
        117: 'F6',
        118: 'F7',
        119: 'F8',
        120: 'F9',
        121: 'F10',
        122: 'F11',
        123: 'F12',
        144: 'NumLock',
        145: 'ScrollLock',
        224: 'Meta'
    };

    /**
     * @param {object} nativeEvent Native browser event.
     * @return {string} Normalized `key` property.
     */
    function getEventKey(nativeEvent) {
        if (nativeEvent.key) {
            // Normalize inconsistent values reported by browsers due to
            // implementations of a working draft specification.

            // FireFox implements `key` but returns `MozPrintableKey` for all
            // printable characters (normalized to `Unidentified`), ignore it.
            var key = normalizeKey[nativeEvent.key] || nativeEvent.key;
            if (key !== 'Unidentified') {
                return key;
            }
        }

        // Browser does not implement `key`, polyfill as much of it as we can.
        if (nativeEvent.type === 'keypress') {
            var charCode = getEventCharCode(nativeEvent);

            // The enter-key is technically both printable and non-printable and can
            // thus be captured by `keypress`, no other non-printable key should.
            return charCode === 13 ? 'Enter' : String.fromCharCode(charCode);
        }
        if (nativeEvent.type === 'keydown' || nativeEvent.type === 'keyup') {
            // While user keyboard layout determines the actual meaning of each
            // `keyCode` value, almost all function keys have a universal value.
            return translateToKey[nativeEvent.keyCode] || 'Unidentified';
        }
        return '';
    }

    /**
     * Translation from modifier key to the associated property in the event.
     * @see http://www.w3.org/TR/DOM-Level-3-Events/#keys-Modifiers
     */

    var modifierKeyToProp = {
        'Alt': 'altKey',
        'Control': 'ctrlKey',
        'Meta': 'metaKey',
        'Shift': 'shiftKey'
    };

    // IE8 does not implement getModifierState so we simply map it to the only
    // modifier keys exposed by the event itself, does not support Lock-keys.
    // Currently, all major browsers except Chrome seems to support Lock-keys.
    function modifierStateGetter(keyArg) {
        var syntheticEvent = this;
        var nativeEvent = syntheticEvent.nativeEvent;
        if (nativeEvent.getModifierState) {
            return nativeEvent.getModifierState(keyArg);
        }
        var keyProp = modifierKeyToProp[keyArg];
        return keyProp ? !!nativeEvent[keyProp] : false;
    }

    function getEventModifierState(nativeEvent) {
        return modifierStateGetter;
    }

    /**
     * @interface KeyboardEvent
     * @see http://www.w3.org/TR/DOM-Level-3-Events/
     */
    var KeyboardEventInterface = {
        key: getEventKey,
        //  location: null,
        //  ctrlKey: null,
        //  shiftKey: null,
        //  altKey: null,
        //  metaKey: null,
        //  repeat: null,
        //  locale: null,
        getModifierState: getEventModifierState
    };

    /**
     * @param {object} dispatchConfig Configuration used to dispatch this event.
     * @param {string} dispatchMarker Marker identifying the event target.
     * @param {object} nativeEvent Native browser event.
     * @extends {SyntheticUIEvent}
     */
    function SyntheticKeyboardEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
        return SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticEvent.augmentClass(SyntheticKeyboardEvent, KeyboardEventInterface);

    /**
     * @interface Event
     * @see http://www.w3.org/TR/clipboard-apis/
     */
    var ClipboardEventInterface = {
        clipboardData: function clipboardData(event) {
            return 'clipboardData' in event ? event.clipboardData : window.clipboardData;
        }
    };

    /**
     * @param {object} dispatchConfig Configuration used to dispatch this event.
     * @param {string} dispatchMarker Marker identifying the event target.
     * @param {object} nativeEvent Native browser event.
     * @extends {SyntheticUIEvent}
     */
    function SyntheticClipboardEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
        return SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticEvent.augmentClass(SyntheticClipboardEvent, ClipboardEventInterface);

    /**
     * @interface WheelEvent
     * @see http://www.w3.org/TR/DOM-Level-3-Events/
     */
    var WheelEventInterface = {
        deltaX: function deltaX(event) {
            return 'deltaX' in event ? event.deltaX :
                // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
                'wheelDeltaX' in event ? -event.wheelDeltaX : 0;
        },
        deltaY: function deltaY(event) {
            return 'deltaY' in event ? event.deltaY :
                // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
                'wheelDeltaY' in event ? -event.wheelDeltaY :
                // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
                'wheelDelta' in event ? -event.wheelDelta : 0;
        },
        deltaZ: null,

        // Browsers without "deltaMode" is reporting in raw wheel delta where one
        // notch on the scroll is always +/- 120, roughly equivalent to pixels.
        // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
        // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
        deltaMode: null
    };

    /**
     * @param {object} dispatchConfig Configuration used to dispatch this event.
     * @param {string} dispatchMarker Marker identifying the event target.
     * @param {object} nativeEvent Native browser event.
     * @extends {SyntheticMouseEvent}
     */
    function SyntheticWheelEvent(dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget) {
        return SyntheticMouseEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent, nativeEventTarget);
    }

    SyntheticMouseEvent.augmentClass(SyntheticWheelEvent, WheelEventInterface);

    var topLevelTypes$3 = EventConstants.topLevelTypes;

    var eventTypes$3 = {};

    var topLevelEventsToDispatchConfig = [];
    Array('abort', 'animationEnd', 'animationIteration', 'animationStart', 'blur', 'canPlay', 'canPlayThrough', 'click', 'contextMenu', 'copy', 'cut', 'doubleClick', 'drag', 'dragEnd', 'dragEnter', 'dragExit', 'dragLeave', 'dragOver', 'dragStart', 'drop', 'durationChange', 'emptied', 'encrypted', 'ended', 'error', 'focus', 'input', 'invalid', 'keyDown', 'keyPress', 'keyUp', 'load', 'loadedData', 'loadedMetadata', 'loadStart', 'mouseDown', 'mouseMove', 'mouseOut', 'mouseOver', 'mouseUp', 'paste', 'pause', 'play', 'playing', 'progress', 'rateChange', 'reset', 'scroll', 'seeked', 'seeking', 'stalled', 'submit', 'suspend', 'timeUpdate', 'touchCancel', 'touchEnd', 'touchMove', 'touchStart', 'transitionEnd', 'volumeChange', 'waiting', 'wheel').forEach(function(event) {
        var capitalizedEvent = event[0].toUpperCase() + event.slice(1);
        var onEvent = 'on' + capitalizedEvent;
        var topEvent = 'top' + capitalizedEvent;

        var type = {
            phasedRegistrationNames: {
                bubbled: onEvent,
                captured: onEvent + 'Capture'
            },
            dependencies: [topEvent]
        };
        eventTypes$3[event] = type;
        topLevelEventsToDispatchConfig[topEvent] = type;
    });

    var ON_CLICK_KEY = 'onClick';
    var onClickListeners = {};

    function getDictionaryKey$1(inst) {
        // Prevents V8 performance issue:
        // https://github.com/facebook/react/pull/7232
        return '.' + inst._rootNodeID;
    }

    var SimpleEventPlugin = {

        eventTypes: eventTypes$3,

        extractEvents: function extractEvents(topLevelType, targetInst, nativeEvent, nativeEventTarget) {
            var dispatchConfig = topLevelEventsToDispatchConfig[topLevelType];
            if (!dispatchConfig) {
                return null;
            }
            var EventConstructor;
            switch (topLevelType) {
                case topLevelTypes$3.topAbort:
                case topLevelTypes$3.topCanPlay:
                case topLevelTypes$3.topCanPlayThrough:
                case topLevelTypes$3.topDurationChange:
                case topLevelTypes$3.topEmptied:
                case topLevelTypes$3.topEncrypted:
                case topLevelTypes$3.topEnded:
                case topLevelTypes$3.topError:
                case topLevelTypes$3.topInput:
                case topLevelTypes$3.topInvalid:
                case topLevelTypes$3.topLoad:
                case topLevelTypes$3.topLoadedData:
                case topLevelTypes$3.topLoadedMetadata:
                case topLevelTypes$3.topLoadStart:
                case topLevelTypes$3.topPause:
                case topLevelTypes$3.topPlay:
                case topLevelTypes$3.topPlaying:
                case topLevelTypes$3.topProgress:
                case topLevelTypes$3.topRateChange:
                case topLevelTypes$3.topReset:
                case topLevelTypes$3.topSeeked:
                case topLevelTypes$3.topSeeking:
                case topLevelTypes$3.topStalled:
                case topLevelTypes$3.topSubmit:
                case topLevelTypes$3.topSuspend:
                case topLevelTypes$3.topTimeUpdate:
                case topLevelTypes$3.topVolumeChange:
                case topLevelTypes$3.topWaiting:
                    // HTML Events
                    // @see http://www.w3.org/TR/html5/index.html#events-0
                    EventConstructor = SyntheticEvent;
                    break;
                case topLevelTypes$3.topKeyPress:
                    // Firefox creates a keypress event for function keys too. This removes
                    // the unwanted keypress events. Enter is however both printable and
                    // non-printable. One would expect Tab to be as well (but it isn't).
                    if (getEventCharCode(nativeEvent) === 0) {
                        return null;
                    }
                    /* falls through */
                case topLevelTypes$3.topKeyDown:
                case topLevelTypes$3.topKeyUp:
                    EventConstructor = SyntheticKeyboardEvent;
                    break;
                case topLevelTypes$3.topBlur:
                case topLevelTypes$3.topFocus:
                    EventConstructor = SyntheticEvent;
                    break;
                case topLevelTypes$3.topClick:
                    // Firefox creates a click event on right mouse clicks. This removes the
                    // unwanted click events.
                    if (nativeEvent.button === 2) {
                        return null;
                    }
                    /* falls through */
                case topLevelTypes$3.topContextMenu:
                case topLevelTypes$3.topDoubleClick:
                case topLevelTypes$3.topMouseDown:
                case topLevelTypes$3.topMouseMove:
                case topLevelTypes$3.topMouseOut:
                case topLevelTypes$3.topMouseOver:
                case topLevelTypes$3.topMouseUp:
                    EventConstructor = SyntheticMouseEvent;
                    break;
                case topLevelTypes$3.topDrag:
                case topLevelTypes$3.topDragEnd:
                case topLevelTypes$3.topDragEnter:
                case topLevelTypes$3.topDragExit:
                case topLevelTypes$3.topDragLeave:
                case topLevelTypes$3.topDragOver:
                case topLevelTypes$3.topDragStart:
                case topLevelTypes$3.topDrop:
                    EventConstructor = SyntheticMouseEvent;
                    break;
                case topLevelTypes$3.topTouchCancel:
                case topLevelTypes$3.topTouchEnd:
                case topLevelTypes$3.topTouchMove:
                case topLevelTypes$3.topTouchStart:
                    EventConstructor = SyntheticEvent;
                    break;
                case topLevelTypes$3.topAnimationEnd:
                case topLevelTypes$3.topAnimationIteration:
                case topLevelTypes$3.topAnimationStart:
                    EventConstructor = SyntheticEvent;
                    break;
                case topLevelTypes$3.topTransitionEnd:
                    EventConstructor = SyntheticEvent;
                    break;
                case topLevelTypes$3.topScroll:
                    EventConstructor = SyntheticEvent;
                    break;
                case topLevelTypes$3.topWheel:
                    EventConstructor = SyntheticWheelEvent;
                    break;
                case topLevelTypes$3.topCopy:
                case topLevelTypes$3.topCut:
                case topLevelTypes$3.topPaste:
                    EventConstructor = SyntheticClipboardEvent;
                    break;
            }!EventConstructor ? prodInvariant('86', topLevelType) : void 0;
            if (!EventConstructor) return console.log(topLevelType);
            var event = EventConstructor.getPooled(dispatchConfig, targetInst, nativeEvent, nativeEventTarget);
            EventPropagators.accumulateTwoPhaseDispatches(event);
            return event;
        },

        didPutListener: function didPutListener(inst, registrationName, listener) {
            // Mobile Safari does not fire properly bubble click events on
            // non-interactive elements, which means delegated click listeners do not
            // fire. The workaround for this bug involves attaching an empty click
            // listener on the target node.
            if (registrationName === ON_CLICK_KEY) {
                var key = getDictionaryKey$1(inst);
                var node = ReactDOMComponentTree.getNodeFromInstance(inst);
                if (!onClickListeners[key]) {
                    onClickListeners[key] = EventListener_1.listen(node, 'click', __moduleExports$1);
                }
            }
        },

        willDeleteListener: function willDeleteListener(inst, registrationName) {
            if (registrationName === ON_CLICK_KEY) {
                var key = getDictionaryKey$1(inst);
                if (onClickListeners[key]) {
                    onClickListeners[key].remove();
                    delete onClickListeners[key];
                }
            }
        }

    };

    window.internalInstanceKey = ReactDOMComponentTree.internalInstanceKey;
    var alreadyInjected = false;

    function inject() {
        if (alreadyInjected) {
            // TODO: This is currently true because these injections are shared between
            // the client and the server package. They should be built independently
            // and not share any injection state. Then this problem will be solved.
            return;
        }
        alreadyInjected = true;

        // ReactInjection.EventEmitter.injectReactEventListener(ReactEventListener);
        ReactBrowserEventEmitter.injection.injectReactEventListener(ReactEventListener);

        /**
         * Inject modules for resolving DOM hierarchy and plugin ordering.
         */
        // ReactInjection.EventPluginHub.injectEventPluginOrder(DefaultEventPluginOrder);
        EventPluginHub.injection.injectEventPluginOrder(DefaultEventPluginOrder);
        // ReactInjection.EventPluginUtils.injectComponentTree(ReactDOMComponentTree);
        EventPluginUtils.injection.injectComponentTree(ReactDOMComponentTree);
        // ReactInjection.EventPluginUtils.injectTreeTraversal(ReactDOMTreeTraversal);
        EventPluginUtils.injection.injectTreeTraversal(ReactDOMTreeTraversal);

        /**
         * Some important event plugins included by default (without having to require
         * them).
         */
        // ReactInjection.EventPluginHub.injectEventPluginsByName
        EventPluginHub.injection.injectEventPluginsByName({
            SimpleEventPlugin: SimpleEventPlugin,

            ChangeEventPlugin: ChangeEventPlugin,
            SelectEventPlugin: SelectEventPlugin,
            BeforeInputEventPlugin: BeforeInputEventPlugin
        });
    }

    var ReactDefaultInjection = {
        inject: inject
    };

    /**
     * Accumulates items that must not be null or undefined.
     *
     * This is used to conserve memory by avoiding array allocations.
     *
     * @return {*|array<*>} An accumulation of items.
     */
    function accumulate(current, next) {

        if (current == null) {
            return next;
        }

        // Both are not empty. Warning: Never call x.concat(y) when you are not
        // certain that x is an Array (x could be a string with concat method).
        if (Array.isArray(current)) {
            return current.concat(next);
        }

        if (Array.isArray(next)) {
            return [current].concat(next);
        }

        return [current, next];
    }

    var ReactAdapter = {
        adapt: function adaptReactWeb(qreact) {
            // since these below are never required in qreact, extract them to lib
            // qreact.TouchHistoryMath
            // qreact.findNodeHandle
            // qreact.onlyChild
            // qreact.CSSPropertyOperations
            // qreact.ResponderEventPlugin
            // qreact.ResponderTouchHistoryStore

            // inline
            qreact.EventConstants = EventConstants;
            qreact.SyntheticEvent = SyntheticEvent;
            qreact.EventPluginRegistry = EventPluginRegistry;
            qreact.PooledClass = PooledClass;
            qreact.reactProdInvariant = prodInvariant;
            qreact.SyntheticUIEvent = SyntheticEvent;
            qreact.EventPropagators = EventPropagators;
            qreact.accumulate = accumulate;
            qreact.EventPluginUtils = EventPluginUtils;
            qreact.EventPluginHub = EventPluginHub;
            qreact.EventEmitter = ReactBrowserEventEmitter;
        }
    };

    Object.assign = Object.assign || index;
    var version = '15.1.0'; // trick libraries to think we are react

    var ELEMENTS = 'a abbr address area article aside audio b base bdi bdo big blockquote body br button canvas caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link main map mark menu menuitem meta meter nav noscript object ol optgroup option output p param picture pre progress q rp rt ruby s samp script section select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr circle clipPath defs ellipse g image line linearGradient mask path pattern polygon polyline radialGradient rect stop svg text tspan'.split(' ');

    var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element') || 0xeac7;

    // don't autobind these methods since they already have guaranteed context.
    var AUTOBIND_BLACKLIST = {
        constructor: 1,
        render: 1,
        shouldComponentUpdate: 1,
        componentWillReceiveProps: 1,
        componentWillUpdate: 1,
        componentDidUpdate: 1,
        componentWillMount: 1,
        componentDidMount: 1,
        componentWillUnmount: 1,
        componentDidUnmount: 1
    };

    var CAMEL_PROPS = /^(?:accent|alignment|arabic|baseline|cap|clip|color|fill|flood|font|glyph|horiz|marker|overline|paint|stop|strikethrough|stroke|text|underline|unicode|units|v|vert|word|writing|x)[A-Z]/;

    var BYPASS_HOOK = {};

    // a component that renders nothing. Used to replace components for unmountComponentAtNode.
    var EmptyComponent = function EmptyComponent() {
        return null;
    };

    var VNode = h('').constructor;

    VNode.prototype.$$typeof = REACT_ELEMENT_TYPE;
    VNode.prototype.preactCompatUpgraded = false;
    VNode.prototype.preactCompatNormalized = false;
    Object.defineProperty(VNode.prototype, 'type', {
        get: function get() {
            return this.nodeName;
        },
        set: function set(v) {
            this.nodeName = v;
        },

        configurable: true
    });

    Object.defineProperty(VNode.prototype, 'props', {
        get: function get() {
            return this.attributes;
        },
        set: function set(v) {
            this.attributes = v;
        },

        configurable: true
    });

    var oldEventHook = options.event;
    options.event = function(e) {
        e.persist = Object;
        if (oldEventHook) e = oldEventHook(e);
        return e;
    };

    //重写vnode方法
    var oldVnodeHook = options.vnode;
    options.vnode = function(vnode) {
        if (!vnode.preactCompatUpgraded) {
            vnode.preactCompatUpgraded = true;

            var tag = vnode.nodeName,
                attrs = vnode.attributes;

            if (!attrs) attrs = vnode.attributes = {};

            if (typeof tag === 'function') {
                if (tag[COMPONENT_WRAPPER_KEY] === true || tag.prototype && 'isReactComponent' in tag.prototype) {
                    if (!vnode.preactCompatNormalized) {
                        normalizeVNode(vnode);
                    }
                    handleComponentVNode(vnode);
                }
            } else if (attrs) {
                handleElementVNode(vnode, attrs);
            }
        }
        if (oldVnodeHook) oldVnodeHook(vnode);
    };

    function handleComponentVNode(vnode) {
        var tag = vnode.nodeName,
            a = vnode.attributes;

        vnode.attributes = {};
        if (tag.defaultProps) extend(vnode.attributes, tag.defaultProps);
        if (a) extend(vnode.attributes, a);
        a = vnode.attributes;

        if (vnode.children && !vnode.children.length) vnode.children = undefined;

        if (vnode.children) a.children = vnode.children;
    }

    function handleElementVNode(vnode, a) {
        var shouldSanitize = void 0,
            attrs = void 0,
            i = void 0;
        if (a) {
            for (i in a) {
                if (shouldSanitize = CAMEL_PROPS.test(i)) break;
            }
            if (shouldSanitize) {
                attrs = vnode.attributes = {};
                for (i in a) {
                    if (a.hasOwnProperty(i)) {
                        attrs[CAMEL_PROPS.test(i) ? i.replace(/([A-Z0-9])/, '-$1').toLowerCase() : i] = a[i];
                    }
                }
            }
        }
    }

    // proxy render() since React returns a Component reference.
    function render(vnode, parent, callback) {
        var prev = parent && parent._preactCompatRendered;

        // ignore impossible previous renders
        if (prev && prev.parentNode !== parent) prev = null;

        // default to first Element child
        if (!prev) prev = parent.children[0];

        // remove unaffected siblings
        for (var i = parent.childNodes.length; i--;) {
            if (parent.childNodes[i] !== prev) {
                parent.removeChild(parent.childNodes[i]);
            }
        }

        var out = render$1(vnode, parent, prev);
        if (parent) parent._preactCompatRendered = out;
        if (typeof callback === 'function') callback();
        return out && out._component || out.base;
    }

    var ContextProvider = function() {
        function ContextProvider() {
            classCallCheck(this, ContextProvider);
        }

        createClass$1(ContextProvider, [{
            key: 'getChildContext',
            value: function getChildContext() {
                return this.props.context;
            }
        }, {
            key: 'render',
            value: function render(props) {
                return props.children[0];
            }
        }]);
        return ContextProvider;
    }();

    function renderSubtreeIntoContainer(parentComponent, vnode, container, callback) {
        var wrap = h(ContextProvider, { context: parentComponent.context }, vnode);
        var c = render(wrap, container);
        if (callback) callback(c);
        return c;
    }

    function unmountComponentAtNode(container) {
        var existing = container._preactCompatRendered;
        if (existing && existing.parentNode === container) {
            render$1(h(EmptyComponent), container, existing);
            return true;
        }
        return false;
    }

    var ARR = [];

    // This API is completely unnecessary for Preact, so it's basically passthrough.
    var Children = {
        map: function map(children, fn, ctx) {
            if (children == null) return null;
            children = Children.toArray(children);
            if (ctx && ctx !== children) fn = fn.bind(ctx);
            return children.map(fn);
        },
        forEach: function forEach(children, fn, ctx) {
            if (children == null) return null;
            children = Children.toArray(children);
            if (ctx && ctx !== children) fn = fn.bind(ctx);
            children.forEach(fn);
        },
        count: function count(children) {
            return children && children.length || 0;
        },
        only: function only(children) {
            children = Children.toArray(children);
            if (children.length !== 1) throw new Error('Children.only() expects only one child.');
            return children[0];
        },
        toArray: function toArray(children) {
            return Array.isArray && Array.isArray(children) ? children : ARR.concat(children);
        }
    };

    /** Track current render() component for ref assignment */
    var currentComponent = void 0;

    function createFactory(type) {
        return createElement.bind(null, type);
    }

    var DOM = {};
    for (var i = ELEMENTS.length; i--;) {
        DOM[ELEMENTS[i]] = createFactory(ELEMENTS[i]);
    }

    function upgradeToVNodes(arr, offset) {
        for (var _i = offset || 0; _i < arr.length; _i++) {
            var obj = arr[_i];
            if (Array.isArray(obj)) {
                upgradeToVNodes(obj);
            } else if (obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && !isValidElement(obj) && (obj.props && obj.type || obj.attributes && obj.nodeName || obj.children)) {
                arr[_i] = createElement(obj.type || obj.nodeName, obj.props || obj.attributes, obj.children);
            }
        }
    }

    function isFunctionalComponent(c) {
        return typeof c === 'function' && !(c.prototype && c.prototype.render);
    }

    var COMPONENT_WRAPPER_KEY = typeof Symbol !== 'undefined' ? Symbol.for('__preactCompatWrapper') : '__preactCompatWrapper';

    // wraps stateless functional components in a PropTypes validator
    function wrapStatelessComponent(WrappedComponent) {
        return createClass({
            displayName: WrappedComponent.displayName || WrappedComponent.name,
            render: function render(props, state, context) {
                return WrappedComponent(props, context);
            }
        });
    }

    function statelessComponentHook(Ctor) {
        var Wrapped = Ctor[COMPONENT_WRAPPER_KEY];
        if (Wrapped) return Wrapped === true ? Ctor : Wrapped;

        Wrapped = wrapStatelessComponent(Ctor);

        Object.defineProperty(Wrapped, COMPONENT_WRAPPER_KEY, { configurable: true, value: true });
        Wrapped.displayName = Ctor.displayName;
        Wrapped.propTypes = Ctor.propTypes;
        Wrapped.defaultProps = Ctor.defaultProps;

        Object.defineProperty(Ctor, COMPONENT_WRAPPER_KEY, { configurable: true, value: Wrapped });

        return Wrapped;
    }

    function createElement() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        upgradeToVNodes(args, 2);
        return normalizeVNode(h.apply(undefined, args));
    }

    function normalizeVNode(vnode) {
        vnode.preactCompatNormalized = true;

        applyClassName(vnode);

        if (isFunctionalComponent(vnode.nodeName)) {
            vnode.nodeName = statelessComponentHook(vnode.nodeName);
        }

        var ref = vnode.attributes.ref,
            type = ref && (typeof ref === 'undefined' ? 'undefined' : _typeof(ref));
        if (currentComponent && (type === 'string' || type === 'number')) {
            vnode.attributes.ref = createStringRefProxy(ref, currentComponent);
        }

        applyEventNormalization(vnode);

        return vnode;
    }

    //不使用外面的cloneElement,使用这里的
    function cloneElement(element) {
        var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (!isValidElement(element)) return element;
        var elementProps = element.attributes || element.props || {};
        var newProps = extend(clone(elementProps), props);
        if (arguments.length > 2) {
            var c = [].slice.call(arguments, 2);
        } else {
            var c = element.children || props.children;
            if (!Array.isArray(c)) {
                c = [c];
            }
        }

        var node = h(element.nodeName || element.type, newProps, c);
        return normalizeVNode(node);
    }

    function isValidElement(element) {
        return element && (element instanceof VNode || element.$$typeof === REACT_ELEMENT_TYPE);
    }

    function createStringRefProxy(name, component) {
        return component._refProxies[name] || (component._refProxies[name] = function(resolved) {
            if (component && component.refs) {
                component.refs[name] = resolved;
                if (resolved === null) {
                    delete component._refProxies[name];
                    component = null;
                }
            }
        });
    }

    function applyEventNormalization(_ref) {
        var nodeName = _ref.nodeName,
            attributes = _ref.attributes;

        if (!attributes || typeof nodeName !== 'string') return;
        var props = {};
        for (var _i2 in attributes) {
            props[_i2.toLowerCase()] = _i2;
        }
        if (props.ondoubleclick) {
            attributes.ondblclick = attributes[props.ondoubleclick];
            delete attributes[props.ondoubleclick];
        }
        if (props.onchange) {
            nodeName = nodeName.toLowerCase();
            var attr = nodeName === 'input' && String(attributes.type).toLowerCase() === 'checkbox' ? 'onclick' : 'oninput',
                normalized = props[attr] || attr;
            if (!attributes[normalized]) {
                attributes[normalized] = multihook([attributes[props[attr]], attributes[props.onchange]]);
                delete attributes[props.onchange];
            }
        }
    }

    function applyClassName(_ref2) {
        var attributes = _ref2.attributes;

        if (!attributes) return;
        var cl = attributes.className || attributes.class;
        if (cl) attributes.className = cl;
    }

    /** 
     * util.js的extend是这样的
     function extend(obj, props) {
    	if (props) {
    		for (let i in props) obj[i] = props[i];
    	}
    	return obj;
    }
    **/
    function extend(base, props) {
        for (var key in props) {
            //if (props.hasOwnProperty(key)) {
            base[key] = props[key];
            //}
        }
        return base;
    }

    function shallowDiffers(a, b) {
        for (var _i3 in a) {
            if (!(_i3 in b)) return true;
        }
        for (var _i4 in b) {
            if (a[_i4] !== b[_i4]) return true;
        }
        return false;
    }

    var findDOMNode = function findDOMNode(component) {
        return component && component.base || component;
    };

    function F() {}

    function createClass(obj) {
        function cl(props, context) {
            bindAll(this);
            Component.call(this, props, context, BYPASS_HOOK);
            newComponentHook.call(this, props, context);
        }

        obj = extend({ constructor: cl }, obj);

        // We need to apply mixins here so that getDefaultProps is correctly mixed
        if (obj.mixins) {
            applyMixins(obj, collateMixins(obj.mixins));
        }
        if (obj.statics) {
            extend(cl, obj.statics);
        }
        if (obj.propTypes) {
            cl.propTypes = obj.propTypes;
        }
        if (obj.defaultProps) {
            cl.defaultProps = obj.defaultProps;
        }
        if (obj.getDefaultProps) {
            cl.defaultProps = obj.getDefaultProps();
        }

        F.prototype = Component.prototype;
        cl.prototype = extend(new F(), obj);

        cl.displayName = obj.displayName || 'Component';

        return cl;
    }

    // Flatten an Array of mixins to a map of method name to mixin implementations
    function collateMixins(mixins) {
        var keyed = {};
        for (var _i5 = 0; _i5 < mixins.length; _i5++) {
            var mixin = mixins[_i5];
            for (var key in mixin) {
                if (mixin.hasOwnProperty(key) && typeof mixin[key] === 'function') {
                    (keyed[key] || (keyed[key] = [])).push(mixin[key]);
                }
            }
        }
        return keyed;
    }

    // apply a mapping of Arrays of mixin methods to a component prototype
    function applyMixins(proto, mixins) {
        for (var key in mixins) {
            if (mixins.hasOwnProperty(key)) {
                var hooks = proto[key] ? mixins[key].concat(proto[key]) : mixins[key];
                if (key === "getDefaultProps" || key === "getInitialState" || key === "getChildContext") {
                    proto[key] = multihook(hooks, mergeNoDupes);
                } else {
                    proto[key] = multihook(hooks);
                }
            }
        }
    }

    function bindAll(ctx) {
        for (var _i6 in ctx) {
            var v = ctx[_i6];
            if (typeof v === 'function' && !v.__bound && !AUTOBIND_BLACKLIST.hasOwnProperty(_i6)) {
                (ctx[_i6] = v.bind(ctx)).__bound = true;
            }
        }
    }

    function callMethod(ctx, m, args) {
        if (typeof m === 'string') {
            m = ctx.constructor.prototype[m];
        }
        if (typeof m === 'function') {
            return m.apply(ctx, args);
        }
    }

    function multihook(hooks, mergeFn) {
        return function() {
            var ret = void 0;
            for (var _i7 = 0; _i7 < hooks.length; _i7++) {
                var r = callMethod(this, hooks[_i7], arguments);

                if (mergeFn) {
                    ret = mergeFn(ret, r);
                } else if (typeof r !== 'undefined') ret = r;
            }
            return ret;
        };
    }

    // Used for lifecycle hooks like getInitialState to merge the return values
    function mergeNoDupes(previous, current) {
        if (current != null) {
            if ((typeof current === 'undefined' ? 'undefined' : _typeof(current)) !== 'object') throw new Error('Expected return value to be an object or null.');
            if (!previous) previous = {};

            for (var key in current) {
                if (current.hasOwnProperty(key)) {
                    if (previous.hasOwnProperty(key)) throw new Error('Duplicate key "' + key + '" found when merging return value.');
                    previous[key] = current[key];
                }
            }
        }
        return previous;
    }

    function newComponentHook(props, context) {
        propsHook.call(this, props, context);
        this.componentWillReceiveProps = multihook([propsHook, this.componentWillReceiveProps || 'componentWillReceiveProps']);
        this.render = multihook([propsHook, beforeRender, this.render || 'render', afterRender]);
    }

    function propsHook(props, context) {
        if (!props) return;

        // React annoyingly special-cases single children, and some react components are ridiculously strict about this.
        var c = props.children;
        if (c && Array.isArray(c) && c.length === 1) {
            props.children = c[0];

            // but its totally still going to be an Array.
            if (props.children && _typeof(props.children) === 'object') {
                props.children.length = 1;
                props.children[0] = props.children;
            }
        }

        // add proptype checking
        if (false) {}
    }

    function beforeRender(props) {
        currentComponent = this;
    }

    function afterRender() {
        if (currentComponent === this) {
            currentComponent = null;
        }
    }

    function Component(props, context, opts) {
        Component$1.call(this, props, context);
        if (this.getInitialState) this.state = this.getInitialState();
        this.refs = {};
        this._refProxies = {};
        if (opts !== BYPASS_HOOK) {
            newComponentHook.call(this, props, context);
        }
    }
    Component.prototype = new Component$1();
    extend(Component.prototype, {
        constructor: Component,

        isReactComponent: {},

        replaceState: function replaceState(state, callback) {
            this.setState(state, callback);
            for (var _i8 in this.state) {
                if (!(_i8 in state)) {
                    delete this.state[_i8];
                }
            }
        },
        getDOMNode: function getDOMNode() {
            return this.base;
        },
        isMounted: function isMounted() {
            return !!this.base;
        }
    });

    function PureComponent(props, context) {
        Component.call(this, props, context);
    }
    PureComponent.prototype = new Component({}, {}, BYPASS_HOOK);
    PureComponent.prototype.shouldComponentUpdate = function(props, state) {
        return shallowDiffers(this.props, props) || shallowDiffers(this.state, state);
    };

    // better user experience
    var qreact = {
        version: version,
        DOM: DOM,
        PropTypes: PropTypes, // actually proptypes target in src/proptypes/index.js
        Children: Children,
        render: render,
        createClass: createClass,
        createFactory: createFactory,
        createElement: createElement,
        cloneElement: cloneElement,
        isValidElement: isValidElement,
        findDOMNode: findDOMNode,
        unmountComponentAtNode: unmountComponentAtNode,
        Component: Component,
        PureComponent: PureComponent,
        unstable_renderSubtreeIntoContainer: renderSubtreeIntoContainer
    };

    ReactAdapter.adapt(qreact);
    // extract injectResponderEventPlugin to qreact/lib/injectResponderEventPlugin.js
    // 请不要修改下方代码，否则就炒了你
    // import './event/injectResponderEventPlugin';import ReactWebAdapter from './lib/ReactWebAdapter';ReactWebAdapter.adapt(qreact)
    ReactDefaultInjection.inject();

    return qreact;

}));