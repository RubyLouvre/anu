/**
 React对input, select, textarea进行了特殊处理，如果它指定了value/checked等受控属性，那么它需要添加onChange
 onInput方法才能改变值的变动，否则框架会阻止你改变它。
 若你对这些元素指定了defaultValue/defaultChecked等非受控属性，那么它们只会作用于视图一次，以后你改变JSX上的值，
 都不会同步到视图
 */
import { typeNumber } from "./util";
export const formElements = {
    select: 1,
    textarea: 1,
    input: 1,
    option: 1
};
var duplexData = {
    1: [
        "value",
        {
            onChange: 1,
            onInput: 1,
            readOnly: 1,
            disabled: 1
        },

        preventUserInput,
        "onchange",
        "oninput"
    ],
    2: [
        "checked",
        {
            onChange: 1,
            onClick: 1,
            readOnly: 1,
            disabled: 1
        },

        preventUserClick,
        "onclick"
    ],
    3: [
        "value",
        {
            onChange: 1,
            disabled: 1
        },

        preventUserChange,
        "onchange"
    ]
};

var duplexMap = {
    color: 1,
    date: 1,
    datetime: 1,
    "datetime-local": 1,
    email: 1,
    month: 1,
    number: 1,
    password: 1,
    range: 1,
    search: 1,
    tel: 1,
    text: 1,
    time: 1,
    url: 1,
    week: 1,
    textarea: 1,
    checkbox: 2,
    radio: 2,
    "select-one": 3,
    "select-multiple": 3
};

export function processFormElement(vnode, dom, props) {
    var domType = dom.type;
    var duplexType = duplexMap[domType];
    if (duplexType) {
        var data = duplexData[duplexType];
        var duplexProp = data[0];
        var keys = data[1];
        var cb = data[2];
        var value = props[duplexProp];
        if (vnode.type === "input") {
            if(value == null && props.defaultValue != null ){
                value = props.defaultValue;
            }
            dom.setAttribute("value", "" + value);
        }
        if (duplexProp in props) {
          
            if(Array.isArray(value)){
                dom._lastValue = value;
            }else{
                dom._lastValue = dom[duplexProp] = value;
            }     
            if (!hasOtherControllProperty(props, keys)) {
                // eslint-disable-next-line
                console.warn(
                    `你为${vnode.type}[type=${domType}]元素指定了**受控属性**${duplexProp}，\n但是没有提供另外的${Object.keys(keys)}\n来操作${duplexProp}的值，因此框架不允许你通过输入改变该值`
                );
                dom[data[3]] = cb;
                dom[data[4]] = cb;
            }
        }
        if (duplexType === 3) {
            postUpdateSelectedOptions(vnode, dom);
        }
    } else {
        //处理option标签
        var arr = dom.children || [];
        for (var i = 0, el; (el = arr[i]); i++) {
            dom.removeChild(el);
            i--;
        }
        if ("value" in props) {
            dom.duplexValue = dom.value = props.value;
            dom.duplexValue = dom.value;
        } else {
            dom.duplexValue = dom.text;
        }
    }
}

function hasOtherControllProperty(props, keys) {
    for (var key in keys) {
        if (props[key]) {
            return true;
        }
    }
}

function preventUserInput(e) {
    var target = e.target;
    var name = e.type === "textarea" ? "innerHTML" : "value";
    if (target._lastValue != null) {
        target[name] = target._lastValue;
    }
}

function preventUserClick(e) {
    e.preventDefault();
}

function preventUserChange(e) {
    let target = e.target,
        value = target._lastValue,
        options = target.options;
    if (target.multiple) {
        updateOptionsMore(options, options.length, value);
    } else {
        updateOptionsOne(options, options.length, value);
    }
    target._setSelected = true;
}

export function postUpdateSelectedOptions(vnode, target) {

    if (target._setSelected && !target.multiple) {
        //只有在单选的情况，用户会乱修改select.value
        if (target.value !== target._lastValue) {
            target._lastValue = target.value;
            target._setValue = false;
        }
    }
    preventUserChange({
        target
    });
}

function updateOptionsOne(options, n, propValue) {
    var stringValues = {},
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
        } else {
            // setOptionSelected(option, false);
        }
        stringValues[value] = option;
    }
    var match = stringValues[propValue];
    if (match) {
        //字符串模糊匹配
        return setOptionSelected(match, true);
    }
    if (n) {
        //选中第一个没有变disable的元素
        setOptionSelected(noDisableds[0], true);
    }
}

function updateOptionsMore(options, n, propValue) {
    var selectedValue = {};
    try {
        for (let i = 0; i < propValue.length; i++) {
            selectedValue["&" + propValue[i]] = true;
        }
    } catch (e) {
        /* istanbul ignore next */
        console.warn('<select multiple="true"> 的value应该对应一个字符串数组'); // eslint-disable-line
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
