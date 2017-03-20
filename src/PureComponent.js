import { Component } from './Component'
import { extend } from './util'
import { shallowEqual } from './shallowEqual'

export function PureComponent(props, context) {
    this.props = props
    this.context = context
}

function Bridge() {}
Bridge.prototype = Component.prototype

let fn = PureComponent.prototype = new Bridge()

// 避免原型链拉长导致方法查找的性能开销
extend(fn, Component.prototype)
fn.shouldComponentUpdate = function shallowCompare(nextProps, nextState) {
    var a = shallowEqual(this.props, nextProps)
    var b = shallowEqual(this.state, nextState)
    console.log(a, b)
    return !a || !b
}
fn.constructor = PureComponent
fn.isPureComponent = true