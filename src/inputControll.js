/**
通过事件绑定实现受控组件
 */
import { Refs } from "./Refs";
import { duplexMap } from "./browser";


export const formElements = {
    select: 1,
    textarea: 1,
    input: 1,
    option: 1
};
let duplexData = {
    1: [
        "value",
        {
            onChange: 1,
            onInput: 1,
            readOnly: 1,
            disabled: 1
        },
        function (a) {
            return a == null ? null : a + "";
        },
        function (dom, value, vnode) {
            if (value == null) {
                return;
            }

            if (vnode.type === "input") {
                dom.__anuSetValue = true;//抑制onpropertychange
                dom.setAttribute("value", value);
                dom.__anuSetValue = false;
                if (dom.type === "number") {
                    let valueAsNumber = parseFloat(dom.value) || 0;
                    if (
                        // eslint-disable-next-line
                        value != valueAsNumber ||
                        // eslint-disable-next-line
                        (value == valueAsNumber && dom.value != value)
                    ) {
                        // Cast `value` to a string to ensure the value is set correctly. While
                        // browsers typically do this as necessary, jsdom doesn't.
                        value += "";
                    } else {
                        return;
                    }
                }
            }
            if (dom._persistValue !== value) {
                dom.__anuSetValue = true;//抑制onpropertychange
                dom._persistValue = dom.value = value;
                dom.__anuSetValue = false;
            }
        },
        keepPersistValue,
        "change",
        "input"
    ],
    2: [
        "checked",
        {
            onChange: 1,
            onClick: 1,
            readOnly: 1,
            disabled: 1
        },
        function (a) {
            return !!a;
        },
        function (dom, value, vnode) {
            if (vnode.props.value != null) {
                dom.value = vnode.props.value;
            }
            if (dom._persistValue !== value) {
                dom._persistValue = dom.checked = value;
            }
        },
        keepPersistValue,
        "change",
        "click"
    ],
    3: [
        "value",
        {
            onChange: 1,
            disabled: 1
        },
        function (a) {
            return a;
        },
        function (dom, value, vnode, isUncontrolled) {
            //只有在单选的情况，用户会乱修改select.value
            if (isUncontrolled) {
                if (!dom.multiple && dom.value !== dom._persistValue) {
                    dom._persistValue = dom.value;
                    dom._setValue = false;
                }
            } else {
                //props中必须有value
                if ("value" in vnode.props) {
                    dom._persistValue = value;
                }
            }

            syncOptions({
                target: dom
            });
        },
        syncOptions,
        "change"
    ]
};

export function inputControll(vnode, dom, props) {
    let domType = dom.type;
    let duplexType = duplexMap[domType];
    let isUncontrolled = dom._uncontrolled;
    if (duplexType) {
        let data = duplexData[duplexType];
        let duplexProp = data[0];
        let keys = data[1];
        let converter = data[2];
        let sideEffect = data[3];

        let value = converter(isUncontrolled ? dom._persistValue : props[duplexProp]);
        sideEffect(dom, value, vnode, isUncontrolled);
        if (isUncontrolled) {
            return;
        }

        let handle = data[4];
        let event1 = data[5];
        let event2 = data[6];
        if (!hasOtherControllProperty(props, keys)) {
            // eslint-disable-next-line
            console.warn(`你为${vnode.type}[type=${domType}]元素指定了**受控属性**${duplexProp}，\n但是没有提供另外的${Object.keys(keys)}\n来操作${duplexProp}的值，框架将不允许你通过输入改变该值`);
            dom["on" + event1] = handle;
            dom["on" + event2] = handle;
        } else {
            vnode.controlledCb = handle;
            Refs.controlledCbs.push(vnode);
        }
    } else {
        //处理option标签
        let arr = dom.children || [];
        for (let i = 0, el; (el = arr[i]); i++) {
            dom.removeChild(el);
            i--;
        }
        if ("value" in props) {
            dom.duplexValue = dom.value = props.value;
        } else {
            dom.duplexValue = dom.text;
        }
    }
}

function hasOtherControllProperty(props, keys) {
    for (let key in keys) {
        if (props[key]) {
            return true;
        }
    }
}

function keepPersistValue(e) {
    let dom = e.target;
    let name = e.type === "textarea" ? "innerHTML" : /check|radio/.test(dom.type) ? "checked" : "value";
    let v = dom._persistValue;
    let noNull = v != null;
    let noEqual = dom[name] !== v; //2.0 , 2

    if (noNull && noEqual) {
        dom[name] = v;
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
        stringValues[value] = option;
    }
    let match = stringValues[propValue];
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