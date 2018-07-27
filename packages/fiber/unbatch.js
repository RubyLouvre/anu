import { miniCreateClass } from "react-core/util";
import { Component } from "react-core/Component";

export var Unbatch = miniCreateClass(
    function Unbatch(props) {
        this.state = {
            child: props.child
        };
    },
    Component,
    {
        render() {
            return this.state.child;
        }
    }
);
