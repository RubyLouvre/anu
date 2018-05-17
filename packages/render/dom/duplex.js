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
            var defaultValue = props.defaultValue == null ? "" : props.defaultValue;
            node._wrapperState = {
                initialChecked: props.checked != null ? props.checked : props.defaultChecked,
                initialValue: getSafeValue(props.value != null ? props.value : defaultValue),
                // controlled: isControlled(props)
            };
        },
        mount(node, props) {
            if (props.hasOwnProperty("value") || props.hasOwnProperty("defaultValue")) {
                // Do not assign value if it is already set. This prevents user text input
                // from being lost during SSR hydration.
                if (node.value === "") {
                    syncValue(node, "value", "" + node._wrapperState.initialValue);
                }
                node.defaultValue = "" + node._wrapperState.initialValue;
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
            var value = getSafeValue(props.value);

            if (value != null) {
                if (props.type === "number") {
                    if (value === 0 && node.value === "" ||
                        // eslint-disable-next-line
                        node.value != value) {
                        syncValue(node, "value", "" + value);
                    }
                } else if (node.value !== "" + value) {
                    syncValue(node, "value", "" + value);
                }
            }

            if (props.hasOwnProperty("value")) {
                setDefaultValue(node, props.type, value);
            } else if (props.hasOwnProperty("defaultValue")) {
                setDefaultValue(node, props.type, getSafeValue(props.defaultValue));
            }

            if (props.checked == null && props.defaultChecked != null) {
                node.defaultChecked = !!props.defaultChecked;
            }
        }
    },
    select: {
        init(node, props) {//select
            var value = props.value;
            node._wrapperState = {
                initialValue: value != null ? value : props.defaultValue,
                wasMultiple: !!props.multiple
            };
        },
        //select
        mount(node, props) {
            node.multiple = !!props.multiple;
            var value = props.value;
            if (value != null) {
                updateOptions(node, !!props.multiple, value, false);
            } else if (props.defaultValue != null) {
                updateOptions(node, !!props.multiple, props.defaultValue, true);
            }
        },
        update(node, props) {
            // After the initial mount, we control selected-ness manually so don't pass
            // this value down
            node._wrapperState.initialValue = undefined;

            var wasMultiple = node._wrapperState.wasMultiple;
            node._wrapperState.wasMultiple = !!props.multiple;

            var value = props.value;
            if (value != null) {
                updateOptions(node, !!props.multiple, value, false);
            } else if (wasMultiple !== !!props.multiple) {
                // For simplicity, reapply `defaultValue` if `multiple` is toggled.
                if (props.defaultValue != null) {
                    updateOptions(node, !!props.multiple, props.defaultValue, true);
                } else {
                    // Revert the select back to its default unselected state.
                    updateOptions(node, !!props.multiple, props.multiple ? [] : "", false);
                }
            }
        }
    },
    textarea: {
        init(node, props) {
            var initialValue = props.value;
            // Only bother fetching default value if we're going to use it
            if (initialValue == null) {
                var defaultValue = props.defaultValue;
                // TODO (yungsters): Remove support for children content in <textarea>.
                var children = props.children;
                if (children != null) {

                    if (Array.isArray(children)) {
                        children = children[0];
                    }

                    defaultValue = "" + children;
                }
                if (defaultValue == null) {
                    defaultValue = "";
                }
                initialValue = defaultValue;
            }
            // value || children || defaultValue || ""
            node._wrapperState = {
                initialValue: "" + initialValue
            };
        },
        //textarea
        mount(node) {
            var textContent = node.textContent;
            var stateValue = node._wrapperState.initialValue;
            if (textContent != stateValue) {
                syncValue(node, "value", stateValue);
            }
        },
        update(node, props) {
            var value = props.value;
            if (value != null) {
                // Cast `value` to a string to ensure the value is set correctly. While
                // browsers typically do this as necessary, jsdom doesn't.
                var newValue = "" + value;

                // To avoid side effects (such as losing text selection), only set value if changed
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
        init() { },
        update(node, props) {
            duplexMap.option.mount(node, props);
        },
        mount(node, props) {
            if ("value" in props) {
                node.duplexValue = node.value = props.value;
            } else {
                node.duplexValue = node.text;
            }
        }
    }
};

function setDefaultValue(node, type, value) {
    if (
        // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
        type !== "number" || node.ownerDocument.activeElement !== node) {
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
            let selected = selectedValue.hasOwnProperty("$" + options[i].duplexValue);
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
                defaultSelected = options[i];
            }
        }
        if (defaultSelected !== null) {
            defaultSelected.selected = true;
        }
    }
}

function syncValue(dom, name, value) {
    dom.__anuSetValue = true;//抑制onpropertychange
    dom[name] = value;
    dom.__anuSetValue = false;
}

export function duplexAction(dom, fiber, nextProps, lastProps) {
    var tag = fiber.name, fns = duplexMap[tag];
    if (tag !== "option") {
        enqueueDuplex(dom);
    }
    if (lastProps == emptyObject) {
        fns.init(dom, nextProps);
        fns.mount(dom, nextProps);
    } else {
        fns.update(dom, nextProps);
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
                    if (props.type === "radio" && name != null && !radioMap[name]) {
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
        if (otherNode === rootNode || otherNode.name !== name || 
            otherNode.type !== "radio" || otherNode.form !== rootNode.form) {
            continue;
        }
        enqueueDuplex(otherNode);
    }
}




