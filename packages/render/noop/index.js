
import { Children } from "react-core/Children";
import { PropTypes } from "react-core/PropTypes";
import { Component } from "react-core/Component";
import { PureComponent } from "react-core/PureComponent";
import { createRenderer,Renderer } from "react-core/createRenderer";
import { createRef, forwardRef } from "react-core/createRef";
import { createPortal } from "react-core/createPortal";
import { createContext } from "react-core/createContext";
import { createElement,cloneElement, isValidElement, createFactory } from "react-core/createElement";
import { createClass } from "react-core/createClass"; //deprecated
import { options, Fragment, getWindow } from "react-core/util";

import { NoopRenderer} from "./NoopRenderer";

var win = getWindow();
var prevReact = win.ReactNoop;
let ReactNoop;
if (prevReact && prevReact.isReactNoop) {
    ReactNoop = prevReact; //解决引入多个
} else {
    createRenderer(NoopRenderer);
    ReactNoop = win.ReactNoop = { //放出全局的ReactNoop
        version: "VERSION",
        render: NoopRenderer.render,
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
        createRef,
        forwardRef,
        createElement,
        cloneElement,
        PureComponent,
        isValidElement,
        createFactory
    };
}
export default ReactNoop;
