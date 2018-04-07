import { Children } from "react-core/Children";
import { PropTypes } from "react-core/PropTypes";
import { Component } from "react-core/Component";
import { cloneElement } from "react-core/cloneElement";
import { PureComponent } from "react-core/PureComponent";
import { createRenderer,Renderer } from "react-core/createRenderer";
import { createRef, forwardRef } from "react-core/createRef";
import { createPortal } from "react-core/createPortal";
import { createContext } from "react-core/createContext";
import { createElement, isValidElement, createFactory } from "react-core/createElement";
import { createClass } from "react-core/createClass"; //deprecated
import { options, Fragment, getWindow } from "react-core/util";

import * as eventSystem from "./event";
import { findDOMNode } from "./findDOMNode";
import { DOMRenderer} from "./DOMRenderer";

let { render, unstable_renderSubtreeIntoContainer, unmountComponentAtNode } = DOMRenderer

var win = getWindow();
var prevReact = win.React;
let React;
if (prevReact && prevReact.options) {
    React = prevReact; //解决引入多个
} else {
    createRenderer(DOMRenderer);


    React = win.React = win.ReactDOM = {
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
        createFactory
    };
}
export default React;
