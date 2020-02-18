import { typeNumber, emptyObject } from "react-core/util";

function getSafeValue(value) {
    switch (typeNumber(value)) {
        case 2:
        case 3:
        case 8:
        case 4:
        case 0:
            return value;
        default:
            // function, symbol are assigned as empty strings
            return "";
    }
}

export var duplexMap = {
    input: {
        init(node, props) {
            let defaultValue =
                props.defaultValue == null ? "" : props.defaultValue;
            return (node._wrapperState = {
                // initialChecked: props.checked != null ? props.checked : props.defaultChecked,
                initialValue: getSafeValue(
                    props.value != null ? props.value : defaultValue
                )
            });
        },
        mount(node, props, state) {
            if (
                props.hasOwnProperty("value") ||
                props.hasOwnProperty("defaultValue")
            ) {
                let stateValue = "" + state.initialValue;
                if (node.value === "" && node.value !== stateValue) {
                    syncValue(node, "value", stateValue);
                }
                node.defaultValue = stateValue;
            }
            var name = node.name;
            if (name !== "") {
                node.name = "";
            }
            node.defaultChecked = !node.defaultChecked;
            node.defaultChecked = !node.defaultChecked;
            if (name !== "") {
                node.name = name;
            }
        },
        update(node, props) {
            if (props.checked != null) {
                syncValue(node, "checked", !!props.checked);
            }
            const isActive = node === node.ownerDocument.activeElement;
            const value = getSafeValue(props.value);
            if (value != null) {
                if (props.type === "number") {
                    if (
                        (value === 0 && node.value === "") ||
                        // eslint-disable-next-line
                        node.value != value
                    ) {
                        syncValue(node, "value", "" + value);
                    }
                } else if (node.value !== "" + value) {
                    syncValue(node, "value", "" + value);
                }
            }

            if (props.hasOwnProperty("value")) {
                setDefaultValue(node, props.type, value, isActive);
            } else if (props.hasOwnProperty("defaultValue")) {
                setDefaultValue(
                    node,
                    props.type,
                    getSafeValue(props.defaultValue),
                    isActive
                );
            }

            if (props.checked == null && props.defaultChecked != null) {
                node.defaultChecked = !!props.defaultChecked;
            }
        }
    },
    select: {
        init(node, props) {
            //select
            let value = props.value;
            return (node._wrapperState = {
                initialValue: value != null ? value : props.defaultValue,
                wasMultiple: !!props.multiple
            });
        },
        mount(node, props) {
            let multiple = (node.multiple = !!props.multiple);
            let value = props.value;
            if (value != null) {
                updateOptions(node, multiple, value, false);
            } else if (props.defaultValue != null) {
                updateOptions(node, multiple, props.defaultValue, true);
            }
        },
        update(node, props) {
            // mount后这个属性没用
            node._wrapperState.initialValue = void 666;

            let wasMultiple = node._wrapperState.wasMultiple;
            let multiple = (node._wrapperState.wasMultiple = !!props.multiple);
            let value = props.value;
            if (value != null) {
                updateOptions(node, multiple, value, false);
            } else if (wasMultiple !== multiple) {
                // 切换multiple后，需要重新计算
                if (props.defaultValue != null) {
                    updateOptions(node, multiple, props.defaultValue, true);
                } else {
                    // Revert the select back to its default unselected state.
                    updateOptions(node, multiple, multiple ? [] : "", false);
                }
            }
        }
    },
    textarea: {
        init(node, props) {
            var initialValue = props.value;
            if (initialValue == null) {
                let defaultValue = props.defaultValue;
                let children = props.children;
                if (children != null) {
                    //移除元素节点
                    defaultValue = textContent(node);
                    node.innerHTML = "";
                }
                if (defaultValue == null) {
                    defaultValue = "";
                }
                initialValue = defaultValue;
            }
            // 优先级：value > children(textContent) > defaultValue > ""
            return (node._wrapperState = {
                initialValue: "" + initialValue
            });
        },
        mount(node, props, state) {
            let text = textContent(node);
            let stateValue = "" + state.initialValue;
            if (text !== stateValue) {
                syncValue(node, "value", stateValue);
            }
        },
        update(node, props) {
            let value = props.value;
            if (value != null) {
                let newValue = "" + value;
                if (newValue !== node.value) {
                    syncValue(node, "value", newValue);
                }
                if (props.defaultValue == null) {
                    node.defaultValue = newValue;
                }
            }
            if (props.defaultValue != null) {
                node.defaultValue = props.defaultValue;
            }
        }
    },
    option: {
        init() {},
        update(node, props) {
            duplexMap.option.mount(node, props);
        },
        mount(node, props) {
            let elems = node.getElementsByTagName("*");
            let n = elems.length,
                el;
            if (n) {
                for (n = n - 1, el; (el = elems[n--]); ) {
                    node.removeChild(el);
                }
            }
            if ("value" in props) {
                node.duplexValue = node.value = props.value;
            } else {
                node.duplexValue = node.text;
            }
        }
    }
};

