import { inherit } from "react-core/util";
import { Component } from "react-core/Component";

export function Unbatch(props, context) {
    Component.call(this, props, context);
    this.state = {
        child: props.child,
    };
}

let fn = inherit(Unbatch, Component);
fn.render = function () {
    return this.state.child;
};