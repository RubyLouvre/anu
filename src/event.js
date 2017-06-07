import {transaction} from './transaction'
import {document, msie} from './browser'
import {isFn, options, noop} from './util'

export var eventMap = {}
/**
 * 判定否为与事件相关
 *
 * @param {any} name
 * @returns
 */
export function isEventName(name) {
    return /^on[A-Z]/.test(name)
}

export function dispatchEvent(e) {
    var __type__ = e.__type__ || e.type
    e = new SyntheticEvent(e)
    var target = e.target
    var paths = []
    do {
        var events = target.__events
        if (events) {
            paths.push({dom: target, props: events})
        }
    } while ((target = target.parentNode) && target.nodeType === 1)
    // target --> parentNode --> body --> html
    var type = eventMap[__type__] || __type__

    var capitalized = capitalize(type)
    var bubble = 'on' + capitalized
    var captured = 'on' + capitalized + 'Capture'
    transaction.isInTransation = true
    triggerEventFlow(paths, captured, e)

    if (!e._stopPropagation) {
        triggerEventFlow(paths.reverse(), bubble, e)
    }
    transaction.isInTransation = false
    options.updateBatchNumber++;
    transaction.dequeue()
}

function triggerEventFlow(paths, prop, e) {
    for (var i = paths.length; i--;) {
        var path = paths[i]
        var fn = path.props[prop]
        if (isFn(fn)) {
            e.currentTarget = path._hostNode
            fn.call(path._hostNode, e)
            if (e._stopPropagation) {
                break
            }
        }
    }
}

function capitalize(str) {
    return str
        .charAt(0)
        .toUpperCase() + str.slice(1)
}

var globalEvents = {}
export function addGlobalEventListener(name) {
    if (!globalEvents[name]) {
        globalEvents[name] = true
        addEvent(document, name, dispatchEvent)
    }
}
export function addEvent(el, type, fn) {
    if (el.addEventListener) {
        el.addEventListener(type, fn)
    } else if (el.attachEvent) {
        el.attachEvent('on' + type, fn)
    }
}

export var eventLowerCache = {
    'onClick': 'click',
    'onChange': 'change'
}

var ron = /^on/
var rcapture = /Capture$/
export function getBrowserName(onStr) {
    var lower = eventLowerCache[onStr]
    if (lower) {
        return lower
    }
    var hump = onStr
        .replace(ron, '')
        .replace(rcapture, '')
    lower = hump.toLowerCase()
    eventLowerCache[onStr] = lower
    eventMap[lower] = hump
    return lower
}


let inMobile = 'ontouchstart' in document

export var eventHooks = {}

if (inMobile) {
    eventHooks.onClick = noop
    eventHooks.onClickCapture = noop
}


export function SyntheticEvent(event) {
    if (event.originalEvent) {
        return event
    }
    for (var i in event) {
        if (!eventProto[i]) {
            this[i] = event[i]
        }
    }
    if (!this.target) {
        this.target = event.srcElement
    }
    var target = this.target
    this.fixEvent()
    this.timeStamp = new Date() - 0
    this.originalEvent = event
}

var eventProto = SyntheticEvent.prototype = {
    fixEvent: function () {}, //留给以后扩展用
    preventDefault: function () {
        var e = this.originalEvent || {}
        e.returnValue = this.returnValue = false
        if (e.preventDefault) {
            e.preventDefault()
        }
    },
    stopPropagation: function () {
        var e = this.originalEvent || {}
        e.cancelBubble = this._stopPropagation = true
        if (e.stopPropagation) {
            e.stopPropagation()
        }
    },
    stopImmediatePropagation: function () {
        this.stopPropagation()
        this.stopImmediate = true
    },
    toString: function () {
        return '[object Event]'
    }
}