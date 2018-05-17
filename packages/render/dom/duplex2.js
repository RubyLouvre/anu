

function getSafeValue(value) {
    switch (typeof value) {
        case 'boolean':
        case 'number':
        case 'object':
        case 'string':
        case 'undefined':
            return value;
        default:
            // function, symbol are assigned as empty strings
            return '';
    }
}


function restoreControlledState$1(domElement, tag, props) {
    switch (tag) {
        case 'input':
            restoreControlledState(domElement, props);
            return;
        case 'textarea':
            restoreControlledState$3(domElement, props);
            return;
        case 'select':
            restoreControlledState$2(domElement, props);
            return;
    }
}

function restoreControlledState(element, props) {
    var node = element;
    duplexMap.input.update(node, props);
    updateNamedCousins(node, props);
}


function restoreControlledState$2(element, props) {
    var node = element;
    var value = props.value;

    if (value != null) {
        updateOptions(node, !!props.multiple, value, false);
    }
}


function restoreControlledState$3(element, props) {
    // DOM component is still mounted; update
    duplexMap.textarea.update(element, props);
}


var duplexMap = {
    input: {
        init(node, props) {
            var defaultValue = props.defaultValue == null ? '' : props.defaultValue;
            node._wrapperState = {
                initialChecked: props.checked != null ? props.checked : props.defaultChecked,
                initialValue: getSafeValue(props.value != null ? props.value : defaultValue),
               // controlled: isControlled(props)
            };
        },
        mount(node, props) {
            if (props.hasOwnProperty('value') || props.hasOwnProperty('defaultValue')) {
                // Do not assign value if it is already set. This prevents user text input
                // from being lost during SSR hydration.
                if (node.value === '') {
                    syncValue(node, "value", "" + node._wrapperState.initialValue);
                }
                node.defaultValue = '' + node._wrapperState.initialValue;
            }
            var name = node.name;
            if (name !== '') {
                node.name = '';
            }
            node.defaultChecked = !node.defaultChecked;
            node.defaultChecked = !node.defaultChecked;
            if (name !== '') {
                node.name = name;
            }

        },
        update(node, props) {
            if (props.checked != null) {
                syncValue(node, "checked", !!props.checked)
            }

            var value = getSafeValue(props.value);

            if (value != null) {
                if (props.type === 'number') {
                    if (value === 0 && node.value === '' ||
                        // eslint-disable-next-line
                        node.value != value) {
                        syncValue(node, "value", '' + value);
                    }
                } else if (node.value !== '' + value) {
                    syncValue(node, "value", '' + value);
                }
            }

            if (props.hasOwnProperty('value')) {
                setDefaultValue(node, props.type, value);
            } else if (props.hasOwnProperty('defaultValue')) {
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
        update(element, props) {
            var node = element;
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
                    updateOptions(node, !!props.multiple, props.multiple ? [] : '', false);
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

                    defaultValue = '' + children;
                }
                if (defaultValue == null) {
                    defaultValue = '';
                }
                initialValue = defaultValue;
            }
            // value || children || defaultValue || ""
            node._wrapperState = {
                initialValue: '' + initialValue
            };
        },
        //textarea
        mount(node) {
            var textContent = node.textContent;
            if (textContent === node._wrapperState.initialValue) {
                syncValue(node, "value", textContent);
            }
        },
        update(node, props) {
            var value = props.value;
            if (value != null) {
                // Cast `value` to a string to ensure the value is set correctly. While
                // browsers typically do this as necessary, jsdom doesn't.
                var newValue = '' + value;

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
    options: {
        init() { },
        update(node, props) {
            duplexMap.options.mount(node, props)
        },
        mount(node, props) {
            if ("value" in props) {
                node.duplexValue = node.value = props.value;
            } else {
                node.duplexValue = node.text;
            }
        }
    }
}

function setDefaultValue(node, type, value) {
    if (
        // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
        type !== 'number' || node.ownerDocument.activeElement !== node) {
        if (value == null) {
            node.defaultValue = '' + node._wrapperState.initialValue;
        } else if (node.defaultValue !== '' + value) {
            node.defaultValue = '' + value;
        }
    }
}

function updateOptions(node, multiple, propValue, setDefaultSelected) {
    var options = node.options;

    if (multiple) {
        var selectedValues = propValue;
        var selectedValue = {};
        for (var i = 0; i < selectedValues.length; i++) {
            // Prefix to avoid chaos with special keys.
            selectedValue['$' + selectedValues[i]] = true;
        }
        for (var _i = 0; _i < options.length; _i++) {
            var selected = selectedValue.hasOwnProperty('$' + options[_i].duplexValue);
            if (options[_i].selected !== selected) {
                options[_i].selected = selected;
            }
            if (selected && setDefaultSelected) {
                options[_i].defaultSelected = true;
            }
        }
    } else {
        // Do not set `select.value` as exact behavior isn't consistent across all
        // browsers for all cases.
        var _selectedValue = '' + propValue;
        var defaultSelected = null;
        for (var _i2 = 0; _i2 < options.length; _i2++) {
            if (options[_i2].duplexValue === _selectedValue) {
                options[_i2].selected = true;
                if (setDefaultSelected) {
                    options[_i2].defaultSelected = true;
                }
                return;
            }
            if (defaultSelected === null && !options[_i2].disabled) {
                defaultSelected = options[_i2];
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



function updateNamedCousins(rootNode, props) {
    var name = props.name;
    if (props.type === 'radio' && name != null) {
        var queryRoot = rootNode;

        while (queryRoot.parentNode) {
            queryRoot = queryRoot.parentNode;
        }

        var group = queryRoot.getElementsByTagName("input");


        for (var i = 0; i < group.length; i++) {
            var otherNode = group[i];
            if (otherNode === rootNode || otherNode.name !== name || otherNode.type !== "radio"  || otherNode.form !== rootNode.form) {
                continue;
            }
            // This will throw if radio buttons rendered by different copies of React
            // and the same name are rendered into the same form (same as #1939).
            // That's probably okay; we don't support it just as we don't support
            // mixing React radio buttons with non-React ones.
            var otherProps = getFiberCurrentPropsFromNode$1(otherNode);
            // We need update the tracked value on the named cousin since the value
            // was changed but the input saw no event or value set
            updateValueIfChanged(otherNode);

            // If this is a controlled radio button group, forcing the input that
            // was previously checked to update will cause it to be come re-checked
            // as appropriate.
            updateWrapper(otherNode, otherProps);
        }
    }
}


export let duplexAction(dom, fiber, nextProps, lastProps){
    var tag = fiber.name, fns = duplexMap[tag]
    if (lastProps == emptyObject) {
        fns.init(dom, nextProps)
        fns.mount(dom, nextProps)
    } else {
        fns.update(dom, nextProps)
    }
}
