import { document, msie } from "./browser";
import { actionStrategy } from "./diffProps";
import { oneObject, innerHTML, noop, extend } from "./util";
import { eventHooks, addEvent, eventPropHooks, createHandle, dispatchEvent, focusMap } from "./event";
import { inputMonitor } from "./inputMonitor";

//IE8中select.value不会在onchange事件中随用户的选中而改变其value值，也不让用户直接修改value 只能通过这个hack改变
var noCheck = false;
function setSelectValue(e) {
    if (e.propertyName === "value" && !noCheck) {
        syncValueByOptionValue(e.srcElement);
    }
}

function syncValueByOptionValue(dom) {
    let idx = dom.selectedIndex,
        option,
        attr;
    if (idx > -1) {
        //IE 下select.value不会改变
        option = dom.options[idx];
        attr = option.attributes.value;
        dom.value = attr && attr.specified ? option.value : option.text;
    }
}

var fixIEChangeHandle = createHandle("change", function(e) {
    var dom = e.srcElement;
    if (dom.type === "select-one") {
        if (!dom.__bindFixValueFn) {
            addEvent(dom, "propertychange", setSelectValue);
            dom.__bindFixValueFn = true;
        }
        noCheck = true;
        syncValueByOptionValue(dom);
        noCheck = false;
    }
    if (e.type === "propertychange") {
        return e.propertyName === "value";
    }
});

var fixIEInputHandle = createHandle("input", function(e) {
    return e.propertyName === "value";
});

var IEHandleFix = {
    input: function(dom) {
        addEvent(dom, "propertychange", fixIEInputHandle);
    },
    change: function(dom) {
        //IE6-8, radio, checkbox的点击事件必须在失去焦点时才触发 select则需要做更多补丁工件
        var mask = /radio|check/.test(dom.type) ? "click" : /text|password/.test(dom.type) ? "propertychange" : "change";
        addEvent(dom, mask, fixIEChangeHandle);
    },
    submit: function(dom) {
        if (dom.nodeName === "FORM") {
            addEvent(dom, "submit", dispatchEvent);
        }
    }
};

if (msie < 9) {
    actionStrategy[innerHTML] = function(dom, name, val, lastProps) {
        var oldhtml = lastProps[name] && lastProps[name].__html;
        var html = val && val.__html;
        if (html !== oldhtml) {
            //IE8-会吃掉最前面的空白
            dom.innerHTML = String.fromCharCode(0xfeff) + html;
            var textNode = dom.firstChild;
            if (textNode.data.length === 1) {
                dom.removeChild(textNode);
            } else {
                textNode.deleteData(0, 1);
            }
        }
    };
    if(msie < 8){
        inputMonitor.observe = noop;
    }
    focusMap.focus = "focusin";
    focusMap.blur = "focusout";
    focusMap.focusin = "focus";
    focusMap.focusout = "blur";
    extend(
        eventPropHooks,
        oneObject("mousemove, mouseout,mouseenter, mouseleave, mouseout,mousewheel, mousewheel, whe" + "el, click", function(event) {
            if (!("pageX" in event)) {
                var doc = event.target.ownerDocument || document;
                var box = doc.compatMode === "BackCompat" ? doc.body : doc.documentElement;
                event.pageX = event.clientX + (box.scrollLeft >> 0) - (box.clientLeft >> 0);
                event.pageY = event.clientY + (box.scrollTop >> 0) - (box.clientTop >> 0);
            }
        })
    );

    extend(
        eventPropHooks,
        oneObject("keyup, keydown, keypress", function(event) {
            /* istanbul ignore next  */
            if (event.which == null && event.type.indexOf("key") === 0) {
                /* istanbul ignore next  */
                event.which = event.charCode != null ? event.charCode : event.keyCode;
            }
        })
    );

    for (let i in IEHandleFix) {
        eventHooks[i] = eventHooks[i + "capture"] = IEHandleFix[i];
    }
}
