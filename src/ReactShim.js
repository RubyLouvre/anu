import { Component } from "./Component";
import { options, Fragment } from "./util";
import { Children } from "./Children";
import { win as window } from "./browser";
import { createElement } from "./createElement";
import { cloneElement } from "./cloneElement";
import { PureComponent } from "./PureComponent";
import { createPortal } from "./createPortal";
import { createContext } from "./createContext";

import { render, findDOMNode, unmountComponentAtNode } from "./diff";


var React;
if (window.React && window.React.options) {
    React = window.React;
} else {
    React = window.React = window.ReactDOM =  {
        version: "VERSION",
        render,
        hydrate: render,
        Fragment,
        options,
        Children, 
        Component,
       
        findDOMNode,
        createPortal,
        createContext,
        createElement,
        cloneElement,
        PureComponent,
        unmountComponentAtNode
    };
}
export default React;