function textContent(node) {
    return node.textContent || node.innerText;
}

function setDefaultValue(node, type, value, isActive) {
    if (
        // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
        type !== "number" ||
        !isActive
    ) {
        if (value == null) {
            node.defaultValue = "" + node._wrapperState.initialValue;
        } else if (node.defaultValue !== "" + value) {
            node.defaultValue = "" + value;
        }
    }
}

export function updateOptions(node, multiple, propValue, setDefaultSelected) {
    var options = node.options;

    if (multiple) {
        var selectedValues = propValue;
        var selectedValue = {};
        for (let i = 0; i < selectedValues.length; i++) {
            // Prefix to avoid chaos with special keys.
            selectedValue["$" + selectedValues[i]] = true;
        }
        for (let i = 0; i < options.length; i++) {
            let selected = selectedValue.hasOwnProperty(
                "$" + options[i].duplexValue
            );
            if (options[i].selected !== selected) {
                options[i].selected = selected;
            }
            if (selected && setDefaultSelected) {
                options[i].defaultSelected = true;
            }
        }
    } else {
        // Do not set `select.value` as exact behavior isn't consistent across all
        // browsers for all cases.
        var _selectedValue = "" + propValue;
        var defaultSelected = null;
        for (let i = 0; i < options.length; i++) {
            if (options[i].duplexValue === _selectedValue) {
                options[i].selected = true;
                if (setDefaultSelected) {
                    options[i].defaultSelected = true;
                }
                return;
            }
            if (defaultSelected === null && !options[i].disabled) {
                defaultSelected = options[i]; //存放第一个不为disabled的option
            }
        }
        if (defaultSelected !== null) {
            defaultSelected.selected = true;
        }
    }
}

function syncValue(dom, name, value) {
    dom.__anuSetValue = true; //抑制onpropertychange
    dom[name] = value;
    dom.__anuSetValue = false;
}

export function duplexAction(fiber) {
    let { stateNode: dom, name, props, lastProps } = fiber;
    let fns = duplexMap[name];
    if (name !== "option") {
        enqueueDuplex(dom);
    }
    if (!lastProps || lastProps == emptyObject) {
        let state = fns.init(dom, props);
        fns.mount(dom, props, state);
    } else {
        fns.update(dom, props);
    }
}

var duplexNodes = [];
export function enqueueDuplex(dom) {
    if (duplexNodes.indexOf(dom) == -1) {
        duplexNodes.push(dom);
    }
}

export function fireDuplex() {
    var radioMap = {};
    if (duplexNodes.length) {
        do {
            let dom = duplexNodes.shift();
            let e = dom.__events;
            let fiber = e && e.vnode;
            if (fiber && !fiber.disposed) {
                let props = fiber.props;
                let tag = fiber.name;
                if (name === "select") {
                    let value = props.value;
                    if (value != null) {
                        updateOptions(dom, !!props.multiple, value, false);
                    }
                } else {
                    duplexMap[tag].update(dom, props);
                    let name = props.name;
                    if (
                        props.type === "radio" &&
                        name != null &&
                        !radioMap[name]
                    ) {
                        radioMap[name] = 1;
                        collectNamedCousins(dom, name);
                    }
                }
            }
        } while (duplexNodes.length);
    }
}

function collectNamedCousins(rootNode, name) {
    let queryRoot = rootNode;
    while (queryRoot.parentNode) {
        queryRoot = queryRoot.parentNode;
    }
    let group = queryRoot.getElementsByTagName("input");
    for (let i = 0; i < group.length; i++) {
        let otherNode = group[i];
        if (
            otherNode === rootNode ||
            otherNode.name !== name ||
            otherNode.type !== "radio" ||
            otherNode.form !== rootNode.form
        ) {
            continue;
        }
        enqueueDuplex(otherNode);
    }
}
