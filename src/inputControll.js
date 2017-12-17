/**
通过事件绑定实现受控组件
 */
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
        function(a) {
            return a == null ? null : a + "";
        },
        function(dom, value, vnode) {
            if (vnode.type === "input") {
                dom.setAttribute("value", value);
            } else if (vnode.type === "textarea" && value === null) {
                value = dom.innerHTML;
            }
            if (dom._persistValue !== value) {
                dom._persistValue = dom.value = value;
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
        function(a) {
            return !!a;
        },
        function(dom, value, vnode) {
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
        function(a) {
            return a;
        },
        function(dom, value, vnode, isUncontrolled) {
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

export function inputControll(vnode, dom, props) {
    var domType = dom.type;
    var duplexType = duplexMap[domType];
    var isUncontrolled = dom._uncontrolled;
    if (duplexType) {
        var data = duplexData[duplexType];
        var duplexProp = data[0];
        var keys = data[1];
        var converter = data[2];
        var sideEffect = data[3];
        var value = converter(isUncontrolled ? dom._persistValue : props[duplexProp]);
        sideEffect(dom, value, vnode, isUncontrolled);
        if (isUncontrolled) {
            return;
        }

        var handle = data[4];
        var event1 = data[5];
        var event2 = data[6];
        if (!hasOtherControllProperty(props, keys)) {
            // eslint-disable-next-line
            console.warn(`你为${vnode.type}[type=${domType}]元素指定了**受控属性**${duplexProp}，\n但是没有提供另外的${Object.keys(keys)}\n来操作${duplexProp}的值，框架将不允许你通过输入改变该值`);
            dom["on" + event1] = handle;
            dom["on" + event2] = handle;
        } else {
            hijackEvent(dom, event1, handle);
            hijackEvent(dom, event2, handle);
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
        } else {
            dom.duplexValue = dom.text;
        }
    }
}
function hijackEvent(dom, name, cb) {
    var obj = dom.__events;
    if (!obj) {
        return;
    }
    var fn = obj[name];
    if (!fn || fn._hijack) {
        return;
    }
    var neo = (obj[name] = merge(fn, cb));
    neo._hijack = true;
}

function merge(fn1, fn2) {
    return function(e) {
        fn1.call(this, e);
        fn2.call(this, e);
    };
}

function hasOtherControllProperty(props, keys) {
    for (var key in keys) {
        if (props[key]) {
            return true;
        }
    }
}
var breakNode = {
    form: 1,
    body: 1
};
function syncOtherRadios(dom, v) {
    var queryRoot = dom;
    while (queryRoot.parentNode) {
        if (breakNode[queryRoot.nodeName.toLowerCase()]) {
            break;
        }
        queryRoot = queryRoot.parentNode;
    }
    var inputs = queryRoot ? queryRoot.getElementsByTagName("input") : [];
    for (var i = 0, el; (el = inputs[i++]); ) {
        if (el !== dom && el.type === dom.type && el.name === dom.name && el.form === dom.form) {
            if (el.checked !== !v) {
                el.checked = !v;
            }
        }
    }
}
function keepPersistValue(e) {
    var dom = e.target;
    var name = e.type === "textarea" ? "innerHTML" : /check|radio/.test(dom.type) ? "checked" : "value";
    var v = dom._persistValue;
    if (dom.type === "radio") {
        syncOtherRadios(dom, v);
    }
    var noNull = v != null;
    var noEqual = dom[name] !== v; //2.0 , 2
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
