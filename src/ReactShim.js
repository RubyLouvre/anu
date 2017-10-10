import { Component } from "./Component";
import { options } from "./util";
import { Children } from "./Children";
import { win as window } from "./browser";
import { createElement } from "./createElement";
import { cloneElement } from "./cloneElement";
import { PureComponent } from "./PureComponent";

import { render,createPortal, findDOMNode, unmountComponentAtNode } from "./diff";

var React = {
    version: "VERSION",
    render,
    options,
    Children, //支持react-redux
    Component,
    findDOMNode,
    createPortal,
    createElement,
    cloneElement,
    PureComponent,
    unmountComponentAtNode
};

window.React = window.ReactDOM = React;

export default React;
