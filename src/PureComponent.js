import { Component } from './Component'
import { inherit } from './util'
import { shallowEqual } from './shallowEqual'

export function PureComponent(props, context) {
    this.props = props
    this.context = context
}

inherit(PureComponent, Component)

let fn = PureComponent.prototype

fn.shouldComponentUpdate = function shallowCompare(nextProps, nextState) {
    var a = shallowEqual(this.props, nextProps)
    var b = shallowEqual(this.state, nextState)
    return !a || !b
}
fn.isPureComponent = true