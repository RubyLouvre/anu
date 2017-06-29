import React from "anujs";

var alreadyInjected = false;
var {
  isTouch,
  eventPropHooks,
  addEvent,
  eventLowerCache,
  dispatchEvent
} = React.eventSystem;
//==============isXXX系列
function isEndish(topLevelType) {
  return (
    topLevelType === "mouseup" ||
    topLevelType === "touchend" ||
    topLevelType === "touchcancel"
  );
}

function isMoveish(topLevelType) {
  return topLevelType === "mousemove" || topLevelType === "touchmove";
}

function isStartish(topLevelType) {
  return topLevelType === "mousedown" || topLevelType === "touchstart";
}

//=============
var tapMoveThreshold = 10;
var ignoreMouseThreshold = 750;
var startCoords = { x: null, y: null };
var lastTouchTime = null;

var Axis = {
  x: { page: "pageX", client: "clientX", envScroll: "currentPageScrollLeft" },
  y: { page: "pageY", client: "clientY", envScroll: "currentPageScrollTop" }
};

// fbjs/lib/TouchEventUtils
var TouchEventUtils = {
  /**
	   * Utility function for common case of extracting out the primary touch from a
	   * touch event.
	   * - `touchEnd` events usually do not have the `touches` property.
	   *   http://stackoverflow.com/questions/3666929/
	   *   mobile-sarai-touchend-event-not-firing-when-last-touch-is-removed
	   *
	   * @param {Event} nativeEvent Native event that may or may not be a touch.
	   * @return {TouchesObject?} an object with pageX and pageY or null.
	   */
  extractSingleTouch: function(nativeEvent) {
    var touches = nativeEvent.touches;
    var changedTouches = nativeEvent.changedTouches;
    var hasTouches = touches && touches.length > 0;
    var hasChangedTouches = changedTouches && changedTouches.length > 0;

    return !hasTouches && hasChangedTouches
      ? changedTouches[0]
      : hasTouches ? touches[0] : nativeEvent;
  }
};
function getAxisCoordOfEvent(axis, nativeEvent) {
  var singleTouch = TouchEventUtils.extractSingleTouch(nativeEvent);
  if (singleTouch) {
    return singleTouch[axis.page];
  }
  return nativeEvent[axis.page];
}

function getDistance(coords, nativeEvent) {
  var pageX = getAxisCoordOfEvent(Axis.x, nativeEvent);
  var pageY = getAxisCoordOfEvent(Axis.y, nativeEvent);
  return Math.pow(
    Math.pow(pageX - coords.x, 2) + Math.pow(pageY - coords.y, 2),
    0.5
  );
}

function shouldRejectClick() {}

eventLowerCache["touchtap"] = "touchTap";
eventPropHooks.touchtap = function(event) {
  var type = event.type;
  if (!isStartish(type) && !isEndish(type)) {
    return false;
  }

  if (isTouch(topLevelType)) {
    lastTouchTime = now();
  } else {
    if (shouldRejectClick(lastTouchTime, now())) {
      return false;
    }
  }

  var distance = getDistance(startCoords, event);
  if (isEndish(type) && distance < tapMoveThreshold) {
    event.type = "touchTap";
  } else {
    event = false;
  }
  if (isStartish(type)) {
    startCoords.x = getAxisCoordOfEvent(Axis.x, event);
    startCoords.y = getAxisCoordOfEvent(Axis.y, event);
  } else if (isEndish(topLevelType)) {
    startCoords.x = 0;
    startCoords.y = 0;
  }
  return event;
};

export function injectTapEventPlugin() {
  if (alreadyInjected) return;
  alreadyInjected = true;
  var events = isTouch
    ? ["touchstart", "touchmove", "touchend", "touchcancel"]
    : ["mousedown", "mousemove", "mouseup"];
  events.forEach(function(type) {
    addEvent(window, type, function(e) {
      e.__type__ = "touchtap";
      dispatchEvent(e);
    });
  });

  // touchTap
}
