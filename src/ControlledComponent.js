/**
 input, select, textarea这几个元素如果指定了value/checked的**状态属性**，就会包装成受控组件或非受控组件
 受控组件是指，用户除了为它指定**状态属性**，还为它指定了onChange/onInput/disabled等用于控制此状态属性
 变动的属性
 反之，它就是非受控组件，非受控组件会在框架内部添加一些事件，阻止**状态属性**被用户的行为改变，只能被setState改变
 */
import { typeNumber } from "./util";

export function processFormElement(vnode, dom, props) {
    var domType = dom.type;
    var duplexType = duplexMap[domType];
    if (duplexType) {
        var data = duplexData[duplexType];
        var duplexProp = data[0];
        var keys = data[1];
        var eventName = data[2];
        if (duplexProp in props && !hasOtherControllProperty(props, keys)) {
            // eslint-disable-next-line
            console.warn(`你为${vnode.type}[type=${domType}]元素指定了${duplexProp}属性，
      但是没有提供另外的${ Object.keys(keys)}来控制${duplexProp}属性的变化
      那么它即为一个非受控组件，用户无法通过输入改变元素的${duplexProp}值`);
            dom[eventName] = data[3];
        }
        if (duplexType === 3) {
            postUpdateSelectedOptions(vnode);
        }
    }
}

function hasOtherControllProperty(props, keys) {
    for (var key in props) {
        if (keys[key]) {
            return true;
        }
    }
}
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

function preventUserInput(e) {
    var target = e.target;
    var name = e.type === "textarea" ? "innerHTML" : "value";
    target[name] = target._lastValue;
}

function preventUserClick(e) {
    e.preventDefault();
}

function preventUserChange(e) {
    var target = e.target;
    var value = target._lastValue;
    var options = target.options;
    if (target.multiple) {

        updateOptionsMore(options, options.length, value);
    } else {
        updateOptionsOne(options, options.length, value);
    }
}

var duplexData = {
    1: [
        "value",
        {
            onChange: 1,
            onInput: 1,
            readOnly: 1,
            disabled: 1
        },
        "oninput",
        preventUserInput
    ],
    2: [
        "checked",
        {
            onChange: 1,
            onClick: 1,
            readOnly: 1,
            disabled: 1
        },
        "onclick",
        preventUserClick
    ],
    3: [
        "value",
        {
            onChange: 1,
            disabled: 1
        },
        "onchange",
        preventUserChange
    ]
};

export function postUpdateSelectedOptions(vnode) {
    var props = vnode.props,
        multiple = !!props.multiple,
        value =
            typeNumber(props.value) > 1
                ? props.value
                : typeNumber(props.defaultValue) > 1
                    ? props.defaultValue
                    : multiple ? [] : "",
        options = [];
    collectOptions(vnode, props, options);
    if (multiple) {
        updateOptionsMore(options, options.length, value);
    } else {
        updateOptionsOne(options, options.length, value);
    }
}

/**
 * 收集虚拟DOM select下面的options元素，如果是真实DOM直接用select.options
 *
 * @param {VNode} vnode
 * @param {any} props
 * @param {Array} ret
 */
function collectOptions(vnode, props, ret) {
    var arr = props.children;
    for (var i = 0, n = arr.length; i < n; i++) {
        var el = arr[i];
        if (el.type === "option") {
            ret.push(el);
        } else if (el.type === "optgroup") {
            collectOptions(el, el.props, ret);
        }
    }
}

function updateOptionsOne(options, n, propValue) {
    var selectedValue = "" + propValue;
    for (let i = 0; i < n; i++) {
        let option = options[i];
        let value = getOptionValue(option, option.props);
        if (value === selectedValue) {
            getOptionSelected(option, true);
            return;
        }
    }
    if (n) {
        getOptionSelected(options[0], true);
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
        let value = getOptionValue(option, option.props);
        let selected = selectedValue.hasOwnProperty("&" + value);
        getOptionSelected(option, selected);
    }
}

function getOptionValue(option, props) {
    if (!props) {
        return getDOMOptionValue(option);
    }
    //这里在1.1.1改动过， props.value === undefined ? props.children[0].text : props.value;
    return props.value === undefined ? props.children : props.value;
}

function getDOMOptionValue(node) {
    if (node.hasAttribute && node.hasAttribute("value")) {
        return node.getAttribute("value");
    }
    var attr = node.getAttributeNode("value");
    if (attr && attr.specified) {
        return attr.value;
    }
    return node.innerHTML.trim();
}

function getOptionSelected(option, selected) {
    var dom = option._hostNode || option;
    dom.selected = selected;
}
