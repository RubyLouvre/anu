import { miniCreateClass } from "react-core/util";
import { Component } from "react-core/Component";
import { createElement } from "react-core/createElement";
var MemoComponent = miniCreateClass(
    function MemoComponent(obj) {
        this.render = obj.render;
        this.shouldComponentUpdate = obj.shouldComponentUpdate
    },
    Component,
    {}
);

export function memo(render, shouldComponentUpdate) {
    return function(props) {
        return createElement(MemoComponent, Object.assign(props,{
            render: render.bind(this, props),
            shouldComponentUpdate
        }));
    };
}
