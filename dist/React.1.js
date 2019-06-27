/**
 * by 司徒正美 Copyright 2019-05-21
 * IE9+
 */

(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react'), require('react-dom/src/client/ReactDOMHostConfig'), require('react-reconciler/reflection'), require('react-reconciler/src/ReactUpdateQueue')) :
        typeof define === 'function' && define.amd ? define(['react', 'react-dom/src/client/ReactDOMHostConfig', 'react-reconciler/reflection', 'react-reconciler/src/ReactUpdateQueue'], factory) :
        (global.React = factory(global.React, global.ReactDOMHostConfig, global.reflection, global.ReactUpdateQueue));
}(this, (function(React, ReactDOMHostConfig, reflection, ReactUpdateQueue) {
    React = React && React.hasOwnProperty('default') ? React['default'] : React;

    function get(key) {
        return key._reactInternalFiber;
    }

    function set(key, value) {
        key._reactInternalFiber = value;
    }

    var FunctionComponent = 0;
    var ClassComponent = 1;
    var IndeterminateComponent = 2;
    var HostRoot = 3;
    var HostPortal = 4;
    var HostComponent = 5;
    var HostText = 6;
    var Fragment = 7;
    var Mode = 8;
    var ContextConsumer = 9;
    var ContextProvider = 10;
    var ForwardRef = 11;
    var Profiler = 12;
    var SuspenseComponent = 13;
    var MemoComponent = 14;
    var SimpleMemoComponent = 15;
    var LazyComponent = 16;
    var IncompleteClassComponent = 17;
    var DehydratedSuspenseComponent = 18;
    var EventComponent = 19;
    var EventTarget = 20;

    var warningWithoutStack = function warningWithoutStack() {};
    var warningWithoutStack$1 = warningWithoutStack;

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) { return typeof obj; } : function(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
    var hasSymbol = typeof Symbol === 'function' && Symbol.for;
    var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
    var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
    var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
    var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
    var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
    var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
    var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace;
    var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
    var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
    var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
    var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
    var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;
    var REACT_EVENT_COMPONENT_TYPE = hasSymbol ? Symbol.for('react.event_component') : 0xead5;
    var REACT_EVENT_TARGET_TYPE = hasSymbol ? Symbol.for('react.event_target') : 0xead6;
    var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
    var FAUX_ITERATOR_SYMBOL = '@@iterator';

    function getIteratorFn(maybeIterable) {
        if (maybeIterable === null || (typeof maybeIterable === 'undefined' ? 'undefined' : _typeof(maybeIterable)) !== 'object') {
            return null;
        }
        var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
        if (typeof maybeIterator === 'function') {
            return maybeIterator;
        }
        return null;
    }

    var Pending = 0;
    var Resolved = 1;
    var Rejected = 2;

    function refineResolvedLazyComponent(lazyComponent) {
        return lazyComponent._status === Resolved ? lazyComponent._result : null;
    }

    var disableYielding = false;

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) { return typeof obj; } : function(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

    function getWrappedName(outerType, innerType, wrapperName) {
        var functionName = innerType.displayName || innerType.name || '';
        return outerType.displayName || (functionName !== '' ? wrapperName + '(' + functionName + ')' : wrapperName);
    }

    function getComponentName(type) {
        if (type == null) {
            return null;
        }
        if (typeof type === 'function') {
            return type.displayName || type.name || null;
        }
        if (typeof type === 'string') {
            return type;
        }
        switch (type) {
            case REACT_FRAGMENT_TYPE:
                return 'Fragment';
            case REACT_PORTAL_TYPE:
                return 'Portal';
            case REACT_PROFILER_TYPE:
                return 'Profiler';
            case REACT_STRICT_MODE_TYPE:
                return 'StrictMode';
            case REACT_SUSPENSE_TYPE:
                return 'Suspense';
        }
        if ((typeof type === 'undefined' ? 'undefined' : _typeof(type)) === 'object') {
            switch (type.$$typeof) {
                case REACT_CONTEXT_TYPE:
                    return 'Context.Consumer';
                case REACT_PROVIDER_TYPE:
                    return 'Context.Provider';
                case REACT_FORWARD_REF_TYPE:
                    return getWrappedName(type, type.render, 'ForwardRef');
                case REACT_MEMO_TYPE:
                    return getComponentName(type.type);
                case REACT_LAZY_TYPE:
                    {
                        var thenable = type;
                        var resolvedThenable = refineResolvedLazyComponent(thenable);
                        if (resolvedThenable) {
                            return getComponentName(resolvedThenable);
                        }
                        break;
                    }
                case REACT_EVENT_COMPONENT_TYPE:
                    {
                        break;
                    }
                case REACT_EVENT_TARGET_TYPE:

            }
        }
        return null;
    }

    function invariant(condition, format, a, b, c, d, e, f) {
        throw new Error('Internal React error: invariant() is meant to be replaced at compile ' + 'time. There is no runtime version.');
    }

    var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    if (!ReactSharedInternals.hasOwnProperty('ReactCurrentDispatcher')) {
        ReactSharedInternals.ReactCurrentDispatcher = {
            current: null
        };
    }
    if (!ReactSharedInternals.hasOwnProperty('ReactCurrentBatchConfig')) {
        ReactSharedInternals.ReactCurrentBatchConfig = {
            suspense: null
        };
    }

    var BEFORE_SLASH_RE = /^(.*)[\\\/]/;

    function describeComponentFrame(name, source, ownerName) {
        var sourceInfo = '';
        if (source) {
            var path = source.fileName;
            var fileName = path.replace(BEFORE_SLASH_RE, '');
            sourceInfo = ' (at ' + fileName + ':' + source.lineNumber + ')';
        } else if (ownerName) {
            sourceInfo = ' (created by ' + ownerName + ')';
        }
        return '\n    in ' + (name || 'Unknown') + sourceInfo;
    }

    var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;

    function describeFiber(fiber) {
        switch (fiber.tag) {
            case HostRoot:
            case HostPortal:
            case HostText:
            case Fragment:
            case ContextProvider:
            case ContextConsumer:
                return '';
            default:
                var owner = fiber._debugOwner;
                var source = fiber._debugSource;
                var name = getComponentName(fiber.type);
                var ownerName = null;
                if (owner) {
                    ownerName = getComponentName(owner.type);
                }
                return describeComponentFrame(name, source, ownerName);
        }
    }

    function getStackByFiberInDevAndProd(workInProgress) {
        var info = '';
        var node = workInProgress;
        do {
            info += describeFiber(node);
            node = node.return;
        } while (node);
        return info;
    }


    var valueStack = [];
    var index = -1;

    function createCursor(defaultValue) {
        return {
            current: defaultValue
        };
    }

    function pop(cursor, fiber) {
        if (index < 0) {
            return;
        }
        cursor.current = valueStack[index];
        valueStack[index] = null;
        index--;
    }

    function push(cursor, value, fiber) {
        index++;
        valueStack[index] = cursor.current;
        cursor.current = value;
    }

    var emptyContextObject = {};
    var contextStackCursor = createCursor(emptyContextObject);
    var didPerformWorkStackCursor = createCursor(false);
    var previousContext = emptyContextObject;

    function getUnmaskedContext(workInProgress, Component, didPushOwnContextIfProvider) {
        if (didPushOwnContextIfProvider && isContextProvider(Component)) {
            return previousContext;
        }
        return contextStackCursor.current;
    }

    function cacheContext(workInProgress, unmaskedContext, maskedContext) {
        var instance = workInProgress.stateNode;
        instance.__reactInternalMemoizedUnmaskedChildContext = unmaskedContext;
        instance.__reactInternalMemoizedMaskedChildContext = maskedContext;
    }

    function getMaskedContext(workInProgress, unmaskedContext) {
        var type = workInProgress.type;
        var contextTypes = type.contextTypes;
        if (!contextTypes) {
            return emptyContextObject;
        }
        var instance = workInProgress.stateNode;
        if (instance && instance.__reactInternalMemoizedUnmaskedChildContext === unmaskedContext) {
            return instance.__reactInternalMemoizedMaskedChildContext;
        }
        var context = {};
        for (var key in contextTypes) {
            context[key] = unmaskedContext[key];
        }
        if (instance) {
            cacheContext(workInProgress, unmaskedContext, context);
        }
        return context;
    }

    function hasContextChanged() {
        return didPerformWorkStackCursor.current;
    }

    function isContextProvider(type) {
        var childContextTypes = type.childContextTypes;
        return childContextTypes !== null && childContextTypes !== undefined;
    }

    function popContext(fiber) {
        pop(didPerformWorkStackCursor, fiber);
        pop(contextStackCursor, fiber);
    }

    function popTopLevelContextObject(fiber) {
        pop(didPerformWorkStackCursor, fiber);
        pop(contextStackCursor, fiber);
    }

    function pushTopLevelContextObject(fiber, context, didChange) {
        invariant(contextStackCursor.current === emptyContextObject, 'Unexpected context found on stack. ' + 'This error is likely caused by a bug in React. Please file an issue.');
        push(contextStackCursor, context, fiber);
        push(didPerformWorkStackCursor, didChange, fiber);
    }
    // 旧的context机制
    function processChildContext(fiber, type, parentContext) {
        var instance = fiber.stateNode;
        var childContextTypes = type.childContextTypes;
        if (typeof instance.getChildContext !== 'function') {
            return parentContext;
        }
        var childContext = void 0;
        childContext = instance.getChildContext();
        for (var contextKey in childContext) {
            invariant(contextKey in childContextTypes, '%s.getChildContext(): key "%s" is not defined in childContextTypes.', getComponentName(type) || 'Unknown', contextKey);
        }
        return Object.assign({}, parentContext, childContext);
    }
    // 新的context机制
    function pushContextProvider(workInProgress) {
        var instance = workInProgress.stateNode;
        var memoizedMergedChildContext = instance && instance.__reactInternalMemoizedMergedChildContext || emptyContextObject;
        previousContext = contextStackCursor.current;
        push(contextStackCursor, memoizedMergedChildContext, workInProgress);
        push(didPerformWorkStackCursor, didPerformWorkStackCursor.current, workInProgress);
        return true;
    }

    function invalidateContextProvider(workInProgress, type, didChange) {
        var instance = workInProgress.stateNode;
        invariant(instance, 'Expected to have an instance by this point. ' + 'This error is likely caused by a bug in React. Please file an issue.');
        if (didChange) {
            var mergedContext = processChildContext(workInProgress, type, previousContext);
            instance.__reactInternalMemoizedMergedChildContext = mergedContext;
            pop(didPerformWorkStackCursor, workInProgress);
            pop(contextStackCursor, workInProgress);
            push(contextStackCursor, mergedContext, workInProgress);
            push(didPerformWorkStackCursor, didChange, workInProgress);
        } else {
            pop(didPerformWorkStackCursor, workInProgress);
            push(didPerformWorkStackCursor, didChange, workInProgress);
        }
    }

    function findCurrentUnmaskedContext(fiber) {
        invariant(reflection.isFiberMounted(fiber) && fiber.tag === ClassComponent, 'Expected subtree parent to be a mounted class component. ' + 'This error is likely caused by a bug in React. Please file an issue.');
        var node = fiber;
        do {
            switch (node.tag) {
                case HostRoot:
                    return node.stateNode.context;
                case ClassComponent:
                    {
                        var Component = node.type;
                        if (isContextProvider(Component)) {
                            return node.stateNode.__reactInternalMemoizedMergedChildContext;
                        }
                        break;
                    }
            }
            node = node.return;
        } while (node !== null);
        invariant(false, 'Found unexpected detached subtree parent. ' + 'This error is likely caused by a bug in React. Please file an issue.');
    }

    var NoEffect = 0;
    var PerformedWork = 1;
    var Placement = 2;
    var Update = 4;
    var PlacementAndUpdate = 6;
    var Deletion = 8;
    var ContentReset = 16;
    var Callback = 32;
    var DidCapture = 64;
    var Ref = 128;
    var Snapshot = 256;
    var Passive = 512;
    var LifecycleEffectMask = 932;
    var HostEffectMask = 1023;
    var Incomplete = 1024;
    var ShouldCapture = 2048;

    var BatchedRoot = 1;
    var ConcurrentRoot = 2;

    var enableSchedulerDebugging$1 = false;

    var _requestHostCallback = void 0;
    var cancelHostCallback = void 0;
    var shouldYieldToHost = void 0;
    var getCurrentTime = void 0;
    var hasNativePerformanceNow = (typeof performance === 'undefined' ? 'undefined' : _typeof(performance)) === 'object' && typeof performance.now === 'function';
    var localDate = Date;
    var localSetTimeout = typeof setTimeout === 'function' ? setTimeout : undefined;
    var localClearTimeout = typeof clearTimeout === 'function' ? clearTimeout : undefined;
    var localRequestAnimationFrame = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : undefined;
    var localCancelAnimationFrame = typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame : undefined;
    var ANIMATION_FRAME_TIMEOUT = 100;
    var rAFID = void 0;
    var rAFTimeoutID = void 0;
    var requestAnimationFrameWithTimeout = function requestAnimationFrameWithTimeout(callback) {
        rAFID = localRequestAnimationFrame(function(timestamp) {
            localClearTimeout(rAFTimeoutID);
            callback(timestamp);
        });
        rAFTimeoutID = localSetTimeout(function() {
            localCancelAnimationFrame(rAFID);
            callback(getCurrentTime());
        }, ANIMATION_FRAME_TIMEOUT);
    };
    if (hasNativePerformanceNow) {
        var Performance = performance;
        getCurrentTime = function getCurrentTime() {
            return Performance.now();
        };
    } else {
        getCurrentTime = function getCurrentTime() {
            return localDate.now();
        };
    }
    if (
        typeof window === 'undefined' ||
        typeof MessageChannel !== 'function') {
        var _callback = null;
        var _flushCallback = function _flushCallback(didTimeout) {
            if (_callback !== null) {
                try {
                    _callback(didTimeout);
                } finally {
                    _callback = null;
                }
            }
        };
        _requestHostCallback = function requestHostCallback(cb, ms) {
            if (_callback !== null) {
                setTimeout(_requestHostCallback, 0, cb);
            } else {
                _callback = cb;
                setTimeout(_flushCallback, 0, false);
            }
        };
        cancelHostCallback = function cancelHostCallback() {
            _callback = null;
        };
        shouldYieldToHost = function shouldYieldToHost() {
            return false;
        };
    } else {
        if (typeof console !== 'undefined') {
            if (typeof localRequestAnimationFrame !== 'function') {
                console.error("This browser doesn't support requestAnimationFrame. " + 'Make sure that you load a ' + 'polyfill in older browsers. https://fb.me/react-polyfills');
            }
            if (typeof localCancelAnimationFrame !== 'function') {
                console.error("This browser doesn't support cancelAnimationFrame. " + 'Make sure that you load a ' + 'polyfill in older browsers. https://fb.me/react-polyfills');
            }
        }
        var scheduledHostCallback = null;
        var isMessageEventScheduled = false;
        var timeoutTime = -1;
        var isAnimationFrameScheduled = false;
        var isFlushingHostCallback = false;
        var frameDeadline = 0;
        var previousFrameTime = 33;
        var activeFrameTime = 33;
        var fpsLocked = false;
        shouldYieldToHost = function shouldYieldToHost() {
            return frameDeadline <= getCurrentTime();
        };
        var channel = new MessageChannel();
        var port = channel.port2;
        channel.port1.onmessage = function(event) {
            isMessageEventScheduled = false;
            var prevScheduledCallback = scheduledHostCallback;
            var prevTimeoutTime = timeoutTime;
            scheduledHostCallback = null;
            timeoutTime = -1;
            var currentTime = getCurrentTime();
            var didTimeout = false;
            if (frameDeadline - currentTime <= 0) {
                if (prevTimeoutTime !== -1 && prevTimeoutTime <= currentTime) {
                    didTimeout = true;
                } else {
                    if (!isAnimationFrameScheduled) {
                        isAnimationFrameScheduled = true;
                        requestAnimationFrameWithTimeout(animationTick);
                    }
                    scheduledHostCallback = prevScheduledCallback;
                    timeoutTime = prevTimeoutTime;
                    return;
                }
            }
            if (prevScheduledCallback !== null) {
                isFlushingHostCallback = true;
                try {
                    prevScheduledCallback(didTimeout);
                } finally {
                    isFlushingHostCallback = false;
                }
            }
        };
        var animationTick = function animationTick(rafTime) {
            if (scheduledHostCallback !== null) {
                requestAnimationFrameWithTimeout(animationTick);
            } else {
                isAnimationFrameScheduled = false;
                return;
            }
            var nextFrameTime = rafTime - frameDeadline + activeFrameTime;
            if (nextFrameTime < activeFrameTime && previousFrameTime < activeFrameTime && !fpsLocked) {
                if (nextFrameTime < 8) {
                    nextFrameTime = 8;
                }
                activeFrameTime = nextFrameTime < previousFrameTime ? previousFrameTime : nextFrameTime;
            } else {
                previousFrameTime = nextFrameTime;
            }
            frameDeadline = rafTime + activeFrameTime;
            if (!isMessageEventScheduled) {
                isMessageEventScheduled = true;
                port.postMessage(undefined);
            }
        };
        _requestHostCallback = function _requestHostCallback(callback, absoluteTimeout) {
            scheduledHostCallback = callback;
            timeoutTime = absoluteTimeout;
            if (isFlushingHostCallback || absoluteTimeout < 0) {
                port.postMessage(undefined);
            } else if (!isAnimationFrameScheduled) {
                isAnimationFrameScheduled = true;
                requestAnimationFrameWithTimeout(animationTick);
            }
        };
        cancelHostCallback = function cancelHostCallback() {
            scheduledHostCallback = null;
            isMessageEventScheduled = false;
            timeoutTime = -1;
        };
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) { return typeof obj; } : function(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
    var ImmediatePriority = 1;
    var UserBlockingPriority = 2;
    var NormalPriority = 3;
    var LowPriority = 4;
    var IdlePriority = 5;
    var maxSigned31BitInt = 1073741823;
    var IMMEDIATE_PRIORITY_TIMEOUT = -1;
    var USER_BLOCKING_PRIORITY = 250;
    var NORMAL_PRIORITY_TIMEOUT = 5000;
    var LOW_PRIORITY_TIMEOUT = 10000;
    var IDLE_PRIORITY = maxSigned31BitInt;
    var firstCallbackNode = null;
    var currentHostCallbackDidTimeout = false;
    var currentPriorityLevel = NormalPriority;
    var currentEventStartTime = -1;
    var currentExpirationTime = -1;
    var isPerformingWork = false;
    var isHostCallbackScheduled = false;

    function scheduleHostCallbackIfNeeded() {
        if (isPerformingWork) {
            return;
        }
        if (firstCallbackNode !== null) {
            var expirationTime = firstCallbackNode.expirationTime;
            if (isHostCallbackScheduled) {
                cancelHostCallback();
            } else {
                isHostCallbackScheduled = true;
            }
            _requestHostCallback(flushWork, expirationTime);
        }
    }

    function flushFirstCallback() {
        var currentlyFlushingCallback = firstCallbackNode;
        var next = firstCallbackNode.next;
        if (firstCallbackNode === next) {
            firstCallbackNode = null;
            next = null;
        } else {
            var lastCallbackNode = firstCallbackNode.previous;
            firstCallbackNode = lastCallbackNode.next = next;
            next.previous = lastCallbackNode;
        }
        currentlyFlushingCallback.next = currentlyFlushingCallback.previous = null;
        var callback = currentlyFlushingCallback.callback;
        var expirationTime = currentlyFlushingCallback.expirationTime;
        var priorityLevel = currentlyFlushingCallback.priorityLevel;
        var previousPriorityLevel = currentPriorityLevel;
        var previousExpirationTime = currentExpirationTime;
        currentPriorityLevel = priorityLevel;
        currentExpirationTime = expirationTime;
        var continuationCallback;
        try {
            var didUserCallbackTimeout = currentHostCallbackDidTimeout ||
                priorityLevel === ImmediatePriority;
            continuationCallback = callback(didUserCallbackTimeout);
        } catch (error) {
            throw error;
        } finally {
            currentPriorityLevel = previousPriorityLevel;
            currentExpirationTime = previousExpirationTime;
        }
        if (typeof continuationCallback === 'function') {
            var continuationNode = {
                callback: continuationCallback,
                priorityLevel: priorityLevel,
                expirationTime: expirationTime,
                next: null,
                previous: null
            };
            if (firstCallbackNode === null) {
                firstCallbackNode = continuationNode.next = continuationNode.previous = continuationNode;
            } else {
                var nextAfterContinuation = null;
                var node = firstCallbackNode;
                do {
                    if (node.expirationTime >= expirationTime) {
                        nextAfterContinuation = node;
                        break;
                    }
                    node = node.next;
                } while (node !== firstCallbackNode);
                if (nextAfterContinuation === null) {
                    nextAfterContinuation = firstCallbackNode;
                } else if (nextAfterContinuation === firstCallbackNode) {
                    firstCallbackNode = continuationNode;
                    scheduleHostCallbackIfNeeded();
                }
                var previous = nextAfterContinuation.previous;
                previous.next = nextAfterContinuation.previous = continuationNode;
                continuationNode.next = nextAfterContinuation;
                continuationNode.previous = previous;
            }
        }
    }

    function flushWork(didUserCallbackTimeout) {
        isHostCallbackScheduled = false;
        isPerformingWork = true;
        var previousDidTimeout = currentHostCallbackDidTimeout;
        currentHostCallbackDidTimeout = didUserCallbackTimeout;
        try {
            if (didUserCallbackTimeout) {
                while (firstCallbackNode !== null && !(enableSchedulerDebugging$1)) {
                    var currentTime = getCurrentTime();
                    if (firstCallbackNode.expirationTime <= currentTime) {
                        do {
                            flushFirstCallback();
                        } while (firstCallbackNode !== null &&
                            firstCallbackNode.expirationTime <= currentTime &&
                            !(enableSchedulerDebugging$1));
                        continue;
                    }
                    break;
                }
            } else {
                if (firstCallbackNode !== null) {
                    do {
                        flushFirstCallback();
                    } while (firstCallbackNode !== null && !shouldYieldToHost());
                }
            }
        } finally {
            isPerformingWork = false;
            currentHostCallbackDidTimeout = previousDidTimeout;
            scheduleHostCallbackIfNeeded();
        }
    }

    function unstable_runWithPriority(priorityLevel, eventHandler) {
        switch (priorityLevel) {
            case ImmediatePriority:
            case UserBlockingPriority:
            case NormalPriority:
            case LowPriority:
            case IdlePriority:
                break;
            default:
                priorityLevel = NormalPriority;
        }
        var previousPriorityLevel = currentPriorityLevel;
        var previousEventStartTime = currentEventStartTime;
        currentPriorityLevel = priorityLevel;
        currentEventStartTime = getCurrentTime();
        try {
            return eventHandler();
        } catch (error) {
            scheduleHostCallbackIfNeeded();
            throw error;
        } finally {
            currentPriorityLevel = previousPriorityLevel;
            currentEventStartTime = previousEventStartTime;
        }
    }

    function unstable_scheduleCallback(priorityLevel, callback, deprecated_options) {
        var startTime = currentEventStartTime !== -1 ? currentEventStartTime : getCurrentTime();
        var expirationTime;
        if ((typeof deprecated_options === 'undefined' ? 'undefined' : _typeof(deprecated_options)) === 'object' && deprecated_options !== null && typeof deprecated_options.timeout === 'number') {
            expirationTime = startTime + deprecated_options.timeout;
        } else {
            switch (priorityLevel) {
                case ImmediatePriority:
                    expirationTime = startTime + IMMEDIATE_PRIORITY_TIMEOUT;
                    break;
                case UserBlockingPriority:
                    expirationTime = startTime + USER_BLOCKING_PRIORITY;
                    break;
                case IdlePriority:
                    expirationTime = startTime + IDLE_PRIORITY;
                    break;
                case LowPriority:
                    expirationTime = startTime + LOW_PRIORITY_TIMEOUT;
                    break;
                case NormalPriority:
                default:
                    expirationTime = startTime + NORMAL_PRIORITY_TIMEOUT;
            }
        }
        var newNode = {
            callback: callback,
            priorityLevel: priorityLevel,
            expirationTime: expirationTime,
            next: null,
            previous: null
        };
        if (firstCallbackNode === null) {
            firstCallbackNode = newNode.next = newNode.previous = newNode;
            scheduleHostCallbackIfNeeded();
        } else {
            var next = null;
            var node = firstCallbackNode;
            do {
                if (node.expirationTime > expirationTime) {
                    next = node;
                    break;
                }
                node = node.next;
            } while (node !== firstCallbackNode);
            if (next === null) {
                next = firstCallbackNode;
            } else if (next === firstCallbackNode) {
                firstCallbackNode = newNode;
                scheduleHostCallbackIfNeeded();
            }
            var previous = next.previous;
            previous.next = next.previous = newNode;
            newNode.next = next;
            newNode.previous = previous;
        }
        return newNode;
    }

    function unstable_cancelCallback(callbackNode) {
        var next = callbackNode.next;
        if (next === null) {
            return;
        }
        if (next === callbackNode) {
            firstCallbackNode = null;
        } else {
            if (callbackNode === firstCallbackNode) {
                firstCallbackNode = next;
            }
            var previous = callbackNode.previous;
            previous.next = next;
            next.previous = previous;
        }
        callbackNode.next = callbackNode.previous = null;
    }

    function unstable_getCurrentPriorityLevel() {
        return currentPriorityLevel;
    }

    function unstable_shouldYield() {
        return !currentHostCallbackDidTimeout && (firstCallbackNode !== null && firstCallbackNode.expirationTime < currentExpirationTime || shouldYieldToHost());
    }

    var interactionsRef = null;
    var subscriberRef = null;

    var Scheduler_runWithPriority = unstable_runWithPriority,
        Scheduler_scheduleCallback = unstable_scheduleCallback,
        Scheduler_cancelCallback = unstable_cancelCallback,
        Scheduler_shouldYield = unstable_shouldYield,
        Scheduler_now = getCurrentTime,
        Scheduler_getCurrentPriorityLevel = unstable_getCurrentPriorityLevel,
        Scheduler_ImmediatePriority = ImmediatePriority,
        Scheduler_UserBlockingPriority = UserBlockingPriority,
        Scheduler_NormalPriority = NormalPriority,
        Scheduler_LowPriority = LowPriority,
        Scheduler_IdlePriority = IdlePriority;
    var fakeCallbackNode = {};
    var ImmediatePriority$1 = 99;
    var UserBlockingPriority$1 = 98;
    var NormalPriority$1 = 97;
    var LowPriority$1 = 96;
    var IdlePriority$1 = 95;
    var shouldYield = disableYielding ? function() {
            return false;
        } :
        Scheduler_shouldYield;
    var syncQueue = null;
    var immediateQueueCallbackNode = null;
    var isFlushingSyncQueue = false;
    var initialTimeMs = Scheduler_now();
    var now = initialTimeMs < 10000 ? Scheduler_now : function() {
        return Scheduler_now() - initialTimeMs;
    };

    function getCurrentPriorityLevel() {
        switch (Scheduler_getCurrentPriorityLevel()) {
            case Scheduler_ImmediatePriority:
                return ImmediatePriority$1;
            case Scheduler_UserBlockingPriority:
                return UserBlockingPriority$1;
            case Scheduler_NormalPriority:
                return NormalPriority$1;
            case Scheduler_LowPriority:
                return LowPriority$1;
            case Scheduler_IdlePriority:
                return IdlePriority$1;
            default:
                invariant(false, 'Unknown priority level.');
        }
    }

    function reactPriorityToSchedulerPriority(reactPriorityLevel) {
        switch (reactPriorityLevel) {
            case ImmediatePriority$1:
                return Scheduler_ImmediatePriority;
            case UserBlockingPriority$1:
                return Scheduler_UserBlockingPriority;
            case NormalPriority$1:
                return Scheduler_NormalPriority;
            case LowPriority$1:
                return Scheduler_LowPriority;
            case IdlePriority$1:
                return Scheduler_IdlePriority;
            default:
                invariant(false, 'Unknown priority level.');
        }
    }

    function runWithPriority(reactPriorityLevel, fn) {
        var priorityLevel = reactPriorityToSchedulerPriority(reactPriorityLevel);
        return Scheduler_runWithPriority(priorityLevel, fn);
    }

    function scheduleCallback(reactPriorityLevel, callback, options) {
        var priorityLevel = reactPriorityToSchedulerPriority(reactPriorityLevel);
        return Scheduler_scheduleCallback(priorityLevel, callback, options);
    }

    function scheduleSyncCallback(callback) {
        if (syncQueue === null) {
            syncQueue = [callback];
            immediateQueueCallbackNode = Scheduler_scheduleCallback(Scheduler_ImmediatePriority, flushSyncCallbackQueueImpl);
        } else {
            syncQueue.push(callback);
        }
        return fakeCallbackNode;
    }

    function cancelCallback(callbackNode) {
        if (callbackNode !== fakeCallbackNode) {
            Scheduler_cancelCallback(callbackNode);
        }
    }

    function flushSyncCallbackQueue() {
        if (immediateQueueCallbackNode !== null) {
            Scheduler_cancelCallback(immediateQueueCallbackNode);
        }
        flushSyncCallbackQueueImpl();
    }

    function flushSyncCallbackQueueImpl() {
        if (!isFlushingSyncQueue && syncQueue !== null) {
            isFlushingSyncQueue = true;
            var i = 0;
            try {
                var isSync = true;
                for (; i < syncQueue.length; i++) {
                    var callback = syncQueue[i];
                    do {
                        callback = callback(isSync);
                    } while (callback !== null);
                }
                syncQueue = null;
            } catch (error) {
                if (syncQueue !== null) {
                    syncQueue = syncQueue.slice(i + 1);
                }
                Scheduler_scheduleCallback(Scheduler_ImmediatePriority, flushSyncCallbackQueue);
                throw error;
            } finally {
                isFlushingSyncQueue = false;
            }
        }
    }

    var NoMode = 0;
    var StrictMode = 1;
    var BatchedMode = 2;
    var ConcurrentMode = 4;
    var ProfileMode = 8;

    var MAX_SIGNED_31_BIT_INT = 1073741823;

    var NoWork = 0;
    var Never = 1;
    var Sync = MAX_SIGNED_31_BIT_INT;
    var Batched = Sync - 1;
    var UNIT_SIZE = 10;
    var MAGIC_NUMBER_OFFSET = Batched - 1;

    function msToExpirationTime(ms) {
        return MAGIC_NUMBER_OFFSET - (ms / UNIT_SIZE | 0);
    }

    function expirationTimeToMs(expirationTime) {
        return (MAGIC_NUMBER_OFFSET - expirationTime) * UNIT_SIZE;
    }

    function ceiling(num, precision) {
        return ((num / precision | 0) + 1) * precision;
    }

    function computeExpirationBucket(currentTime, expirationInMs, bucketSizeMs) {
        return MAGIC_NUMBER_OFFSET - ceiling(MAGIC_NUMBER_OFFSET - currentTime + expirationInMs / UNIT_SIZE, bucketSizeMs / UNIT_SIZE);
    }
    var LOW_PRIORITY_EXPIRATION = 5000;
    var LOW_PRIORITY_BATCH_SIZE = 250;

    function computeAsyncExpiration(currentTime) {
        return computeExpirationBucket(currentTime, LOW_PRIORITY_EXPIRATION, LOW_PRIORITY_BATCH_SIZE);
    }

    function computeSuspenseExpiration(currentTime, timeoutMs) {
        return computeExpirationBucket(currentTime, timeoutMs, LOW_PRIORITY_BATCH_SIZE);
    }

    function computeAsyncExpirationNoBucket(currentTime) {
        return currentTime - LOW_PRIORITY_EXPIRATION / UNIT_SIZE;
    }
    var HIGH_PRIORITY_EXPIRATION = 150;
    var HIGH_PRIORITY_BATCH_SIZE = 100;

    function computeInteractiveExpiration(currentTime) {
        return computeExpirationBucket(currentTime, HIGH_PRIORITY_EXPIRATION, HIGH_PRIORITY_BATCH_SIZE);
    }

    function inferPriorityFromExpirationTime(currentTime, expirationTime) {
        if (expirationTime === Sync) {
            return ImmediatePriority$1;
        }
        if (expirationTime === Never) {
            return IdlePriority$1;
        }
        var msUntil = expirationTimeToMs(expirationTime) - expirationTimeToMs(currentTime);
        if (msUntil <= 0) {
            return ImmediatePriority$1;
        }
        if (msUntil <= HIGH_PRIORITY_EXPIRATION + HIGH_PRIORITY_BATCH_SIZE) {
            return UserBlockingPriority$1;
        }
        if (msUntil <= LOW_PRIORITY_EXPIRATION + LOW_PRIORITY_BATCH_SIZE) {
            return NormalPriority$1;
        }
        return IdlePriority$1;
    }

    function is(x, y) {
        return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y;
    }

    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function shallowEqual(objA, objB) {
        if (is(objA, objB)) {
            return true;
        }
        if ((typeof objA === 'undefined' ? 'undefined' : _typeof(objA)) !== 'object' || objA === null || (typeof objB === 'undefined' ? 'undefined' : _typeof(objB)) !== 'object' || objB === null) {
            return false;
        }
        var keysA = Object.keys(objA);
        var keysB = Object.keys(objB);
        if (keysA.length !== keysB.length) {
            return false;
        }
        for (var i = 0; i < keysA.length; i++) {
            if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
                return false;
            }
        }
        return true;
    }

    function resolveDefaultProps(Component, baseProps) {
        if (Component && Component.defaultProps) {
            var props = Object.assign({}, baseProps);
            var defaultProps = Component.defaultProps;
            for (var propName in defaultProps) {
                if (props[propName] === undefined) {
                    props[propName] = defaultProps[propName];
                }
            }
            return props;
        }
        return baseProps;
    }

    function readLazyComponentType(lazyComponent) {
        var status = lazyComponent._status;
        var result = lazyComponent._result;
        switch (status) {
            case Resolved:
                {
                    var Component = result;
                    return Component;
                }
            case Rejected:
                {
                    var error = result;
                    throw error;
                }
            case Pending:
                {
                    var thenable = result;
                    throw thenable;
                }
            default:
                {
                    lazyComponent._status = Pending;
                    var ctor = lazyComponent._ctor;
                    var _thenable = ctor();
                    _thenable.then(function(moduleObject) {
                        if (lazyComponent._status === Pending) {
                            var defaultExport = moduleObject.default;
                            lazyComponent._status = Resolved;
                            lazyComponent._result = defaultExport;
                        }
                    }, function(error) {
                        if (lazyComponent._status === Pending) {
                            lazyComponent._status = Rejected;
                            lazyComponent._result = error;
                        }
                    });
                    switch (lazyComponent._status) {
                        case Resolved:
                            return lazyComponent._result;
                        case Rejected:
                            throw lazyComponent._result;
                    }
                    lazyComponent._result = _thenable;
                    throw _thenable;
                }
        }
    }

    var valueCursor = createCursor(null);
    var currentlyRenderingFiber = null;
    var lastContextDependency = null;
    var lastContextWithAllBitsObserved = null;

    function resetContextDependences() {
        currentlyRenderingFiber = null;
        lastContextDependency = null;
        lastContextWithAllBitsObserved = null;
    }

    function pushProvider(providerFiber, nextValue) {
        var context = providerFiber.type._context;
        if (ReactDOMHostConfig.isPrimaryRenderer) {
            push(valueCursor, context._currentValue, providerFiber);
            context._currentValue = nextValue;
        } else {
            push(valueCursor, context._currentValue2, providerFiber);
            context._currentValue2 = nextValue;
        }
    }

    function popProvider(providerFiber) {
        var currentValue = valueCursor.current;
        pop(valueCursor, providerFiber);
        var context = providerFiber.type._context;
        if (ReactDOMHostConfig.isPrimaryRenderer) {
            context._currentValue = currentValue;
        } else {
            context._currentValue2 = currentValue;
        }
    }

    function calculateChangedBits(context, newValue, oldValue) {
        if (is(oldValue, newValue)) {
            return 0;
        } else {
            var changedBits = typeof context._calculateChangedBits === 'function' ? context._calculateChangedBits(oldValue, newValue) : MAX_SIGNED_31_BIT_INT;
            return changedBits | 0;
        }
    }

    function scheduleWorkOnParentPath(parent, renderExpirationTime) {
        var node = parent;
        while (node !== null) {
            var alternate = node.alternate;
            if (node.childExpirationTime < renderExpirationTime) {
                node.childExpirationTime = renderExpirationTime;
                if (alternate !== null && alternate.childExpirationTime < renderExpirationTime) {
                    alternate.childExpirationTime = renderExpirationTime;
                }
            } else if (alternate !== null && alternate.childExpirationTime < renderExpirationTime) {
                alternate.childExpirationTime = renderExpirationTime;
            } else {
                break;
            }
            node = node.return;
        }
    }

    function propagateContextChange(workInProgress, context, changedBits, renderExpirationTime) {
        var fiber = workInProgress.child;
        if (fiber !== null) {
            fiber.return = workInProgress;
        }
        while (fiber !== null) {
            var nextFiber = void 0;
            var list = fiber.contextDependencies;
            if (list !== null) {
                nextFiber = fiber.child;
                var dependency = list.first;
                while (dependency !== null) {
                    if (dependency.context === context && (dependency.observedBits & changedBits) !== 0) {
                        if (fiber.tag === ClassComponent) {
                            var update = ReactUpdateQueue.createUpdate(renderExpirationTime, null);
                            update.tag = ReactUpdateQueue.ForceUpdate;
                            ReactUpdateQueue.enqueueUpdate(fiber, update);
                        }
                        if (fiber.expirationTime < renderExpirationTime) {
                            fiber.expirationTime = renderExpirationTime;
                        }
                        var alternate = fiber.alternate;
                        if (alternate !== null && alternate.expirationTime < renderExpirationTime) {
                            alternate.expirationTime = renderExpirationTime;
                        }
                        scheduleWorkOnParentPath(fiber.return, renderExpirationTime);
                        if (list.expirationTime < renderExpirationTime) {
                            list.expirationTime = renderExpirationTime;
                        }
                        break;
                    }
                    dependency = dependency.next;
                }
            } else if (fiber.tag === ContextProvider) {
                nextFiber = fiber.type === workInProgress.type ? null : fiber.child;
            } else {
                nextFiber = fiber.child;
            }
            if (nextFiber !== null) {
                nextFiber.return = fiber;
            } else {
                nextFiber = fiber;
                while (nextFiber !== null) {
                    if (nextFiber === workInProgress) {
                        nextFiber = null;
                        break;
                    }
                    var sibling = nextFiber.sibling;
                    if (sibling !== null) {
                        sibling.return = nextFiber.return;
                        nextFiber = sibling;
                        break;
                    }
                    nextFiber = nextFiber.return;
                }
            }
            fiber = nextFiber;
        }
    }

    function prepareToReadContext(workInProgress, renderExpirationTime) {
        currentlyRenderingFiber = workInProgress;
        lastContextDependency = null;
        lastContextWithAllBitsObserved = null;
        var currentDependencies = workInProgress.contextDependencies;
        if (currentDependencies !== null && currentDependencies.expirationTime >= renderExpirationTime) {
            markWorkInProgressReceivedUpdate();
        }
        workInProgress.contextDependencies = null;
    }

    function readContext(context, observedBits) {
        if (lastContextWithAllBitsObserved === context);
        else if (observedBits === false || observedBits === 0);
        else {
            var resolvedObservedBits = void 0;
            if (typeof observedBits !== 'number' || observedBits === MAX_SIGNED_31_BIT_INT) {
                lastContextWithAllBitsObserved = context;
                resolvedObservedBits = MAX_SIGNED_31_BIT_INT;
            } else {
                resolvedObservedBits = observedBits;
            }
            var contextItem = {
                context: context,
                observedBits: resolvedObservedBits,
                next: null
            };
            if (lastContextDependency === null) {
                invariant(currentlyRenderingFiber !== null, 'Context can only be read while React is rendering. ' + 'In classes, you can read it in the render method or getDerivedStateFromProps. ' + 'In function components, you can read it directly in the function body, but not ' + 'inside Hooks like useReducer() or useMemo().');
                lastContextDependency = contextItem;
                currentlyRenderingFiber.contextDependencies = {
                    first: contextItem,
                    expirationTime: NoWork
                };
            } else {
                lastContextDependency = lastContextDependency.next = contextItem;
            }
        }
        return ReactDOMHostConfig.isPrimaryRenderer ? context._currentValue : context._currentValue2;
    }

    var UpdateState = 0;
    var ReplaceState = 1;
    var ForceUpdate = 2;
    var CaptureUpdate = 3;
    var hasForceUpdate = false;

    function createUpdateQueue(baseState) {
        var queue = {
            baseState: baseState,
            firstUpdate: null,
            lastUpdate: null,
            firstCapturedUpdate: null,
            lastCapturedUpdate: null,
            firstEffect: null,
            lastEffect: null,
            firstCapturedEffect: null,
            lastCapturedEffect: null
        };
        return queue;
    }

    function cloneUpdateQueue(currentQueue) {
        var queue = {
            baseState: currentQueue.baseState,
            firstUpdate: currentQueue.firstUpdate,
            lastUpdate: currentQueue.lastUpdate,
            firstCapturedUpdate: null,
            lastCapturedUpdate: null,
            firstEffect: null,
            lastEffect: null,
            firstCapturedEffect: null,
            lastCapturedEffect: null
        };
        return queue;
    }

    function createUpdate(expirationTime, suspenseConfig) {
        return {
            expirationTime: expirationTime,
            suspenseConfig: suspenseConfig,
            tag: UpdateState,
            payload: null,
            callback: null,
            next: null,
            nextEffect: null
        };
    }

    function appendUpdateToQueue(queue, update) {
        if (queue.lastUpdate === null) {
            queue.firstUpdate = queue.lastUpdate = update;
        } else {
            queue.lastUpdate.next = update;
            queue.lastUpdate = update;
        }
    }

    function enqueueUpdate(fiber, update) {
        var alternate = fiber.alternate;
        var queue1 = void 0;
        var queue2 = void 0;
        if (alternate === null) { //如果备胎不存在那么，queue2为null， queue1保证存在
            queue1 = fiber.updateQueue;
            queue2 = null;
            if (queue1 === null) {
                queue1 = fiber.updateQueue = createUpdateQueue(fiber.memoizedState);
            }
        } else {
            queue1 = fiber.updateQueue;
            queue2 = alternate.updateQueue;
            if (queue1 === null) {
                if (queue2 === null) { //都不存在，它们根据memoizedState创建
                    queue1 = fiber.updateQueue = createUpdateQueue(fiber.memoizedState);
                    queue2 = alternate.updateQueue = createUpdateQueue(alternate.memoizedState);
                } else { // queue1不存在，那么复制queue2
                    queue1 = fiber.updateQueue = cloneUpdateQueue(queue2);
                }
            } else {
                if (queue2 === null) { //有一方存在，就克隆另一方
                    queue2 = alternate.updateQueue = cloneUpdateQueue(queue1);
                }
            }
        }
        if (queue2 === null || queue1 === queue2) {
            appendUpdateToQueue(queue1, update);
        } else {
            if (queue1.lastUpdate === null || queue2.lastUpdate === null) {
                appendUpdateToQueue(queue1, update);
                appendUpdateToQueue(queue2, update);
            } else {
                appendUpdateToQueue(queue1, update);
                queue2.lastUpdate = update;
            }
        }
    }

    function enqueueUpdate(fiber, update) {
        var alternate = fiber.alternate || {};
        var queue1 = fiber.updateQueue;
        var queue2 = alternate.updateQueue;
        if (queue1 && !queue2) {
            queue2 = alternate.updateQueue = cloneUpdateQueue(queue1);
        } else if (!queue1 && queue2) {
            queue1 = fiber.updateQueue = cloneUpdateQueue(queue2);
        } else if (!queue1 && !queue2) {
            queue1 = fiber.updateQueue = createUpdateQueue(fiber.memoizedState);
            queue2 = alternate.updateQueue = alternate.memoizedState ? createUpdateQueue(alternate.memoizedState) : null;
        }

        if (!queue2 || queue1 === queue2) {
            appendUpdateToQueue(queue1, update);
        } else {
            if (queue1.lastUpdate === null || queue2.lastUpdate === null) {
                appendUpdateToQueue(queue1, update);
                appendUpdateToQueue(queue2, update);
            } else {
                appendUpdateToQueue(queue1, update);
                queue2.lastUpdate = update;
            }
        }
    }

    function enqueueCapturedUpdate(workInProgress, update) {
        var workInProgressQueue = workInProgress.updateQueue;
        if (workInProgressQueue === null) {
            workInProgressQueue = workInProgress.updateQueue = createUpdateQueue(workInProgress.memoizedState);
        } else {
            workInProgressQueue = ensureWorkInProgressQueueIsAClone(workInProgress, workInProgressQueue);
        }
        if (workInProgressQueue.lastCapturedUpdate === null) {
            workInProgressQueue.firstCapturedUpdate = workInProgressQueue.lastCapturedUpdate = update;
        } else {
            workInProgressQueue.lastCapturedUpdate.next = update;
            workInProgressQueue.lastCapturedUpdate = update;
        }
    }

    function ensureWorkInProgressQueueIsAClone(workInProgress, queue) {
        var current = workInProgress.alternate;
        if (current !== null) {
            if (queue === current.updateQueue) {
                queue = workInProgress.updateQueue = cloneUpdateQueue(queue);
            }
        }
        return queue;
    }

    function getStateFromUpdate(workInProgress, queue, update, prevState, nextProps, instance) {
        switch (update.tag) {
            case ReplaceState:
                {
                    var payload = update.payload;
                    if (typeof payload === 'function') {
                        var nextState = payload.call(instance, prevState, nextProps);
                        return nextState;
                    }
                    return payload;
                }
            case CaptureUpdate:
                {
                    workInProgress.effectTag = workInProgress.effectTag & ~ShouldCapture | DidCapture;
                }
            case UpdateState:
                {
                    var _payload = update.payload;
                    var partialState = void 0;
                    if (typeof _payload === 'function') {
                        partialState = _payload.call(instance, prevState, nextProps);
                    } else {
                        partialState = _payload;
                    }
                    if (partialState === null || partialState === undefined) {
                        return prevState;
                    }
                    return Object.assign({}, prevState, partialState);
                }
            case ForceUpdate:
                {
                    hasForceUpdate = true;
                    return prevState;
                }
        }
        return prevState;
    }

    function processUpdateQueue(workInProgress, queue, props, instance, renderExpirationTime) {
        hasForceUpdate = false;
        queue = ensureWorkInProgressQueueIsAClone(workInProgress, queue);
        var newBaseState = queue.baseState;
        var newFirstUpdate = null;
        var newExpirationTime = NoWork;
        var update = queue.firstUpdate;
        var resultState = newBaseState;
        while (update !== null) {
            var updateExpirationTime = update.expirationTime;
            if (updateExpirationTime < renderExpirationTime) {
                if (newFirstUpdate === null) {
                    newFirstUpdate = update;
                    newBaseState = resultState;
                }
                if (newExpirationTime < updateExpirationTime) {
                    newExpirationTime = updateExpirationTime;
                }
            } else {
                markRenderEventTimeAndConfig(updateExpirationTime, update.suspenseConfig);
                resultState = getStateFromUpdate(workInProgress, queue, update, resultState, props, instance);
                var callback = update.callback;
                if (callback !== null) {
                    workInProgress.effectTag |= Callback;
                    update.nextEffect = null;
                    if (queue.lastEffect === null) {
                        queue.firstEffect = queue.lastEffect = update;
                    } else {
                        queue.lastEffect.nextEffect = update;
                        queue.lastEffect = update;
                    }
                }
            }
            update = update.next;
        }
        var newFirstCapturedUpdate = null;
        update = queue.firstCapturedUpdate;
        while (update !== null) {
            var _updateExpirationTime = update.expirationTime;
            if (_updateExpirationTime < renderExpirationTime) {
                if (newFirstCapturedUpdate === null) {
                    newFirstCapturedUpdate = update;
                    if (newFirstUpdate === null) {
                        newBaseState = resultState;
                    }
                }
                if (newExpirationTime < _updateExpirationTime) {
                    newExpirationTime = _updateExpirationTime;
                }
            } else {
                resultState = getStateFromUpdate(workInProgress, queue, update, resultState, props, instance);
                var _callback = update.callback;
                if (_callback !== null) {
                    workInProgress.effectTag |= Callback;
                    update.nextEffect = null;
                    if (queue.lastCapturedEffect === null) {
                        queue.firstCapturedEffect = queue.lastCapturedEffect = update;
                    } else {
                        queue.lastCapturedEffect.nextEffect = update;
                        queue.lastCapturedEffect = update;
                    }
                }
            }
            update = update.next;
        }
        if (newFirstUpdate === null) {
            queue.lastUpdate = null;
        }
        if (newFirstCapturedUpdate === null) {
            queue.lastCapturedUpdate = null;
        } else {
            workInProgress.effectTag |= Callback;
        }
        if (newFirstUpdate === null && newFirstCapturedUpdate === null) {
            newBaseState = resultState;
        }
        queue.baseState = newBaseState;
        queue.firstUpdate = newFirstUpdate;
        queue.firstCapturedUpdate = newFirstCapturedUpdate;
        workInProgress.expirationTime = newExpirationTime;
        workInProgress.memoizedState = resultState;
    }

    function callCallback(callback, context) {
        invariant(typeof callback === 'function', 'Invalid argument passed as callback. Expected a function. Instead ' + 'received: %s', callback);
        callback.call(context);
    }

    function resetHasForceUpdateBeforeProcessing() {
        hasForceUpdate = false;
    }

    function checkHasForceUpdateAfterProcessing() {
        return hasForceUpdate;
    }

    function commitUpdateQueue(finishedWork, finishedQueue, instance, renderExpirationTime) {
        if (finishedQueue.firstCapturedUpdate !== null) {
            if (finishedQueue.lastUpdate !== null) {
                finishedQueue.lastUpdate.next = finishedQueue.firstCapturedUpdate;
                finishedQueue.lastUpdate = finishedQueue.lastCapturedUpdate;
            }
            finishedQueue.firstCapturedUpdate = finishedQueue.lastCapturedUpdate = null;
        }
        commitUpdateEffects(finishedQueue.firstEffect, instance);
        finishedQueue.firstEffect = finishedQueue.lastEffect = null;
        commitUpdateEffects(finishedQueue.firstCapturedEffect, instance);
        finishedQueue.firstCapturedEffect = finishedQueue.lastCapturedEffect = null;
    }

    function commitUpdateEffects(effect, instance) {
        while (effect !== null) {
            var callback = effect.callback;
            if (callback !== null) {
                effect.callback = null;
                callCallback(callback, instance);
            }
            effect = effect.nextEffect;
        }
    }

    var ReactCurrentBatchConfig = ReactSharedInternals.ReactCurrentBatchConfig;

    function requestCurrentSuspenseConfig() {
        return ReactCurrentBatchConfig.suspense;
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) { return typeof obj; } : function(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
    var emptyRefsObject = new React.Component().refs;

    function applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, nextProps) {
        var prevState = workInProgress.memoizedState;
        var partialState = getDerivedStateFromProps(nextProps, prevState);
        var memoizedState = partialState === null || partialState === undefined ? prevState : Object.assign({}, prevState, partialState);
        workInProgress.memoizedState = memoizedState;
        var updateQueue = workInProgress.updateQueue;
        if (updateQueue !== null && workInProgress.expirationTime === NoWork) {
            updateQueue.baseState = memoizedState;
        }
    }

    function enqueueSetState(inst, payload, callback, tag) {
        var fiber = get(inst);
        var currentTime = requestCurrentTime();
        var suspenseConfig = requestCurrentSuspenseConfig();
        var expirationTime = computeExpirationForFiber(currentTime, fiber, suspenseConfig);
        var update = createUpdate(expirationTime, suspenseConfig);
        update.payload = payload;
        if (tag) {
            update.tag = tag
        }
        if (callback !== undefined && callback !== null) {
            update.callback = callback;
        }
        enqueueUpdate(fiber, update);
        scheduleWork(fiber, expirationTime);
    }
    var classComponentUpdater = {
        isMounted: reflection.isMounted,
        enqueueSetState: enqueueSetState,
        enqueueReplaceState: function enqueueReplaceState(inst, payload, callback) {
            enqueueSetState(inst, payload, callback, ReplaceState)
        },
        enqueueForceUpdate: function enqueueForceUpdate(inst, callback) {
            enqueueSetState(inst, payload, callback, ForceUpdate)
        }
    };

    function checkShouldComponentUpdate(workInProgress, ctor, oldProps, newProps, oldState, newState, nextContext) {
        var instance = workInProgress.stateNode;
        if (typeof instance.shouldComponentUpdate === 'function') {
            var shouldUpdate = instance.shouldComponentUpdate(newProps, newState, nextContext);
            return shouldUpdate;
        }
        if (ctor.prototype && ctor.prototype.isPureReactComponent) {
            return !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState);
        }
        return true;
    }

    function adoptClassInstance(workInProgress, instance) {
        instance.updater = classComponentUpdater;
        workInProgress.stateNode = instance;
        set(instance, workInProgress);
    }

    function constructClassInstance(workInProgress, ctor, props, renderExpirationTime) {
        var isLegacyContextConsumer = false;
        var unmaskedContext = emptyContextObject;
        var context = null;
        var contextType = ctor.contextType;
        if ((typeof contextType === 'undefined' ? 'undefined' : _typeof(contextType)) === 'object' && contextType !== null) {
            context = readContext(contextType);
        } else {
            unmaskedContext = getUnmaskedContext(workInProgress, ctor, true);
            var contextTypes = ctor.contextTypes;
            isLegacyContextConsumer = contextTypes !== null && contextTypes !== undefined;
            context = isLegacyContextConsumer ? getMaskedContext(workInProgress, unmaskedContext) : emptyContextObject;
        }
        var instance = new ctor(props, context);
        var state = workInProgress.memoizedState = instance.state !== null && instance.state !== undefined ? instance.state : null;
        adoptClassInstance(workInProgress, instance);
        if (isLegacyContextConsumer) {
            cacheContext(workInProgress, unmaskedContext, context);
        }
        return instance;
    }

    function callComponentWillMount(workInProgress, instance) {
        var oldState = instance.state;
        if (typeof instance.componentWillMount === 'function') {
            instance.componentWillMount();
        }
        if (typeof instance.UNSAFE_componentWillMount === 'function') {
            instance.UNSAFE_componentWillMount();
        }
        if (oldState !== instance.state) {
            classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
        }
    }

    function callComponentWillReceiveProps(workInProgress, instance, newProps, nextContext) {
        var oldState = instance.state;
        if (typeof instance.componentWillReceiveProps === 'function') {
            instance.componentWillReceiveProps(newProps, nextContext);
        }
        if (typeof instance.UNSAFE_componentWillReceiveProps === 'function') {
            instance.UNSAFE_componentWillReceiveProps(newProps, nextContext);
        }
        if (instance.state !== oldState) {
            classComponentUpdater.enqueueReplaceState(instance, instance.state, null);
        }
    }

    function mountClassInstance(workInProgress, ctor, newProps, renderExpirationTime) {
        var instance = workInProgress.stateNode;
        instance.props = newProps;
        instance.state = workInProgress.memoizedState;
        instance.refs = emptyRefsObject;
        var contextType = ctor.contextType;
        if ((typeof contextType === 'undefined' ? 'undefined' : _typeof(contextType)) === 'object' && contextType !== null) {
            instance.context = readContext(contextType);
        } else {
            var unmaskedContext = getUnmaskedContext(workInProgress, ctor, true);
            instance.context = getMaskedContext(workInProgress, unmaskedContext);
        }
        var updateQueue = workInProgress.updateQueue;
        if (updateQueue !== null) {
            processUpdateQueue(workInProgress, updateQueue, newProps, instance, renderExpirationTime);
            instance.state = workInProgress.memoizedState;
        }
        var getDerivedStateFromProps = ctor.getDerivedStateFromProps;
        if (typeof getDerivedStateFromProps === 'function') {
            applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, newProps);
            instance.state = workInProgress.memoizedState;
        }
        if (typeof ctor.getDerivedStateFromProps !== 'function' && typeof instance.getSnapshotBeforeUpdate !== 'function' &&
            (typeof instance.UNSAFE_componentWillMount === 'function' ||
                typeof instance.componentWillMount === 'function')) {
            callComponentWillMount(workInProgress, instance);
            updateQueue = workInProgress.updateQueue;
            if (updateQueue !== null) {
                processUpdateQueue(workInProgress, updateQueue, newProps, instance, renderExpirationTime);
                instance.state = workInProgress.memoizedState;
            }
        }
        if (typeof instance.componentDidMount === 'function') {
            workInProgress.effectTag |= Update;
        }
    }

    function resumeMountClassInstance(workInProgress, ctor, newProps, renderExpirationTime) {
        var instance = workInProgress.stateNode;
        var oldProps = workInProgress.memoizedProps;
        instance.props = oldProps;
        var oldContext = instance.context;
        var contextType = ctor.contextType;
        var nextContext = void 0;
        if ((typeof contextType === 'undefined' ? 'undefined' : _typeof(contextType)) === 'object' && contextType !== null) {
            nextContext = readContext(contextType);
        } else {
            var nextLegacyUnmaskedContext = getUnmaskedContext(workInProgress, ctor, true);
            nextContext = getMaskedContext(workInProgress, nextLegacyUnmaskedContext);
        }
        var getDerivedStateFromProps = ctor.getDerivedStateFromProps;
        var hasNewLifecycles = typeof getDerivedStateFromProps === 'function' || typeof instance.getSnapshotBeforeUpdate === 'function';
        if (!hasNewLifecycles && (typeof instance.UNSAFE_componentWillReceiveProps === 'function' || typeof instance.componentWillReceiveProps === 'function')) {
            if (oldProps !== newProps || oldContext !== nextContext) {
                callComponentWillReceiveProps(workInProgress, instance, newProps, nextContext);
            }
        }
        resetHasForceUpdateBeforeProcessing();
        var oldState = workInProgress.memoizedState;
        var newState = instance.state = oldState;
        var updateQueue = workInProgress.updateQueue;
        if (updateQueue !== null) {
            processUpdateQueue(workInProgress, updateQueue, newProps, instance, renderExpirationTime);
            newState = workInProgress.memoizedState;
        }
        if (oldProps === newProps && oldState === newState && !hasContextChanged() && !checkHasForceUpdateAfterProcessing()) {
            if (typeof instance.componentDidMount === 'function') {
                workInProgress.effectTag |= Update;
            }
            return false;
        }
        if (typeof getDerivedStateFromProps === 'function') {
            applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, newProps);
            newState = workInProgress.memoizedState;
        }
        var shouldUpdate = checkHasForceUpdateAfterProcessing() || checkShouldComponentUpdate(workInProgress, ctor, oldProps, newProps, oldState, newState, nextContext);
        if (shouldUpdate) {
            if (!hasNewLifecycles && (typeof instance.UNSAFE_componentWillMount === 'function' || typeof instance.componentWillMount === 'function')) {
                if (typeof instance.componentWillMount === 'function') {
                    instance.componentWillMount();
                }
                if (typeof instance.UNSAFE_componentWillMount === 'function') {
                    instance.UNSAFE_componentWillMount();
                }
            }
            if (typeof instance.componentDidMount === 'function') {
                workInProgress.effectTag |= Update;
            }
        } else {
            if (typeof instance.componentDidMount === 'function') {
                workInProgress.effectTag |= Update;
            }
            workInProgress.memoizedProps = newProps;
            workInProgress.memoizedState = newState;
        }
        instance.props = newProps;
        instance.state = newState;
        instance.context = nextContext;
        return shouldUpdate;
    }

    function updateClassInstance(current, workInProgress, ctor, newProps, renderExpirationTime) {
        var instance = workInProgress.stateNode;
        var oldProps = workInProgress.memoizedProps;
        instance.props = workInProgress.type === workInProgress.elementType ? oldProps : resolveDefaultProps(workInProgress.type, oldProps);
        var oldContext = instance.context;
        var contextType = ctor.contextType;
        var nextContext = void 0;
        if ((typeof contextType === 'undefined' ? 'undefined' : _typeof(contextType)) === 'object' && contextType !== null) {
            nextContext = readContext(contextType);
        } else {
            var nextUnmaskedContext = getUnmaskedContext(workInProgress, ctor, true);
            nextContext = getMaskedContext(workInProgress, nextUnmaskedContext);
        }
        var getDerivedStateFromProps = ctor.getDerivedStateFromProps;
        var hasNewLifecycles = typeof getDerivedStateFromProps === 'function' || typeof instance.getSnapshotBeforeUpdate === 'function';
        if (!hasNewLifecycles && (typeof instance.UNSAFE_componentWillReceiveProps === 'function' || typeof instance.componentWillReceiveProps === 'function')) {
            if (oldProps !== newProps || oldContext !== nextContext) {
                callComponentWillReceiveProps(workInProgress, instance, newProps, nextContext);
            }
        }
        resetHasForceUpdateBeforeProcessing();
        var oldState = workInProgress.memoizedState;
        var newState = instance.state = oldState;
        var updateQueue = workInProgress.updateQueue;
        if (updateQueue !== null) {
            processUpdateQueue(workInProgress, updateQueue, newProps, instance, renderExpirationTime);
            newState = workInProgress.memoizedState;
        }
        if (oldProps === newProps && oldState === newState && !hasContextChanged() && !checkHasForceUpdateAfterProcessing()) {
            if (typeof instance.componentDidUpdate === 'function') {
                if (oldProps !== current.memoizedProps || oldState !== current.memoizedState) {
                    workInProgress.effectTag |= Update;
                }
            }
            if (typeof instance.getSnapshotBeforeUpdate === 'function') {
                if (oldProps !== current.memoizedProps || oldState !== current.memoizedState) {
                    workInProgress.effectTag |= Snapshot;
                }
            }
            return false;
        }
        if (typeof getDerivedStateFromProps === 'function') {
            applyDerivedStateFromProps(workInProgress, ctor, getDerivedStateFromProps, newProps);
            newState = workInProgress.memoizedState;
        }
        var shouldUpdate = checkHasForceUpdateAfterProcessing() || checkShouldComponentUpdate(workInProgress, ctor, oldProps, newProps, oldState, newState, nextContext);
        if (shouldUpdate) {
            if (!hasNewLifecycles && (typeof instance.UNSAFE_componentWillUpdate === 'function' || typeof instance.componentWillUpdate === 'function')) {
                if (typeof instance.componentWillUpdate === 'function') {
                    instance.componentWillUpdate(newProps, newState, nextContext);
                }
                if (typeof instance.UNSAFE_componentWillUpdate === 'function') {
                    instance.UNSAFE_componentWillUpdate(newProps, newState, nextContext);
                }
            }
            if (typeof instance.componentDidUpdate === 'function') {
                workInProgress.effectTag |= Update;
            }
            if (typeof instance.getSnapshotBeforeUpdate === 'function') {
                workInProgress.effectTag |= Snapshot;
            }
        } else {
            if (typeof instance.componentDidUpdate === 'function') {
                if (oldProps !== current.memoizedProps || oldState !== current.memoizedState) {
                    workInProgress.effectTag |= Update;
                }
            }
            if (typeof instance.getSnapshotBeforeUpdate === 'function') {
                if (oldProps !== current.memoizedProps || oldState !== current.memoizedState) {
                    workInProgress.effectTag |= Snapshot;
                }
            }
            workInProgress.memoizedProps = newProps;
            workInProgress.memoizedState = newState;
        }
        instance.props = newProps;
        instance.state = newState;
        instance.context = nextContext;
        return shouldUpdate;
    }

    var isArray$1 = Array.isArray;

    function coerceRef(returnFiber, current$$1, element) {
        var mixedRef = element.ref;
        if (mixedRef !== null && typeof mixedRef !== 'function' && (typeof mixedRef === 'undefined' ? 'undefined' : _typeof(mixedRef)) !== 'object') {
            if (element._owner) {
                var owner = element._owner;
                var inst = void 0;
                if (owner) {
                    var ownerFiber = owner;
                    invariant(ownerFiber.tag === ClassComponent, 'Function components cannot have refs. ' + 'Did you mean to use React.forwardRef()?');
                    inst = ownerFiber.stateNode;
                }
                invariant(inst, 'Missing owner for string ref %s. This error is likely caused by a ' + 'bug in React. Please file an issue.', mixedRef);
                var stringRef = '' + mixedRef;
                if (current$$1 !== null && current$$1.ref !== null && typeof current$$1.ref === 'function' && current$$1.ref._stringRef === stringRef) {
                    return current$$1.ref;
                }
                var ref = function ref(value) {
                    var refs = inst.refs;
                    if (refs === emptyRefsObject) {
                        refs = inst.refs = {};
                    }
                    if (value === null) {
                        delete refs[stringRef];
                    } else {
                        refs[stringRef] = value;
                    }
                };
                ref._stringRef = stringRef;
                return ref;
            } else {
                invariant(typeof mixedRef === 'string', 'Expected ref to be a function, a string, an object returned by React.createRef(), or null.');
                invariant(element._owner, 'Element ref was specified as a string (%s) but no owner was set. This could happen for one of' + ' the following reasons:\n' + '1. You may be adding a ref to a function component\n' + "2. You may be adding a ref to a component that was not created inside a component's render method\n" + '3. You have multiple copies of React loaded\n' + 'See https://fb.me/react-refs-must-have-owner for more information.', mixedRef);
            }
        }
        return mixedRef;
    }

    function throwOnInvalidObjectType(returnFiber, newChild) {
        if (returnFiber.type !== 'textarea') {
            var addendum = '';
            invariant(false, 'Objects are not valid as a React child (found: %s).%s', Object.prototype.toString.call(newChild) === '[object Object]' ? 'object with keys {' + Object.keys(newChild).join(', ') + '}' : newChild, addendum);
        }
    }

    function ChildReconciler(shouldTrackSideEffects) {
        function deleteChild(returnFiber, childToDelete) {
            if (!shouldTrackSideEffects) {
                return;
            }
            var last = returnFiber.lastEffect;
            if (last !== null) {
                last.nextEffect = childToDelete;
                returnFiber.lastEffect = childToDelete;
            } else {
                returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
            }
            childToDelete.nextEffect = null;
            childToDelete.effectTag = Deletion;
        }

        function deleteRemainingChildren(returnFiber, currentFirstChild) {
            if (!shouldTrackSideEffects) {
                return null;
            }
            var childToDelete = currentFirstChild;
            while (childToDelete !== null) {
                deleteChild(returnFiber, childToDelete);
                childToDelete = childToDelete.sibling;
            }
            return null;
        }

        function mapRemainingChildren(returnFiber, currentFirstChild) {
            var existingChildren = new Map();
            var existingChild = currentFirstChild;
            while (existingChild !== null) {
                if (existingChild.key !== null) {
                    existingChildren.set(existingChild.key, existingChild);
                } else {
                    existingChildren.set(existingChild.index, existingChild);
                }
                existingChild = existingChild.sibling;
            }
            return existingChildren;
        }

        function useFiber(fiber, pendingProps, expirationTime) {
            var clone = createWorkInProgress(fiber, pendingProps, expirationTime);
            clone.index = 0;
            clone.sibling = null;
            return clone;
        }

        function placeChild(newFiber, lastPlacedIndex, newIndex) {
            newFiber.index = newIndex;
            if (!shouldTrackSideEffects) {
                return lastPlacedIndex;
            }
            var current$$1 = newFiber.alternate;
            if (current$$1 !== null) {
                var oldIndex = current$$1.index;
                if (oldIndex < lastPlacedIndex) {
                    newFiber.effectTag = Placement;
                    return lastPlacedIndex;
                } else {
                    return oldIndex;
                }
            } else {
                newFiber.effectTag = Placement;
                return lastPlacedIndex;
            }
        }

        function placeSingleChild(newFiber) {
            if (shouldTrackSideEffects && newFiber.alternate === null) {
                newFiber.effectTag = Placement;
            }
            return newFiber;
        }

        function updateTextNode(returnFiber, current$$1, textContent, expirationTime) {
            if (current$$1 === null || current$$1.tag !== HostText) {
                var created = createFiberFromText(textContent, returnFiber.mode, expirationTime);
                created.return = returnFiber;
                return created;
            } else {
                var existing = useFiber(current$$1, textContent, expirationTime);
                existing.return = returnFiber;
                return existing;
            }
        }

        function updateElement(returnFiber, current$$1, element, expirationTime) {
            if (current$$1 !== null && (current$$1.elementType === element.type || (
                    false))) {
                var existing = useFiber(current$$1, element.props, expirationTime);
                existing.ref = coerceRef(returnFiber, current$$1, element);
                existing.return = returnFiber;
                return existing;
            } else {
                var created = createFiberFromElement(element, returnFiber.mode, expirationTime);
                created.ref = coerceRef(returnFiber, current$$1, element);
                created.return = returnFiber;
                return created;
            }
        }

        function updatePortal(returnFiber, current$$1, portal, expirationTime) {
            if (current$$1 === null || current$$1.tag !== HostPortal || current$$1.stateNode.containerInfo !== portal.containerInfo || current$$1.stateNode.implementation !== portal.implementation) {
                var created = createFiberFromPortal(portal, returnFiber.mode, expirationTime);
                created.return = returnFiber;
                return created;
            } else {
                var existing = useFiber(current$$1, portal.children || [], expirationTime);
                existing.return = returnFiber;
                return existing;
            }
        }

        function updateFragment(returnFiber, current$$1, fragment, expirationTime, key) {
            if (current$$1 === null || current$$1.tag !== Fragment) {
                var created = createFiberFromFragment(fragment, returnFiber.mode, expirationTime, key);
                created.return = returnFiber;
                return created;
            } else {
                var existing = useFiber(current$$1, fragment, expirationTime);
                existing.return = returnFiber;
                return existing;
            }
        }

        function createChild(returnFiber, newChild, expirationTime) {
            if (typeof newChild === 'string' || typeof newChild === 'number') {
                var created = createFiberFromText('' + newChild, returnFiber.mode, expirationTime);
                created.return = returnFiber;
                return created;
            }
            if ((typeof newChild === 'undefined' ? 'undefined' : _typeof(newChild)) === 'object' && newChild !== null) {
                switch (newChild.$$typeof) {
                    case REACT_ELEMENT_TYPE:
                        {
                            var _created = createFiberFromElement(newChild, returnFiber.mode, expirationTime);
                            _created.ref = coerceRef(returnFiber, null, newChild);
                            _created.return = returnFiber;
                            return _created;
                        }
                    case REACT_PORTAL_TYPE:
                        {
                            var _created2 = createFiberFromPortal(newChild, returnFiber.mode, expirationTime);
                            _created2.return = returnFiber;
                            return _created2;
                        }
                }
                if (isArray$1(newChild) || getIteratorFn(newChild)) {
                    var _created3 = createFiberFromFragment(newChild, returnFiber.mode, expirationTime, null);
                    _created3.return = returnFiber;
                    return _created3;
                }
                throwOnInvalidObjectType(returnFiber, newChild);
            }
            return null;
        }

        function updateSlot(returnFiber, oldFiber, newChild, expirationTime) {
            var key = oldFiber !== null ? oldFiber.key : null;
            if (typeof newChild === 'string' || typeof newChild === 'number') {
                if (key !== null) {
                    return null;
                }
                return updateTextNode(returnFiber, oldFiber, '' + newChild, expirationTime);
            }
            if ((typeof newChild === 'undefined' ? 'undefined' : _typeof(newChild)) === 'object' && newChild !== null) {
                switch (newChild.$$typeof) {
                    case REACT_ELEMENT_TYPE:
                        {
                            if (newChild.key === key) {
                                if (newChild.type === REACT_FRAGMENT_TYPE) {
                                    return updateFragment(returnFiber, oldFiber, newChild.props.children, expirationTime, key);
                                }
                                return updateElement(returnFiber, oldFiber, newChild, expirationTime);
                            } else {
                                return null;
                            }
                        }
                    case REACT_PORTAL_TYPE:
                        {
                            if (newChild.key === key) {
                                return updatePortal(returnFiber, oldFiber, newChild, expirationTime);
                            } else {
                                return null;
                            }
                        }
                }
                if (isArray$1(newChild) || getIteratorFn(newChild)) {
                    if (key !== null) {
                        return null;
                    }
                    return updateFragment(returnFiber, oldFiber, newChild, expirationTime, null);
                }
                throwOnInvalidObjectType(returnFiber, newChild);
            }
            return null;
        }

        function updateFromMap(existingChildren, returnFiber, newIdx, newChild, expirationTime) {
            if (typeof newChild === 'string' || typeof newChild === 'number') {
                var matchedFiber = existingChildren.get(newIdx) || null;
                return updateTextNode(returnFiber, matchedFiber, '' + newChild, expirationTime);
            }
            if ((typeof newChild === 'undefined' ? 'undefined' : _typeof(newChild)) === 'object' && newChild !== null) {
                switch (newChild.$$typeof) {
                    case REACT_ELEMENT_TYPE:
                        {
                            var _matchedFiber = existingChildren.get(newChild.key === null ? newIdx : newChild.key) || null;
                            if (newChild.type === REACT_FRAGMENT_TYPE) {
                                return updateFragment(returnFiber, _matchedFiber, newChild.props.children, expirationTime, newChild.key);
                            }
                            return updateElement(returnFiber, _matchedFiber, newChild, expirationTime);
                        }
                    case REACT_PORTAL_TYPE:
                        {
                            var _matchedFiber2 = existingChildren.get(newChild.key === null ? newIdx : newChild.key) || null;
                            return updatePortal(returnFiber, _matchedFiber2, newChild, expirationTime);
                        }
                }
                if (isArray$1(newChild) || getIteratorFn(newChild)) {
                    var _matchedFiber3 = existingChildren.get(newIdx) || null;
                    return updateFragment(returnFiber, _matchedFiber3, newChild, expirationTime, null);
                }
                throwOnInvalidObjectType(returnFiber, newChild);
            }
            return null;
        }

        function reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, expirationTime) {
            var resultingFirstChild = null;
            var previousNewFiber = null;
            var oldFiber = currentFirstChild;
            var lastPlacedIndex = 0;
            var newIdx = 0;
            var nextOldFiber = null;
            for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
                if (oldFiber.index > newIdx) {
                    nextOldFiber = oldFiber;
                    oldFiber = null;
                } else {
                    nextOldFiber = oldFiber.sibling;
                }
                var newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx], expirationTime);
                if (newFiber === null) {
                    if (oldFiber === null) {
                        oldFiber = nextOldFiber;
                    }
                    break;
                }
                if (shouldTrackSideEffects) {
                    if (oldFiber && newFiber.alternate === null) {
                        deleteChild(returnFiber, oldFiber);
                    }
                }
                lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
                if (previousNewFiber === null) {
                    resultingFirstChild = newFiber;
                } else {
                    previousNewFiber.sibling = newFiber;
                }
                previousNewFiber = newFiber;
                oldFiber = nextOldFiber;
            }
            if (newIdx === newChildren.length) {
                deleteRemainingChildren(returnFiber, oldFiber);
                return resultingFirstChild;
            }
            if (oldFiber === null) {
                for (; newIdx < newChildren.length; newIdx++) {
                    var _newFiber = createChild(returnFiber, newChildren[newIdx], expirationTime);
                    if (_newFiber === null) {
                        continue;
                    }
                    lastPlacedIndex = placeChild(_newFiber, lastPlacedIndex, newIdx);
                    if (previousNewFiber === null) {
                        resultingFirstChild = _newFiber;
                    } else {
                        previousNewFiber.sibling = _newFiber;
                    }
                    previousNewFiber = _newFiber;
                }
                return resultingFirstChild;
            }
            var existingChildren = mapRemainingChildren(returnFiber, oldFiber);
            for (; newIdx < newChildren.length; newIdx++) {
                var _newFiber2 = updateFromMap(existingChildren, returnFiber, newIdx, newChildren[newIdx], expirationTime);
                if (_newFiber2 !== null) {
                    if (shouldTrackSideEffects) {
                        if (_newFiber2.alternate !== null) {
                            existingChildren.delete(_newFiber2.key === null ? newIdx : _newFiber2.key);
                        }
                    }
                    lastPlacedIndex = placeChild(_newFiber2, lastPlacedIndex, newIdx);
                    if (previousNewFiber === null) {
                        resultingFirstChild = _newFiber2;
                    } else {
                        previousNewFiber.sibling = _newFiber2;
                    }
                    previousNewFiber = _newFiber2;
                }
            }
            if (shouldTrackSideEffects) {
                existingChildren.forEach(function(child) {
                    return deleteChild(returnFiber, child);
                });
            }
            return resultingFirstChild;
        }

        function reconcileChildrenIterator(returnFiber, currentFirstChild, newChildrenIterable, expirationTime) {
            var iteratorFn = getIteratorFn(newChildrenIterable);
            invariant(typeof iteratorFn === 'function', 'An object is not an iterable. This error is likely caused by a bug in ' + 'React. Please file an issue.');
            var newChildren = iteratorFn.call(newChildrenIterable);
            invariant(newChildren != null, 'An iterable object provided no iterator.');
            var resultingFirstChild = null;
            var previousNewFiber = null;
            var oldFiber = currentFirstChild;
            var lastPlacedIndex = 0;
            var newIdx = 0;
            var nextOldFiber = null;
            var step = newChildren.next();
            for (; oldFiber !== null && !step.done; newIdx++, step = newChildren.next()) {
                if (oldFiber.index > newIdx) {
                    nextOldFiber = oldFiber;
                    oldFiber = null;
                } else {
                    nextOldFiber = oldFiber.sibling;
                }
                var newFiber = updateSlot(returnFiber, oldFiber, step.value, expirationTime);
                if (newFiber === null) {
                    if (oldFiber === null) {
                        oldFiber = nextOldFiber;
                    }
                    break;
                }
                if (shouldTrackSideEffects) {
                    if (oldFiber && newFiber.alternate === null) {
                        deleteChild(returnFiber, oldFiber);
                    }
                }
                lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx);
                if (previousNewFiber === null) {
                    resultingFirstChild = newFiber;
                } else {
                    previousNewFiber.sibling = newFiber;
                }
                previousNewFiber = newFiber;
                oldFiber = nextOldFiber;
            }
            if (step.done) {
                deleteRemainingChildren(returnFiber, oldFiber);
                return resultingFirstChild;
            }
            if (oldFiber === null) {
                for (; !step.done; newIdx++, step = newChildren.next()) {
                    var _newFiber3 = createChild(returnFiber, step.value, expirationTime);
                    if (_newFiber3 === null) {
                        continue;
                    }
                    lastPlacedIndex = placeChild(_newFiber3, lastPlacedIndex, newIdx);
                    if (previousNewFiber === null) {
                        resultingFirstChild = _newFiber3;
                    } else {
                        previousNewFiber.sibling = _newFiber3;
                    }
                    previousNewFiber = _newFiber3;
                }
                return resultingFirstChild;
            }
            var existingChildren = mapRemainingChildren(returnFiber, oldFiber);
            for (; !step.done; newIdx++, step = newChildren.next()) {
                var _newFiber4 = updateFromMap(existingChildren, returnFiber, newIdx, step.value, expirationTime);
                if (_newFiber4 !== null) {
                    if (shouldTrackSideEffects) {
                        if (_newFiber4.alternate !== null) {
                            existingChildren.delete(_newFiber4.key === null ? newIdx : _newFiber4.key);
                        }
                    }
                    lastPlacedIndex = placeChild(_newFiber4, lastPlacedIndex, newIdx);
                    if (previousNewFiber === null) {
                        resultingFirstChild = _newFiber4;
                    } else {
                        previousNewFiber.sibling = _newFiber4;
                    }
                    previousNewFiber = _newFiber4;
                }
            }
            if (shouldTrackSideEffects) {
                existingChildren.forEach(function(child) {
                    return deleteChild(returnFiber, child);
                });
            }
            return resultingFirstChild;
        }

        function reconcileSingleTextNode(returnFiber, currentFirstChild, textContent, expirationTime) {
            if (currentFirstChild !== null && currentFirstChild.tag === HostText) {
                deleteRemainingChildren(returnFiber, currentFirstChild.sibling);
                var existing = useFiber(currentFirstChild, textContent, expirationTime);
                existing.return = returnFiber;
                return existing;
            }
            deleteRemainingChildren(returnFiber, currentFirstChild);
            var created = createFiberFromText(textContent, returnFiber.mode, expirationTime);
            created.return = returnFiber;
            return created;
        }

        function reconcileSingleElement(returnFiber, currentFirstChild, element, expirationTime) {
            var key = element.key;
            var child = currentFirstChild;
            while (child !== null) {
                if (child.key === key) {
                    if (child.tag === Fragment ? element.type === REACT_FRAGMENT_TYPE : child.elementType === element.type || (
                            false)) {
                        deleteRemainingChildren(returnFiber, child.sibling);
                        var existing = useFiber(child, element.type === REACT_FRAGMENT_TYPE ? element.props.children : element.props, expirationTime);
                        existing.ref = coerceRef(returnFiber, child, element);
                        existing.return = returnFiber;
                        return existing;
                    } else {
                        deleteRemainingChildren(returnFiber, child);
                        break;
                    }
                } else {
                    deleteChild(returnFiber, child);
                }
                child = child.sibling;
            }
            if (element.type === REACT_FRAGMENT_TYPE) {
                var created = createFiberFromFragment(element.props.children, returnFiber.mode, expirationTime, element.key);
                created.return = returnFiber;
                return created;
            } else {
                var _created4 = createFiberFromElement(element, returnFiber.mode, expirationTime);
                _created4.ref = coerceRef(returnFiber, currentFirstChild, element);
                _created4.return = returnFiber;
                return _created4;
            }
        }

        function reconcileSinglePortal(returnFiber, currentFirstChild, portal, expirationTime) {
            var key = portal.key;
            var child = currentFirstChild;
            while (child !== null) {
                if (child.key === key) {
                    if (child.tag === HostPortal && child.stateNode.containerInfo === portal.containerInfo && child.stateNode.implementation === portal.implementation) {
                        deleteRemainingChildren(returnFiber, child.sibling);
                        var existing = useFiber(child, portal.children || [], expirationTime);
                        existing.return = returnFiber;
                        return existing;
                    } else {
                        deleteRemainingChildren(returnFiber, child);
                        break;
                    }
                } else {
                    deleteChild(returnFiber, child);
                }
                child = child.sibling;
            }
            var created = createFiberFromPortal(portal, returnFiber.mode, expirationTime);
            created.return = returnFiber;
            return created;
        }

        function reconcileChildFibers(returnFiber, currentFirstChild, newChild, expirationTime) {
            var isUnkeyedTopLevelFragment = (typeof newChild === 'undefined' ? 'undefined' : _typeof(newChild)) === 'object' && newChild !== null && newChild.type === REACT_FRAGMENT_TYPE && newChild.key === null;
            if (isUnkeyedTopLevelFragment) {
                newChild = newChild.props.children;
            }
            var isObject = (typeof newChild === 'undefined' ? 'undefined' : _typeof(newChild)) === 'object' && newChild !== null;
            if (isObject) {
                switch (newChild.$$typeof) {
                    case REACT_ELEMENT_TYPE:
                        return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstChild, newChild, expirationTime));
                    case REACT_PORTAL_TYPE:
                        return placeSingleChild(reconcileSinglePortal(returnFiber, currentFirstChild, newChild, expirationTime));
                }
            }
            if (typeof newChild === 'string' || typeof newChild === 'number') {
                return placeSingleChild(reconcileSingleTextNode(returnFiber, currentFirstChild, '' + newChild, expirationTime));
            }
            if (isArray$1(newChild)) {
                return reconcileChildrenArray(returnFiber, currentFirstChild, newChild, expirationTime);
            }
            if (getIteratorFn(newChild)) {
                return reconcileChildrenIterator(returnFiber, currentFirstChild, newChild, expirationTime);
            }
            if (isObject) {
                throwOnInvalidObjectType(returnFiber, newChild);
            }
            if (typeof newChild === 'undefined' && !isUnkeyedTopLevelFragment) {
                switch (returnFiber.tag) {
                    case ClassComponent:

                    case FunctionComponent:
                        {
                            var Component = returnFiber.type;
                            invariant(false, '%s(...): Nothing was returned from render. This usually means a ' + 'return statement is missing. Or, to render nothing, ' + 'return null.', Component.displayName || Component.name || 'Component');
                        }
                }
            }
            return deleteRemainingChildren(returnFiber, currentFirstChild);
        }
        return reconcileChildFibers;
    }
    var reconcileChildFibers = ChildReconciler(true);
    var mountChildFibers = ChildReconciler(false);

    function cloneChildFibers(current$$1, workInProgress) {
        invariant(current$$1 === null || workInProgress.child === current$$1.child, 'Resuming work not yet implemented.');
        if (workInProgress.child === null) {
            return;
        }
        var currentChild = workInProgress.child;
        var newChild = createWorkInProgress(currentChild, currentChild.pendingProps, currentChild.expirationTime);
        workInProgress.child = newChild;
        newChild.return = workInProgress;
        while (currentChild.sibling !== null) {
            currentChild = currentChild.sibling;
            newChild = newChild.sibling = createWorkInProgress(currentChild, currentChild.pendingProps, currentChild.expirationTime);
            newChild.return = workInProgress;
        }
        newChild.sibling = null;
    }

    var NO_CONTEXT = {};
    var contextStackCursor$1 = createCursor(NO_CONTEXT);
    var contextFiberStackCursor = createCursor(NO_CONTEXT);
    var rootInstanceStackCursor = createCursor(NO_CONTEXT);

    function requiredContext(c) {
        invariant(c !== NO_CONTEXT, 'Expected host context to exist. This error is likely caused by a bug ' + 'in React. Please file an issue.');
        return c;
    }

    function getRootHostContainer() {
        var rootInstance = requiredContext(rootInstanceStackCursor.current);
        return rootInstance;
    }

    function pushHostContainer(fiber, nextRootInstance) {
        push(rootInstanceStackCursor, nextRootInstance, fiber);
        push(contextFiberStackCursor, fiber, fiber);
        push(contextStackCursor$1, NO_CONTEXT, fiber);
        var nextRootContext = ReactDOMHostConfig.getRootHostContext(nextRootInstance);
        pop(contextStackCursor$1, fiber);
        push(contextStackCursor$1, nextRootContext, fiber);
    }

    function popHostContainer(fiber) {
        pop(contextStackCursor$1, fiber);
        pop(contextFiberStackCursor, fiber);
        pop(rootInstanceStackCursor, fiber);
    }

    function getHostContext() {
        var context = requiredContext(contextStackCursor$1.current);
        return context;
    }

    function pushHostContext(fiber) {
        var rootInstance = requiredContext(rootInstanceStackCursor.current);
        var context = requiredContext(contextStackCursor$1.current);
        var nextContext = ReactDOMHostConfig.getChildHostContext(context, fiber.type, rootInstance);
        if (context === nextContext) {
            return;
        }
        push(contextFiberStackCursor, fiber, fiber);
        push(contextStackCursor$1, nextContext, fiber);
    }

    function popHostContext(fiber) {
        if (contextFiberStackCursor.current !== fiber) {
            return;
        }
        pop(contextStackCursor$1, fiber);
        pop(contextFiberStackCursor, fiber);
    }

    var DefaultSuspenseContext = 0;
    var SubtreeSuspenseContextMask = 1;
    var InvisibleParentSuspenseContext = 1;
    var ForceSuspenseFallback = 2;
    var suspenseStackCursor = createCursor(DefaultSuspenseContext);

    function hasSuspenseContext(parentContext, flag) {
        return (parentContext & flag) !== 0;
    }

    function setDefaultShallowSuspenseContext(parentContext) {
        return parentContext & SubtreeSuspenseContextMask;
    }

    function addSubtreeSuspenseContext(parentContext, subtreeContext) {
        return parentContext | subtreeContext;
    }

    function pushSuspenseContext(fiber, newContext) {
        push(suspenseStackCursor, newContext, fiber);
    }

    function popSuspenseContext(fiber) {
        pop(suspenseStackCursor, fiber);
    }

    var NoEffect$1 = 0;
    var UnmountSnapshot = 2;
    var UnmountMutation = 4;
    var MountMutation = 8;
    var UnmountLayout = 16;
    var MountLayout = 32;
    var MountPassive = 64;
    var UnmountPassive = 128;

    var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
    var renderExpirationTime = NoWork;
    var currentlyRenderingFiber$1 = null;
    var currentHook = null;
    var nextCurrentHook = null;
    var firstWorkInProgressHook = null;
    var workInProgressHook = null;
    var nextWorkInProgressHook = null;
    var remainingExpirationTime = NoWork;
    var componentUpdateQueue = null;
    var sideEffectTag = 0;
    var didScheduleRenderPhaseUpdate = false;
    var renderPhaseUpdates = null;
    var numberOfReRenders = 0;
    var RE_RENDER_LIMIT = 25;

    function throwInvalidHookError() {
        invariant(false, 'Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for' + ' one of the following reasons:\n' + '1. You might have mismatching versions of React and the renderer (such as React DOM)\n' + '2. You might be breaking the Rules of Hooks\n' + '3. You might have more than one copy of React in the same app\n' + 'See https://fb.me/react-invalid-hook-call for tips about how to debug and fix this problem.');
    }

    function areHookInputsEqual(nextDeps, prevDeps) {
        if (prevDeps === null) {
            return false;
        }
        for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
            if (is(nextDeps[i], prevDeps[i])) {
                continue;
            }
            return false;
        }
        return true;
    }

    function renderWithHooks(current, workInProgress, Component, props, refOrContext, nextRenderExpirationTime) {
        renderExpirationTime = nextRenderExpirationTime;
        currentlyRenderingFiber$1 = workInProgress;
        nextCurrentHook = current !== null ? current.memoizedState : null; {
            ReactCurrentDispatcher.current = nextCurrentHook === null ? HooksDispatcherOnMount : HooksDispatcherOnUpdate;
        }
        var children = Component(props, refOrContext);
        if (didScheduleRenderPhaseUpdate) {
            do {
                didScheduleRenderPhaseUpdate = false;
                numberOfReRenders += 1;
                nextCurrentHook = current !== null ? current.memoizedState : null;
                nextWorkInProgressHook = firstWorkInProgressHook;
                currentHook = null;
                workInProgressHook = null;
                componentUpdateQueue = null;
                ReactCurrentDispatcher.current = HooksDispatcherOnUpdate;
                children = Component(props, refOrContext);
            } while (didScheduleRenderPhaseUpdate);
            renderPhaseUpdates = null;
            numberOfReRenders = 0;
        }
        ReactCurrentDispatcher.current = ContextOnlyDispatcher;
        var renderedWork = currentlyRenderingFiber$1;
        renderedWork.memoizedState = firstWorkInProgressHook;
        renderedWork.expirationTime = remainingExpirationTime;
        renderedWork.updateQueue = componentUpdateQueue;
        renderedWork.effectTag |= sideEffectTag;
        var didRenderTooFewHooks = currentHook !== null && currentHook.next !== null;
        renderExpirationTime = NoWork;
        currentlyRenderingFiber$1 = null;
        currentHook = null;
        nextCurrentHook = null;
        firstWorkInProgressHook = null;
        workInProgressHook = null;
        nextWorkInProgressHook = null;
        remainingExpirationTime = NoWork;
        componentUpdateQueue = null;
        sideEffectTag = 0;
        invariant(!didRenderTooFewHooks, 'Rendered fewer hooks than expected. This may be caused by an accidental ' + 'early return statement.');
        return children;
    }

    function bailoutHooks(current, workInProgress, expirationTime) {
        workInProgress.updateQueue = current.updateQueue;
        workInProgress.effectTag &= ~(Passive | Update);
        if (current.expirationTime <= expirationTime) {
            current.expirationTime = NoWork;
        }
    }

    function resetHooks() {
        ReactCurrentDispatcher.current = ContextOnlyDispatcher;
        renderExpirationTime = NoWork;
        currentlyRenderingFiber$1 = null;
        currentHook = null;
        nextCurrentHook = null;
        firstWorkInProgressHook = null;
        workInProgressHook = null;
        nextWorkInProgressHook = null;
        remainingExpirationTime = NoWork;
        componentUpdateQueue = null;
        sideEffectTag = 0;
        didScheduleRenderPhaseUpdate = false;
        renderPhaseUpdates = null;
        numberOfReRenders = 0;
    }

    function mountWorkInProgressHook() {
        var hook = {
            memoizedState: null,
            baseState: null,
            queue: null,
            baseUpdate: null,
            next: null
        };
        if (workInProgressHook === null) {
            firstWorkInProgressHook = workInProgressHook = hook;
        } else {
            workInProgressHook = workInProgressHook.next = hook;
        }
        return workInProgressHook;
    }

    function updateWorkInProgressHook() {
        if (nextWorkInProgressHook !== null) {
            workInProgressHook = nextWorkInProgressHook;
            nextWorkInProgressHook = workInProgressHook.next;
            currentHook = nextCurrentHook;
            nextCurrentHook = currentHook !== null ? currentHook.next : null;
        } else {
            invariant(nextCurrentHook !== null, 'Rendered more hooks than during the previous render.');
            currentHook = nextCurrentHook;
            var newHook = {
                memoizedState: currentHook.memoizedState,
                baseState: currentHook.baseState,
                queue: currentHook.queue,
                baseUpdate: currentHook.baseUpdate,
                next: null
            };
            if (workInProgressHook === null) {
                workInProgressHook = firstWorkInProgressHook = newHook;
            } else {
                workInProgressHook = workInProgressHook.next = newHook;
            }
            nextCurrentHook = currentHook.next;
        }
        return workInProgressHook;
    }

    function createFunctionComponentUpdateQueue() {
        return {
            lastEffect: null
        };
    }

    function basicStateReducer(state, action) {
        return typeof action === 'function' ? action(state) : action;
    }

    function mountReducer(reducer, initialArg, init) {
        var hook = mountWorkInProgressHook();
        var initialState = void 0;
        if (init !== undefined) {
            initialState = init(initialArg);
        } else {
            initialState = initialArg;
        }
        hook.memoizedState = hook.baseState = initialState;
        var queue = hook.queue = {
            last: null,
            dispatch: null,
            lastRenderedReducer: reducer,
            lastRenderedState: initialState
        };
        var dispatch = queue.dispatch = dispatchAction.bind(null,
            currentlyRenderingFiber$1, queue);
        return [hook.memoizedState, dispatch];
    }

    function updateReducer(reducer, initialArg, init) {
        var hook = updateWorkInProgressHook();
        var queue = hook.queue;
        invariant(queue !== null, 'Should have a queue. This is likely a bug in React. Please file an issue.');
        queue.lastRenderedReducer = reducer;
        if (numberOfReRenders > 0) {
            var _dispatch = queue.dispatch;
            if (renderPhaseUpdates !== null) {
                var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);
                if (firstRenderPhaseUpdate !== undefined) {
                    renderPhaseUpdates.delete(queue);
                    var newState = hook.memoizedState;
                    var update = firstRenderPhaseUpdate;
                    do {
                        var action = update.action;
                        newState = reducer(newState, action);
                        update = update.next;
                    } while (update !== null);
                    if (!is(newState, hook.memoizedState)) {
                        markWorkInProgressReceivedUpdate();
                    }
                    hook.memoizedState = newState;
                    if (hook.baseUpdate === queue.last) {
                        hook.baseState = newState;
                    }
                    queue.lastRenderedState = newState;
                    return [newState, _dispatch];
                }
            }
            return [hook.memoizedState, _dispatch];
        }
        var last = queue.last;
        var baseUpdate = hook.baseUpdate;
        var baseState = hook.baseState;
        var first = void 0;
        if (baseUpdate !== null) {
            if (last !== null) {
                last.next = null;
            }
            first = baseUpdate.next;
        } else {
            first = last !== null ? last.next : null;
        }
        if (first !== null) {
            var _newState = baseState;
            var newBaseState = null;
            var newBaseUpdate = null;
            var prevUpdate = baseUpdate;
            var _update = first;
            var didSkip = false;
            do {
                var updateExpirationTime = _update.expirationTime;
                if (updateExpirationTime < renderExpirationTime) {
                    if (!didSkip) {
                        didSkip = true;
                        newBaseUpdate = prevUpdate;
                        newBaseState = _newState;
                    }
                    if (updateExpirationTime > remainingExpirationTime) {
                        remainingExpirationTime = updateExpirationTime;
                    }
                } else {
                    markRenderEventTimeAndConfig(updateExpirationTime, _update.suspenseConfig);
                    if (_update.eagerReducer === reducer) {
                        _newState = _update.eagerState;
                    } else {
                        var _action = _update.action;
                        _newState = reducer(_newState, _action);
                    }
                }
                prevUpdate = _update;
                _update = _update.next;
            } while (_update !== null && _update !== first);
            if (!didSkip) {
                newBaseUpdate = prevUpdate;
                newBaseState = _newState;
            }
            if (!is(_newState, hook.memoizedState)) {
                markWorkInProgressReceivedUpdate();
            }
            hook.memoizedState = _newState;
            hook.baseUpdate = newBaseUpdate;
            hook.baseState = newBaseState;
            queue.lastRenderedState = _newState;
        }
        var dispatch = queue.dispatch;
        return [hook.memoizedState, dispatch];
    }

    function mountState(initialState) {
        var hook = mountWorkInProgressHook();
        if (typeof initialState === 'function') {
            initialState = initialState();
        }
        hook.memoizedState = hook.baseState = initialState;
        var queue = hook.queue = {
            last: null,
            dispatch: null,
            lastRenderedReducer: basicStateReducer,
            lastRenderedState: initialState
        };
        var dispatch = queue.dispatch = dispatchAction.bind(null,
            currentlyRenderingFiber$1, queue);
        return [hook.memoizedState, dispatch];
    }

    function updateState(initialState) {
        return updateReducer(basicStateReducer, initialState);
    }

    function pushEffect(tag, create, destroy, deps) {
        var effect = {
            tag: tag,
            create: create,
            destroy: destroy,
            deps: deps,
            next: null
        };
        if (componentUpdateQueue === null) {
            componentUpdateQueue = createFunctionComponentUpdateQueue();
            componentUpdateQueue.lastEffect = effect.next = effect;
        } else {
            var lastEffect = componentUpdateQueue.lastEffect;
            if (lastEffect === null) {
                componentUpdateQueue.lastEffect = effect.next = effect;
            } else {
                var firstEffect = lastEffect.next;
                lastEffect.next = effect;
                effect.next = firstEffect;
                componentUpdateQueue.lastEffect = effect;
            }
        }
        return effect;
    }

    function mountRef(initialValue) {
        var hook = mountWorkInProgressHook();
        var ref = { current: initialValue };
        hook.memoizedState = ref;
        return ref;
    }

    function updateRef(initialValue) {
        var hook = updateWorkInProgressHook();
        return hook.memoizedState;
    }

    function mountEffectImpl(fiberEffectTag, hookEffectTag, create, deps) {
        var hook = mountWorkInProgressHook();
        var nextDeps = deps === undefined ? null : deps;
        sideEffectTag |= fiberEffectTag;
        hook.memoizedState = pushEffect(hookEffectTag, create, undefined, nextDeps);
    }

    function updateEffectImpl(fiberEffectTag, hookEffectTag, create, deps) {
        var hook = updateWorkInProgressHook();
        var nextDeps = deps === undefined ? null : deps;
        var destroy = undefined;
        if (currentHook !== null) {
            var prevEffect = currentHook.memoizedState;
            destroy = prevEffect.destroy;
            if (nextDeps !== null) {
                var prevDeps = prevEffect.deps;
                if (areHookInputsEqual(nextDeps, prevDeps)) {
                    pushEffect(NoEffect$1, create, destroy, nextDeps);
                    return;
                }
            }
        }
        sideEffectTag |= fiberEffectTag;
        hook.memoizedState = pushEffect(hookEffectTag, create, destroy, nextDeps);
    }

    function mountEffect(create, deps) {
        return mountEffectImpl(Update | Passive, UnmountPassive | MountPassive, create, deps);
    }

    function updateEffect(create, deps) {
        return updateEffectImpl(Update | Passive, UnmountPassive | MountPassive, create, deps);
    }

    function mountLayoutEffect(create, deps) {
        return mountEffectImpl(Update, UnmountMutation | MountLayout, create, deps);
    }

    function updateLayoutEffect(create, deps) {
        return updateEffectImpl(Update, UnmountMutation | MountLayout, create, deps);
    }

    function imperativeHandleEffect(create, ref) {
        if (typeof ref === 'function') {
            var refCallback = ref;
            var inst = create();
            refCallback(inst);
            return function() {
                refCallback(null);
            };
        } else if (ref !== null && ref !== undefined) {
            var refObject = ref;
            var _inst = create();
            refObject.current = _inst;
            return function() {
                refObject.current = null;
            };
        }
    }

    function mountImperativeHandle(ref, create, deps) {
        var effectDeps = deps !== null && deps !== undefined ? deps.concat([ref]) : null;
        return mountEffectImpl(Update, UnmountMutation | MountLayout, imperativeHandleEffect.bind(null, create, ref), effectDeps);
    }

    function updateImperativeHandle(ref, create, deps) {
        var effectDeps = deps !== null && deps !== undefined ? deps.concat([ref]) : null;
        return updateEffectImpl(Update, UnmountMutation | MountLayout, imperativeHandleEffect.bind(null, create, ref), effectDeps);
    }

    function mountDebugValue(value, formatterFn) {}
    var updateDebugValue = mountDebugValue;

    function mountCallback(callback, deps) {
        var hook = mountWorkInProgressHook();
        var nextDeps = deps === undefined ? null : deps;
        hook.memoizedState = [callback, nextDeps];
        return callback;
    }

    function updateCallback(callback, deps) {
        var hook = updateWorkInProgressHook();
        var nextDeps = deps === undefined ? null : deps;
        var prevState = hook.memoizedState;
        if (prevState !== null) {
            if (nextDeps !== null) {
                var prevDeps = prevState[1];
                if (areHookInputsEqual(nextDeps, prevDeps)) {
                    return prevState[0];
                }
            }
        }
        hook.memoizedState = [callback, nextDeps];
        return callback;
    }

    function mountMemo(nextCreate, deps) {
        var hook = mountWorkInProgressHook();
        var nextDeps = deps === undefined ? null : deps;
        var nextValue = nextCreate();
        hook.memoizedState = [nextValue, nextDeps];
        return nextValue;
    }

    function updateMemo(nextCreate, deps) {
        var hook = updateWorkInProgressHook();
        var nextDeps = deps === undefined ? null : deps;
        var prevState = hook.memoizedState;
        if (prevState !== null) {
            if (nextDeps !== null) {
                var prevDeps = prevState[1];
                if (areHookInputsEqual(nextDeps, prevDeps)) {
                    return prevState[0];
                }
            }
        }
        var nextValue = nextCreate();
        hook.memoizedState = [nextValue, nextDeps];
        return nextValue;
    }

    function dispatchAction(fiber, queue, action) {
        invariant(numberOfReRenders < RE_RENDER_LIMIT, 'Too many re-renders. React limits the number of renders to prevent ' + 'an infinite loop.');
        var alternate = fiber.alternate;
        if (fiber === currentlyRenderingFiber$1 || alternate !== null && alternate === currentlyRenderingFiber$1) {
            didScheduleRenderPhaseUpdate = true;
            var update = {
                expirationTime: renderExpirationTime,
                suspenseConfig: null,
                action: action,
                eagerReducer: null,
                eagerState: null,
                next: null
            };
            if (renderPhaseUpdates === null) {
                renderPhaseUpdates = new Map();
            }
            var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);
            if (firstRenderPhaseUpdate === undefined) {
                renderPhaseUpdates.set(queue, update);
            } else {
                var lastRenderPhaseUpdate = firstRenderPhaseUpdate;
                while (lastRenderPhaseUpdate.next !== null) {
                    lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
                }
                lastRenderPhaseUpdate.next = update;
            }
        } else {
            var currentTime = requestCurrentTime();
            var suspenseConfig = requestCurrentSuspenseConfig();
            var expirationTime = computeExpirationForFiber(currentTime, fiber, suspenseConfig);
            var _update2 = {
                expirationTime: expirationTime,
                suspenseConfig: suspenseConfig,
                action: action,
                eagerReducer: null,
                eagerState: null,
                next: null
            };
            var last = queue.last;
            if (last === null) {
                _update2.next = _update2;
            } else {
                var first = last.next;
                if (first !== null) {
                    _update2.next = first;
                }
                last.next = _update2;
            }
            queue.last = _update2;
            if (fiber.expirationTime === NoWork && (alternate === null || alternate.expirationTime === NoWork)) {
                var lastRenderedReducer = queue.lastRenderedReducer;
                if (lastRenderedReducer !== null) {
                    try {
                        var currentState = queue.lastRenderedState;
                        var eagerState = lastRenderedReducer(currentState, action);
                        _update2.eagerReducer = lastRenderedReducer;
                        _update2.eagerState = eagerState;
                        if (is(eagerState, currentState)) {
                            return;
                        }
                    } catch (error) {} finally {}
                }
            }
            scheduleWork(fiber, expirationTime);
        }
    }
    var ContextOnlyDispatcher = {
        readContext: readContext,
        useCallback: throwInvalidHookError,
        useContext: throwInvalidHookError,
        useEffect: throwInvalidHookError,
        useImperativeHandle: throwInvalidHookError,
        useLayoutEffect: throwInvalidHookError,
        useMemo: throwInvalidHookError,
        useReducer: throwInvalidHookError,
        useRef: throwInvalidHookError,
        useState: throwInvalidHookError,
        useDebugValue: throwInvalidHookError
    };
    var HooksDispatcherOnMount = {
        readContext: readContext,
        useCallback: mountCallback,
        useContext: readContext,
        useEffect: mountEffect,
        useImperativeHandle: mountImperativeHandle,
        useLayoutEffect: mountLayoutEffect,
        useMemo: mountMemo,
        useReducer: mountReducer,
        useRef: mountRef,
        useState: mountState,
        useDebugValue: mountDebugValue
    };
    var HooksDispatcherOnUpdate = {
        readContext: readContext,
        useCallback: updateCallback,
        useContext: readContext,
        useEffect: updateEffect,
        useImperativeHandle: updateImperativeHandle,
        useLayoutEffect: updateLayoutEffect,
        useMemo: updateMemo,
        useReducer: updateReducer,
        useRef: updateRef,
        useState: updateState,
        useDebugValue: updateDebugValue
    };

    var hydrationParentFiber = null;
    var nextHydratableInstance = null;
    var isHydrating = false;

    function enterHydrationState(fiber) {
        if (!ReactDOMHostConfig.supportsHydration) {
            return false;
        }
        var parentInstance = fiber.stateNode.containerInfo;
        nextHydratableInstance = ReactDOMHostConfig.getFirstHydratableChild(parentInstance);
        hydrationParentFiber = fiber;
        isHydrating = true;
        return true;
    }

    function deleteHydratableInstance(returnFiber, instance) {
        var childToDelete = createFiberFromHostInstanceForDeletion();
        childToDelete.stateNode = instance;
        childToDelete.return = returnFiber;
        childToDelete.effectTag = Deletion;
        if (returnFiber.lastEffect !== null) {
            returnFiber.lastEffect.nextEffect = childToDelete;
            returnFiber.lastEffect = childToDelete;
        } else {
            returnFiber.firstEffect = returnFiber.lastEffect = childToDelete;
        }
    }

    function insertNonHydratedInstance(returnFiber, fiber) {
        fiber.effectTag |= Placement;
    }

    function tryHydrate(fiber, nextInstance) {
        switch (fiber.tag) {
            case HostComponent:
                {
                    var type = fiber.type;
                    var props = fiber.pendingProps;
                    var instance = ReactDOMHostConfig.canHydrateInstance(nextInstance, type, props);
                    if (instance !== null) {
                        fiber.stateNode = instance;
                        return true;
                    }
                    return false;
                }
            case HostText:
                {
                    var text = fiber.pendingProps;
                    var textInstance = ReactDOMHostConfig.canHydrateTextInstance(nextInstance, text);
                    if (textInstance !== null) {
                        fiber.stateNode = textInstance;
                        return true;
                    }
                    return false;
                }
            case SuspenseComponent:
                {
                    return false;
                }
            default:
                return false;
        }
    }

    function tryToClaimNextHydratableInstance(fiber) {
        if (!isHydrating) {
            return;
        }
        var nextInstance = nextHydratableInstance;
        if (!nextInstance) {
            insertNonHydratedInstance(hydrationParentFiber, fiber);
            isHydrating = false;
            hydrationParentFiber = fiber;
            return;
        }
        var firstAttemptedInstance = nextInstance;
        if (!tryHydrate(fiber, nextInstance)) {
            nextInstance = ReactDOMHostConfig.getNextHydratableSibling(firstAttemptedInstance);
            if (!nextInstance || !tryHydrate(fiber, nextInstance)) {
                insertNonHydratedInstance(hydrationParentFiber, fiber);
                isHydrating = false;
                hydrationParentFiber = fiber;
                return;
            }
            deleteHydratableInstance(hydrationParentFiber, firstAttemptedInstance);
        }
        hydrationParentFiber = fiber;
        nextHydratableInstance = ReactDOMHostConfig.getFirstHydratableChild(nextInstance);
    }

    function prepareToHydrateHostInstance(fiber, rootContainerInstance, hostContext) {
        if (!ReactDOMHostConfig.supportsHydration) {
            invariant(false, 'Expected prepareToHydrateHostInstance() to never be called. ' + 'This error is likely caused by a bug in React. Please file an issue.');
        }
        var instance = fiber.stateNode;
        var updatePayload = ReactDOMHostConfig.hydrateInstance(instance, fiber.type, fiber.memoizedProps, rootContainerInstance, hostContext, fiber);
        fiber.updateQueue = updatePayload;
        if (updatePayload !== null) {
            return true;
        }
        return false;
    }

    function prepareToHydrateHostTextInstance(fiber) {
        if (!ReactDOMHostConfig.supportsHydration) {
            invariant(false, 'Expected prepareToHydrateHostTextInstance() to never be called. ' + 'This error is likely caused by a bug in React. Please file an issue.');
        }
        var textInstance = fiber.stateNode;
        var textContent = fiber.memoizedProps;
        var shouldUpdate = ReactDOMHostConfig.hydrateTextInstance(textInstance, textContent, fiber);
        return shouldUpdate;
    }

    function popToNextHostParent(fiber) {
        var parent = fiber.return;
        while (parent !== null && parent.tag !== HostComponent && parent.tag !== HostRoot && parent.tag !== DehydratedSuspenseComponent) {
            parent = parent.return;
        }
        hydrationParentFiber = parent;
    }

    function popHydrationState(fiber) {
        if (!ReactDOMHostConfig.supportsHydration) {
            return false;
        }
        if (fiber !== hydrationParentFiber) {
            return false;
        }
        if (!isHydrating) {
            popToNextHostParent(fiber);
            isHydrating = true;
            return false;
        }
        var type = fiber.type;
        if (fiber.tag !== HostComponent || type !== 'head' && type !== 'body' && !ReactDOMHostConfig.shouldSetTextContent(type, fiber.memoizedProps)) {
            var nextInstance = nextHydratableInstance;
            while (nextInstance) {
                deleteHydratableInstance(fiber, nextInstance);
                nextInstance = ReactDOMHostConfig.getNextHydratableSibling(nextInstance);
            }
        }
        popToNextHostParent(fiber);
        nextHydratableInstance = hydrationParentFiber ? ReactDOMHostConfig.getNextHydratableSibling(fiber.stateNode) : null;
        return true;
    }

    function resetHydrationState() {
        if (!ReactDOMHostConfig.supportsHydration) {
            return;
        }
        hydrationParentFiber = null;
        nextHydratableInstance = null;
        isHydrating = false;
    }

    var _typeof9 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) { return typeof obj; } : function(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
    var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
    var didReceiveUpdate = false;

    function reconcileChildren(current$$1, workInProgress, nextChildren, renderExpirationTime) {
        if (current$$1 === null) {
            workInProgress.child = mountChildFibers(workInProgress, null, nextChildren, renderExpirationTime);
        } else {
            workInProgress.child = reconcileChildFibers(workInProgress, current$$1.child, nextChildren, renderExpirationTime);
        }
    }

    function forceUnmountCurrentAndReconcile(current$$1, workInProgress, nextChildren, renderExpirationTime) {
        workInProgress.child = reconcileChildFibers(workInProgress, current$$1.child, null, renderExpirationTime);
        workInProgress.child = reconcileChildFibers(workInProgress, null, nextChildren, renderExpirationTime);
    }

    function updateForwardRef(current$$1, workInProgress, Component, nextProps, renderExpirationTime) {
        var render = Component.render;
        var ref = workInProgress.ref;
        var nextChildren = void 0;
        prepareToReadContext(workInProgress, renderExpirationTime); {
            nextChildren = renderWithHooks(current$$1, workInProgress, render, nextProps, ref, renderExpirationTime);
        }
        if (current$$1 !== null && !didReceiveUpdate) {
            bailoutHooks(current$$1, workInProgress, renderExpirationTime);
            return bailoutOnAlreadyFinishedWork(current$$1, workInProgress, renderExpirationTime);
        }
        workInProgress.effectTag |= PerformedWork;
        reconcileChildren(current$$1, workInProgress, nextChildren, renderExpirationTime);
        return workInProgress.child;
    }

    function updateMemoComponent(current$$1, workInProgress, Component, nextProps, updateExpirationTime, renderExpirationTime) {
        if (current$$1 === null) {
            var type = Component.type;
            if (isSimpleFunctionComponent(type) && Component.compare === null &&
                Component.defaultProps === undefined) {
                var resolvedType = type;
                workInProgress.tag = SimpleMemoComponent;
                workInProgress.type = resolvedType;
                return updateSimpleMemoComponent(current$$1, workInProgress, resolvedType, nextProps, updateExpirationTime, renderExpirationTime);
            }
            var child = createFiberFromTypeAndProps(Component.type, null, nextProps, null, workInProgress.mode, renderExpirationTime);
            child.ref = workInProgress.ref;
            child.return = workInProgress;
            workInProgress.child = child;
            return child;
        }
        var currentChild = current$$1.child;
        if (updateExpirationTime < renderExpirationTime) {
            var prevProps = currentChild.memoizedProps;
            var compare = Component.compare;
            compare = compare !== null ? compare : shallowEqual;
            if (compare(prevProps, nextProps) && current$$1.ref === workInProgress.ref) {
                return bailoutOnAlreadyFinishedWork(current$$1, workInProgress, renderExpirationTime);
            }
        }
        workInProgress.effectTag |= PerformedWork;
        var newChild = createWorkInProgress(currentChild, nextProps, renderExpirationTime);
        newChild.ref = workInProgress.ref;
        newChild.return = workInProgress;
        workInProgress.child = newChild;
        return newChild;
    }

    function updateSimpleMemoComponent(current$$1, workInProgress, Component, nextProps, updateExpirationTime, renderExpirationTime) {
        if (current$$1 !== null) {
            var prevProps = current$$1.memoizedProps;
            if (shallowEqual(prevProps, nextProps) && current$$1.ref === workInProgress.ref && (
                    true)) {
                didReceiveUpdate = false;
                if (updateExpirationTime < renderExpirationTime) {
                    return bailoutOnAlreadyFinishedWork(current$$1, workInProgress, renderExpirationTime);
                }
            }
        }
        return updateFunctionComponent(current$$1, workInProgress, Component, nextProps, renderExpirationTime);
    }

    function updateFragment(current$$1, workInProgress, renderExpirationTime) {
        var nextChildren = workInProgress.pendingProps;
        reconcileChildren(current$$1, workInProgress, nextChildren, renderExpirationTime);
        return workInProgress.child;
    }

    function updateMode(current$$1, workInProgress, renderExpirationTime) {
        var nextChildren = workInProgress.pendingProps.children;
        reconcileChildren(current$$1, workInProgress, nextChildren, renderExpirationTime);
        return workInProgress.child;
    }

    function updateProfiler(current$$1, workInProgress, renderExpirationTime) {
        var nextProps = workInProgress.pendingProps;
        var nextChildren = nextProps.children;
        reconcileChildren(current$$1, workInProgress, nextChildren, renderExpirationTime);
        return workInProgress.child;
    }

    function markRef(current$$1, workInProgress) {
        var ref = workInProgress.ref;
        if (current$$1 === null && ref !== null || current$$1 !== null && current$$1.ref !== ref) {
            workInProgress.effectTag |= Ref;
        }
    }

    function updateFunctionComponent(current$$1, workInProgress, Component, nextProps, renderExpirationTime) {
        var unmaskedContext = getUnmaskedContext(workInProgress, Component, true);
        var context = getMaskedContext(workInProgress, unmaskedContext);
        var nextChildren = void 0;
        prepareToReadContext(workInProgress, renderExpirationTime); {
            nextChildren = renderWithHooks(current$$1, workInProgress, Component, nextProps, context, renderExpirationTime);
        }
        if (current$$1 !== null && !didReceiveUpdate) {
            bailoutHooks(current$$1, workInProgress, renderExpirationTime);
            return bailoutOnAlreadyFinishedWork(current$$1, workInProgress, renderExpirationTime);
        }
        workInProgress.effectTag |= PerformedWork;
        reconcileChildren(current$$1, workInProgress, nextChildren, renderExpirationTime);
        return workInProgress.child;
    }

    function updateClassComponent(current$$1, workInProgress, Component, nextProps, renderExpirationTime) {
        var hasContext = void 0;
        if (isContextProvider(Component)) {
            hasContext = true;
            pushContextProvider(workInProgress);
        } else {
            hasContext = false;
        }
        prepareToReadContext(workInProgress, renderExpirationTime);
        var instance = workInProgress.stateNode;
        var shouldUpdate = void 0;
        if (instance === null) {
            if (current$$1 !== null) {
                current$$1.alternate = null;
                workInProgress.alternate = null;
                workInProgress.effectTag |= Placement;
            }
            constructClassInstance(workInProgress, Component, nextProps, renderExpirationTime);
            mountClassInstance(workInProgress, Component, nextProps, renderExpirationTime);
            shouldUpdate = true;
        } else if (current$$1 === null) {
            shouldUpdate = resumeMountClassInstance(workInProgress, Component, nextProps, renderExpirationTime);
        } else {
            shouldUpdate = updateClassInstance(current$$1, workInProgress, Component, nextProps, renderExpirationTime);
        }
        var nextUnitOfWork = finishClassComponent(current$$1, workInProgress, Component, shouldUpdate, hasContext, renderExpirationTime);
        return nextUnitOfWork;
    }

    function finishClassComponent(current$$1, workInProgress, Component, shouldUpdate, hasContext, renderExpirationTime) {
        markRef(current$$1, workInProgress);
        var didCaptureError = (workInProgress.effectTag & DidCapture) !== NoEffect;
        if (!shouldUpdate && !didCaptureError) {
            if (hasContext) {
                invalidateContextProvider(workInProgress, Component, false);
            }
            return bailoutOnAlreadyFinishedWork(current$$1, workInProgress, renderExpirationTime);
        }
        var instance = workInProgress.stateNode;
        ReactCurrentOwner.current = workInProgress;
        var nextChildren = void 0;
        if (didCaptureError && typeof Component.getDerivedStateFromError !== 'function') {
            nextChildren = null;
        } else {
            {
                nextChildren = instance.render();
            }
        }
        workInProgress.effectTag |= PerformedWork;
        if (current$$1 !== null && didCaptureError) {
            forceUnmountCurrentAndReconcile(current$$1, workInProgress, nextChildren, renderExpirationTime);
        } else {
            reconcileChildren(current$$1, workInProgress, nextChildren, renderExpirationTime);
        }
        workInProgress.memoizedState = instance.state;
        if (hasContext) {
            invalidateContextProvider(workInProgress, Component, true);
        }
        return workInProgress.child;
    }

    function pushHostRootContext(workInProgress) {
        var root = workInProgress.stateNode;
        if (root.pendingContext) {
            pushTopLevelContextObject(workInProgress, root.pendingContext, root.pendingContext !== root.context);
        } else if (root.context) {
            pushTopLevelContextObject(workInProgress, root.context, false);
        }
        pushHostContainer(workInProgress, root.containerInfo);
    }

    function updateHostRoot(current$$1, workInProgress, renderExpirationTime) {
        pushHostRootContext(workInProgress);
        var updateQueue = workInProgress.updateQueue;
        invariant(updateQueue !== null, 'If the root does not have an updateQueue, we should have already ' + 'bailed out. This error is likely caused by a bug in React. Please ' + 'file an issue.');
        var nextProps = workInProgress.pendingProps;
        var prevState = workInProgress.memoizedState;
        var prevChildren = prevState !== null ? prevState.element : null;
        processUpdateQueue(workInProgress, updateQueue, nextProps, null, renderExpirationTime);
        var nextState = workInProgress.memoizedState;
        var nextChildren = nextState.element;
        if (nextChildren === prevChildren) {
            resetHydrationState();
            return bailoutOnAlreadyFinishedWork(current$$1, workInProgress, renderExpirationTime);
        }
        var root = workInProgress.stateNode;
        if ((current$$1 === null || current$$1.child === null) && root.hydrate && enterHydrationState(workInProgress)) {
            workInProgress.effectTag |= Placement;
            workInProgress.child = mountChildFibers(workInProgress, null, nextChildren, renderExpirationTime);
        } else {
            reconcileChildren(current$$1, workInProgress, nextChildren, renderExpirationTime);
            resetHydrationState();
        }
        return workInProgress.child;
    }

    function updateHostComponent(current$$1, workInProgress, renderExpirationTime) {
        pushHostContext(workInProgress);
        if (current$$1 === null) {
            tryToClaimNextHydratableInstance(workInProgress);
        }
        var type = workInProgress.type;
        var nextProps = workInProgress.pendingProps;
        var prevProps = current$$1 !== null ? current$$1.memoizedProps : null;
        var nextChildren = nextProps.children;
        var isDirectTextChild = ReactDOMHostConfig.shouldSetTextContent(type, nextProps);
        if (isDirectTextChild) {
            nextChildren = null;
        } else if (prevProps !== null && ReactDOMHostConfig.shouldSetTextContent(type, prevProps)) {
            workInProgress.effectTag |= ContentReset;
        }
        markRef(current$$1, workInProgress);
        if (workInProgress.mode & ConcurrentMode && renderExpirationTime !== Never && ReactDOMHostConfig.shouldDeprioritizeSubtree(type, nextProps)) {
            workInProgress.expirationTime = workInProgress.childExpirationTime = Never;
            return null;
        }
        reconcileChildren(current$$1, workInProgress, nextChildren, renderExpirationTime);
        return workInProgress.child;
    }

    function updateHostText(current$$1, workInProgress) {
        if (current$$1 === null) {
            tryToClaimNextHydratableInstance(workInProgress);
        }
        return null;
    }

    function mountLazyComponent(_current, workInProgress, elementType, updateExpirationTime, renderExpirationTime) {
        if (_current !== null) {
            _current.alternate = null;
            workInProgress.alternate = null;
            workInProgress.effectTag |= Placement;
        }
        var props = workInProgress.pendingProps;
        var Component = readLazyComponentType(elementType);
        workInProgress.type = Component;
        var resolvedTag = workInProgress.tag = resolveLazyComponentTag(Component);
        var resolvedProps = resolveDefaultProps(Component, props);
        var child = void 0;
        switch (resolvedTag) {
            case FunctionComponent:
                {
                    child = updateFunctionComponent(null, workInProgress, Component, resolvedProps, renderExpirationTime);
                    break;
                }
            case ClassComponent:
                {
                    child = updateClassComponent(null, workInProgress, Component, resolvedProps, renderExpirationTime);
                    break;
                }
            case ForwardRef:
                {
                    child = updateForwardRef(null, workInProgress, Component, resolvedProps, renderExpirationTime);
                    break;
                }
            case MemoComponent:
                {
                    child = updateMemoComponent(null, workInProgress, Component, resolveDefaultProps(Component.type, resolvedProps),
                        updateExpirationTime, renderExpirationTime);
                    break;
                }
            default:
                {
                    var hint = '';
                    invariant(false, 'Element type is invalid. Received a promise that resolves to: %s. ' + 'Lazy element type must resolve to a class or function.%s', Component, hint);
                }
        }
        return child;
    }

    function mountIncompleteClassComponent(_current, workInProgress, Component, nextProps, renderExpirationTime) {
        if (_current !== null) {
            _current.alternate = null;
            workInProgress.alternate = null;
            workInProgress.effectTag |= Placement;
        }
        workInProgress.tag = ClassComponent;
        var hasContext = void 0;
        if (isContextProvider(Component)) {
            hasContext = true;
            pushContextProvider(workInProgress);
        } else {
            hasContext = false;
        }
        prepareToReadContext(workInProgress, renderExpirationTime);
        constructClassInstance(workInProgress, Component, nextProps, renderExpirationTime);
        mountClassInstance(workInProgress, Component, nextProps, renderExpirationTime);
        return finishClassComponent(null, workInProgress, Component, true, hasContext, renderExpirationTime);
    }

    function mountIndeterminateComponent(_current, workInProgress, Component, renderExpirationTime) {
        if (_current !== null) {
            _current.alternate = null;
            workInProgress.alternate = null;
            workInProgress.effectTag |= Placement;
        }
        var props = workInProgress.pendingProps;
        var unmaskedContext = getUnmaskedContext(workInProgress, Component, false);
        var context = getMaskedContext(workInProgress, unmaskedContext);
        prepareToReadContext(workInProgress, renderExpirationTime);
        var value = void 0; {
            value = renderWithHooks(null, workInProgress, Component, props, context, renderExpirationTime);
        }
        workInProgress.effectTag |= PerformedWork;
        if ((typeof value === 'undefined' ? 'undefined' : _typeof9(value)) === 'object' && value !== null && typeof value.render === 'function' && value.$$typeof === undefined) {
            workInProgress.tag = ClassComponent;
            resetHooks();
            var hasContext = false;
            if (isContextProvider(Component)) {
                hasContext = true;
                pushContextProvider(workInProgress);
            } else {
                hasContext = false;
            }
            workInProgress.memoizedState = value.state !== null && value.state !== undefined ? value.state : null;
            var getDerivedStateFromProps = Component.getDerivedStateFromProps;
            if (typeof getDerivedStateFromProps === 'function') {
                applyDerivedStateFromProps(workInProgress, Component, getDerivedStateFromProps, props);
            }
            adoptClassInstance(workInProgress, value);
            mountClassInstance(workInProgress, Component, props, renderExpirationTime);
            return finishClassComponent(null, workInProgress, Component, true, hasContext, renderExpirationTime);
        } else {
            workInProgress.tag = FunctionComponent;
            reconcileChildren(null, workInProgress, value, renderExpirationTime);
            return workInProgress.child;
        }
    }

    function updateSuspenseComponent(current$$1, workInProgress, renderExpirationTime) {
        var mode = workInProgress.mode;
        var nextProps = workInProgress.pendingProps;
        var suspenseContext = suspenseStackCursor.current;
        var nextState = null;
        var nextDidTimeout = false;
        if ((workInProgress.effectTag & DidCapture) !== NoEffect || hasSuspenseContext(suspenseContext, ForceSuspenseFallback)) {
            var attemptedState = workInProgress.memoizedState;
            nextState = {
                fallbackExpirationTime: attemptedState !== null ? attemptedState.fallbackExpirationTime : NoWork
            };
            nextDidTimeout = true;
            workInProgress.effectTag &= ~DidCapture;
        } else {
            if (current$$1 === null || current$$1.memoizedState !== null) {
                if (nextProps.fallback !== undefined && nextProps.unstable_avoidThisFallback !== true) {
                    suspenseContext = addSubtreeSuspenseContext(suspenseContext, InvisibleParentSuspenseContext);
                }
            }
        }
        suspenseContext = setDefaultShallowSuspenseContext(suspenseContext);
        pushSuspenseContext(workInProgress, suspenseContext);
        var child = void 0;
        var next = void 0;
        if (current$$1 === null) {
            if (nextDidTimeout) {
                var nextFallbackChildren = nextProps.fallback;
                var primaryChildFragment = createFiberFromFragment(null, mode, NoWork, null);
                if ((workInProgress.mode & BatchedMode) === NoMode) {
                    var progressedState = workInProgress.memoizedState;
                    var progressedPrimaryChild = progressedState !== null ? workInProgress.child.child : workInProgress.child;
                    primaryChildFragment.child = progressedPrimaryChild;
                }
                var fallbackChildFragment = createFiberFromFragment(nextFallbackChildren, mode, renderExpirationTime, null);
                primaryChildFragment.sibling = fallbackChildFragment;
                child = primaryChildFragment;
                next = fallbackChildFragment;
                child.return = next.return = workInProgress;
            } else {
                var nextPrimaryChildren = nextProps.children;
                child = next = mountChildFibers(workInProgress, null, nextPrimaryChildren, renderExpirationTime);
            }
        } else {
            var prevState = current$$1.memoizedState;
            var prevDidTimeout = prevState !== null;
            if (prevDidTimeout) {
                var currentPrimaryChildFragment = current$$1.child;
                var currentFallbackChildFragment = currentPrimaryChildFragment.sibling;
                if (nextDidTimeout) {
                    var _nextFallbackChildren = nextProps.fallback;
                    var _primaryChildFragment = createWorkInProgress(currentPrimaryChildFragment, currentPrimaryChildFragment.pendingProps, NoWork);
                    if ((workInProgress.mode & BatchedMode) === NoMode) {
                        var _progressedState = workInProgress.memoizedState;
                        var _progressedPrimaryChild = _progressedState !== null ? workInProgress.child.child : workInProgress.child;
                        if (_progressedPrimaryChild !== currentPrimaryChildFragment.child) {
                            _primaryChildFragment.child = _progressedPrimaryChild;
                        }
                    }
                    var _fallbackChildFragment = _primaryChildFragment.sibling = createWorkInProgress(currentFallbackChildFragment, _nextFallbackChildren, currentFallbackChildFragment.expirationTime);
                    child = _primaryChildFragment;
                    _primaryChildFragment.childExpirationTime = NoWork;
                    next = _fallbackChildFragment;
                    child.return = next.return = workInProgress;
                } else {
                    var _nextPrimaryChildren = nextProps.children;
                    var currentPrimaryChild = currentPrimaryChildFragment.child;
                    var primaryChild = reconcileChildFibers(workInProgress, currentPrimaryChild, _nextPrimaryChildren, renderExpirationTime);
                    child = next = primaryChild;
                }
            } else {
                var _currentPrimaryChild = current$$1.child;
                if (nextDidTimeout) {
                    var _nextFallbackChildren2 = nextProps.fallback;
                    var _primaryChildFragment2 = createFiberFromFragment(
                        null, mode, NoWork, null);
                    _primaryChildFragment2.child = _currentPrimaryChild;
                    if ((workInProgress.mode & BatchedMode) === NoMode) {
                        var _progressedState2 = workInProgress.memoizedState;
                        var _progressedPrimaryChild2 = _progressedState2 !== null ? workInProgress.child.child : workInProgress.child;
                        _primaryChildFragment2.child = _progressedPrimaryChild2;
                    }
                    var _fallbackChildFragment2 = _primaryChildFragment2.sibling = createFiberFromFragment(_nextFallbackChildren2, mode, renderExpirationTime, null);
                    _fallbackChildFragment2.effectTag |= Placement;
                    child = _primaryChildFragment2;
                    _primaryChildFragment2.childExpirationTime = NoWork;
                    next = _fallbackChildFragment2;
                    child.return = next.return = workInProgress;
                } else {
                    var _nextPrimaryChildren2 = nextProps.children;
                    next = child = reconcileChildFibers(workInProgress, _currentPrimaryChild, _nextPrimaryChildren2, renderExpirationTime);
                }
            }
            workInProgress.stateNode = current$$1.stateNode;
        }
        workInProgress.memoizedState = nextState;
        workInProgress.child = child;
        return next;
    }

    function updatePortalComponent(current$$1, workInProgress, renderExpirationTime) {
        pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
        var nextChildren = workInProgress.pendingProps;
        if (current$$1 === null) {
            workInProgress.child = reconcileChildFibers(workInProgress, null, nextChildren, renderExpirationTime);
        } else {
            reconcileChildren(current$$1, workInProgress, nextChildren, renderExpirationTime);
        }
        return workInProgress.child;
    }

    function updateContextProvider(current$$1, workInProgress, renderExpirationTime) {
        var providerType = workInProgress.type;
        var context = providerType._context;
        var newProps = workInProgress.pendingProps;
        var oldProps = workInProgress.memoizedProps;
        var newValue = newProps.value;
        pushProvider(workInProgress, newValue);
        if (oldProps !== null) {
            var oldValue = oldProps.value;
            var changedBits = calculateChangedBits(context, newValue, oldValue);
            if (changedBits === 0) {
                if (oldProps.children === newProps.children && !hasContextChanged()) {
                    return bailoutOnAlreadyFinishedWork(current$$1, workInProgress, renderExpirationTime);
                }
            } else {
                propagateContextChange(workInProgress, context, changedBits, renderExpirationTime);
            }
        }
        var newChildren = newProps.children;
        reconcileChildren(current$$1, workInProgress, newChildren, renderExpirationTime);
        return workInProgress.child;
    }

    function updateContextConsumer(current$$1, workInProgress, renderExpirationTime) {
        var context = workInProgress.type;
        var newProps = workInProgress.pendingProps;
        var render = newProps.children;
        prepareToReadContext(workInProgress, renderExpirationTime);
        var newValue = readContext(context, newProps.unstable_observedBits);
        var newChildren = void 0; {
            newChildren = render(newValue);
        }
        workInProgress.effectTag |= PerformedWork;
        reconcileChildren(current$$1, workInProgress, newChildren, renderExpirationTime);
        return workInProgress.child;
    }

    function markWorkInProgressReceivedUpdate() {
        didReceiveUpdate = true;
    }

    function bailoutOnAlreadyFinishedWork(current$$1, workInProgress, renderExpirationTime) {
        if (current$$1 !== null) {
            workInProgress.contextDependencies = current$$1.contextDependencies;
        }
        var childExpirationTime = workInProgress.childExpirationTime;
        if (childExpirationTime < renderExpirationTime) {
            return null;
        } else {
            cloneChildFibers(current$$1, workInProgress);
            return workInProgress.child;
        }
    }

    function beginWork(current$$1, workInProgress, renderExpirationTime) {
        var updateExpirationTime = workInProgress.expirationTime;
        if (current$$1 !== null) {
            var oldProps = current$$1.memoizedProps;
            var newProps = workInProgress.pendingProps;
            if (oldProps !== newProps || hasContextChanged() || (
                    false)) {
                didReceiveUpdate = true;
            } else if (updateExpirationTime < renderExpirationTime) {
                didReceiveUpdate = false;
                switch (workInProgress.tag) {
                    case HostRoot:
                        pushHostRootContext(workInProgress);
                        resetHydrationState();
                        break;
                    case HostComponent:
                        pushHostContext(workInProgress);
                        if (workInProgress.mode & ConcurrentMode && renderExpirationTime !== Never && ReactDOMHostConfig.shouldDeprioritizeSubtree(workInProgress.type, newProps)) {
                            workInProgress.expirationTime = workInProgress.childExpirationTime = Never;
                            return null;
                        }
                        break;
                    case ClassComponent:
                        {
                            var Component = workInProgress.type;
                            if (isContextProvider(Component)) {
                                pushContextProvider(workInProgress);
                            }
                            break;
                        }
                    case HostPortal:
                        pushHostContainer(workInProgress, workInProgress.stateNode.containerInfo);
                        break;
                    case ContextProvider:
                        {
                            var newValue = workInProgress.memoizedProps.value;
                            pushProvider(workInProgress, newValue);
                            break;
                        }
                    case Profiler:
                        break;
                    case SuspenseComponent:
                        {
                            var state = workInProgress.memoizedState;
                            var didTimeout = state !== null;
                            if (didTimeout) {
                                var primaryChildFragment = workInProgress.child;
                                var primaryChildExpirationTime = primaryChildFragment.childExpirationTime;
                                if (primaryChildExpirationTime !== NoWork && primaryChildExpirationTime >= renderExpirationTime) {
                                    return updateSuspenseComponent(current$$1, workInProgress, renderExpirationTime);
                                } else {
                                    pushSuspenseContext(workInProgress, setDefaultShallowSuspenseContext(suspenseStackCursor.current));
                                    var child = bailoutOnAlreadyFinishedWork(current$$1, workInProgress, renderExpirationTime);
                                    if (child !== null) {
                                        return child.sibling;
                                    } else {
                                        return null;
                                    }
                                }
                            } else {
                                pushSuspenseContext(workInProgress, setDefaultShallowSuspenseContext(suspenseStackCursor.current));
                            }
                            break;
                        }
                    case DehydratedSuspenseComponent:
                        {
                            break;
                        }
                    case EventComponent:
                        break;
                    case EventTarget:
                        {
                            break;
                        }
                }
                return bailoutOnAlreadyFinishedWork(current$$1, workInProgress, renderExpirationTime);
            }
        } else {
            didReceiveUpdate = false;
        }
        workInProgress.expirationTime = NoWork;
        switch (workInProgress.tag) {
            case IndeterminateComponent:
                {
                    return mountIndeterminateComponent(current$$1, workInProgress, workInProgress.type, renderExpirationTime);
                }
            case LazyComponent:
                {
                    var elementType = workInProgress.elementType;
                    return mountLazyComponent(current$$1, workInProgress, elementType, updateExpirationTime, renderExpirationTime);
                }
            case FunctionComponent:
                {
                    var _Component = workInProgress.type;
                    var unresolvedProps = workInProgress.pendingProps;
                    var resolvedProps = workInProgress.elementType === _Component ? unresolvedProps : resolveDefaultProps(_Component, unresolvedProps);
                    return updateFunctionComponent(current$$1, workInProgress, _Component, resolvedProps, renderExpirationTime);
                }
            case ClassComponent:
                {
                    var _Component2 = workInProgress.type;
                    var _unresolvedProps = workInProgress.pendingProps;
                    var _resolvedProps = workInProgress.elementType === _Component2 ? _unresolvedProps : resolveDefaultProps(_Component2, _unresolvedProps);
                    return updateClassComponent(current$$1, workInProgress, _Component2, _resolvedProps, renderExpirationTime);
                }
            case HostRoot:
                return updateHostRoot(current$$1, workInProgress, renderExpirationTime);
            case HostComponent:
                return updateHostComponent(current$$1, workInProgress, renderExpirationTime);
            case HostText:
                return updateHostText(current$$1, workInProgress);
            case SuspenseComponent:
                return updateSuspenseComponent(current$$1, workInProgress, renderExpirationTime);
            case HostPortal:
                return updatePortalComponent(current$$1, workInProgress, renderExpirationTime);
            case ForwardRef:
                {
                    var type = workInProgress.type;
                    var _unresolvedProps2 = workInProgress.pendingProps;
                    var _resolvedProps2 = workInProgress.elementType === type ? _unresolvedProps2 : resolveDefaultProps(type, _unresolvedProps2);
                    return updateForwardRef(current$$1, workInProgress, type, _resolvedProps2, renderExpirationTime);
                }
            case Fragment:
                return updateFragment(current$$1, workInProgress, renderExpirationTime);
            case Mode:
                return updateMode(current$$1, workInProgress, renderExpirationTime);
            case Profiler:
                return updateProfiler(current$$1, workInProgress, renderExpirationTime);
            case ContextProvider:
                return updateContextProvider(current$$1, workInProgress, renderExpirationTime);
            case ContextConsumer:
                return updateContextConsumer(current$$1, workInProgress, renderExpirationTime);
            case MemoComponent:
                {
                    var _type2 = workInProgress.type;
                    var _unresolvedProps3 = workInProgress.pendingProps;
                    var _resolvedProps3 = resolveDefaultProps(_type2, _unresolvedProps3);
                    _resolvedProps3 = resolveDefaultProps(_type2.type, _resolvedProps3);
                    return updateMemoComponent(current$$1, workInProgress, _type2, _resolvedProps3, updateExpirationTime, renderExpirationTime);
                }
            case SimpleMemoComponent:
                {
                    return updateSimpleMemoComponent(current$$1, workInProgress, workInProgress.type, workInProgress.pendingProps, updateExpirationTime, renderExpirationTime);
                }
            case IncompleteClassComponent:
                {
                    var _Component3 = workInProgress.type;
                    var _unresolvedProps4 = workInProgress.pendingProps;
                    var _resolvedProps4 = workInProgress.elementType === _Component3 ? _unresolvedProps4 : resolveDefaultProps(_Component3, _unresolvedProps4);
                    return mountIncompleteClassComponent(current$$1, workInProgress, _Component3, _resolvedProps4, renderExpirationTime);
                }
            case DehydratedSuspenseComponent:
                {
                    break;
                }
            case EventComponent:
                {
                    break;
                }
            case EventTarget:
                {
                    break;
                }
        }
        invariant(false, 'Unknown unit of work tag. This error is likely caused by a bug in ' + 'React. Please file an issue.');
    }

    function markUpdate(workInProgress) {
        workInProgress.effectTag |= Update;
    }

    function markRef$1(workInProgress) {
        workInProgress.effectTag |= Ref;
    }
    var _appendAllChildren = void 0;
    var updateHostContainer = void 0;
    var updateHostComponent$1 = void 0;
    var updateHostText$1 = void 0;
    if (ReactDOMHostConfig.supportsMutation) {
        _appendAllChildren = function appendAllChildren(parent, workInProgress, needsVisibilityToggle, isHidden) {
            var node = workInProgress.child;
            while (node !== null) {
                if (node.tag === HostComponent || node.tag === HostText) {
                    ReactDOMHostConfig.appendInitialChild(parent, node.stateNode);
                } else if (node.tag === HostPortal);
                else if (node.child !== null) {
                    node.child.return = node;
                    node = node.child;
                    continue;
                }
                if (node === workInProgress) {
                    return;
                }
                while (node.sibling === null) {
                    if (node.return === null || node.return === workInProgress) {
                        return;
                    }
                    node = node.return;
                }
                node.sibling.return = node.return;
                node = node.sibling;
            }
        };
        updateHostContainer = function updateHostContainer(workInProgress) {};
        updateHostComponent$1 = function updateHostComponent(current, workInProgress, type, newProps, rootContainerInstance) {
            var oldProps = current.memoizedProps;
            if (oldProps === newProps) {
                return;
            }
            var instance = workInProgress.stateNode;
            var currentHostContext = getHostContext();
            var updatePayload = ReactDOMHostConfig.prepareUpdate(instance, type, oldProps, newProps, rootContainerInstance, currentHostContext);
            workInProgress.updateQueue = updatePayload;
            if (updatePayload) {
                markUpdate(workInProgress);
            }
        };
        updateHostText$1 = function updateHostText(current, workInProgress, oldText, newText) {
            if (oldText !== newText) {
                markUpdate(workInProgress);
            }
        };
    } else if (ReactDOMHostConfig.supportsPersistence) {
        _appendAllChildren = function appendAllChildren(parent, workInProgress, needsVisibilityToggle, isHidden) {
            var node = workInProgress.child;
            while (node !== null) {
                branches: if (node.tag === HostComponent) {
                    var instance = node.stateNode;
                    if (needsVisibilityToggle && isHidden) {
                        var props = node.memoizedProps;
                        var type = node.type;
                        instance = ReactDOMHostConfig.cloneHiddenInstance(instance, type, props, node);
                    }
                    ReactDOMHostConfig.appendInitialChild(parent, instance);
                }elseif(node.tag === HostText) {
                    var _instance = node.stateNode;
                    if (needsVisibilityToggle && isHidden) {
                        var text = node.memoizedProps;
                        _instance = ReactDOMHostConfig.cloneHiddenTextInstance(_instance, text, node);
                    }
                    ReactDOMHostConfig.appendInitialChild(parent, _instance);
                } else if (node.tag === HostPortal);
                else if (node.tag === SuspenseComponent) {
                    if ((node.effectTag & Update) !== NoEffect) {
                        var newIsHidden = node.memoizedState !== null;
                        if (newIsHidden) {
                            var primaryChildParent = node.child;
                            if (primaryChildParent !== null) {
                                if (primaryChildParent.child !== null) {
                                    primaryChildParent.child.return = primaryChildParent;
                                    _appendAllChildren(parent, primaryChildParent, true, newIsHidden);
                                }
                                var fallbackChildParent = primaryChildParent.sibling;
                                if (fallbackChildParent !== null) {
                                    fallbackChildParent.return = node;
                                    node = fallbackChildParent;
                                    continue;
                                }
                            }
                        }
                    }
                    if (node.child !== null) {
                        node.child.return = node;
                        node = node.child;
                        continue;
                    }
                } else if (node.child !== null) {
                    node.child.return = node;
                    node = node.child;
                    continue;
                }
                node = node;
                if (node === workInProgress) {
                    return;
                }
                while (node.sibling === null) {
                    if (node.return === null || node.return === workInProgress) {
                        return;
                    }
                    node = node.return;
                }
                node.sibling.return = node.return;
                node = node.sibling;
            }
        };
        var appendAllChildrenToContainer = function appendAllChildrenToContainer(containerChildSet, workInProgress, needsVisibilityToggle, isHidden) {
            var node = workInProgress.child;
            while (node !== null) {
                branches: if (node.tag === HostComponent) {
                    var instance = node.stateNode;
                    if (needsVisibilityToggle && isHidden) {
                        var props = node.memoizedProps;
                        var type = node.type;
                        instance = ReactDOMHostConfig.cloneHiddenInstance(instance, type, props, node);
                    }
                    ReactDOMHostConfig.appendChildToContainerChildSet(containerChildSet, instance);
                }elseif(node.tag === HostText) {
                    var _instance2 = node.stateNode;
                    if (needsVisibilityToggle && isHidden) {
                        var text = node.memoizedProps;
                        _instance2 = ReactDOMHostConfig.cloneHiddenTextInstance(_instance2, text, node);
                    }
                    ReactDOMHostConfig.appendChildToContainerChildSet(containerChildSet, _instance2);
                } else if (node.tag === HostPortal);
                else if (node.tag === SuspenseComponent) {
                    if ((node.effectTag & Update) !== NoEffect) {
                        var newIsHidden = node.memoizedState !== null;
                        if (newIsHidden) {
                            var primaryChildParent = node.child;
                            if (primaryChildParent !== null) {
                                if (primaryChildParent.child !== null) {
                                    primaryChildParent.child.return = primaryChildParent;
                                    appendAllChildrenToContainer(containerChildSet, primaryChildParent, true, newIsHidden);
                                }
                                var fallbackChildParent = primaryChildParent.sibling;
                                if (fallbackChildParent !== null) {
                                    fallbackChildParent.return = node;
                                    node = fallbackChildParent;
                                    continue;
                                }
                            }
                        }
                    }
                    if (node.child !== null) {
                        node.child.return = node;
                        node = node.child;
                        continue;
                    }
                } else if (node.child !== null) {
                    node.child.return = node;
                    node = node.child;
                    continue;
                }
                node = node;
                if (node === workInProgress) {
                    return;
                }
                while (node.sibling === null) {
                    if (node.return === null || node.return === workInProgress) {
                        return;
                    }
                    node = node.return;
                }
                node.sibling.return = node.return;
                node = node.sibling;
            }
        };
        updateHostContainer = function updateHostContainer(workInProgress) {
            var portalOrRoot = workInProgress.stateNode;
            var childrenUnchanged = workInProgress.firstEffect === null;
            if (childrenUnchanged);
            else {
                var container = portalOrRoot.containerInfo;
                var newChildSet = ReactDOMHostConfig.createContainerChildSet(container);
                appendAllChildrenToContainer(newChildSet, workInProgress, false, false);
                portalOrRoot.pendingChildren = newChildSet;
                markUpdate(workInProgress);
                ReactDOMHostConfig.finalizeContainerChildren(container, newChildSet);
            }
        };
        updateHostComponent$1 = function updateHostComponent(current, workInProgress, type, newProps, rootContainerInstance) {
            var currentInstance = current.stateNode;
            var oldProps = current.memoizedProps;
            var childrenUnchanged = workInProgress.firstEffect === null;
            if (childrenUnchanged && oldProps === newProps) {
                workInProgress.stateNode = currentInstance;
                return;
            }
            var recyclableInstance = workInProgress.stateNode;
            var currentHostContext = getHostContext();
            var updatePayload = null;
            if (oldProps !== newProps) {
                updatePayload = ReactDOMHostConfig.prepareUpdate(recyclableInstance, type, oldProps, newProps, rootContainerInstance, currentHostContext);
            }
            if (childrenUnchanged && updatePayload === null) {
                workInProgress.stateNode = currentInstance;
                return;
            }
            var newInstance = ReactDOMHostConfig.cloneInstance(currentInstance, updatePayload, type, oldProps, newProps, workInProgress, childrenUnchanged, recyclableInstance);
            if (ReactDOMHostConfig.finalizeInitialChildren(newInstance, type, newProps, rootContainerInstance, currentHostContext)) {
                markUpdate(workInProgress);
            }
            workInProgress.stateNode = newInstance;
            if (childrenUnchanged) {
                markUpdate(workInProgress);
            } else {
                _appendAllChildren(newInstance, workInProgress, false, false);
            }
        };
        updateHostText$1 = function updateHostText(current, workInProgress, oldText, newText) {
            if (oldText !== newText) {
                var rootContainerInstance = getRootHostContainer();
                var currentHostContext = getHostContext();
                workInProgress.stateNode = ReactDOMHostConfig.createTextInstance(newText, rootContainerInstance, currentHostContext, workInProgress);
                markUpdate(workInProgress);
            }
        };
    } else {
        updateHostContainer = function updateHostContainer(workInProgress) {};
        updateHostComponent$1 = function updateHostComponent(current, workInProgress, type, newProps, rootContainerInstance) {};
        updateHostText$1 = function updateHostText(current, workInProgress, oldText, newText) {};
    }

    function completeWork(current, workInProgress, renderExpirationTime) {
        var newProps = workInProgress.pendingProps;
        switch (workInProgress.tag) {
            case IndeterminateComponent:
                break;
            case LazyComponent:
                break;
            case SimpleMemoComponent:
            case FunctionComponent:
                break;
            case ClassComponent:
                {
                    var Component = workInProgress.type;
                    if (isContextProvider(Component)) {
                        popContext(workInProgress);
                    }
                    break;
                }
            case HostRoot:
                {
                    popHostContainer(workInProgress);
                    popTopLevelContextObject(workInProgress);
                    var fiberRoot = workInProgress.stateNode;
                    if (fiberRoot.pendingContext) {
                        fiberRoot.context = fiberRoot.pendingContext;
                        fiberRoot.pendingContext = null;
                    }
                    if (current === null || current.child === null) {
                        popHydrationState(workInProgress);
                        workInProgress.effectTag &= ~Placement;
                    }
                    updateHostContainer(workInProgress);
                    break;
                }
            case HostComponent:
                {
                    popHostContext(workInProgress);
                    var rootContainerInstance = getRootHostContainer();
                    var type = workInProgress.type;
                    if (current !== null && workInProgress.stateNode != null) {
                        updateHostComponent$1(current, workInProgress, type, newProps, rootContainerInstance);
                        if (current.ref !== workInProgress.ref) {
                            markRef$1(workInProgress);
                        }
                    } else {
                        if (!newProps) {
                            invariant(workInProgress.stateNode !== null, 'We must have new props for new mounts. This error is likely ' + 'caused by a bug in React. Please file an issue.');
                            break;
                        }
                        var currentHostContext = getHostContext();
                        var wasHydrated = popHydrationState(workInProgress);
                        if (wasHydrated) {
                            if (prepareToHydrateHostInstance(workInProgress, rootContainerInstance, currentHostContext)) {
                                markUpdate(workInProgress);
                            }
                        } else {
                            var instance = ReactDOMHostConfig.createInstance(type, newProps, rootContainerInstance, currentHostContext, workInProgress);
                            _appendAllChildren(instance, workInProgress, false, false);
                            if (ReactDOMHostConfig.finalizeInitialChildren(instance, type, newProps, rootContainerInstance, currentHostContext)) {
                                markUpdate(workInProgress);
                            }
                            workInProgress.stateNode = instance;
                        }
                        if (workInProgress.ref !== null) {
                            markRef$1(workInProgress);
                        }
                    }
                    break;
                }
            case HostText:
                {
                    var newText = newProps;
                    if (current && workInProgress.stateNode != null) {
                        var oldText = current.memoizedProps;
                        updateHostText$1(current, workInProgress, oldText, newText);
                    } else {
                        if (typeof newText !== 'string') {
                            invariant(workInProgress.stateNode !== null, 'We must have new props for new mounts. This error is likely ' + 'caused by a bug in React. Please file an issue.');
                        }
                        var _rootContainerInstance = getRootHostContainer();
                        var _currentHostContext = getHostContext();
                        var _wasHydrated = popHydrationState(workInProgress);
                        if (_wasHydrated) {
                            if (prepareToHydrateHostTextInstance(workInProgress)) {
                                markUpdate(workInProgress);
                            }
                        } else {
                            workInProgress.stateNode = ReactDOMHostConfig.createTextInstance(newText, _rootContainerInstance, _currentHostContext, workInProgress);
                        }
                    }
                    break;
                }
            case ForwardRef:
                break;
            case SuspenseComponent:
                {
                    popSuspenseContext(workInProgress);
                    var nextState = workInProgress.memoizedState;
                    if ((workInProgress.effectTag & DidCapture) !== NoEffect) {
                        workInProgress.expirationTime = renderExpirationTime;
                        return workInProgress;
                    }
                    var nextDidTimeout = nextState !== null;
                    var prevDidTimeout = false;
                    if (current === null) {
                        popHydrationState(workInProgress);
                    } else {
                        var prevState = current.memoizedState;
                        prevDidTimeout = prevState !== null;
                        if (!nextDidTimeout && prevState !== null) {
                            var fallbackExpirationTime = prevState.fallbackExpirationTime;
                            markRenderEventTimeAndConfig(fallbackExpirationTime, null);
                            var currentFallbackChild = current.child.sibling;
                            if (currentFallbackChild !== null) {
                                var first = workInProgress.firstEffect;
                                if (first !== null) {
                                    workInProgress.firstEffect = currentFallbackChild;
                                    currentFallbackChild.nextEffect = first;
                                } else {
                                    workInProgress.firstEffect = workInProgress.lastEffect = currentFallbackChild;
                                    currentFallbackChild.nextEffect = null;
                                }
                                currentFallbackChild.effectTag = Deletion;
                            }
                        }
                    }
                    if (nextDidTimeout && !prevDidTimeout) {
                        if ((workInProgress.mode & BatchedMode) !== NoMode) {
                            var hasInvisibleChildContext = current === null && workInProgress.memoizedProps.unstable_avoidThisFallback !== true;
                            if (hasInvisibleChildContext || hasSuspenseContext(suspenseStackCursor.current, InvisibleParentSuspenseContext)) {
                                renderDidSuspend();
                            } else {
                                renderDidSuspendDelayIfPossible();
                            }
                        }
                    }
                    if (ReactDOMHostConfig.supportsPersistence) {
                        if (nextDidTimeout) {
                            workInProgress.effectTag |= Update;
                        }
                    }
                    if (ReactDOMHostConfig.supportsMutation) {
                        if (nextDidTimeout || prevDidTimeout) {
                            workInProgress.effectTag |= Update;
                        }
                    }
                    break;
                }
            case Fragment:
                break;
            case Mode:
                break;
            case Profiler:
                break;
            case HostPortal:
                popHostContainer(workInProgress);
                updateHostContainer(workInProgress);
                break;
            case ContextProvider:
                popProvider(workInProgress);
                break;
            case ContextConsumer:
                break;
            case MemoComponent:
                break;
            case IncompleteClassComponent:
                {
                    var _Component = workInProgress.type;
                    if (isContextProvider(_Component)) {
                        popContext(workInProgress);
                    }
                    break;
                }
            case DehydratedSuspenseComponent:
                {
                    break;
                }
            case EventComponent:
                {
                    break;
                }
            case EventTarget:
                {
                    break;
                }
            default:
                invariant(false, 'Unknown unit of work tag. This error is likely caused by a bug in ' + 'React. Please file an issue.');
        }
        return null;
    }

    function shouldCaptureSuspense(workInProgress, hasInvisibleParent) {
        var nextState = workInProgress.memoizedState;
        if (nextState !== null) {
            return false;
        }
        var props = workInProgress.memoizedProps;
        if (props.fallback === undefined) {
            return false;
        }
        if (props.unstable_avoidThisFallback !== true) {
            return true;
        }
        if (hasInvisibleParent) {
            return false;
        }
        return true;
    }

    function createCapturedValue(value, source) {
        return {
            value: value,
            source: source,
            stack: getStackByFiberInDevAndProd(source)
        };
    }

    function showErrorDialog(capturedError) {
        return true;
    }

    function logCapturedError(capturedError) {
        var logError = showErrorDialog(capturedError);
        if (logError === false) {
            return;
        }
        var error = capturedError.error; {
            console.error(error);
        }
    }

    var PossiblyWeakSet = typeof WeakSet === 'function' ? WeakSet : Set;

    function logError(boundary, errorInfo) {
        var source = errorInfo.source;
        var stack = errorInfo.stack;
        if (stack === null && source !== null) {
            stack = getStackByFiberInDevAndProd(source);
        }
        var capturedError = {
            componentName: source !== null ? getComponentName(source.type) : null,
            componentStack: stack !== null ? stack : '',
            error: errorInfo.value,
            errorBoundary: null,
            errorBoundaryName: null,
            errorBoundaryFound: false,
            willRetry: false
        };
        if (boundary !== null && boundary.tag === ClassComponent) {
            capturedError.errorBoundary = boundary.stateNode;
            capturedError.errorBoundaryName = getComponentName(boundary.type);
            capturedError.errorBoundaryFound = true;
            capturedError.willRetry = true;
        }
        try {
            logCapturedError(capturedError);
        } catch (e) {
            setTimeout(function() {
                throw e;
            });
        }
    }
    var callComponentWillUnmountWithTimer = function callComponentWillUnmountWithTimer(current$$1, instance) {
        instance.props = current$$1.memoizedProps;
        instance.state = current$$1.memoizedState;
        instance.componentWillUnmount();
    };

    function safelyCallComponentWillUnmount(current$$1, instance) {
        {
            try {
                callComponentWillUnmountWithTimer(current$$1, instance);
            } catch (unmountError) {
                captureCommitPhaseError(current$$1, unmountError);
            }
        }
    }

    function safelyDetachRef(current$$1) {
        var ref = current$$1.ref;
        if (ref !== null) {
            if (typeof ref === 'function') {
                {
                    try {
                        ref(null);
                    } catch (refError) {
                        captureCommitPhaseError(current$$1, refError);
                    }
                }
            } else {
                ref.current = null;
            }
        }
    }

    function safelyCallDestroy(current$$1, destroy) {
        {
            try {
                destroy();
            } catch (error) {
                captureCommitPhaseError(current$$1, error);
            }
        }
    }

    function commitBeforeMutationLifeCycles(current$$1, finishedWork) {
        switch (finishedWork.tag) {
            case FunctionComponent:
            case ForwardRef:
            case SimpleMemoComponent:
                {
                    commitHookEffectList(UnmountSnapshot, NoEffect$1, finishedWork);
                    return;
                }
            case ClassComponent:
                {
                    if (finishedWork.effectTag & Snapshot) {
                        if (current$$1 !== null) {
                            var prevProps = current$$1.memoizedProps;
                            var prevState = current$$1.memoizedState;
                            var instance = finishedWork.stateNode;
                            var snapshot = instance.getSnapshotBeforeUpdate(finishedWork.elementType === finishedWork.type ? prevProps : resolveDefaultProps(finishedWork.type, prevProps), prevState);
                            instance.__reactInternalSnapshotBeforeUpdate = snapshot;
                        }
                    }
                    return;
                }
            case HostRoot:
            case HostComponent:
            case HostText:
            case HostPortal:
            case IncompleteClassComponent:
            case EventTarget:
                return;
            default:
                {
                    invariant(false, 'This unit of work tag should not have side-effects. This error is ' + 'likely caused by a bug in React. Please file an issue.');
                }
        }
    }

    function commitHookEffectList(unmountTag, mountTag, finishedWork) {
        var updateQueue = finishedWork.updateQueue;
        var lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
        if (lastEffect !== null) {
            var firstEffect = lastEffect.next;
            var effect = firstEffect;
            do {
                if ((effect.tag & unmountTag) !== NoEffect$1) {
                    var destroy = effect.destroy;
                    effect.destroy = undefined;
                    if (destroy !== undefined) {
                        destroy();
                    }
                }
                if ((effect.tag & mountTag) !== NoEffect$1) {
                    var create = effect.create;
                    effect.destroy = create();
                }
                effect = effect.next;
            } while (effect !== firstEffect);
        }
    }

    function commitPassiveHookEffects(finishedWork) {
        commitHookEffectList(UnmountPassive, NoEffect$1, finishedWork);
        commitHookEffectList(NoEffect$1, MountPassive, finishedWork);
    }

    function commitLifeCycles(finishedRoot, current$$1, finishedWork, committedExpirationTime) {
        switch (finishedWork.tag) {
            case FunctionComponent:
            case ForwardRef:
            case SimpleMemoComponent:
                {
                    commitHookEffectList(UnmountLayout, MountLayout, finishedWork);
                    break;
                }
            case ClassComponent:
                {
                    var instance = finishedWork.stateNode;
                    if (finishedWork.effectTag & Update) {
                        if (current$$1 === null) {
                            instance.componentDidMount();
                        } else {
                            var prevProps = finishedWork.elementType === finishedWork.type ? current$$1.memoizedProps : resolveDefaultProps(finishedWork.type, current$$1.memoizedProps);
                            var prevState = current$$1.memoizedState;
                            instance.componentDidUpdate(prevProps, prevState, instance.__reactInternalSnapshotBeforeUpdate);
                        }
                    }
                    var updateQueue = finishedWork.updateQueue;
                    if (updateQueue !== null) {
                        commitUpdateQueue(finishedWork, updateQueue, instance, committedExpirationTime);
                    }
                    return;
                }
            case HostRoot:
                {
                    var _updateQueue = finishedWork.updateQueue;
                    if (_updateQueue !== null) {
                        var _instance = null;
                        if (finishedWork.child !== null) {
                            switch (finishedWork.child.tag) {
                                case HostComponent:
                                    _instance = ReactDOMHostConfig.getPublicInstance(finishedWork.child.stateNode);
                                    break;
                                case ClassComponent:
                                    _instance = finishedWork.child.stateNode;
                                    break;
                            }
                        }
                        commitUpdateQueue(finishedWork, _updateQueue, _instance, committedExpirationTime);
                    }
                    return;
                }
            case HostComponent:
                {
                    var _instance2 = finishedWork.stateNode;
                    if (current$$1 === null && finishedWork.effectTag & Update) {
                        var type = finishedWork.type;
                        var props = finishedWork.memoizedProps;
                        ReactDOMHostConfig.commitMount(_instance2, type, props, finishedWork);
                    }
                    return;
                }
            case HostText:
                {
                    return;
                }
            case HostPortal:
                {
                    return;
                }
            case Profiler:
                {
                    return;
                }
            case SuspenseComponent:
            case IncompleteClassComponent:
                return;
            case EventTarget:
                {
                    return;
                }
            case EventComponent:
                {
                    return;
                }
            default:
                {
                    invariant(false, 'This unit of work tag should not have side-effects. This error is ' + 'likely caused by a bug in React. Please file an issue.');
                }
        }
    }

    function hideOrUnhideAllChildren(finishedWork, isHidden) {
        if (ReactDOMHostConfig.supportsMutation) {
            var node = finishedWork;
            while (true) {
                if (node.tag === HostComponent) {
                    var instance = node.stateNode;
                    if (isHidden) {
                        ReactDOMHostConfig.hideInstance(instance);
                    } else {
                        ReactDOMHostConfig.unhideInstance(node.stateNode, node.memoizedProps);
                    }
                } else if (node.tag === HostText) {
                    var _instance4 = node.stateNode;
                    if (isHidden) {
                        ReactDOMHostConfig.hideTextInstance(_instance4);
                    } else {
                        ReactDOMHostConfig.unhideTextInstance(_instance4, node.memoizedProps);
                    }
                } else if (node.tag === SuspenseComponent && node.memoizedState !== null) {
                    var fallbackChildFragment = node.child.sibling;
                    fallbackChildFragment.return = node;
                    node = fallbackChildFragment;
                    continue;
                } else if (node.child !== null) {
                    node.child.return = node;
                    node = node.child;
                    continue;
                }
                if (node === finishedWork) {
                    return;
                }
                while (node.sibling === null) {
                    if (node.return === null || node.return === finishedWork) {
                        return;
                    }
                    node = node.return;
                }
                node.sibling.return = node.return;
                node = node.sibling;
            }
        }
    }

    function commitAttachRef(finishedWork) {
        var ref = finishedWork.ref;
        if (ref !== null) {
            var instance = finishedWork.stateNode;
            var instanceToUse = void 0;
            switch (finishedWork.tag) {
                case HostComponent:
                    instanceToUse = ReactDOMHostConfig.getPublicInstance(instance);
                    break;
                default:
                    instanceToUse = instance;
            }
            if (typeof ref === 'function') {
                ref(instanceToUse);
            } else {
                ref.current = instanceToUse;
            }
        }
    }

    function commitDetachRef(current$$1) {
        var currentRef = current$$1.ref;
        if (currentRef !== null) {
            if (typeof currentRef === 'function') {
                currentRef(null);
            } else {
                currentRef.current = null;
            }
        }
    }

    function commitUnmount(current$$1) {
        onCommitUnmount(current$$1);
        switch (current$$1.tag) {
            case FunctionComponent:
            case ForwardRef:
            case MemoComponent:
            case SimpleMemoComponent:
                {
                    var updateQueue = current$$1.updateQueue;
                    if (updateQueue !== null) {
                        var lastEffect = updateQueue.lastEffect;
                        if (lastEffect !== null) {
                            var firstEffect = lastEffect.next;
                            var effect = firstEffect;
                            do {
                                var destroy = effect.destroy;
                                if (destroy !== undefined) {
                                    safelyCallDestroy(current$$1, destroy);
                                }
                                effect = effect.next;
                            } while (effect !== firstEffect);
                        }
                    }
                    break;
                }
            case ClassComponent:
                {
                    safelyDetachRef(current$$1);
                    var instance = current$$1.stateNode;
                    if (typeof instance.componentWillUnmount === 'function') {
                        safelyCallComponentWillUnmount(current$$1, instance);
                    }
                    return;
                }
            case HostComponent:
                {
                    safelyDetachRef(current$$1);
                    return;
                }
            case HostPortal:
                {
                    if (ReactDOMHostConfig.supportsMutation) {
                        unmountHostComponents(current$$1);
                    } else if (ReactDOMHostConfig.supportsPersistence) {
                        emptyPortalContainer(current$$1);
                    }
                    return;
                }
            case EventComponent:

        }
    }

    function commitNestedUnmounts(root) {
        var node = root;
        while (true) {
            commitUnmount(node);
            if (node.child !== null && (!ReactDOMHostConfig.supportsMutation || node.tag !== HostPortal)) {
                node.child.return = node;
                node = node.child;
                continue;
            }
            if (node === root) {
                return;
            }
            while (node.sibling === null) {
                if (node.return === null || node.return === root) {
                    return;
                }
                node = node.return;
            }
            node.sibling.return = node.return;
            node = node.sibling;
        }
    }

    function detachFiber(current$$1) {
        current$$1.return = null;
        current$$1.child = null;
        current$$1.memoizedState = null;
        current$$1.updateQueue = null;
        var alternate = current$$1.alternate;
        if (alternate !== null) {
            alternate.return = null;
            alternate.child = null;
            alternate.memoizedState = null;
            alternate.updateQueue = null;
        }
    }

    function emptyPortalContainer(current$$1) {
        if (!ReactDOMHostConfig.supportsPersistence) {
            return;
        }
        var portal = current$$1.stateNode;
        var containerInfo = portal.containerInfo;
        var emptyChildSet = ReactDOMHostConfig.createContainerChildSet(containerInfo);
        ReactDOMHostConfig.replaceContainerChildren(containerInfo, emptyChildSet);
    }

    function commitContainer(finishedWork) {
        if (!ReactDOMHostConfig.supportsPersistence) {
            return;
        }
        switch (finishedWork.tag) {
            case ClassComponent:
            case HostComponent:
            case HostText:
            case EventTarget:
            case EventComponent:
                {
                    return;
                }
            case HostRoot:
            case HostPortal:
                {
                    var portalOrRoot = finishedWork.stateNode;
                    var containerInfo = portalOrRoot.containerInfo,
                        pendingChildren = portalOrRoot.pendingChildren;
                    ReactDOMHostConfig.replaceContainerChildren(containerInfo, pendingChildren);
                    return;
                }
            default:
                {
                    invariant(false, 'This unit of work tag should not have side-effects. This error is ' + 'likely caused by a bug in React. Please file an issue.');
                }
        }
    }

    function getHostParentFiber(fiber) {
        var parent = fiber.return;
        while (parent !== null) {
            if (isHostParent(parent)) {
                return parent;
            }
            parent = parent.return;
        }
        invariant(false, 'Expected to find a host parent. This error is likely caused by a bug ' + 'in React. Please file an issue.');
    }

    function isHostParent(fiber) {
        return fiber.tag === HostComponent || fiber.tag === HostRoot || fiber.tag === HostPortal;
    }

    function getHostSibling(fiber) {
        var node = fiber;
        siblings: while (true) {
            while (node.sibling === null) {
                if (node.return === null || isHostParent(node.return)) {
                    return null;
                }
                node = node.return;
            }
            node.sibling.return = node.return;
            node = node.sibling;
            while (node.tag !== HostComponent && node.tag !== HostText && node.tag !== DehydratedSuspenseComponent) {
                if (node.effectTag & Placement) {
                    continue siblings;
                }
                if (node.child === null || node.tag === HostPortal) {
                    continue siblings;
                } else {
                    node.child.return = node;
                    node = node.child;
                }
            }
            if (!(node.effectTag & Placement)) {
                return node.stateNode;
            }
        }
    }

    function commitPlacement(finishedWork) {
        if (!ReactDOMHostConfig.supportsMutation) {
            return;
        }
        var parentFiber = getHostParentFiber(finishedWork);
        var parent = void 0;
        var isContainer = void 0;
        switch (parentFiber.tag) {
            case HostComponent:
                parent = parentFiber.stateNode;
                isContainer = false;
                break;
            case HostRoot:
                parent = parentFiber.stateNode.containerInfo;
                isContainer = true;
                break;
            case HostPortal:
                parent = parentFiber.stateNode.containerInfo;
                isContainer = true;
                break;
            default:
                invariant(false, 'Invalid host parent fiber. This error is likely caused by a bug ' + 'in React. Please file an issue.');
        }
        if (parentFiber.effectTag & ContentReset) {
            ReactDOMHostConfig.resetTextContent(parent);
            parentFiber.effectTag &= ~ContentReset;
        }
        var before = getHostSibling(finishedWork);
        var node = finishedWork;
        while (true) {
            if (node.tag === HostComponent || node.tag === HostText) {
                var stateNode = node.stateNode;
                if (before) {
                    if (isContainer) {
                        ReactDOMHostConfig.insertInContainerBefore(parent, stateNode, before);
                    } else {
                        ReactDOMHostConfig.insertBefore(parent, stateNode, before);
                    }
                } else {
                    if (isContainer) {
                        ReactDOMHostConfig.appendChildToContainer(parent, stateNode);
                    } else {
                        ReactDOMHostConfig.appendChild(parent, stateNode);
                    }
                }
            } else if (node.tag === HostPortal);
            else if (node.child !== null) {
                node.child.return = node;
                node = node.child;
                continue;
            }
            if (node === finishedWork) {
                return;
            }
            while (node.sibling === null) {
                if (node.return === null || node.return === finishedWork) {
                    return;
                }
                node = node.return;
            }
            node.sibling.return = node.return;
            node = node.sibling;
        }
    }

    function unmountHostComponents(current$$1) {
        var node = current$$1;
        var currentParentIsValid = false;
        var currentParent = void 0;
        var currentParentIsContainer = void 0;
        while (true) {
            if (!currentParentIsValid) {
                var parent = node.return;
                findParent: while (true) {
                    invariant(parent !== null, 'Expected to find a host parent. This error is likely caused by ' + 'a bug in React. Please file an issue.');
                    switch (parent.tag) {
                        case HostComponent:
                            currentParent = parent.stateNode;
                            currentParentIsContainer = false;
                            break findParent;
                        case HostRoot:
                            currentParent = parent.stateNode.containerInfo;
                            currentParentIsContainer = true;
                            break findParent;
                        case HostPortal:
                            currentParent = parent.stateNode.containerInfo;
                            currentParentIsContainer = true;
                            break findParent;
                    }
                    parent = parent.return;
                }
                currentParentIsValid = true;
            }
            if (node.tag === HostComponent || node.tag === HostText) {
                commitNestedUnmounts(node);
                if (currentParentIsContainer) {
                    ReactDOMHostConfig.removeChildFromContainer(currentParent, node.stateNode);
                } else {
                    ReactDOMHostConfig.removeChild(currentParent, node.stateNode);
                }
            } else if (node.tag === HostPortal) {
                if (node.child !== null) {
                    currentParent = node.stateNode.containerInfo;
                    currentParentIsContainer = true;
                    node.child.return = node;
                    node = node.child;
                    continue;
                }
            } else {
                commitUnmount(node);
                if (node.child !== null) {
                    node.child.return = node;
                    node = node.child;
                    continue;
                }
            }
            if (node === current$$1) {
                return;
            }
            while (node.sibling === null) {
                if (node.return === null || node.return === current$$1) {
                    return;
                }
                node = node.return;
                if (node.tag === HostPortal) {
                    currentParentIsValid = false;
                }
            }
            node.sibling.return = node.return;
            node = node.sibling;
        }
    }

    function commitDeletion(current$$1) {
        if (ReactDOMHostConfig.supportsMutation) {
            unmountHostComponents(current$$1);
        } else {
            commitNestedUnmounts(current$$1);
        }
        detachFiber(current$$1);
    }

    function commitWork(current$$1, finishedWork) {
        if (!ReactDOMHostConfig.supportsMutation) {
            switch (finishedWork.tag) {
                case FunctionComponent:
                case ForwardRef:
                case MemoComponent:
                case SimpleMemoComponent:
                    {
                        commitHookEffectList(UnmountMutation, MountMutation, finishedWork);
                        return;
                    }
                case Profiler:
                    {
                        return;
                    }
                case SuspenseComponent:
                    {
                        commitSuspenseComponent(finishedWork);
                        return;
                    }
            }
            commitContainer(finishedWork);
            return;
        }
        switch (finishedWork.tag) {
            case FunctionComponent:
            case ForwardRef:
            case MemoComponent:
            case SimpleMemoComponent:
                {
                    commitHookEffectList(UnmountMutation, MountMutation, finishedWork);
                    return;
                }
            case ClassComponent:
                {
                    return;
                }
            case HostComponent:
                {
                    var instance = finishedWork.stateNode;
                    if (instance != null) {
                        var newProps = finishedWork.memoizedProps;
                        var oldProps = current$$1 !== null ? current$$1.memoizedProps : newProps;
                        var type = finishedWork.type;
                        var updatePayload = finishedWork.updateQueue;
                        finishedWork.updateQueue = null;
                        if (updatePayload !== null) {
                            ReactDOMHostConfig.commitUpdate(instance, updatePayload, type, oldProps, newProps, finishedWork);
                        }
                    }
                    return;
                }
            case HostText:
                {
                    invariant(finishedWork.stateNode !== null, 'This should have a text node initialized. This error is likely ' + 'caused by a bug in React. Please file an issue.');
                    var textInstance = finishedWork.stateNode;
                    var newText = finishedWork.memoizedProps;
                    var oldText = current$$1 !== null ? current$$1.memoizedProps : newText;
                    ReactDOMHostConfig.commitTextUpdate(textInstance, oldText, newText);
                    return;
                }
            case EventTarget:
                {
                    return;
                }
            case HostRoot:
                {
                    return;
                }
            case Profiler:
                {
                    return;
                }
            case SuspenseComponent:
                {
                    commitSuspenseComponent(finishedWork);
                    return;
                }
            case IncompleteClassComponent:
                {
                    return;
                }
            case EventComponent:
                {
                    return;
                }
            default:
                {
                    invariant(false, 'This unit of work tag should not have side-effects. This error is ' + 'likely caused by a bug in React. Please file an issue.');
                }
        }
    }

    function commitSuspenseComponent(finishedWork) {
        var newState = finishedWork.memoizedState;
        var newDidTimeout = void 0;
        var primaryChildParent = finishedWork;
        if (newState === null) {
            newDidTimeout = false;
        } else {
            newDidTimeout = true;
            primaryChildParent = finishedWork.child;
            if (newState.fallbackExpirationTime === NoWork) {
                newState.fallbackExpirationTime = computeAsyncExpirationNoBucket(requestCurrentTime());
            }
        }
        if (ReactDOMHostConfig.supportsMutation && primaryChildParent !== null) {
            hideOrUnhideAllChildren(primaryChildParent, newDidTimeout);
        }
        var thenables = finishedWork.updateQueue;
        if (thenables !== null) {
            finishedWork.updateQueue = null;
            var retryCache = finishedWork.stateNode;
            if (retryCache === null) {
                retryCache = finishedWork.stateNode = new PossiblyWeakSet();
            }
            thenables.forEach(function(thenable) {
                var retry = resolveRetryThenable.bind(null, finishedWork, thenable);
                if (!retryCache.has(thenable)) {
                    retryCache.add(thenable);
                    thenable.then(retry, retry);
                }
            });
        }
    }

    function commitResetTextContent(current$$1) {
        if (!ReactDOMHostConfig.supportsMutation) {
            return;
        }
        ReactDOMHostConfig.resetTextContent(current$$1.stateNode);
    }

    var _typeofb = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) { return typeof obj; } : function(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
    var PossiblyWeakMap = typeof WeakMap === 'function' ? WeakMap : Map;

    function createRootErrorUpdate(fiber, errorInfo, expirationTime) {
        var update = createUpdate(expirationTime, null);
        update.tag = CaptureUpdate;
        update.payload = { element: null };
        var error = errorInfo.value;
        update.callback = function() {
            onUncaughtError(error);
            logError(fiber, errorInfo);
        };
        return update;
    }

    function createClassErrorUpdate(fiber, errorInfo, expirationTime) {
        var update = createUpdate(expirationTime, null);
        update.tag = CaptureUpdate;
        var getDerivedStateFromError = fiber.type.getDerivedStateFromError;
        if (typeof getDerivedStateFromError === 'function') {
            var error = errorInfo.value;
            update.payload = function() {
                return getDerivedStateFromError(error);
            };
        }
        var inst = fiber.stateNode;
        if (inst !== null && typeof inst.componentDidCatch === 'function') {
            update.callback = function callback() {
                if (typeof getDerivedStateFromError !== 'function') {
                    markLegacyErrorBoundaryAsFailed(this);
                }
                var error = errorInfo.value;
                var stack = errorInfo.stack;
                logError(fiber, errorInfo);
                this.componentDidCatch(error, {
                    componentStack: stack !== null ? stack : ''
                });
            };
        }
        return update;
    }

    function attachPingListener(root, renderExpirationTime, thenable) {
        var pingCache = root.pingCache;
        var threadIDs = void 0;
        if (pingCache === null) {
            pingCache = root.pingCache = new PossiblyWeakMap();
            threadIDs = new Set();
            pingCache.set(thenable, threadIDs);
        } else {
            threadIDs = pingCache.get(thenable);
            if (threadIDs === undefined) {
                threadIDs = new Set();
                pingCache.set(thenable, threadIDs);
            }
        }
        if (!threadIDs.has(renderExpirationTime)) {
            threadIDs.add(renderExpirationTime);
            var ping = pingSuspendedRoot.bind(null, root, thenable, renderExpirationTime);
            thenable.then(ping, ping);
        }
    }

    function throwException(root, returnFiber, sourceFiber, value, renderExpirationTime) {
        sourceFiber.effectTag |= Incomplete;
        sourceFiber.firstEffect = sourceFiber.lastEffect = null;
        if (value !== null && (typeof value === 'undefined' ? 'undefined' : _typeofb(value)) === 'object' && typeof value.then === 'function') {
            var thenable = value;
            var hasInvisibleParentBoundary = hasSuspenseContext(suspenseStackCursor.current, InvisibleParentSuspenseContext);
            var _workInProgress = returnFiber;
            do {
                if (_workInProgress.tag === SuspenseComponent && shouldCaptureSuspense(_workInProgress, hasInvisibleParentBoundary)) {
                    var thenables = _workInProgress.updateQueue;
                    if (thenables === null) {
                        var updateQueue = new Set();
                        updateQueue.add(thenable);
                        _workInProgress.updateQueue = updateQueue;
                    } else {
                        thenables.add(thenable);
                    }
                    if ((_workInProgress.mode & BatchedMode) === NoMode) {
                        _workInProgress.effectTag |= DidCapture;
                        sourceFiber.effectTag &= ~(LifecycleEffectMask | Incomplete);
                        if (sourceFiber.tag === ClassComponent) {
                            var currentSourceFiber = sourceFiber.alternate;
                            if (currentSourceFiber === null) {
                                sourceFiber.tag = IncompleteClassComponent;
                            } else {
                                var update = createUpdate(Sync, null);
                                update.tag = ForceUpdate;
                                enqueueUpdate(sourceFiber, update);
                            }
                        }
                        sourceFiber.expirationTime = Sync;
                        return;
                    }
                    attachPingListener(root, renderExpirationTime, thenable);
                    _workInProgress.effectTag |= ShouldCapture;
                    _workInProgress.expirationTime = renderExpirationTime;
                    return;
                }
                _workInProgress = _workInProgress.return;
            } while (_workInProgress !== null);
            value = new Error((getComponentName(sourceFiber.type) || 'A React component') + ' suspended while rendering, but no fallback UI was specified.\n' + '\n' + 'Add a <Suspense fallback=...> component higher in the tree to ' + 'provide a loading indicator or placeholder to display.' + getStackByFiberInDevAndProd(sourceFiber));
        }
        renderDidError();
        value = createCapturedValue(value, sourceFiber);
        var workInProgress = returnFiber;
        do {
            switch (workInProgress.tag) {
                case HostRoot:
                    {
                        var _errorInfo = value;
                        workInProgress.effectTag |= ShouldCapture;
                        workInProgress.expirationTime = renderExpirationTime;
                        var _update = createRootErrorUpdate(workInProgress, _errorInfo, renderExpirationTime);
                        enqueueCapturedUpdate(workInProgress, _update);
                        return;
                    }
                case ClassComponent:
                    var errorInfo = value;
                    var ctor = workInProgress.type;
                    var instance = workInProgress.stateNode;
                    if ((workInProgress.effectTag & DidCapture) === NoEffect && (typeof ctor.getDerivedStateFromError === 'function' || instance !== null && typeof instance.componentDidCatch === 'function' && !isAlreadyFailedLegacyErrorBoundary(instance))) {
                        workInProgress.effectTag |= ShouldCapture;
                        workInProgress.expirationTime = renderExpirationTime;
                        var _update2 = createClassErrorUpdate(workInProgress, errorInfo, renderExpirationTime);
                        enqueueCapturedUpdate(workInProgress, _update2);
                        return;
                    }
                    break;
                default:
                    break;
            }
            workInProgress = workInProgress.return;
        } while (workInProgress !== null);
    }

    function unwindWork(workInProgress, renderExpirationTime) {
        switch (workInProgress.tag) {
            case ClassComponent:
                {
                    var Component = workInProgress.type;
                    if (isContextProvider(Component)) {
                        popContext(workInProgress);
                    }
                    var effectTag = workInProgress.effectTag;
                    if (effectTag & ShouldCapture) {
                        workInProgress.effectTag = effectTag & ~ShouldCapture | DidCapture;
                        return workInProgress;
                    }
                    return null;
                }
            case HostRoot:
                {
                    popHostContainer(workInProgress);
                    popTopLevelContextObject(workInProgress);
                    var _effectTag = workInProgress.effectTag;
                    invariant((_effectTag & DidCapture) === NoEffect, 'The root failed to unmount after an error. This is likely a bug in ' + 'React. Please file an issue.');
                    workInProgress.effectTag = _effectTag & ~ShouldCapture | DidCapture;
                    return workInProgress;
                }
            case HostComponent:
                {
                    popHostContext(workInProgress);
                    return null;
                }
            case SuspenseComponent:
                {
                    popSuspenseContext(workInProgress);
                    var _effectTag2 = workInProgress.effectTag;
                    if (_effectTag2 & ShouldCapture) {
                        workInProgress.effectTag = _effectTag2 & ~ShouldCapture | DidCapture;
                        return workInProgress;
                    }
                    return null;
                }
            case DehydratedSuspenseComponent:
                {
                    return null;
                }
            case HostPortal:
                popHostContainer(workInProgress);
                return null;
            case ContextProvider:
                popProvider(workInProgress);
                return null;
            case EventComponent:
            case EventTarget:
                return null;
            default:
                return null;
        }
    }

    function unwindInterruptedWork(interruptedWork) {
        switch (interruptedWork.tag) {
            case ClassComponent:
                {
                    var childContextTypes = interruptedWork.type.childContextTypes;
                    if (childContextTypes !== null && childContextTypes !== undefined) {
                        popContext(interruptedWork);
                    }
                    break;
                }
            case HostRoot:
                {
                    popHostContainer(interruptedWork);
                    popTopLevelContextObject(interruptedWork);
                    break;
                }
            case HostComponent:
                {
                    popHostContext(interruptedWork);
                    break;
                }
            case HostPortal:
                popHostContainer(interruptedWork);
                break;
            case SuspenseComponent:
                popSuspenseContext(interruptedWork);
                break;
            case DehydratedSuspenseComponent:
                break;
            case ContextProvider:
                popProvider(interruptedWork);
                break;
            case EventComponent:
            case EventTarget:
                break;
            default:
                break;
        }
    }

    var ceil = Math.ceil;
    var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher,
        ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner,
        ReactShouldWarnActingUpdates = ReactSharedInternals.ReactShouldWarnActingUpdates;
    var NotWorking = 0;
    var BatchedPhase = 1;
    var LegacyUnbatchedPhase = 2;
    var FlushSyncPhase = 3;
    var RenderPhase = 4;
    var CommitPhase = 5;
    var RootIncomplete = 0;
    var RootErrored = 1;
    var RootSuspended = 2;
    var RootSuspendedWithDelay = 3;
    var RootCompleted = 4;
    var workPhase = NotWorking;
    var workInProgressRoot = null;
    var workInProgress = null;
    var renderExpirationTime$1 = NoWork;
    var workInProgressRootExitStatus = RootIncomplete;
    var workInProgressRootLatestProcessedExpirationTime = Sync;
    var workInProgressRootLatestSuspenseTimeout = Sync;
    var workInProgressRootCanSuspendUsingConfig = null;
    var nextEffect = null;
    var hasUncaughtError = false;
    var firstUncaughtError = null;
    var legacyErrorBoundariesThatAlreadyFailed = null;
    var rootDoesHavePassiveEffects = false;
    var rootWithPendingPassiveEffects = null;
    var rootsWithPendingDiscreteUpdates = null;
    var NESTED_UPDATE_LIMIT = 50;
    var nestedUpdateCount = 0;
    var rootWithNestedUpdates = null;
    var currentEventTime = NoWork;

    function requestCurrentTime() {
        if (workPhase === RenderPhase || workPhase === CommitPhase) {
            return msToExpirationTime(now());
        }
        if (currentEventTime !== NoWork) {
            return currentEventTime;
        }
        currentEventTime = msToExpirationTime(now());
        return currentEventTime;
    }

    function computeExpirationForFiber(currentTime, fiber, suspenseConfig) {
        var mode = fiber.mode;
        if ((mode & BatchedMode) === NoMode) {
            return Sync;
        }
        var priorityLevel = getCurrentPriorityLevel();
        if ((mode & ConcurrentMode) === NoMode) {
            return priorityLevel === ImmediatePriority$1 ? Sync : Batched;
        }
        if (workPhase === RenderPhase) {
            return renderExpirationTime$1;
        }
        var expirationTime = void 0;
        if (suspenseConfig !== null) {
            expirationTime = computeSuspenseExpiration(currentTime, suspenseConfig.timeoutMs | 0 || LOW_PRIORITY_EXPIRATION);
        } else {
            switch (priorityLevel) {
                case ImmediatePriority$1:
                    expirationTime = Sync;
                    break;
                case UserBlockingPriority$1:
                    expirationTime = computeInteractiveExpiration(currentTime);
                    break;
                case NormalPriority$1:
                case LowPriority$1:
                    expirationTime = computeAsyncExpiration(currentTime);
                    break;
                case IdlePriority$1:
                    expirationTime = Never;
                    break;
                default:
                    invariant(false, 'Expected a valid priority level');
            }
        }
        if (workInProgressRoot !== null && expirationTime === renderExpirationTime$1) {
            expirationTime -= 1;
        }
        return expirationTime;
    }
    var lastUniqueAsyncExpiration = NoWork;

    function computeUniqueAsyncExpiration() {
        var currentTime = requestCurrentTime();
        var result = computeAsyncExpiration(currentTime);
        if (result <= lastUniqueAsyncExpiration) {
            result -= 1;
        }
        lastUniqueAsyncExpiration = result;
        return result;
    }

    function scheduleUpdateOnFiber(fiber, expirationTime) {
        checkForNestedUpdates();
        var root = markUpdateTimeFromFiberToRoot(fiber, expirationTime);
        if (root === null) {
            return;
        }
        root.pingTime = NoWork;
        if (expirationTime === Sync) {
            if (workPhase === LegacyUnbatchedPhase) {
                schedulePendingInteraction(root, expirationTime);
                var callback = renderRoot(root, Sync, true);
                while (callback !== null) {
                    callback = callback(true);
                }
            } else {
                scheduleCallbackForRoot(root, ImmediatePriority$1, Sync);
                if (workPhase === NotWorking) {
                    flushSyncCallbackQueue();
                }
            }
        } else {
            var priorityLevel = getCurrentPriorityLevel();
            if (priorityLevel === UserBlockingPriority$1) {
                if (rootsWithPendingDiscreteUpdates === null) {
                    rootsWithPendingDiscreteUpdates = new Map([
                        [root, expirationTime]
                    ]);
                } else {
                    var lastDiscreteTime = rootsWithPendingDiscreteUpdates.get(root);
                    if (lastDiscreteTime === undefined || lastDiscreteTime > expirationTime) {
                        rootsWithPendingDiscreteUpdates.set(root, expirationTime);
                    }
                }
            }
            scheduleCallbackForRoot(root, priorityLevel, expirationTime);
        }
    }
    var scheduleWork = scheduleUpdateOnFiber;

    function markUpdateTimeFromFiberToRoot(fiber, expirationTime) {
        if (fiber.expirationTime < expirationTime) {
            fiber.expirationTime = expirationTime;
        }
        var alternate = fiber.alternate;
        if (alternate !== null && alternate.expirationTime < expirationTime) {
            alternate.expirationTime = expirationTime;
        }
        var node = fiber.return;
        var root = null;
        if (node === null && fiber.tag === HostRoot) {
            root = fiber.stateNode;
        } else {
            while (node !== null) {
                alternate = node.alternate;
                if (node.childExpirationTime < expirationTime) {
                    node.childExpirationTime = expirationTime;
                    if (alternate !== null && alternate.childExpirationTime < expirationTime) {
                        alternate.childExpirationTime = expirationTime;
                    }
                } else if (alternate !== null && alternate.childExpirationTime < expirationTime) {
                    alternate.childExpirationTime = expirationTime;
                }
                if (node.return === null && node.tag === HostRoot) {
                    root = node.stateNode;
                    break;
                }
                node = node.return;
            }
        }
        if (root !== null) {
            var firstPendingTime = root.firstPendingTime;
            if (expirationTime > firstPendingTime) {
                root.firstPendingTime = expirationTime;
            }
            var lastPendingTime = root.lastPendingTime;
            if (lastPendingTime === NoWork || expirationTime < lastPendingTime) {
                root.lastPendingTime = expirationTime;
            }
        }
        return root;
    }

    function scheduleCallbackForRoot(root, priorityLevel, expirationTime) {
        var existingCallbackExpirationTime = root.callbackExpirationTime;
        if (existingCallbackExpirationTime < expirationTime) {
            var existingCallbackNode = root.callbackNode;
            if (existingCallbackNode !== null) {
                cancelCallback(existingCallbackNode);
            }
            root.callbackExpirationTime = expirationTime;
            if (expirationTime === Sync) {
                root.callbackNode = scheduleSyncCallback(runRootCallback.bind(null, root, renderRoot.bind(null, root, expirationTime)));
            } else {
                var options = null;
                if (expirationTime !== Sync && expirationTime !== Never) {
                    var timeout = expirationTimeToMs(expirationTime) - now();
                    if (timeout > 5000) {
                        timeout = 5000;
                    }
                    options = { timeout: timeout };
                }
                root.callbackNode = scheduleCallback(priorityLevel, runRootCallback.bind(null, root, renderRoot.bind(null, root, expirationTime)), options);
            }
        }
        schedulePendingInteraction(root, expirationTime);
    }

    function runRootCallback(root, callback, isSync) {
        var prevCallbackNode = root.callbackNode;
        var continuation = null;
        try {
            continuation = callback(isSync);
            if (continuation !== null) {
                return runRootCallback.bind(null, root, continuation);
            } else {
                return null;
            }
        } finally {
            if (continuation === null && prevCallbackNode === root.callbackNode) {
                root.callbackNode = null;
                root.callbackExpirationTime = NoWork;
            }
        }
    }

    function flushRoot(root, expirationTime) {
        if (workPhase === RenderPhase || workPhase === CommitPhase) {
            invariant(false, 'work.commit(): Cannot commit while already rendering. This likely ' + 'means you attempted to commit from inside a lifecycle method.');
        }
        scheduleSyncCallback(renderRoot.bind(null, root, expirationTime));
        flushSyncCallbackQueue();
    }

    function flushInteractiveUpdates() {
        if (workPhase === RenderPhase || workPhase === CommitPhase) {
            return;
        }
        flushPendingDiscreteUpdates(); {
            flushPassiveEffects();
        }
    }

    function resolveLocksOnRoot(root, expirationTime) {
        var firstBatch = root.firstBatch;
        if (firstBatch !== null && firstBatch._defer && firstBatch._expirationTime >= expirationTime) {
            scheduleCallback(NormalPriority$1, function() {
                firstBatch._onComplete();
                return null;
            });
            return true;
        } else {
            return false;
        }
    }

    function deferredUpdates(fn) {
        return runWithPriority(NormalPriority$1, fn);
    }

    function interactiveUpdates(fn, a, b, c) {
        if (workPhase === NotWorking) {
            flushPendingDiscreteUpdates();
        } {
            flushPassiveEffects();
        }
        return runWithPriority(UserBlockingPriority$1, fn.bind(null, a, b, c));
    }

    function syncUpdates(fn, a, b, c) {
        return runWithPriority(ImmediatePriority$1, fn.bind(null, a, b, c));
    }

    function flushPendingDiscreteUpdates() {
        if (rootsWithPendingDiscreteUpdates !== null) {
            var roots = rootsWithPendingDiscreteUpdates;
            rootsWithPendingDiscreteUpdates = null;
            roots.forEach(function(expirationTime, root) {
                scheduleSyncCallback(renderRoot.bind(null, root, expirationTime));
            });
            flushSyncCallbackQueue();
        }
    }

    function batchedUpdates(fn, a) {
        if (workPhase !== NotWorking) {
            return fn(a);
        }
        workPhase = BatchedPhase;
        try {
            return fn(a);
        } finally {
            workPhase = NotWorking;
            flushSyncCallbackQueue();
        }
    }

    function unbatchedUpdates(fn, a) {
        if (workPhase !== BatchedPhase && workPhase !== FlushSyncPhase) {
            return fn(a);
        }
        var prevWorkPhase = workPhase;
        workPhase = LegacyUnbatchedPhase;
        try {
            return fn(a);
        } finally {
            workPhase = prevWorkPhase;
        }
    }

    function flushSync(fn, a) {
        if (workPhase === RenderPhase || workPhase === CommitPhase) {
            invariant(false, 'flushSync was called from inside a lifecycle method. It cannot be ' + 'called when React is already rendering.');
        }
        var prevWorkPhase = workPhase;
        workPhase = FlushSyncPhase;
        try {
            return runWithPriority(ImmediatePriority$1, fn.bind(null, a));
        } finally {
            workPhase = prevWorkPhase;
            flushSyncCallbackQueue();
        }
    }

    function flushControlled(fn) {
        var prevWorkPhase = workPhase;
        workPhase = BatchedPhase;
        try {
            runWithPriority(ImmediatePriority$1, fn);
        } finally {
            workPhase = prevWorkPhase;
            if (workPhase === NotWorking) {
                flushSyncCallbackQueue();
            }
        }
    }

    function prepareFreshStack(root, expirationTime) {
        root.finishedWork = null;
        root.finishedExpirationTime = NoWork;
        var timeoutHandle = root.timeoutHandle;
        if (timeoutHandle !== ReactDOMHostConfig.noTimeout) {
            root.timeoutHandle = ReactDOMHostConfig.noTimeout;
            ReactDOMHostConfig.cancelTimeout(timeoutHandle);
        }
        if (workInProgress !== null) {
            var interruptedWork = workInProgress.return;
            while (interruptedWork !== null) {
                unwindInterruptedWork(interruptedWork);
                interruptedWork = interruptedWork.return;
            }
        }
        workInProgressRoot = root;
        workInProgress = createWorkInProgress(root.current, null, expirationTime);
        renderExpirationTime$1 = expirationTime;
        workInProgressRootExitStatus = RootIncomplete;
        workInProgressRootLatestProcessedExpirationTime = Sync;
        workInProgressRootLatestSuspenseTimeout = Sync;
        workInProgressRootCanSuspendUsingConfig = null;
    }

    function renderRoot(root, expirationTime, isSync) {
        invariant(workPhase !== RenderPhase && workPhase !== CommitPhase, 'Should not already be working.');
        if (root.firstPendingTime < expirationTime) {
            return null;
        }
        if (root.finishedExpirationTime === expirationTime) {
            return commitRoot.bind(null, root);
        }
        flushPassiveEffects();
        if (root !== workInProgressRoot || expirationTime !== renderExpirationTime$1) {
            prepareFreshStack(root, expirationTime);
            startWorkOnPendingInteraction(root, expirationTime);
        }
        if (workInProgress !== null) {
            var prevWorkPhase = workPhase;
            workPhase = RenderPhase;
            var prevDispatcher = ReactCurrentDispatcher$1.current;
            if (prevDispatcher === null) {
                prevDispatcher = ContextOnlyDispatcher;
            }
            ReactCurrentDispatcher$1.current = ContextOnlyDispatcher;
            if (isSync) {
                if (expirationTime !== Sync) {
                    var currentTime = requestCurrentTime();
                    if (currentTime < expirationTime) {
                        workPhase = prevWorkPhase;
                        resetContextDependences();
                        ReactCurrentDispatcher$1.current = prevDispatcher;
                        return renderRoot.bind(null, root, currentTime);
                    }
                }
            } else {
                currentEventTime = NoWork;
            }
            do {
                try {
                    if (isSync) {
                        workLoopSync();
                    } else {
                        workLoop();
                    }
                    break;
                } catch (thrownValue) {
                    resetContextDependences();
                    resetHooks();
                    var sourceFiber = workInProgress;
                    if (sourceFiber === null || sourceFiber.return === null) {
                        prepareFreshStack(root, expirationTime);
                        workPhase = prevWorkPhase;
                        throw thrownValue;
                    }
                    var returnFiber = sourceFiber.return;
                    throwException(root, returnFiber, sourceFiber, thrownValue, renderExpirationTime$1);
                    workInProgress = completeUnitOfWork(sourceFiber);
                }
            } while (true);
            workPhase = prevWorkPhase;
            resetContextDependences();
            ReactCurrentDispatcher$1.current = prevDispatcher;
            if (workInProgress !== null) {
                return renderRoot.bind(null, root, expirationTime);
            }
        }
        root.finishedWork = root.current.alternate;
        root.finishedExpirationTime = expirationTime;
        var isLocked = resolveLocksOnRoot(root, expirationTime);
        if (isLocked) {
            return null;
        }
        workInProgressRoot = null;
        switch (workInProgressRootExitStatus) {
            case RootIncomplete:
                {
                    invariant(false, 'Should have a work-in-progress.');
                }
            case RootErrored:
                {
                    var lastPendingTime = root.lastPendingTime;
                    if (root.lastPendingTime < expirationTime) {
                        return renderRoot.bind(null, root, lastPendingTime);
                    }
                    if (!isSync) {
                        prepareFreshStack(root, expirationTime);
                        scheduleSyncCallback(renderRoot.bind(null, root, expirationTime));
                        return null;
                    }
                    return commitRoot.bind(null, root);
                }
            case RootSuspended:
            case RootSuspendedWithDelay:
                {
                    if (!isSync) {
                        var _lastPendingTime = root.lastPendingTime;
                        if (root.lastPendingTime < expirationTime) {
                            return renderRoot.bind(null, root, _lastPendingTime);
                        }
                        if (workInProgressRootLatestProcessedExpirationTime !== Sync) {
                            var shouldDelay = workInProgressRootExitStatus === RootSuspendedWithDelay;
                            var msUntilTimeout = computeMsUntilTimeout(workInProgressRootLatestProcessedExpirationTime, workInProgressRootLatestSuspenseTimeout, expirationTime, workInProgressRootCanSuspendUsingConfig, shouldDelay);
                            if (msUntilTimeout > 10) {
                                root.timeoutHandle = ReactDOMHostConfig.scheduleTimeout(commitRoot.bind(null, root), msUntilTimeout);
                                return null;
                            }
                        }
                    }
                    return commitRoot.bind(null, root);
                }
            case RootCompleted:
                {
                    if (!isSync && workInProgressRootLatestProcessedExpirationTime !== Sync && workInProgressRootCanSuspendUsingConfig !== null) {
                        var _msUntilTimeout = computeMsUntilSuspenseLoadingDelay(workInProgressRootLatestProcessedExpirationTime, expirationTime, workInProgressRootCanSuspendUsingConfig);
                        if (_msUntilTimeout > 10) {
                            root.timeoutHandle = ReactDOMHostConfig.scheduleTimeout(commitRoot.bind(null, root), _msUntilTimeout);
                            return null;
                        }
                    }
                    return commitRoot.bind(null, root);
                }
            default:
                {
                    invariant(false, 'Unknown root exit status.');
                }
        }
    }

    function markRenderEventTimeAndConfig(expirationTime, suspenseConfig) {
        if (expirationTime < workInProgressRootLatestProcessedExpirationTime && expirationTime > Never) {
            workInProgressRootLatestProcessedExpirationTime = expirationTime;
        }
        if (suspenseConfig !== null) {
            if (expirationTime < workInProgressRootLatestSuspenseTimeout && expirationTime > Never) {
                workInProgressRootLatestSuspenseTimeout = expirationTime;
                workInProgressRootCanSuspendUsingConfig = suspenseConfig;
            }
        }
    }

    function renderDidSuspend() {
        if (workInProgressRootExitStatus === RootIncomplete) {
            workInProgressRootExitStatus = RootSuspended;
        }
    }

    function renderDidSuspendDelayIfPossible() {
        if (workInProgressRootExitStatus === RootIncomplete || workInProgressRootExitStatus === RootSuspended) {
            workInProgressRootExitStatus = RootSuspendedWithDelay;
        }
    }

    function renderDidError() {
        if (workInProgressRootExitStatus !== RootCompleted) {
            workInProgressRootExitStatus = RootErrored;
        }
    }

    function inferTimeFromExpirationTime(expirationTime, suspenseConfig) {
        var earliestExpirationTimeMs = expirationTimeToMs(expirationTime);
        return earliestExpirationTimeMs - (suspenseConfig !== null ? suspenseConfig.timeoutMs | 0 || LOW_PRIORITY_EXPIRATION : LOW_PRIORITY_EXPIRATION);
    }

    function workLoopSync() {
        while (workInProgress !== null) {
            workInProgress = performUnitOfWork(workInProgress);
        }
    }

    function workLoop() {
        while (workInProgress !== null && !shouldYield()) {
            workInProgress = performUnitOfWork(workInProgress);
        }
    }

    function performUnitOfWork(unitOfWork) {
        var current$$1 = unitOfWork.alternate;
        var next = void 0; {
            next = beginWork$1(current$$1, unitOfWork, renderExpirationTime$1);
        }
        unitOfWork.memoizedProps = unitOfWork.pendingProps;
        if (next === null) {
            next = completeUnitOfWork(unitOfWork);
        }
        ReactCurrentOwner$1.current = null;
        return next;
    }

    function completeUnitOfWork(unitOfWork) {
        workInProgress = unitOfWork;
        do {
            var current$$1 = workInProgress.alternate;
            var returnFiber = workInProgress.return;
            if ((workInProgress.effectTag & Incomplete) === NoEffect) {
                var next = void 0; {
                    next = completeWork(current$$1, workInProgress, renderExpirationTime$1);
                }
                resetChildExpirationTime(workInProgress);
                if (next !== null) {
                    return next;
                }
                if (returnFiber !== null &&
                    (returnFiber.effectTag & Incomplete) === NoEffect) {
                    if (returnFiber.firstEffect === null) {
                        returnFiber.firstEffect = workInProgress.firstEffect;
                    }
                    if (workInProgress.lastEffect !== null) {
                        if (returnFiber.lastEffect !== null) {
                            returnFiber.lastEffect.nextEffect = workInProgress.firstEffect;
                        }
                        returnFiber.lastEffect = workInProgress.lastEffect;
                    }
                    var effectTag = workInProgress.effectTag;
                    if (effectTag > PerformedWork) {
                        if (returnFiber.lastEffect !== null) {
                            returnFiber.lastEffect.nextEffect = workInProgress;
                        } else {
                            returnFiber.firstEffect = workInProgress;
                        }
                        returnFiber.lastEffect = workInProgress;
                    }
                }
            } else {
                var _next = unwindWork(workInProgress, renderExpirationTime$1);
                if (_next !== null) {
                    _next.effectTag &= HostEffectMask;
                    return _next;
                }
                if (returnFiber !== null) {
                    returnFiber.firstEffect = returnFiber.lastEffect = null;
                    returnFiber.effectTag |= Incomplete;
                }
            }
            var siblingFiber = workInProgress.sibling;
            if (siblingFiber !== null) {
                return siblingFiber;
            }
            workInProgress = returnFiber;
        } while (workInProgress !== null);
        if (workInProgressRootExitStatus === RootIncomplete) {
            workInProgressRootExitStatus = RootCompleted;
        }
        return null;
    }

    function resetChildExpirationTime(completedWork) {
        if (renderExpirationTime$1 !== Never && completedWork.childExpirationTime === Never) {
            return;
        }
        var newChildExpirationTime = NoWork; {
            var _child = completedWork.child;
            while (_child !== null) {
                var _childUpdateExpirationTime = _child.expirationTime;
                var _childChildExpirationTime = _child.childExpirationTime;
                if (_childUpdateExpirationTime > newChildExpirationTime) {
                    newChildExpirationTime = _childUpdateExpirationTime;
                }
                if (_childChildExpirationTime > newChildExpirationTime) {
                    newChildExpirationTime = _childChildExpirationTime;
                }
                _child = _child.sibling;
            }
        }
        completedWork.childExpirationTime = newChildExpirationTime;
    }

    function commitRoot(root) {
        runWithPriority(ImmediatePriority$1, commitRootImpl.bind(null, root));
        if (rootWithPendingPassiveEffects !== null) {
            var priorityLevel = getCurrentPriorityLevel();
            scheduleCallback(priorityLevel, function() {
                flushPassiveEffects();
                return null;
            });
        }
        return null;
    }

    function commitRootImpl(root) {
        flushPassiveEffects();
        invariant(workPhase !== RenderPhase && workPhase !== CommitPhase, 'Should not already be working.');
        var finishedWork = root.finishedWork;
        var expirationTime = root.finishedExpirationTime;
        if (finishedWork === null) {
            return null;
        }
        root.finishedWork = null;
        root.finishedExpirationTime = NoWork;
        invariant(finishedWork !== root.current, 'Cannot commit the same tree as before. This error is likely caused by ' + 'a bug in React. Please file an issue.');
        root.callbackNode = null;
        root.callbackExpirationTime = NoWork;
        var updateExpirationTimeBeforeCommit = finishedWork.expirationTime;
        var childExpirationTimeBeforeCommit = finishedWork.childExpirationTime;
        var firstPendingTimeBeforeCommit = childExpirationTimeBeforeCommit > updateExpirationTimeBeforeCommit ? childExpirationTimeBeforeCommit : updateExpirationTimeBeforeCommit;
        root.firstPendingTime = firstPendingTimeBeforeCommit;
        if (firstPendingTimeBeforeCommit < root.lastPendingTime) {
            root.lastPendingTime = firstPendingTimeBeforeCommit;
        }
        if (root === workInProgressRoot) {
            workInProgressRoot = null;
            workInProgress = null;
            renderExpirationTime$1 = NoWork;
        }
        var firstEffect = void 0;
        if (finishedWork.effectTag > PerformedWork) {
            if (finishedWork.lastEffect !== null) {
                finishedWork.lastEffect.nextEffect = finishedWork;
                firstEffect = finishedWork.firstEffect;
            } else {
                firstEffect = finishedWork;
            }
        } else {
            firstEffect = finishedWork.firstEffect;
        }
        if (firstEffect !== null) {
            var prevWorkPhase = workPhase;
            workPhase = CommitPhase;
            ReactCurrentOwner$1.current = null;
            ReactDOMHostConfig.prepareForCommit(root.containerInfo);
            nextEffect = firstEffect;
            do {
                {
                    try {
                        commitBeforeMutationEffects();
                    } catch (error) {
                        invariant(nextEffect !== null, 'Should be working on an effect.');
                        captureCommitPhaseError(nextEffect, error);
                        nextEffect = nextEffect.nextEffect;
                    }
                }
            } while (nextEffect !== null);
            nextEffect = firstEffect;
            do {
                {
                    try {
                        commitMutationEffects();
                    } catch (error) {
                        invariant(nextEffect !== null, 'Should be working on an effect.');
                        captureCommitPhaseError(nextEffect, error);
                        nextEffect = nextEffect.nextEffect;
                    }
                }
            } while (nextEffect !== null);
            ReactDOMHostConfig.resetAfterCommit(root.containerInfo);
            root.current = finishedWork;
            nextEffect = firstEffect;
            do {
                {
                    try {
                        commitLayoutEffects(root, expirationTime);
                    } catch (error) {
                        invariant(nextEffect !== null, 'Should be working on an effect.');
                        captureCommitPhaseError(nextEffect, error);
                        nextEffect = nextEffect.nextEffect;
                    }
                }
            } while (nextEffect !== null);
            nextEffect = null;
            workPhase = prevWorkPhase;
        } else {
            root.current = finishedWork;
        }
        if (rootDoesHavePassiveEffects) {
            rootDoesHavePassiveEffects = false;
            rootWithPendingPassiveEffects = root;
        }
        var remainingExpirationTime = root.firstPendingTime;
        if (remainingExpirationTime !== NoWork) {
            var currentTime = requestCurrentTime();
            var priorityLevel = inferPriorityFromExpirationTime(currentTime, remainingExpirationTime);
            scheduleCallbackForRoot(root, priorityLevel, remainingExpirationTime);
        } else {
            legacyErrorBoundariesThatAlreadyFailed = null;
        }
        onCommitRoot(finishedWork.stateNode, expirationTime);
        if (remainingExpirationTime === Sync) {
            if (root === rootWithNestedUpdates) {
                nestedUpdateCount++;
            } else {
                nestedUpdateCount = 0;
                rootWithNestedUpdates = root;
            }
        } else {
            nestedUpdateCount = 0;
        }
        if (hasUncaughtError) {
            hasUncaughtError = false;
            var _error3 = firstUncaughtError;
            firstUncaughtError = null;
            throw _error3;
        }
        if (workPhase === LegacyUnbatchedPhase) {
            return null;
        }
        flushSyncCallbackQueue();
        return null;
    }

    function commitBeforeMutationEffects() {
        while (nextEffect !== null) {
            if ((nextEffect.effectTag & Snapshot) !== NoEffect) {
                var current$$1 = nextEffect.alternate;
                commitBeforeMutationLifeCycles(current$$1, nextEffect);
            }
            nextEffect = nextEffect.nextEffect;
        }
    }

    function commitMutationEffects() {
        while (nextEffect !== null) {
            var effectTag = nextEffect.effectTag;
            if (effectTag & ContentReset) {
                commitResetTextContent(nextEffect);
            }
            if (effectTag & Ref) {
                var current$$1 = nextEffect.alternate;
                if (current$$1 !== null) {
                    commitDetachRef(current$$1);
                }
            }
            var primaryEffectTag = effectTag & (Placement | Update | Deletion);
            switch (primaryEffectTag) {
                case Placement:
                    {
                        commitPlacement(nextEffect);
                        nextEffect.effectTag &= ~Placement;
                        break;
                    }
                case PlacementAndUpdate:
                    {
                        commitPlacement(nextEffect);
                        nextEffect.effectTag &= ~Placement;
                        var _current = nextEffect.alternate;
                        commitWork(_current, nextEffect);
                        break;
                    }
                case Update:
                    {
                        var _current2 = nextEffect.alternate;
                        commitWork(_current2, nextEffect);
                        break;
                    }
                case Deletion:
                    {
                        commitDeletion(nextEffect);
                        break;
                    }
            }
            nextEffect = nextEffect.nextEffect;
        }
    }

    function commitLayoutEffects(root, committedExpirationTime) {
        while (nextEffect !== null) {
            var effectTag = nextEffect.effectTag;
            if (effectTag & (Update | Callback)) {
                var current$$1 = nextEffect.alternate;
                commitLifeCycles(root, current$$1, nextEffect, committedExpirationTime);
            }
            if (effectTag & Ref) {
                commitAttachRef(nextEffect);
            }
            if (effectTag & Passive) {
                rootDoesHavePassiveEffects = true;
            }
            nextEffect = nextEffect.nextEffect;
        }
    }

    function flushPassiveEffects() {
        if (rootWithPendingPassiveEffects === null) {
            return false;
        }
        var root = rootWithPendingPassiveEffects;
        rootWithPendingPassiveEffects = null;
        invariant(workPhase !== RenderPhase && workPhase !== CommitPhase, 'Cannot flush passive effects while already rendering.');
        var prevWorkPhase = workPhase;
        workPhase = CommitPhase;
        var effect = root.current.firstEffect;
        while (effect !== null) {
            {
                try {
                    commitPassiveHookEffects(effect);
                } catch (error) {
                    invariant(effect !== null, 'Should be working on an effect.');
                    captureCommitPhaseError(effect, error);
                }
            }
            effect = effect.nextEffect;
        }
        workPhase = prevWorkPhase;
        flushSyncCallbackQueue();
        return true;
    }

    function isAlreadyFailedLegacyErrorBoundary(instance) {
        return legacyErrorBoundariesThatAlreadyFailed !== null && legacyErrorBoundariesThatAlreadyFailed.has(instance);
    }

    function markLegacyErrorBoundaryAsFailed(instance) {
        if (legacyErrorBoundariesThatAlreadyFailed === null) {
            legacyErrorBoundariesThatAlreadyFailed = new Set([instance]);
        } else {
            legacyErrorBoundariesThatAlreadyFailed.add(instance);
        }
    }

    function prepareToThrowUncaughtError(error) {
        if (!hasUncaughtError) {
            hasUncaughtError = true;
            firstUncaughtError = error;
        }
    }
    var onUncaughtError = prepareToThrowUncaughtError;

    function captureCommitPhaseErrorOnRoot(rootFiber, sourceFiber, error) {
        var errorInfo = createCapturedValue(error, sourceFiber);
        var update = createRootErrorUpdate(rootFiber, errorInfo, Sync);
        enqueueUpdate(rootFiber, update);
        var root = markUpdateTimeFromFiberToRoot(rootFiber, Sync);
        if (root !== null) {
            scheduleCallbackForRoot(root, ImmediatePriority$1, Sync);
        }
    }

    function captureCommitPhaseError(sourceFiber, error) {
        if (sourceFiber.tag === HostRoot) {
            captureCommitPhaseErrorOnRoot(sourceFiber, sourceFiber, error);
            return;
        }
        var fiber = sourceFiber.return;
        while (fiber !== null) {
            if (fiber.tag === HostRoot) {
                captureCommitPhaseErrorOnRoot(fiber, sourceFiber, error);
                return;
            } else if (fiber.tag === ClassComponent) {
                var ctor = fiber.type;
                var instance = fiber.stateNode;
                if (typeof ctor.getDerivedStateFromError === 'function' || typeof instance.componentDidCatch === 'function' && !isAlreadyFailedLegacyErrorBoundary(instance)) {
                    var errorInfo = createCapturedValue(error, sourceFiber);
                    var update = createClassErrorUpdate(fiber, errorInfo,
                        Sync);
                    enqueueUpdate(fiber, update);
                    var root = markUpdateTimeFromFiberToRoot(fiber, Sync);
                    if (root !== null) {
                        scheduleCallbackForRoot(root, ImmediatePriority$1, Sync);
                    }
                    return;
                }
            }
            fiber = fiber.return;
        }
    }

    function pingSuspendedRoot(root, thenable, suspendedTime) {
        var pingCache = root.pingCache;
        if (pingCache !== null) {
            pingCache.delete(thenable);
        }
        if (workInProgressRoot === root && renderExpirationTime$1 === suspendedTime) {
            prepareFreshStack(root, renderExpirationTime$1);
            return;
        }
        var lastPendingTime = root.lastPendingTime;
        if (lastPendingTime < suspendedTime) {
            return;
        }
        var pingTime = root.pingTime;
        if (pingTime !== NoWork && pingTime < suspendedTime) {
            return;
        }
        root.pingTime = suspendedTime;
        if (root.finishedExpirationTime === suspendedTime) {
            root.finishedExpirationTime = NoWork;
            root.finishedWork = null;
        }
        var currentTime = requestCurrentTime();
        var priorityLevel = inferPriorityFromExpirationTime(currentTime, suspendedTime);
        scheduleCallbackForRoot(root, priorityLevel, suspendedTime);
    }

    function retryTimedOutBoundary(boundaryFiber) {
        var currentTime = requestCurrentTime();
        var suspenseConfig = null;
        var retryTime = computeExpirationForFiber(currentTime, boundaryFiber, suspenseConfig);
        var priorityLevel = inferPriorityFromExpirationTime(currentTime, retryTime);
        var root = markUpdateTimeFromFiberToRoot(boundaryFiber, retryTime);
        if (root !== null) {
            scheduleCallbackForRoot(root, priorityLevel, retryTime);
        }
    }

    function resolveRetryThenable(boundaryFiber, thenable) {
        var retryCache = void 0; {
            retryCache = boundaryFiber.stateNode;
        }
        if (retryCache !== null) {
            retryCache.delete(thenable);
        }
        retryTimedOutBoundary(boundaryFiber);
    }

    function jnd(timeElapsed) {
        return timeElapsed < 120 ? 120 : timeElapsed < 480 ? 480 : timeElapsed < 1080 ? 1080 : timeElapsed < 1920 ? 1920 : timeElapsed < 3000 ? 3000 : timeElapsed < 4320 ? 4320 : ceil(timeElapsed / 1960) * 1960;
    }

    function computeMsUntilSuspenseLoadingDelay(mostRecentEventTime, committedExpirationTime, suspenseConfig) {
        var minLoadingDurationMs = suspenseConfig.minLoadingDurationMs | 0;
        if (minLoadingDurationMs <= 0) {
            return 0;
        }
        var loadingDelayMs = suspenseConfig.loadingDelayMs | 0;
        var currentTimeMs = now();
        var eventTimeMs = inferTimeFromExpirationTime(mostRecentEventTime, suspenseConfig);
        var timeElapsed = currentTimeMs - eventTimeMs;
        if (timeElapsed <= loadingDelayMs) {
            return 0;
        }
        var msUntilTimeout = loadingDelayMs + minLoadingDurationMs - timeElapsed;
        return msUntilTimeout;
    }

    function computeMsUntilTimeout(mostRecentEventTime, suspenseTimeout, committedExpirationTime, suspenseConfig, shouldDelay) {
        var currentTimeMs = now();
        if (suspenseTimeout !== Sync && shouldDelay) {
            var timeUntilTimeoutMs = expirationTimeToMs(suspenseTimeout) - currentTimeMs;
            return timeUntilTimeoutMs;
        }
        var eventTimeMs = inferTimeFromExpirationTime(mostRecentEventTime, suspenseConfig);
        var timeUntilExpirationMs = expirationTimeToMs(committedExpirationTime) - currentTimeMs;
        var timeElapsed = currentTimeMs - eventTimeMs;
        if (timeElapsed < 0) {
            timeElapsed = 0;
        }
        var msUntilTimeout = jnd(timeElapsed) - timeElapsed;
        if (timeUntilExpirationMs < msUntilTimeout) {
            msUntilTimeout = timeUntilExpirationMs;
        }
        return msUntilTimeout;
    }

    function checkForNestedUpdates() {
        if (nestedUpdateCount > NESTED_UPDATE_LIMIT) {
            nestedUpdateCount = 0;
            rootWithNestedUpdates = null;
            invariant(false, 'Maximum update depth exceeded. This can happen when a component ' + 'repeatedly calls setState inside componentWillUpdate or ' + 'componentDidUpdate. React limits the number of nested updates to ' + 'prevent infinite loops.');
        }
    }
    var beginWork$1 = void 0; {
        beginWork$1 = beginWork;
    }

    function computeThreadID(root, expirationTime) {
        return expirationTime * 1000 + root.interactionThreadID;
    }

    function schedulePendingInteraction(root, expirationTime) {
        {
            return;
        }
        var interactions = interactionsRef.current;
        if (interactions.size > 0) {
            var pendingInteractionMap = root.pendingInteractionMap;
            var pendingInteractions = pendingInteractionMap.get(expirationTime);
            if (pendingInteractions != null) {
                interactions.forEach(function(interaction) {
                    if (!pendingInteractions.has(interaction)) {
                        interaction.__count++;
                    }
                    pendingInteractions.add(interaction);
                });
            } else {
                pendingInteractionMap.set(expirationTime, new Set(interactions));
                interactions.forEach(function(interaction) {
                    interaction.__count++;
                });
            }
            var subscriber = subscriberRef.current;
            if (subscriber !== null) {
                var threadID = computeThreadID(root, expirationTime);
                subscriber.onWorkScheduled(interactions, threadID);
            }
        }
    }

    function startWorkOnPendingInteraction(root, expirationTime) {
        {
            return;
        }
        var interactions = new Set();
        root.pendingInteractionMap.forEach(function(scheduledInteractions, scheduledExpirationTime) {
            if (scheduledExpirationTime >= expirationTime) {
                scheduledInteractions.forEach(function(interaction) {
                    return interactions.add(interaction);
                });
            }
        });
        root.memoizedInteractions = interactions;
        if (interactions.size > 0) {
            var subscriber = subscriberRef.current;
            if (subscriber !== null) {
                var threadID = computeThreadID(root, expirationTime);
                try {
                    subscriber.onWorkStarted(interactions, threadID);
                } catch (error) {
                    scheduleCallback(ImmediatePriority$1, function() {
                        throw error;
                    });
                }
            }
        }
    }

    var onCommitFiberRoot = null;
    var onCommitFiberUnmount = null;

    function injectInternals(internals) {
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined') {
            return false;
        }
        var hook = __REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (hook.isDisabled) {
            return true;
        }
        if (!hook.supportsFiber) {
            return true;
        }
        try {
            var rendererID = hook.inject(internals);
            onCommitFiberRoot = function onCommitFiberRoot(root, expirationTime) {
                try {
                    {
                        hook.onCommitFiberRoot(rendererID, root);
                    }
                } catch (err) {}
            };
            onCommitFiberUnmount = function onCommitFiberUnmount(fiber) {
                try {
                    hook.onCommitFiberUnmount(rendererID, fiber);
                } catch (err) {}
            };
        } catch (err) {}
        return true;
    }

    function onCommitRoot(root, expirationTime) {
        if (typeof onCommitFiberRoot === 'function') {
            onCommitFiberRoot(root, expirationTime);
        }
    }

    function onCommitUnmount(fiber) {
        if (typeof onCommitFiberUnmount === 'function') {
            onCommitFiberUnmount(fiber);
        }
    }

    var _typeofd = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) { return typeof obj; } : function(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

    function FiberNode(tag, pendingProps, key, mode) {
        this.tag = tag;
        this.key = key;
        this.elementType = null;
        this.type = null;
        this.stateNode = null;
        this.return = null;
        this.child = null;
        this.sibling = null;
        this.index = 0;
        this.ref = null;
        this.pendingProps = pendingProps;
        this.memoizedProps = null;
        this.updateQueue = null;
        this.memoizedState = null;
        this.contextDependencies = null;
        this.mode = mode;
        this.effectTag = NoEffect;
        this.nextEffect = null;
        this.firstEffect = null;
        this.lastEffect = null;
        this.expirationTime = NoWork;
        this.childExpirationTime = NoWork;
        this.alternate = null;
    }
    var createFiber = function createFiber(tag, pendingProps, key, mode) {
        return new FiberNode(tag, pendingProps, key, mode);
    };

    function shouldConstruct(Component) {
        var prototype = Component.prototype;
        return !!(prototype && prototype.isReactComponent);
    }

    function isSimpleFunctionComponent(type) {
        return typeof type === 'function' && !shouldConstruct(type) && type.defaultProps === undefined;
    }

    function resolveLazyComponentTag(Component) {
        if (typeof Component === 'function') {
            return shouldConstruct(Component) ? ClassComponent : FunctionComponent;
        } else if (Component !== undefined && Component !== null) {
            var $$typeof = Component.$$typeof;
            if ($$typeof === REACT_FORWARD_REF_TYPE) {
                return ForwardRef;
            }
            if ($$typeof === REACT_MEMO_TYPE) {
                return MemoComponent;
            }
        }
        return IndeterminateComponent;
    }

    function createWorkInProgress(current, pendingProps, expirationTime) {
        var workInProgress = current.alternate;
        if (workInProgress === null) {
            workInProgress = createFiber(current.tag, pendingProps, current.key, current.mode);
            workInProgress.elementType = current.elementType;
            workInProgress.type = current.type;
            workInProgress.stateNode = current.stateNode;
            workInProgress.alternate = current;
            current.alternate = workInProgress;
        } else {
            workInProgress.pendingProps = pendingProps;
            workInProgress.effectTag = NoEffect;
            workInProgress.nextEffect = null;
            workInProgress.firstEffect = null;
            workInProgress.lastEffect = null;
        }
        workInProgress.childExpirationTime = current.childExpirationTime;
        workInProgress.expirationTime = current.expirationTime;
        workInProgress.child = current.child;
        workInProgress.memoizedProps = current.memoizedProps;
        workInProgress.memoizedState = current.memoizedState;
        workInProgress.updateQueue = current.updateQueue;
        workInProgress.contextDependencies = current.contextDependencies;
        workInProgress.sibling = current.sibling;
        workInProgress.index = current.index;
        workInProgress.ref = current.ref;
        return workInProgress;
    }

    function createHostRootFiber(tag) {
        var mode = void 0;
        if (tag === ConcurrentRoot) {
            mode = ConcurrentMode | BatchedMode | StrictMode;
        } else if (tag === BatchedRoot) {
            mode = BatchedMode | StrictMode;
        } else {
            mode = NoMode;
        }
        return createFiber(HostRoot, null, null, mode);
    }

    function createFiberFromTypeAndProps(type,
        key, pendingProps, owner, mode, expirationTime) {
        var fiber = void 0;
        var fiberTag = IndeterminateComponent;
        var resolvedType = type;
        if (typeof type === 'function') {
            if (shouldConstruct(type)) {
                fiberTag = ClassComponent;
            }
        } else if (typeof type === 'string') {
            fiberTag = HostComponent;
        } else {
            getTag: switch (type) {
                case REACT_FRAGMENT_TYPE:
                    return createFiberFromFragment(pendingProps.children, mode, expirationTime, key);
                case REACT_CONCURRENT_MODE_TYPE:
                    fiberTag = Mode;
                    mode |= ConcurrentMode | BatchedMode | StrictMode;
                    break;
                case REACT_STRICT_MODE_TYPE:
                    fiberTag = Mode;
                    mode |= StrictMode;
                    break;
                case REACT_PROFILER_TYPE:
                    return createFiberFromProfiler(pendingProps, mode, expirationTime, key);
                case REACT_SUSPENSE_TYPE:
                    return createFiberFromSuspense(pendingProps, mode, expirationTime, key);
                default:
                    {
                        if ((typeof type === 'undefined' ? 'undefined' : _typeofd(type)) === 'object' && type !== null) {
                            switch (type.$$typeof) {
                                case REACT_PROVIDER_TYPE:
                                    fiberTag = ContextProvider;
                                    break getTag;
                                case REACT_CONTEXT_TYPE:
                                    fiberTag = ContextConsumer;
                                    break getTag;
                                case REACT_FORWARD_REF_TYPE:
                                    fiberTag = ForwardRef;
                                    break getTag;
                                case REACT_MEMO_TYPE:
                                    fiberTag = MemoComponent;
                                    break getTag;
                                case REACT_LAZY_TYPE:
                                    fiberTag = LazyComponent;
                                    resolvedType = null;
                                    break getTag;
                                case REACT_EVENT_COMPONENT_TYPE:
                                    break;
                                case REACT_EVENT_TARGET_TYPE:
                                    break;
                            }
                        }
                        var info = '';
                        invariant(false, 'Element type is invalid: expected a string (for built-in ' + 'components) or a class/function (for composite components) ' + 'but got: %s.%s', type == null ? type : typeof type === 'undefined' ? 'undefined' : _typeofd(type), info);
                    }
            }
        }
        fiber = createFiber(fiberTag, pendingProps, key, mode);
        fiber.elementType = type;
        fiber.type = resolvedType;
        fiber.expirationTime = expirationTime;
        return fiber;
    }

    function createFiberFromElement(element, mode, expirationTime) {
        var owner = null;
        var type = element.type;
        var key = element.key;
        var pendingProps = element.props;
        var fiber = createFiberFromTypeAndProps(type, key, pendingProps, owner, mode, expirationTime);
        return fiber;
    }

    function createFiberFromFragment(elements, mode, expirationTime, key) {
        var fiber = createFiber(Fragment, elements, key, mode);
        fiber.expirationTime = expirationTime;
        return fiber;
    }

    function createFiberFromProfiler(pendingProps, mode, expirationTime, key) {
        var fiber = createFiber(Profiler, pendingProps, key, mode | ProfileMode);
        fiber.elementType = REACT_PROFILER_TYPE;
        fiber.type = REACT_PROFILER_TYPE;
        fiber.expirationTime = expirationTime;
        return fiber;
    }

    function createFiberFromSuspense(pendingProps, mode, expirationTime, key) {
        var fiber = createFiber(SuspenseComponent, pendingProps, key, mode);
        var type = REACT_SUSPENSE_TYPE;
        fiber.elementType = type;
        fiber.type = type;
        fiber.expirationTime = expirationTime;
        return fiber;
    }

    function createFiberFromText(content, mode, expirationTime) {
        var fiber = createFiber(HostText, content, null, mode);
        fiber.expirationTime = expirationTime;
        return fiber;
    }

    function createFiberFromHostInstanceForDeletion() {
        var fiber = createFiber(HostComponent, null, null, NoMode);
        fiber.elementType = 'DELETED';
        fiber.type = 'DELETED';
        return fiber;
    }

    function createFiberFromPortal(portal, mode, expirationTime) {
        var pendingProps = portal.children !== null ? portal.children : [];
        var fiber = createFiber(HostPortal, pendingProps, portal.key, mode);
        fiber.expirationTime = expirationTime;
        fiber.stateNode = {
            containerInfo: portal.containerInfo,
            pendingChildren: null,
            implementation: portal.implementation
        };
        return fiber;
    }

    function FiberRootNode(containerInfo, tag, hydrate) {
        this.tag = tag;
        this.current = null;
        this.containerInfo = containerInfo;
        this.pendingChildren = null;
        this.pingCache = null;
        this.finishedExpirationTime = NoWork;
        this.finishedWork = null;
        this.timeoutHandle = ReactDOMHostConfig.noTimeout;
        this.context = null;
        this.pendingContext = null;
        this.hydrate = hydrate;
        this.firstBatch = null;
        this.callbackNode = null;
        this.callbackExpirationTime = NoWork;
        this.firstPendingTime = NoWork;
        this.lastPendingTime = NoWork;
        this.pingTime = NoWork;
    }

    function createFiberRoot(containerInfo, tag, hydrate) {
        var root = new FiberRootNode(containerInfo, tag, hydrate);
        var uninitializedFiber = createHostRootFiber(tag);
        root.current = uninitializedFiber;
        uninitializedFiber.stateNode = root;
        return root;
    }

    function getContextForSubtree(parentComponent) {
        if (!parentComponent) {
            return emptyContextObject;
        }
        var fiber = get(parentComponent);
        var parentContext = findCurrentUnmaskedContext(fiber);
        if (fiber.tag === ClassComponent) {
            var Component = fiber.type;
            if (isContextProvider(Component)) {
                return processChildContext(fiber, Component, parentContext);
            }
        }
        return parentContext;
    }

    function scheduleRootUpdate(current$$1, element, expirationTime, suspenseConfig, callback) {
        var update = createUpdate(expirationTime, suspenseConfig);
        update.payload = { element: element };
        callback = callback === undefined ? null : callback;
        if (callback !== null) {
            warningWithoutStack$1(typeof callback === 'function', 'render(...): Expected the last optional `callback` argument to be a ' + 'function. Instead received: %s.', callback);
            update.callback = callback;
        }
        enqueueUpdate(current$$1, update);
        scheduleWork(current$$1, expirationTime);
        return expirationTime;
    }

    function updateContainerAtExpirationTime(element, container, parentComponent, expirationTime, suspenseConfig, callback) {
        var current$$1 = container.current;
        var context = getContextForSubtree(parentComponent);
        if (container.context === null) {
            container.context = context;
        } else {
            container.pendingContext = context;
        }
        return scheduleRootUpdate(current$$1, element, expirationTime, suspenseConfig, callback);
    }

    function findHostInstance(component) {
        var fiber = get(component);
        if (fiber === undefined) {
            if (typeof component.render === 'function') {
                invariant(false, 'Unable to find node on an unmounted component.');
            } else {
                invariant(false, 'Argument appears to not be a ReactComponent. Keys: %s', Object.keys(component));
            }
        }
        var hostFiber = reflection.findCurrentHostFiber(fiber);
        if (hostFiber === null) {
            return null;
        }
        return hostFiber.stateNode;
    }

    function findHostInstanceWithWarning(component, methodName) {
        return findHostInstance(component);
    }

    function createContainer(containerInfo, tag, hydrate) {
        return createFiberRoot(containerInfo, tag, hydrate);
    }

    function updateContainer(element, container, parentComponent, callback) {
        var current$$1 = container.current;
        var currentTime = requestCurrentTime();
        var suspenseConfig = requestCurrentSuspenseConfig();
        var expirationTime = computeExpirationForFiber(currentTime, current$$1, suspenseConfig);
        return updateContainerAtExpirationTime(element, container, parentComponent, expirationTime, suspenseConfig, callback);
    }

    function getPublicRootInstance(container) {
        var containerFiber = container.current;
        if (!containerFiber.child) {
            return null;
        }
        switch (containerFiber.child.tag) {
            case HostComponent:
                return ReactDOMHostConfig.getPublicInstance(containerFiber.child.stateNode);
            default:
                return containerFiber.child.stateNode;
        }
    }

    function findHostInstanceWithNoPortals(fiber) {
        var hostFiber = reflection.findCurrentHostFiberWithNoPortals(fiber);
        if (hostFiber === null) {
            return null;
        }
        return hostFiber.stateNode;
    }
    var shouldSuspendImpl = function shouldSuspendImpl(fiber) {
        return false;
    };

    function shouldSuspend(fiber) {
        return shouldSuspendImpl(fiber);
    }
    var overrideHookState = null;
    var overrideProps = null;
    var scheduleUpdate = null;
    var setSuspenseHandler = null;

    function injectIntoDevTools(devToolsConfig) {
        var _findFiberByHostInstance = devToolsConfig.findFiberByHostInstance;
        var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
        return injectInternals(Object.assign({}, devToolsConfig, {
            scheduleHotUpdate: null,
            overrideHookState: overrideHookState,
            overrideProps: overrideProps,
            setSuspenseHandler: setSuspenseHandler,
            scheduleUpdate: scheduleUpdate,
            currentDispatcherRef: ReactCurrentDispatcher,
            findHostInstanceByFiber: function findHostInstanceByFiber(fiber) {
                var hostFiber = reflection.findCurrentHostFiber(fiber);
                if (hostFiber === null) {
                    return null;
                }
                return hostFiber.stateNode;
            },
            findFiberByHostInstance: function findFiberByHostInstance(instance) {
                if (!_findFiberByHostInstance) {
                    return null;
                }
                return _findFiberByHostInstance(instance);
            }
        }));
    }

    var e = /*#__PURE__*/ Object.freeze({
        updateContainerAtExpirationTime: updateContainerAtExpirationTime,
        createContainer: createContainer,
        updateContainer: updateContainer,
        flushRoot: flushRoot,
        computeUniqueAsyncExpiration: computeUniqueAsyncExpiration,
        batchedUpdates: batchedUpdates,
        unbatchedUpdates: unbatchedUpdates,
        deferredUpdates: deferredUpdates,
        syncUpdates: syncUpdates,
        interactiveUpdates: interactiveUpdates,
        flushInteractiveUpdates: flushInteractiveUpdates,
        flushControlled: flushControlled,
        flushSync: flushSync,
        flushPassiveEffects: flushPassiveEffects,
        getPublicRootInstance: getPublicRootInstance,
        findHostInstance: findHostInstance,
        findHostInstanceWithWarning: findHostInstanceWithWarning,
        findHostInstanceWithNoPortals: findHostInstanceWithNoPortals,
        shouldSuspend: shouldSuspend,
        injectIntoDevTools: injectIntoDevTools
    });

    return e;

})));