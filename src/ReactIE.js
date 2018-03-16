import { options, Fragment, hasOwnProperty } from "./util";
import { Children } from "./Children";
import * as eventSystem from "./event";
import { PropTypes } from "./PropTypes";
import { Component } from "./Component";
import { win as window } from "./browser";
import { cloneElement } from "./cloneElement";
import { PureComponent } from "./PureComponent";

import { createRef, forwardRef } from "./createRef";
import { createClass } from "./createClass";//deprecated
import { createPortal } from "./createPortal";
import { createContext } from "./createContext";
import { createElement } from "./createElement";

import { render, findDOMNode, isValidElement, unmountComponentAtNode, unstable_renderSubtreeIntoContainer } from "./diff";

import "./compat";
function needFix(fn) {
    return !/native code/.test(fn);
}
function keysPolyfill() {
    //解决IE下Object.keys的性能问题
    if (needFix(Object.keys)) {
        Object.keys = function keys(obj) {
            let a = [];
            for (let k in obj) {
                if (hasOwnProperty.call(obj, k)) {
                    a.push(k);
                }
            }
            return a;
        };
    }
}
keysPolyfill();
setTimeout(keysPolyfill, 0);
setTimeout(keysPolyfill, 100);

let React;
if (window.React && window.React.options) {
    React = window.React;
} else {
    React = window.React = window.ReactDOM = {
        version: "VERSION",
        render,
        hydrate: render,
        Fragment,
        options,
        PropTypes,
        Children,
        Component,
        eventSystem,
        findDOMNode,
        createRef,
        forwardRef,
        createClass,
        createPortal,
        createContext,
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
