import { document, msie } from "./browser";
import {
  eventLowerCache,
  eventHooks,
  addEvent,
  eventPropHooks,
  dispatchEvent
} from "./event";

//Ie6-8 oninput使用propertychange进行冒充，触发一个ondatasetchanged事件
function fixIEInput(dom, name) {
  addEvent(dom, "propertychange", function(e) {
    if (e.propertyName === "value") {
      addEvent.fire(dom, "input");
    }
  });
}

function fixIEChange(dom, name) {
  //IE6-8, radio, checkbox的点击事件必须在失去焦点时才触发
  var eventType = dom.type === "radio" || dom.type === "checkbox"
    ? "click"
    : "change";
  addEvent(dom, eventType, function(e) {
    if (dom.type === "select-one") {
      var idx = dom.selectedIndex,
        option,
        attr;
      if (idx > -1) {
        //IE 下select.value不会改变
        option = dom.options[idx];
        attr = option.attributes.value;
        dom.value = attr && attr.specified ? option.value : option.text;
      }
    }
    addEvent.fire(dom, "change");
  });
}

function fixIESubmit(dom, name) {
  if (dom.nodeName === "FORM") {
    addEvent(dom, "submit", dispatchEvent);
  }
}

if (msie < 9) {
  eventHooks.onFocus = function(dom) {
    addEvent(dom, "focusin", function(e) {
      addEvent.fire(dom, "focus");
    });
  };
  eventHooks.onBlur = function(dom) {
    addEvent(dom, "blurout", function(e) {
      addEvent.fire(dom, "blur");
    });
  };

  Object.assign(
    eventPropHooks,
    oneObject(
      "mousemove, mouseout, mouseout, mousewheel, mousewheel, wheel, click",
      function(event) {
        if (!("pageX" in event)) {
          var doc = event.target.ownerDocument || document;
          var box = doc.compatMode === "BackCompat"
            ? doc.body
            : doc.documentElement;
          event.pageX =
            event.clientX + (box.scrollLeft >> 0) - (box.clientLeft >> 0);
          event.pageY =
            event.clientY + (box.scrollTop >> 0) - (box.clientTop >> 0);
        }
      }
    )
  );

  Object.assign(
    eventPropHooks,
    oneObject("keyup, keydown, keypress", function(event) {
      if (event.which == null && event.type.indexOf("key") === 0) {
        event.which = event.charCode != null ? event.charCode : event.keyCode;
      }
    })
  );

  addEvent.fire = function dispatchIEEvent(dom, type, obj) {
    try {
      var hackEvent = document.createEventObject();
      if (obj) {
        Object.assign(hackEvent, obj);
      }
      hackEvent.__type__ = type;
      //IE6-8触发事件必须保证在DOM树中,否则报"SCRIPT16389: 未指明的错误"
      dom.fireEvent("ondatasetchanged", hackEvent);
    } catch (e) {}
  };
  //IE8中select.value不会在onchange事件中随用户的选中而改变其value值，也不让用户直接修改value 只能通过这个hack改变
  try {
    Object.defineProperty(HTMLSelectElement.prototype, "value", {
      set: function(v) {
        this._fixIEValue = v;
      },
      get: function() {
        return this._fixIEValue;
      }
    });
  } catch (e) {}
  eventLowerCache.onInput = "datasetchanged";
  eventLowerCache.onChange = "datasetchanged";
  eventLowerCache.onInputCapture = "datasetchanged";
  eventLowerCache.onChangeCapture = "datasetchanged";
  eventHooks.onInput = fixIEInput;
  eventHooks.onInputCapture = fixIEInput;
  eventHooks.onChange = fixIEChange;
  eventHooks.onChangeCapture = fixIEChange;
  eventHooks.onSubmit = fixIESubmit;
  eventHooks.mousewheelFix = eventHooks.mousewheel;
}
