import { Children } from "react-core/Children";
import { PropTypes } from "react-core/PropTypes";
import { Component } from "react-core/Component";
import { PureComponent } from "react-core/PureComponent";
import { createRef, forwardRef } from "react-core/createRef";
import { createPortal } from "react-core/createPortal";
import { createContext } from "react-core/createContext";
import {
  createElement,
  cloneElement,
  isValidElement,
  createFactory
} from "react-core/createElement";
import { Fragment, getWindow } from "react-core/util";
import { createPage } from "./createPage";
import { template } from "./template";

import { Renderer } from "./wxrender";
let win = getWindow();
let prevReact = win.React;
let React;

let { render } = Renderer;
/*
    DOMRenderer.injectIntoDevTools({
        findFiberByHostInstance: get,
        findHostInstanceByFiber: findDOMNode,
        bundleType: 1,
        version: "VERSION",
        rendererPackageName: "react-dom"
    });
    */
React = win.React = win.ReactDOM = {
  //平台相关API
  eventSystem,

  //fiber底层API
  version: "VERSION",
  render: render,
  hydrate: render,
  template,
  createPage,
  unstable_batchedUpdates: DOMRenderer.batchedUpdates,
  Fragment,
  PropTypes,
  Children,
  createPortal,
  createContext,
  Component,
  createRef,
  forwardRef,
  // createClass,
  createElement,
  cloneElement,
  PureComponent,
  isValidElement,
  createFactory
};
export default React;
