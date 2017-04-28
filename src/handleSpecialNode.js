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
 export function handleSpecialNode(vnode) {
     var props = vnode.props
     var type = props.type
     //如果用户没有为表单元素添加onChange或onInput事件，那么它就成为一个非受控组件
     //意即用户无法控制它的value与checked的改变，一直保持原始值
     //框架通过添加onChange或onInput事件，不断重置用户的输入，确保它不被改变
     switch (vnode.type) {
         case 'textarea':
             if (!type) {
                 type = 'textarea'
             }
         case 'input':
             if (!type) {
                 type = 'text'
             }
             if (hasReadOnlyValue[type])
                 return
             var isChecked = type === 'radio' || type === 'checkbox'
             var propName = isChecked ? 'checked' : 'value'
             var defaultName = propName === 'value' ? 'defaultValue' : 'defaultChecked'
             var initValue = props[propName] != null ? props[propName] : props[defaultName]
             var isControlled = props.onChange || props.readOnly || props.disabled
             if (/text|password/.test(type)) {
                 isControlled = isControlled || props.onInput
             }
             if (!isControlled && propName in props) {
                 var dom = vnode.dom
                 console.log('你在表单元素指定了' + propName + '属性,但没有添加onChange或onInput事件或readOnly或disabled，它将变成非受控组件，无法更换' + propName)
                 function keepInitValue(e) {
                     dom[propName] = initValue
                 }
                 vnode.dom.addEventListener('change', keepInitValue)
                 vnode.dom.addEventListener(isChecked ? 'click' : 'input', keepInitValue)
             }
             break
         case "select":
             return vnode._wrapperState = {
                 postUpdate: postUpdateSelectedOptions,
                 postMount: postUpdateSelectedOptions
             }
         case "option":
             return vnode._wrapperState = {
                 value: typeof props.value != 'undefined' ? props.value : props.children[0].text
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
             updateOptions(vnode, multiple, props.multiple ? [] : '');
         }
     }
 }

 function collectOptions(vnode, ret) {
     ret = ret || []
     vnode.props.children.forEach(function (el) {
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
         selectedValue = {};
         for (i = 0; i < propValue.length; i++) {
             selectedValue['' + propValue[i]] = true;
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