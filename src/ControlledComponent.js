import {inherit} from './util'

var hasReadOnlyValue = {
    'button': true,
    'image': true,
    'hidden': true,
    'reset': true,
    'submit': true
}
export function setControlledComponent(vnode) {
    var props = vnode.props
    var type = props.type
    // input, select, textarea, datalist这几个元素都会包装成受控组件或非受控组件 **受控组件**
    // 是指定指定了value或checked 并绑定了事件的元素 **非受控组件** 是指定指定了value或checked，
    // 但没有绑定事件，也没有使用readOnly, disabled来限制状态变化的元素
    // 这时框架会弹出为它绑定事件，以重置用户的输入，确保它的value或checked值不被改变 但如果用户使用了defaultValue,
    // defaultChecked，那么它不做任何转换

    switch (vnode.type) {
        case "select":
        case "datalist":
            type = 'select'
        case 'textarea':
            if (!type) {//必须指定
                type = 'textarea'
            }
        case 'input':
            if (!type) {
                type = 'text'
            }
            if (hasReadOnlyValue[type]) 
                return
            var isChecked = type === 'radio' || type === 'checkbox'
            var propName = isChecked
                ? 'checked'
                : 'value'
            var defaultName = propName === 'value'
                ? 'defaultValue'
                : 'defaultChecked'
            var initValue = props[propName] != null
                ? props[propName]
                : props[defaultName]
            var isControlled = props.onChange || props.readOnly || props.disabled
            if (/text|password/.test(type)) {
                isControlled = isControlled || props.onInput
            }
            if (!isControlled && propName in props) {
                var dom = vnode.dom
                console.warn('你在表单元素指定了' + propName + '属性,但没有添加onChange或onInput事件或readOnly或disabled，它将变成非受控组件，无法更换' + propName)

                function keepInitValue(e) {
                    dom[propName] = initValue
                }
                vnode
                    .dom
                    .addEventListener('change', keepInitValue)
                if (type !== 'select') {
                    vnode
                        .dom
                        .addEventListener(isChecked
                            ? 'click'
                            : 'input', keepInitValue)
                }
            }
            break
        case "option":
            return vnode._wrapperState = {
                value: typeof props.value != 'undefined'
                    ? props.value
                    : props.children[0].text
            }
    }
    if (type === 'select') {
        postUpdateSelectedOptions(vnode) //先在mount时执行一次
        return vnode._wrapperState = {
            postUpdate: postUpdateSelectedOptions
        }
    }
}

function postUpdateSelectedOptions(vnode) {
    var props = vnode.props
    var value = props.value
    var multiple = !!props.multiple
    if (value != null) {
        updateOptions(vnode, multiple, value)
    } else {
        if (props.defaultValue != null) {
            updateOptions(vnode, multiple, props.defaultValue)
        } else {
            // Revert the select back to its default unselected state.
            updateOptions(vnode, multiple, multiple
                ? []
                : '');
        }
    }
}

function collectOptions(vnode, ret) {
    ret = ret || []
    vnode
        .props
        .children
        .forEach(function (el) {
            if (el.type === 'option') {
                ret.push(el)
            } else if (el.type === 'optgroup') {
                collectOptions(el, ret)
            }
        })
    return ret
}

function updateOptions(vnode, multiple, propValue) {
    var options = collectOptions(vnode),
        selectedValue
    if (multiple) {
        selectedValue = {}
        try {
            for (i = 0; i < propValue.length; i++) {
                selectedValue['' + propValue[i]] = true
            }
        } catch (e) {
            console.warn('<select multiple="true"> 的value应该对应一个字符串数组')
        }
        for (var i = 0, option; option = options[i++];) {
            var state = option._wrapperState || handleSpecialNode(option)
            var selected = selectedValue.hasOwnProperty(state.value)
            if (state.selected !== f) {
                state.selected = selected
                setDomSelected(option, selected)
            }
        }
    } else {
        // Do not set `select.value` as exact behavior isn't consistent across all
        // browsers for all cases.
        selectedValue = '' + propValue;
        for (var i = 0, option; option = options[i++];) {
            var state = option._wrapperState
            if (state.value === selectedValue) {
                setDomSelected(option, true)
                return
            }
        }
        if (options.length) {
            setDomSelected(options[0], true)
        }
    }
}

function setDomSelected(option, selected) {
    option.dom && (option.dom.selected = selected)
}

//react的单向流动是由生命周期钩子的setState选择性调用（不是所有钩子都能用setState）,受控组件，事务机制