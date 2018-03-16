import { options, Fragment } from "./util";
import { Children } from "./Children";
import * as eventSystem from "./event";
import { PropTypes } from "./PropTypes";
import { Component } from "./Component";
import { win as window } from "./browser";
import { cloneElement } from "./cloneElement";
import { PureComponent } from "./PureComponent";

import { createRef,forwardRef } from "./createRef";
import { createClass } from "./createClass";//deprecated
import { createPortal } from "./createPortal";
import { createContext } from "./createContext";
import { createElement } from "./createElement";

import { render, findDOMNode, isValidElement, unmountComponentAtNode, unstable_renderSubtreeIntoContainer } from "./diff";

let React;
if (window.React && window.React.options) {
    React = window.React; //解决引入多个
} else {
    React = window.React = window.ReactDOM = {
        version: "VERSION",
        render,
        hydrate: render,
        options,
        Fragment,
        PropTypes,
        Children,
        createPortal,
        createContext,
        Component,
        eventSystem,
        findDOMNode,
        createRef,
        forwardRef,
        createClass,
        createElement,
        cloneElement,
        PureComponent,
        isValidElement,
        unmountComponentAtNode,
        unstable_renderSubtreeIntoContainer,
        createFactory(type) {
            console.warn("createFactory is deprecated"); // eslint-disable-line
            let factory = createElement.bind(null, type);
            factory.type = type;
            return factory;
        }
    };
}
export default React;
