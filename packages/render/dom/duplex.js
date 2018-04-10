
import { duplexMap } from "./browser";
import { eventAction } from "./event";
import { noop, typeNumber, emptyObject } from "react-core/util";
import { Renderer } from "react-core/createRenderer";

export function getDuplexProps(dom, props) {
    let type = dom.type || dom.tagName.toLowerCase();
    let number = duplexMap[type];
    if (number) {
        for (let i in controlledStrategy) {
            if (props.hasOwnProperty(i)) {
                return i;
            }
        }
    }
    return "children";
}

export let controlledStrategy = {
    value: controlled,
    checked: controlled,
    defaultValue: uncontrolled,
    defaultChecked: uncontrolled,
    children: noop
};

let rchecked = /checkbox|radio/;
function controlled(dom, name, nextProps, lastProps, fiber) {
    uncontrolled(dom, name, nextProps, lastProps, fiber, true);
}
function uncontrolled(dom, name, nextProps, lastProps, fiber, six) {
    let isControlled = !!six;
    let isSelect = fiber.type === "select";
    let value = nextProps[name];
    if(!isSelect){
        if(name.indexOf("alue") !== -1){
            var canSetVal = true;
            value = toString(value);
        }else{
            value = !!value;
        }
    }
    let multipleChange = isControlled || (isSelect && nextProps.multiple != lastProps.multiple);
    if (multipleChange || lastProps === emptyObject) {
        dom._persistValue = value;//非受控的情况下只更新一次，除非multiple发生变化
        syncValue({ target: dom }); //set value/checked
        var duplexType = "select";
        if (isSelect) {
            syncOptions({//set selected
                target: dom
            });
        } else {
            duplexType = rchecked.test(dom.type) ? "checked" : "value";
        }
        if (isControlled) { // add event for controlled 
            var arr = duplexData[duplexType];
            arr[0].forEach(function (name) {
                eventAction(dom, name, nextProps[name] || noop, lastProps, fiber);
            });
            fiber.controlledCb = arr[1];
            Renderer.controlledCbs.push(fiber);
        }
    }
    //必须设置完dom.value=yyy后才能设置dom.setAttribute("value",xxx)
    if (canSetVal) {
        if(rchecked.test(dom.type)  ){
            value = "value" in nextProps ? nextProps.value: "on";
        }
        dom.__anuSetValue = true;
        dom.setAttribute("value", value);
        dom.__anuSetValue = false;
    }
}

function syncOptions(e) {
    let target = e.target,
        value = target._persistValue,
        options = target.options;
    if (target.multiple) {
        updateOptionsMore(options, options.length, value);
    } else {
        updateOptionsOne(options, options.length, value);
    }
    target._setSelected = true;
}

function syncValue({ target: dom }) {
    let name = rchecked.test(dom.type) ? "checked" : "value";
   
    let value = dom._persistValue;
    if (dom[name]+"" !== value + "") { //全部转数字再比较
        dom.__anuSetValue = true;//抑制onpropertychange
        dom[name] = dom._persistValue = value;
        if (dom.type === "textarea") {
            dom.innerHTML = value;
        }
        dom.__anuSetValue = false;
    }
}

var duplexData = {
    select: [["onChange"], syncOptions],
    value: [["onChange", "onInput"], syncValue],
    checked: [["onChange", "onClick"], syncValue]
};

function toString(a) {
    var t = typeNumber(a);
    if (t < 2 || t > 4) {
        if (t === 8 && a.hasOwnProperty("toString")){
            return a.toString();
        }
        return "";
    }
    return a + "";
}

function updateOptionsOne(options, n, propValue) {
    let stringValues = {},
        noDisableds = [];
    for (let i = 0; i < n; i++) {
        let option = options[i];
        let value = option.duplexValue;
        if (!option.disabled) {
            noDisableds.push(option);
        }
        if (value === propValue) {
            //精确匹配
            return setOptionSelected(option, true);
        }
        stringValues["&" + value] = option;
    }

    let match = stringValues["&" + propValue];
    if (match) {
        //字符串模糊匹配
        return setOptionSelected(match, true);
    }
    if (n && noDisableds[0]) {
        //选中第一个没有变disable的元素
        setOptionSelected(noDisableds[0], true);
    }
}

function updateOptionsMore(options, n, propValue) {
    let selectedValue = {};
    try {
        for (let i = 0; i < propValue.length; i++) {
            selectedValue["&" + propValue[i]] = true;
        }
    } catch (e) {
        /* istanbul ignore next */
        console.log('the value of multiple select should be an array'); // eslint-disable-line
    }
    for (let i = 0; i < n; i++) {
        let option = options[i];
        let value = option.duplexValue;
        let selected = selectedValue.hasOwnProperty("&" + value);
        setOptionSelected(option, selected);
    }
}

function setOptionSelected(dom, selected) {
    dom.selected = selected;
}