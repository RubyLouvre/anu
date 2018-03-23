import { options, Fragment, createRenderer, getWindow } from "./util";
import { Children } from "./Children";
import { PropTypes } from "./PropTypes";
import { Component } from "./Component";
import { cloneElement } from "./cloneElement";
import { PureComponent } from "./PureComponent";

import { createRef, forwardRef } from "./createRef";
import { createPortal } from "./createPortal";
import { createContext } from "./createContext";
import { createElement } from "./createElement";
import { findDOMNode, isValidElement,unmountComponentAtNode } from "./diff";

import { NoopRenderer } from "./NoopRenderer";



var win = getWindow();
var prevReact = win.React;
let React;
if (prevReact && prevReact.options) {
    React = prevReact; //解决引入多个
} else {
    createRenderer(NoopRenderer);
    var render = NoopRenderer.render;
    React = win.React = win.ReactNoop = {
        version: "VERSION",
        render,
        hydrate: render,
        flush:  NoopRenderer.flush,
        getChildren: NoopRenderer.getChildren,
        options,
        Fragment,
        PropTypes,
        Children,
        createPortal,
        createContext,
        Component,
        findDOMNode,
        createRef,
        forwardRef,
        createElement,
        cloneElement,
        PureComponent,
        isValidElement,
        unmountComponentAtNode,
        createFactory(type) {
			console.warn('createFactory is deprecated'); // eslint-disable-line
            let factory = createElement.bind(null, type);
            factory.type = type;
            return factory;
        }
    };
}
export default React;
