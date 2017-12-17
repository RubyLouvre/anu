import { inherit } from "./util";
import { Component } from "./Component";
import { shallowEqual } from "./shallowEqual";

export function PureComponent(props, context) {
    Component.call(this, props, context);
}

let fn = inherit(PureComponent, Component);

fn.shouldComponentUpdate = function shallowCompare(nextProps, nextState) {
    var a = shallowEqual(this.props, nextProps);
    var b = shallowEqual(this.state, nextState);
    return !a || !b;
};
fn.isPureComponent = true;

export function AsyncComponent(props, context) {
    Component.call(this, props, context);
}
let fn2 = inherit(AsyncComponent, Component);

fn2.unstable_isAsyncReactComponent = true;
fn2.render = function() {
    return this.props.children;
};
