import { Component } from "./Component";
import { options } from "./util";
import { Children } from "./Children";
import * as eventSystem from "./event";
import { win as window } from "./browser";
import { createElement } from "./createElement";
import { cloneElement } from "./cloneElement";
import { PureComponent } from "./PureComponent";

import { render, findDOMNode, unmountComponentAtNode } from "./diff";

var React = {
    version: "VERSION",
    render,
    options,
    Children, //支持react-redux
    Component,
    findDOMNode,
    createElement,
    cloneElement,
    PureComponent,
    unmountComponentAtNode
};

window.React = window.ReactDOM = React;

export default React;
