

// input, select, textarea, datalist这几个元素都会包装成受控组件或非受控组件 **受控组件**
// 是指定指定了value或checked 并绑定了事件的元素 **非受控组件** 是指定指定了value或checked，
// 但没有绑定事件，也没有使用readOnly, disabled来限制状态变化的元素
// 这时框架会弹出为它绑定事件，以重置用户的输入，确保它的value或checked值不被改变 但如果用户使用了defaultValue,
// defaultChecked，那么它不做任何转换

function getOptionValue(props) {
    //typeof props.value === 'undefined'
    return props.value != void 666
        ? props.value
        : props.children[0].text
}

export function postUpdateSelectedOptions(vnode) {
    var props = vnode.props
    var multiple = !!props.multiple
    var value = props.value != null
        ? props.value
        : props.defaultValue != null
            ? props.defaultValue
            : multiple
                ? []
                : ''
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

function setOptionState(vnode) {
    return {
        value: getOptionValue(vnode.props)
    }
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
            var state = setOptionState(option)
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
            var state = setOptionState(option)
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

function stopUserInput(e) {
    var target = e.target
    var name = e.type === 'textarea'
        ? 'innerHTML'
        : 'value'
    target[name] = target._lastValue
}

function stopUserClick(e) {
    e.preventDefault()
}

export function processFormElement(vnode, dom, props) {
    var domType = dom.type
    if (/text|password|number|date|time|color|month/.test(domType)) {
        if ('value' in props && !hasOtherControllProperty(props, textMap)) {
            console.warn('你为', domType, `元素指定了value属性，但是没有提供另外的${Object.keys(textMap)}
           等用于控制value变化的属性，那么它是一个非受控组件，用户无法通过输入改变元素的value值`)
            dom.oninput = stopUserInput
        }
    } else if (/checkbox|radio/.test(domType)) {
        if ('checked' in props && !hasOtherControllProperty(props, checkedMap)) {
            console.warn('你为', domType, `元素指定了value属性，但是没有提供另外的${Object.keys(checkedMap)}
           等用于控制value变化的属性，那么它是一个非受控组件，用户无法通过输入改变元素的value值`)
            dom.onclick = stopUserClick
        }
    } else if (/select/.test(domType)) {
        if (!('value' in props || 'defaultValue' in props)) {
            console.warn(`select元素必须指定value或defaultValue属性`)
        }
        postUpdateSelectedOptions(vnode)
    }
}

var textMap = {
    onChange: 1,
    onInput: 1,
    readyOnly: 1,
    disabled: 1
}
var checkedMap = {
    onChange: 1,
    onClick: 1,
    readyOnly: 1,
    disabled: 1
}

function hasOtherControllProperty(props, map) {
    for (var i in props) {
        if (map[i]) {
            return true
        }
    }
    return false
}