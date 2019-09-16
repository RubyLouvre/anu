

import { miniCreateClass } from "react-core/util";
import { Component } from "react-core/Component";
import { createElement } from "react-core/createElement";
var MemoComponent = miniCreateClass(function MemoComponent(props) {
    this.props = props;
    this.state = {
    }
    this.render = props.render;
    this.shouldComponentUpdate = props.shouldComponentUpdate
}, Component, {

});

export function memo(render, shouldComponentUpdate){
    return function(){
        return createElement(MemoComponent, {
            render,
            shouldComponentUpdate
        })
    }
}