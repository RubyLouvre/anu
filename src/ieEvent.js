import { document, msie } from "./browser";
import {
  eventLowerCache,
  eventHooks,
  addEvent,
  eventPropHooks,
  dispatchEvent,
  SyntheticEvent
} from "./event";
import { oneObject, toLowerCase } from "./util";

function fireEvent(e, type, dom) {
  e = new SyntheticEvent(e);
  e.type = type;
  dispatchEvent(e);
}

//Ie6-8 oninput使用propertychange进行冒充，触发一个ondatasetchanged事件
function fixIEInputHandle(e) {
  if (e.propertyName === "value") {
    fireEvent(e, "input");
  }
}
function fixIEInput(dom, name) {
  addEvent(dom, "propertychange", fixIEInputHandle);
}

function fixIEChangeHandle(e) {
  var dom = e.srcElement;
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

  fireEvent(e, "change");
}
function fixIEChange(dom, name) {
  //IE6-8, radio, checkbox的点击事件必须在失去焦点时才触发
  var eventType =
    dom.type === "radio" || dom.type === "checkbox" ? "click" : "change";
  addEvent(dom, eventType, fixIEChangeHandle);
}

function fixIESubmit(dom, name) {
  if (dom.nodeName === "FORM") {
    addEvent(dom, "submit", dispatchEvent);
  }
}

if (msie < 9) {
  eventHooks.onFocus = function(dom) {
    addEvent(dom, "focusin", function(e) {
      fireEvent(e, "focus");
    });
  };
  eventHooks.onBlur = function(dom) {
    addEvent(dom, "blurout", function(e) {
      fireEvent(e, "blur");
    });
  };

  "MouseEnter,MouseLeave".replace(/\w+/g, function(method) {
    eventHooks["on" + method] = function(dom) {
      var eventType = method === "MouseEnter" ? "mouseover" : "mouseout";
      addEvent(dom, eventType, function(e) {
        var t = e.relatedTarget;
        if (!t || (t !== elem && elem.contains(t))) {
          fireEvent(e, toLowerCase(method));
        }
      });
    };
  });
  Object.assign(
    eventPropHooks,
    oneObject(
      "mousemove, mouseout,mouseenter, mouseleave, mouseout, mousewheel, mousewheel, wh" +
        "eel, click",
      function(event) {
        if (!("pageX" in event)) {
          var doc = event.target.ownerDocument || document;
          var box =
            doc.compatMode === "BackCompat" ? doc.body : doc.documentElement;
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
      /* istanbul ignore next  */
      if (event.which == null && event.type.indexOf("key") === 0) {
        /* istanbul ignore next  */
        event.which = event.charCode != null ? event.charCode : event.keyCode;
      }
    })
  );

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
  eventHooks.onInput = fixIEInput;
  eventHooks.onInputCapture = fixIEInput;
  eventHooks.onChange = fixIEChange;
  eventHooks.onChangeCapture = fixIEChange;
  eventHooks.onSubmit = fixIESubmit;
  eventHooks.mousewheelFix = eventHooks.mousewheel;
}
