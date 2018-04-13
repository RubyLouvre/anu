import { Children } from "react-core/Children";
import { PropTypes } from "react-core/PropTypes";
import { Component } from "react-core/Component";
import { PureComponent } from "react-core/PureComponent";
import { createRef, forwardRef } from "react-core/createRef";
import { createPortal } from "react-core/createPortal";
import { createContext } from "react-core/createContext";
import { createElement, cloneElement, isValidElement, createFactory } from "react-core/createElement";
import { createClass } from "react-core/createClass"; //deprecated
import { Fragment, getWindow } from "react-core/util";

import * as eventSystem from "./event";
import { findDOMNode } from "./findDOMNode";
import { DOMRenderer } from "./DOMRenderer";

var win = getWindow();
var prevReact = win.React;
let React;
if (prevReact && prevReact.eventSystem) {
    React = prevReact; //解决引入多个
} else {
   
    let { render, unstable_renderSubtreeIntoContainer, unmountComponentAtNode } = DOMRenderer;

    React = win.React = win.ReactDOM = {
        version: "VERSION",
        render: render,
        hydrate: render,
        unstable_batchedUpdates: DOMRenderer.batchedUpdates,
        //  options,
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
