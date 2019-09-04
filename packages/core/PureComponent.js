import { miniCreateClass } from "./util";
import { Component } from "./Component";
import { shallowEqual } from "./shallowEqual";

export var PureComponent = miniCreateClass(
    function PureComponent() {
        this.isPureComponent = true;
    },
    Component,
    {
        shouldComponentUpdate(nextProps, nextState) {
            let a = shallowEqual(this.props, nextProps);
            let b = shallowEqual(this.state, nextState);
            return !a || !b;
        }
    }
);
