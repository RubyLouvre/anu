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
import { render, findDOMNode, isValidElement, unmountComponentAtNode } from "./diff";

import { NoopRenderer } from "./NoopRenderer";

var win = getWindow();
var prevReact = win.ReactNoop;
let ReactNoop;
if (prevReact && prevReact.isReactNoop) {
    ReactNoop = prevReact; //解决引入多个
} else {
    createRenderer(NoopRenderer);
    ReactNoop = win.ReactNoop = { //放出全局的ReactNoop
        version: "VERSION",
        render,
        flush: NoopRenderer.flush,
        reset: NoopRenderer.reset,
        getRoot: NoopRenderer.getRoot,
        getChildren: NoopRenderer.getChildren,
        options,
        isReactNoop: true,
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
export default ReactNoop;
