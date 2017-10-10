import { options } from "./util";
import { Children } from "./Children";
import * as eventSystem from "./event";
import { PropTypes } from "./PropTypes";
import { Component } from "./Component";
import { win as window } from "./browser";
import { createClass } from "./createClass";
import { cloneElement } from "./cloneElement";
import { PureComponent } from "./PureComponent";
import { createElement } from "./createElement";

import { render, createPortal, findDOMNode, isValidElement, unmountComponentAtNode, unstable_renderSubtreeIntoContainer } from "./diff";

import "./compat";

var React = {
    version: "VERSION",
    render,
    options,
    PropTypes,
    Children, //为了react-redux
    Component,
    eventSystem,
    findDOMNode,
    createClass,
    createPortal,
    createElement,
    cloneElement,
    PureComponent,
    isValidElement,
    unmountComponentAtNode,
    unstable_renderSubtreeIntoContainer,

    createFactory(type) {
        console.warn("createFactory将被废弃"); // eslint-disable-line
        var factory = createElement.bind(null, type);
        factory.type = type;
        return factory;
    }
};

window.React = window.ReactDOM = React;

export default React;
