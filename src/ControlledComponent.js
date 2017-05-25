import {
    inherit
} from './util'

var hasReadOnlyValue = {
    'button': true,
    'image': true,
    'hidden': true,
    'reset': true,
    'submit': true
}
var formElements = {
    select: 1,
    datalist: 1,
    textarea: 1,
    input: 1,
    option: 1
}
export function setControlledComponent(vnode) {
    var props = vnode.props

    var type = props.type
    var nodeName = vnode.type
   if (!formElements[nodeName])
        return

    // input, select, textarea, datalist这几个元素都会包装成受控组件或非受控组件 **受控组件**
    // 是指定指定了value或checked 并绑定了事件的元素 **非受控组件** 是指定指定了value或checked，
    // 但没有绑定事件，也没有使用readOnly, disabled来限制状态变化的元素
    // 这时框架会弹出为它绑定事件，以重置用户的输入，确保它的value或checked值不被改变 但如果用户使用了defaultValue,
    // defaultChecked，那么它不做任何转换

    switch (nodeName) {
        case "select":
        case "datalist":
            type = 'select'
        case 'textarea':
            if (!type) { //必须指定
                type = 'textarea'
            }
        case 'input':
            if (hasReadOnlyValue[type])
                return

            if (!type) {
                type = 'text'
            }

            var isChecked = type === 'radio' || type === 'checkbox'
            var propName = isChecked ?
                'checked' :
                'value'
            var defaultName = propName === 'value' ?
                'defaultValue' :
                'defaultChecked'
            var initValue = props[propName] != null ?
                props[propName] :
                props[defaultName]
            var isControlled = props.onChange || props.readOnly || props.disabled
            if (/text|password/.test(type)) {
                isControlled = isControlled || props.onInput
            }
            if (!isControlled && propName in props) {
                var dom = vnode._hostNode
                console.warn('你在表单元素指定了' + propName + '属性,但没有添加onChange或onInput事件或readOnly或disabled，它将变成非受控组件，无法更换' + propName)

                function keepInitValue(e) {
                    dom[propName] = initValue
                }
                vnode
                    ._hostNode
                    .addEventListener('change', keepInitValue)
                if (type !== 'select') {
                    vnode
                        ._hostNode
                        .addEventListener(isChecked ?
                            'click' :
                            'input', keepInitValue)
                }
            }
            break
        case "option":
            return vnode._wrapperState = {
                value: getOptionValue(props)
            }
    }
    if (type === 'select') {
        postUpdateSelectedOptions(vnode) //先在mount时执行一次
        return vnode._wrapperState = {
            postUpdate: postUpdateSelectedOptions
        }
    }
}

function getOptionValue(props) {
    //typeof props.value === 'undefined'
    return props.value != void 666 ?
        props.value :
        props.children[0].text
}

function postUpdateSelectedOptions(vnode) {
    var props = vnode.props
    var multiple = !!props.multiple
    var value = props.value != null ? props.value : props.defaultValue != null ? props.defaultValue : multiple ? [] :
        ''
    updateOptions(vnode, multiple, value)

}

function collectOptions(vnode, ret) {
    ret = ret || []
    for (var i = 0, el; el = vnode.props.children[i++];) {
        if (el.type === 'option') {
            ret.push(el)
        } else if (el.type === 'optgroup') {
            collectOptions(el, ret)
        }
    }
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
            /* istanbul ignore next */
            console.warn('<select multiple="true"> 的value应该对应一个字符串数组')
        }
        for (var i = 0, option; option = options[i++];) {
            var state = option._wrapperState || /* istanbul ignore next */ handleSpecialNode(option)
            var selected = selectedValue.hasOwnProperty(state.value)
            if (state.selected !== selected) {
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
    if (option._hostNode) {
        option._hostNode.selected = selected
    }
}

//react的单向流动是由生命周期钩子的setState选择性调用（不是所有钩子都能用setState）,受控组件，事务机制