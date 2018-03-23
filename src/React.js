import { options, Fragment, createRenderer, getWindow } from "./util";
import { Children } from "./Children";
import * as eventSystem from "./event";
import { PropTypes } from "./PropTypes";
import { Component } from "./Component";
import { cloneElement } from "./cloneElement";
import { PureComponent } from "./PureComponent";

import { createRef, forwardRef } from "./createRef";
import { createClass } from "./createClass"; //deprecated
import { createPortal } from "./createPortal";
import { createContext } from "./createContext";
import { createElement } from "./createElement";
import { render, findDOMNode, isValidElement } from "./diff";

import { DOMRenderer } from "./DOMRenderer";

createRenderer(DOMRenderer);


var win = getWindow();
var prevReact = win.React;
let React;
if (prevReact && prevReact.options) {
    React = prevReact; //解决引入多个
} else {
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
        createFactory(type) {
			console.warn('createFactory is deprecated'); // eslint-disable-line
            let factory = createElement.bind(null, type);
            factory.type = type;
            return factory;
        }
    };
}
export default React;
