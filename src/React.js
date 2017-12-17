import { options } from "./util";
import { Children } from "./Children";
import * as eventSystem from "./event";
import { PropTypes } from "./PropTypes";
import { Component } from "./Component";
import { win as window } from "./browser";
import { createClass } from "./createClass";
import { cloneElement } from "./cloneElement";
import { PureComponent, AsyncComponent } from "./PureComponent";
import { createElement } from "./createElement";
import { createPortal } from "./createPortal";
import { render,findDOMNode, isValidElement, unmountComponentAtNode, unstable_renderSubtreeIntoContainer } from "./diff";

var React = {
    version: "VERSION",
    render,
    hydrate: render,
    options,
    PropTypes,
    Children,
    createPortal,
    Component,
    eventSystem,
    findDOMNode,
    createClass,
    createElement,
    cloneElement,
    PureComponent,
    isValidElement,
    unmountComponentAtNode,
    unstable_renderSubtreeIntoContainer,
    unstable_AsyncComponent:AsyncComponent,
    createFactory(type) {
        console.warn("createFactory is deprecated"); // eslint-disable-line
        var factory = createElement.bind(null, type);
        factory.type = type;
        return factory;
    }
};

window.React = window.ReactDOM = React;

export default React;

