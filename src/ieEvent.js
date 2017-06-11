import {document, msie} from './browser'
import {eventLowerCache, eventHooks, addEvent, dispatchEvent} from './event'

function dispatchIEEvent(dom, type) {
    try {
        var hackEvent = document.createEventObject()
        hackEvent.__type__ = type
        //IE6-8触发事件必须保证在DOM树中,否则报"SCRIPT16389: 未指明的错误"
        dom.fireEvent("ondatasetchanged", hackEvent)
    } catch (e) {}
}

//Ie6-8 oninput使用propertychange进行冒充，触发一个ondatasetchanged事件
function fixIEInput(dom, name) {
    addEvent(dom, 'propertychange', function (e) {
        if (e.propertyName === 'value') {
            dispatchIEEvent(dom, 'input')
        }
    })
}

function fixIEChange(dom, name) {
    addEvent(dom, 'change', function (e) {
        if (dom.type === 'select-one') {
            var idx = dom.selectedIndex,
                option,
                attr;
            if (idx > -1) { //IE 下select.value不会改变
                option = select.options[idx]
                attr = option.attributes.value
                dom.value = (attr && attr.specified)
                    ? option.value
                    : option.text
            }
        }
        dispatchIEEvent(dom, 'change')
    })
}

function fixIESubmit(dom, name) {
    if (dom.nodeName === 'FORM') {
        addEvent(dom, 'submit', dispatchEvent)
    }
}

if (msie < 9) {
    eventLowerCache.onInput = 'datasetchanged'
    eventLowerCache.onChange = 'datasetchanged'
    eventLowerCache.onInputCapture = 'datasetchanged'
    eventLowerCache.onChangeCapture = 'datasetchanged'
    eventHooks.onInput = fixIEInput
    eventHooks.onInputCapture = fixIEInput
    eventHooks.onChange = fixIEChange
    eventHooks.onChangeCapture = fixIEChange
    eventHooks.onSubmit = fixIESubmit
}
