import { Component } from './Component'
import { inherit } from './util'

var topLevelRootCounter = 1
export function TopLevelWrapper() {
    this.rootID = topLevelRootCounter++
}

inherit(TopLevelWrapper, Component)

let fn = TopLevelWrapper.prototype
fn.render = function() {
    return this.props.child
}