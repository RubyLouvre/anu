(function(global, factory) {
    //https://github.com/jquery/jquery/blob/master/src/wrapper.js
    if (typeof define === "function" && define.amd) {
        define(["react"], function(React) {
            global.injectTapEventPlugin = factory(global, React);
        });
    } else if (typeof exports !== "undefined") {
        factory(global, require("react"));
    } else {
        global.injectTapEventPlugin = factory(
            global,
            global.React || global.ReactDOM
        );
    }
})(typeof window !== "undefined" ? window : this, function(window, React) {
    var alreadyInjected = false;
    var eventSystem = React.eventSystem;
    if (!eventSystem) {
        throw new Error("请确保你加载的是anujs");
    }
    var isTouch = "ontouchstart" in window;


    var eventPropHooks = eventSystem.eventPropHooks;
    var addEvent = eventSystem.addEvent;
    var dispatchEvent = eventSystem.dispatchEvent;
    //==============isXXX系列

    function isEndish(eventType) {
        return (
            eventType === "mouseup" ||
      eventType === "touchend" ||
      eventType === "touchcancel"
        );
    }

    function isStartish(eventType) {
        return eventType === "mousedown" || eventType === "touchstart";
    }

    //=============
    var tapMoveThreshold = 10;
    var startCoords = { x: null, y: null };
    var lastTouchTime = null;

    var Axis = {
        x: { page: "pageX" },
        y: { page: "pageY" }
    };

    // fbjs/lib/TouchEventUtils
    var TouchEventUtils = {
        extractSingleTouch: function extractSingleTouch(nativeEvent) {
            var touches = nativeEvent.touches || [];
            var changedTouches = nativeEvent.changedTouches || [];

            return changedTouches[0] || touches[0] || nativeEvent;
        }
    };
    function getAxisCoordOfEvent(axis, nativeEvent) {
        var singleTouch = TouchEventUtils.extractSingleTouch(nativeEvent);
        return singleTouch[axis.page];
    }

    function getDistance(coords, nativeEvent) {
        var pageX = getAxisCoordOfEvent(Axis.x, nativeEvent);
        var pageY = getAxisCoordOfEvent(Axis.y, nativeEvent);
        return Math.pow(
            Math.pow(pageX - coords.x, 2) + Math.pow(pageY - coords.y, 2),
            0.5
        );
    }

    function now() {
        return new Date() - 0;
    }
    function shouldRejectClick() {}

    // eventLowerCache["touchtap"] = "touchTap";
    eventPropHooks.touchtap = function(event) {
        var type = event.nativeEvent.type;
        if (!isStartish(type) && !isEndish(type)) {
            return false;
        }

        if (isTouch) {
            lastTouchTime = now();
        } else {
            if (shouldRejectClick(lastTouchTime, now())) {
                return false;
            }
        }

        var distance = getDistance(startCoords, event);
        var returnFalse = true;
        if (isEndish(type) && distance < tapMoveThreshold) {
            event.type = "touchTap";
        } else {
            returnFalse = false;
        }
        if (isStartish(type)) {
            startCoords.x = getAxisCoordOfEvent(Axis.x, event);
            startCoords.y = getAxisCoordOfEvent(Axis.y, event);
        } else if (isEndish(type)) {
            startCoords.x = 0;
            startCoords.y = 0;
        }
        return returnFalse && event;
    };
    var events = isTouch
        ? ["touchstart", "touchmove", "touchend", "touchcancel"]
        : ["mousedown", "mousemove", "mouseup"];

    var injectTapEventPlugin = function() {
        if (alreadyInjected) {
            return;
        }
        alreadyInjected = true;
        events.forEach(function(type) {
            addEvent(window.document, type, function(e) {
                // e.__type__ = "touchtap";
                dispatchEvent(e, "touchtap");
            });
        });
    };
    injectTapEventPlugin();

    return injectTapEventPlugin;
});