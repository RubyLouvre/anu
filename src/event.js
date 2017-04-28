  import {
      transaction
  } from './transaction'
  import {
      document
  } from './browser'
  export var eventMap = {
      mouseover: 'MouseOver',
      mouseout: 'MouseOut',
      mouseleave: 'MouseLeave',
      mouseenter: 'MouseEnter'
  }
/**
 * 判定否为与事件相关
 * 
 * @param {any} name 
 * @returns 
 */
export function isEventName(name) {
    return /^on[A-Z]/.test(name)
}

  function dispatchEvent(e) {
      e = new SyntheticEvent(e)
      var target = e.target
      var paths = []
      do {
          var events = target.__events
          if (events) {
              paths.push({
                  dom: target,
                  props: events
              })
          }
      } while ((target = target.parentNode) && target.nodeType === 1)

      var type = eventMap[e.type] || e.type

      var capitalized = capitalize(type)
      var bubble = 'on' + capitalized
      var captured = 'on' + capitalized + 'Capture'
      transaction.isInTransation = true
      for (var i = paths.length; i--;) { //从上到下
          var path = paths[i]
          var fn = path.props[captured]
          if (typeof fn === 'function') {
              e.currentTarget = path.dom
              fn.call(path.dom, e)
              if (e._stopPropagation) {
                  break
              }
          }
      }

      for (var i = 0, n = paths.length; i < n; i++) { //从下到上
          var path = paths[i]
          var fn = path.props[bubble]
          if (typeof fn === 'function') {
              e.currentTarget = path.dom
              fn.call(path.dom, e)
              if (e._stopPropagation) {
                  break
              }
          }
      }
      transaction.isInTransation = false
      transaction.enqueue()
  }

  function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
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

  var eventNameCache = {}
  var ron = /^on/
  var rcapture = /Capture$/
  export function getBrowserName(name) {
      var n = eventNameCache[name]
      if (n) {
          return n
      }
      return eventNameCache[name] = name.replace(ron, '').
      replace(rcapture, '').toLowerCase()
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
          e.cancelBubble = this.$$stop = true
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