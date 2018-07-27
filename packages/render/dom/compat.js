import { document, msie } from "./browser";
import { actionStrategy } from "./props";
import { oneObject, innerHTML, extend, inherit } from "react-core/util";
import {
    eventHooks,
    addEvent,
    eventPropHooks,
    createHandle,
    dispatchEvent,
    focusMap
} from "./event";

//IE8中select.value不会在onchange事件中随用户的选中而改变其value值，也不让用户直接修改value 只能通过这个hack改变
let noCheck = false;
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

let fixIEChangeHandle = createHandle("change", function(e) {
    let dom = e.srcElement;
    if (dom.type === "select-one") {
        if (!dom.__bindFixValueFn) {
            addEvent(dom, "propertychange", setSelectValue);
            dom.__bindFixValueFn = true;
        }
        noCheck = true;
        syncValueByOptionValue(dom);
        noCheck = false;
        return true;
    }
    if (e.type === "propertychange") {
        return e.propertyName === "value" && !dom.__anuSetValue;
    }
});

let fixIEInputHandle = createHandle("input", function(e) {
    return e.propertyName === "value";
});

let IEHandleFix = {
    input: function(dom) {
        addEvent(dom, "propertychange", fixIEInputHandle);
    },
    change: function(dom) {
        //IE6-8, radio, checkbox的点击事件必须在失去焦点时才触发 select则需要做更多补丁工件
        let mask = /radio|check/.test(dom.type)
            ? "click"
            : /text|password/.test(dom.type)
                ? "propertychange"
                : "change";
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
        let oldhtml = lastProps[name] && lastProps[name].__html;
        let html = val && val.__html;
        if (html !== oldhtml) {
            //IE8-会吃掉最前面的空白
            dom.innerHTML = String.fromCharCode(0xfeff) + html;
            let textNode = dom.firstChild;
            if (textNode.data.length === 1) {
                dom.removeChild(textNode);
            } else {
                textNode.deleteData(0, 1);
            }
        }
    };

    focusMap.focus = "focusin";
    focusMap.blur = "focusout";
    focusMap.focusin = "focus";
    focusMap.focusout = "blur";
    extend(
        eventPropHooks,
        oneObject(
            "mousemove, mouseout,mouseenter, mouseleave, mouseout,mousewheel, mousewheel, whe" +
                "el, click",
            function(event) {
                if (!("pageX" in event)) {
                    let doc = event.target.ownerDocument || document;
                    let box =
                        doc.compatMode === "BackCompat"
                            ? doc.body
                            : doc.documentElement;
                    event.pageX =
                        event.clientX +
                        (box.scrollLeft >> 0) -
                        (box.clientLeft >> 0);
                    event.pageY =
                        event.clientY +
                        (box.scrollTop >> 0) -
                        (box.clientTop >> 0);
                }
            }
        )
    );
    const translateToKey = {
        "8": "Backspace",
        "9": "Tab",
        "12": "Clear",
        "13": "Enter",
        "16": "Shift",
        "17": "Control",
        "18": "Alt",
        "19": "Pause",
        "20": "CapsLock",
        "27": "Escape",
        "32": " ",
        "33": "PageUp",
        "34": "PageDown",
        "35": "End",
        "36": "Home",
        "37": "ArrowLeft",
        "38": "ArrowUp",
        "39": "ArrowRight",
        "40": "ArrowDown",
        "45": "Insert",
        "46": "Delete",
        "112": "F1",
        "113": "F2",
        "114": "F3",
        "115": "F4",
        "116": "F5",
        "117": "F6",
        "118": "F7",
        "119": "F8",
        "120": "F9",
        "121": "F10",
        "122": "F11",
        "123": "F12",
        "144": "NumLock",
        "145": "ScrollLock",
        "224": "Meta"
    };
    extend(
        eventPropHooks,
        oneObject("keyup, keydown, keypress", function(event) {
            if (!event.which && event.type.indexOf("key") === 0) {
                event.key = translateToKey[event.keyCode];
                /* istanbul ignore next  */
                event.which =
                    event.charCode != null ? event.charCode : event.keyCode;
            }
        })
    );

    for (let i in IEHandleFix) {
        eventHooks[i] = eventHooks[i + "capture"] = IEHandleFix[i];
    }
}
