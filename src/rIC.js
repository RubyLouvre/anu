// Polyfill requestIdleCallback and cancelIdleCallback
import { typeNumber, isFn } from "./util";
var scheduledRICCallback = null;
var isIdleScheduled = false;
var timeoutTime = -1;

var isAnimationFrameScheduled = false;

var frameDeadline = 0;
function now() {
    return new Date - 0;
}
// We start out assuming that we run at 30fps but then the heuristic tracking
// will adjust this value to a faster fps if we get more frequent animation
// frames.
// 我们假设我们运行的是30fps，但是如果我们得到更流畅的动画帧，启发式跟踪会将这个值调整为更快的fps。
var previousFrameTime = 33;
var activeFrameTime = 33;
var frameDeadlineObject = void 0;
var hasNativePerformanceNow = typeNumber(performance) == 8 && isFn(performance.now);
if (hasNativePerformanceNow) {
    frameDeadlineObject = {
        didTimeout: false,
        timeRemaining: function () {
            // We assume that if we have a performance timer that the rAF callback
            // gets a performance timer value. Not sure if this is always true.
            // 我们假设，如果我们有一个performance计时器，rAF回调获得performance计时器值。但不能保证它总是正确的。
            var remaining = frameDeadline - performance.now();
            return remaining > 0 ? remaining : 0;
        }
    };
} else {
    frameDeadlineObject = {
        didTimeout: false,
        timeRemaining: function () {
            // Fallback to Date.now()
            var remaining = frameDeadline - now();
            return remaining > 0 ? remaining : 0;
        }
    };
}

// We use the postMessage trick to defer idle work until after the repaint.
var messageKey = "__reactIdleCallback$" + Math.random().toString(36).slice(2);
var idleTick = function (event) {
    if (event.source !== window || event.data !== messageKey) {
        return;
    }

    isIdleScheduled = false;

    var currentTime = now();
    if (frameDeadline - currentTime <= 0) {
        // There"s no time left in this idle period. Check if the callback has
        // a timeout and whether it"s been exceeded.
        if (timeoutTime !== -1 && timeoutTime <= currentTime) {
            // Exceeded the timeout. Invoke the callback even though there"s no
            // time left.
            frameDeadlineObject.didTimeout = true;
        } else {
            // No timeout.
            if (!isAnimationFrameScheduled) {
                // Schedule another animation callback so we retry later.
                isAnimationFrameScheduled = true;
                requestAnimationFrame(animationTick);
            }
            // Exit without invoking the callback.
            return;
        }
    } else {
        // There"s still time left in this idle period.
        frameDeadlineObject.didTimeout = false;
    }

    timeoutTime = -1;
    var callback = scheduledRICCallback;
    scheduledRICCallback = null;
    if (callback !== null) {
        callback(frameDeadlineObject);
    }
};
// Assumes that we have addEventListener in this environment. Might need
// something better for old IE.
window.addEventListener("message", idleTick, false);

var animationTick = function (rafTime) {
    isAnimationFrameScheduled = false;
    var nextFrameTime = rafTime - frameDeadline + activeFrameTime;
    if (nextFrameTime < activeFrameTime && previousFrameTime < activeFrameTime) {
        if (nextFrameTime < 8) {
            // Defensive coding. We don"t support higher frame rates than 120hz.
            // If we get lower than that, it is probably a bug.
            nextFrameTime = 8;
        }
        // If one frame goes long, then the next one can be short to catch up.
        // If two frames are short in a row, then that"s an indication that we
        // actually have a higher frame rate than what we"re currently optimizing.
        // We adjust our heuristic dynamically accordingly. For example, if we"re
        // running on 120hz display or 90hz VR display.
        // Take the max of the two in case one of them was an anomaly due to
        // missed frame deadlines.
        activeFrameTime = nextFrameTime < previousFrameTime ? previousFrameTime : nextFrameTime;
    } else {
        previousFrameTime = nextFrameTime;
    }
    frameDeadline = rafTime + activeFrameTime;
    if (!isIdleScheduled) {
        isIdleScheduled = true;
        window.postMessage(messageKey, "*");
    }
};

var scheduleDeferredCallback = function (callback, options) {
    // This assumes that we only schedule one callback at a time because that"s
    // how Fiber uses it.
    scheduledRICCallback = callback;
    if (options != null && typeof options.timeout === "number") {
        timeoutTime = now() + options.timeout;
    }
    if (!isAnimationFrameScheduled) {
        // If rAF didn"t already schedule one, we need to schedule a frame.
        // TODO: If this rAF doesn"t materialize because the browser throttles, we
        // might want to still have setTimeout trigger rIC as a backup to ensure
        // that we keep performing work.
        isAnimationFrameScheduled = true;
        requestAnimationFrame(animationTick);
    }
    return 0;
};

var cancelDeferredCallback = function () {
    scheduledRICCallback = null;
    isIdleScheduled = false;
    timeoutTime = -1;
};

var NoWork = 0;
var Sync = 1;
var UNIT_SIZE = 10;
var MAGIC_NUMBER_OFFSET = 2;
var callbackExpirationTime = NoWork;
var callbackID = -1;
// 1 unit of expiration time represents 10ms.
function msToExpirationTime(ms) {
    // Always add an offset so that we don't clash with the magic number for NoWork.
    return (ms / UNIT_SIZE | 0) + MAGIC_NUMBER_OFFSET;
}

function expirationTimeToMs(expirationTime) {
    return (expirationTime - MAGIC_NUMBER_OFFSET) * UNIT_SIZE;
}

function scheduleCallbackWithExpiration(expirationTime) {
    if (callbackExpirationTime !== NoWork) {
        // A callback is already scheduled. Check its expiration time (timeout).
        if (expirationTime > callbackExpirationTime) {
            // Existing callback has sufficient timeout. Exit.
            return;
        } else {
            // Existing callback has insufficient timeout. Cancel and schedule a
            // new one.
            console.log("cancelDeferredCallback");
            cancelDeferredCallback(callbackID);
        }
        // The request callback timer is already running. Don't start a new one.
    } else {
        console.log("startRequestCallbackTimer");
        // startRequestCallbackTimer();
    }

    // Compute a timeout for the given expiration time.
    var currentMs = now() - originalStartTimeMs;
    var expirationMs = expirationTimeToMs(expirationTime);
    var timeout = expirationMs - currentMs;

    callbackExpirationTime = expirationTime;
    console.log("scheduleDeferredCallback");
    callbackID = scheduleDeferredCallback(performAsyncWork, { timeout: timeout });
}

function requestWork(root, expirationTime) {
    if (expirationTime === Sync) {
        console.log("同步performSyncWork");
        performSyncWork();
    } else {
        console.log("异步scheduleCallbackWithExpiration");
        scheduleCallbackWithExpiration(expirationTime);
    }
}