import { document, msie } from "./browser";
import { propHooks } from "./diffProps";

import {
  eventHooks,
  addEvent,
  eventPropHooks,
  dispatchEvent,
  SyntheticEvent
} from "./event";
import { oneObject, toLowerCase, clearArray, HTML_KEY } from "./util";


//Ie6-8 oninput使用propertychange进行冒充，触发一个ondatasetchanged事件
function fixIEInputHandle(e) {
  if (e.propertyName === "value") {
    dispatchEvent(e, "input");
  }
}
function fixIEInput(dom) {
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

  dispatchEvent(e, "change");
}
function fixIEChange(dom) {
  //IE6-8, radio, checkbox的点击事件必须在失去焦点时才触发
  var mask =
    dom.type === "radio" || dom.type === "checkbox" ? "click" : "change";
  addEvent(dom, mask, fixIEChangeHandle);
}

function fixIESubmit(dom) {
  if (dom.nodeName === "FORM") {
    addEvent(dom, "submit", dispatchEvent);
  }
}

if (msie < 9) {
  propHooks[HTML_KEY] = function (dom, name, val, lastProps) {
    var oldhtml = lastProps[name] && lastProps[name].__html;
    var html = val && val.__html;
    if (html !== oldhtml) {
      //IE8-会吃掉最前面的空白
      dom.innerHTML = String.fromCharCode(0xFEFF) + html
      var textNode = dom.firstChild;
      if (textNode.data.length === 1) {
        dom.removeChild(textNode);
      } else {
        textNode.deleteData(0, 1);
      }
    }
  }

  String("focus,blur").replace(/\w+/g, function (type) {
    eventHooks[type] = function (dom) {
      var mark = '__' + type
      if (!dom[mark]) {
        dom[mark] = true
        var mask = type === "focus" ? "focusin" : "focusout";
        addEvent(dom, mask, function (e) {
          //https://www.ibm.com/developerworks/cn/web/1407_zhangyao_IE11Dojo/
          //window
          var tagName = e.srcElement.tagName
          if (!tagName) { return; }
          // <body> #document
          var tag = toLowerCase(tagName);
          if (tag == "#document" || tag == "body") { return; }
          e.target = dom //因此focusin事件的srcElement有问题，强行修正
          dispatchEvent(e, type, true);
        });
      }
    };
  });

  Object.assign(
    eventPropHooks,
    oneObject(
      "mousemove, mouseout,mouseenter, mouseleave, mouseout,mousewheel, mousewheel, whe" +
      "el, click",
      function (event) {
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
    oneObject("keyup, keydown, keypress", function (event) {
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
      set: function (v) {
        this._fixIEValue = v;
      },
      get: function () {
        return this._fixIEValue;
      }
    });
  } catch (e) {
    // no catch
  }
  eventHooks.input = fixIEInput;
  eventHooks.inputcapture = fixIEInput;
  eventHooks.change = fixIEChange;
  eventHooks.changecapture = fixIEChange;
  eventHooks.submit = fixIESubmit;
}
