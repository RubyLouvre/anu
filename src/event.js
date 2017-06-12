import { transaction } from "./transaction";
import { document, msie } from "./browser";
import { isFn, options, noop, oneObject } from "./util";

var globalEvents = {};
export var eventCamelCache = {}; //根据事件对象的type得到驼峰风格的type， 如 click --> Click, mousemove --> MouseMove
export var eventPropHooks = {}; //用于在事件回调里对事件对象进行
export var eventHooks = {}; //用于在元素上绑定特定的事件
export var eventLowerCache = {
  //根据onXXX得到其全小写的事件名, onClick --> click, onMouseMove --> mousemove
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

export function dispatchEvent(e) {
  var __type__ = e.__type__ || e.type;
  e = new SyntheticEvent(e);
  var target = e.target;
  var paths = [];
  do {
    var events = target.__events;
    if (events) {
      paths.push({ dom: target, props: events });
    }
  } while ((target = target.parentNode) && target.nodeType === 1);
  // target --> parentNode --> body --> html
  var type = eventCamelCache[__type__] || __type__;

  var capitalized = capitalize(type);
  var bubble = "on" + capitalized;
  var captured = "on" + capitalized + "Capture";

  var hook = eventPropHooks[type];
  if (hook) {
    hook(e);
  }
  transaction.isInTransation = true;
  triggerEventFlow(paths, captured, e);

  if (!e._stopPropagation) {
    triggerEventFlow(paths.reverse(), bubble, e);
  }
  transaction.isInTransation = false;
  options.updateBatchNumber++;
  transaction.dequeue();
}

function triggerEventFlow(paths, prop, e) {
  for (var i = paths.length; i--; ) {
    var path = paths[i];
    var fn = path.props[prop];
    if (isFn(fn)) {
      e.currentTarget = path._hostNode;
      fn.call(path._hostNode, e);
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
export function addEvent(el, type, fn) {
  if (el.addEventListener) {
    el.addEventListener(type, fn);
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
  eventCamelCache[lower] = camel;
  return lower;
}

addEvent.fire = function fire(dom, name, opts) {
  var hackEvent = document.createEvent("Events");
  hackEvent.initEvent("datasetchanged", true, true, opts);
  if (opts) {
    Object.assign(hackEvent, opts);
  }
  hackEvent.__type__ = name;
  dom.dispatchEvent(hackEvent);
};

let inMobile = "ontouchstart" in document;

eventLowerCache.onWheel = "datasetchanged";
/* IE6-11 chrome mousewheel wheelDetla 下 -120 上 120
            firefox DOMMouseScroll detail 下3 上-3
            firefox wheel detlaY 下3 上-3
            IE9-11 wheel deltaY 下40 上-40
            chrome wheel deltaY 下100 上-100 */
const fixWheelType = "onmousewheel" in document
  ? "mousewheel"
  : document.onwheel !== void 0 ? "wheel" : "DOMMouseScroll";
const fixWheelDelta = fixWheelType === "mousewheel"
  ? "wheelDetla"
  : fixWheelType === "wheel" ? "deltaY" : "detail";
eventHooks.onWheel = function(dom) {
  addEvent(dom, fixWheelType, function(e) {
    var delta = e[fixWheelDelta] > 0 ? -120 : 120;
    var wheelDelta = ~~dom._ms_wheel_ + delta;
    dom._ms_wheel_ = wheelDelta;
    addEvent.fire(dom, "wheel", {
      detail: wheelDelta,
      wheelDeltaY: wheelDelta,
      wheelDelta: wheelDelta
    });
  });
};

eventHooks.onFocus = function(dom) {
  addEvent(
    dom,
    "focus",
    function(e) {
      addEvent.fire(dom, "focus");
    },
    true
  );
};
eventHooks.onBlur = function(dom) {
  addEvent(
    dom,
    "blur",
    function(e) {
      addEvent.fire(dom, "blur");
    },
    true
  );
};
eventLowerCache.onFocus = "datasetchanged";
eventLowerCache.onBlur = "datasetchanged";

if (inMobile) {
  eventHooks.onClick = noop;
  eventHooks.onClickCapture = noop;
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
