import { scheduler } from "./scheduler";
import { document, msie } from "./browser";
import { isFn, noop } from "./util";

var globalEvents = {};
export var eventPropHooks = {}; //用于在事件回调里对事件对象进行
export var eventHooks = {}; //用于在元素上绑定特定的事件
//根据onXXX得到其全小写的事件名, onClick --> click, onClickCapture --> click,
// onMouseMove --> mousemove

export var eventLowerCache = {
  onClick: "click",
  onChange: "change",
  onWheel: "wheel"
};
/**
 * 判定否为与事件相关
 *
 * @param {any} name
 * @returns
 */
export function isEventName(name) {
  return /^on[A-Z]/.test(name);
}
export var isTouch = "ontouchstart" in document;

export function dispatchEvent(e) {
  var bubble = e.type;

  e = new SyntheticEvent(e);

  var hook = eventPropHooks[bubble];
  if (hook && false === hook(e)) {
    return;
  }

  var paths = collectPaths(e);

  var captured = bubble + "capture";

  scheduler.run();
  triggerEventFlow(paths, captured, e);

  if (!e._stopPropagation) {
    triggerEventFlow(paths.reverse(), bubble, e);
  }
}

function collectPaths(e) {
  var target = e.target;
  var paths = [];
  do {
    var events = target.__events;
    if (events) {
      paths.push({ dom: target, events: events });
    }
  } while ((target = target.parentNode) && target.nodeType === 1);
  // target --> parentNode --> body --> html
  return paths;
}

function triggerEventFlow(paths, prop, e) {
  for (var i = paths.length; i--; ) {
    var path = paths[i];
    var fn = path.events[prop];
    if (isFn(fn)) {
      e.currentTarget = path.dom;
      fn.call(path.dom, e);
      if (e._stopPropagation) {
        break;
      }
    }
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function addGlobalEventListener(name) {
  if (!globalEvents[name]) {
    globalEvents[name] = true;
    addEvent(document, name, dispatchEvent);
  }
}

export function addEvent(el, type, fn, bool) {
  if (el.addEventListener) {
    // Unable to preventDefault inside passive event listener due to target being
    // treated as passive
    el.addEventListener(
      type,
      fn,
      /true|false/.test(bool)
        ? bool
        : supportsPassive
          ? {
              passive: false
            }
          : false
    );
  } else if (el.attachEvent) {
    el.attachEvent("on" + type, fn);
  }
}

var ron = /^on/;
var rcapture = /Capture$/;
export function getBrowserName(onStr) {
  var lower = eventLowerCache[onStr];
  if (lower) {
    return lower;
  }
  var camel = onStr.replace(ron, "").replace(rcapture, "");
  lower = camel.toLowerCase();
  eventLowerCache[onStr] = lower;
  return lower;
}
var supportsPassive = false;
try {
  var opts = Object.defineProperty({}, "passive", {
    get: function() {
      supportsPassive = true;
    }
  });
  document.addEventListener("test", null, opts);
} catch (e) {}

/* IE6-11 chrome mousewheel wheelDetla 下 -120 上 120
            firefox DOMMouseScroll detail 下3 上-3
            firefox wheel detlaY 下3 上-3
            IE9-11 wheel deltaY 下40 上-40
            chrome wheel deltaY 下100 上-100 */
/* istanbul ignore next  */
const fixWheelType =
  "onmousewheel" in document
    ? "mousewheel"
    : document.onwheel !== void 666 ? "wheel" : "DOMMouseScroll";
const fixWheelDelta =
  fixWheelType === "mousewheel"
    ? "wheelDetla"
    : fixWheelType === "wheel" ? "deltaY" : "detail";
eventHooks.wheel = function(dom) {
  addEvent(dom, fixWheelType, function(e) {
    var delta = e[fixWheelDelta] > 0 ? -120 : 120;
    var deltaY = ~~dom._ms_wheel_ + delta;
    dom._ms_wheel_ = deltaY;
    e = new SyntheticEvent(e);
    e.type = "wheel";
    e.deltaY = deltaY;
    dispatchEvent(e);
  });
};

"blur,focus,mouseenter,mouseleave".replace(/\w+/g, function(type) {
  eventHooks[type] = function(dom) {
    addEvent(
      dom,
      type,
      function(e) {
        dispatchEvent(e);
      },
      true
    );
  };
});

if (isTouch) {
  eventHooks.click = noop;
  eventHooks.clickcapture = noop;
}

export function SyntheticEvent(event) {
  if (event.originalEvent) {
    return event;
  }
  for (var i in event) {
    if (!eventProto[i]) {
      this[i] = event[i];
    }
  }
  if (!this.target) {
    this.target = event.srcElement;
  }
  var target = this.target;
  this.fixEvent();
  this.timeStamp = new Date() - 0;
  this.originalEvent = event;
}

var eventProto = (SyntheticEvent.prototype = {
  fixEvent: function() {}, //留给以后扩展用
  preventDefault: function() {
    var e = this.originalEvent || {};
    e.returnValue = this.returnValue = false;
    if (e.preventDefault) {
      e.preventDefault();
    }
  },
  fixHooks: function() {},
  stopPropagation: function() {
    var e = this.originalEvent || {};
    e.cancelBubble = this._stopPropagation = true;
    if (e.stopPropagation) {
      e.stopPropagation();
    }
  },
  stopImmediatePropagation: function() {
    this.stopPropagation();
    this.stopImmediate = true;
  },
  toString: function() {
    return "[object Event]";
  }
});
/* istanbul ignore next  */
//freeze_start
Object.freeze ||
  (Object.freeze = function(a) {
    return a;
  });
//freeze_end
