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
import {
  Fragment,
  getWindow,
  miniCreateClass,
} from "react-core/util";
import { createPage } from "./createPage";
import { template } from "./template";
import { eventSystem } from "./eventSystem";

import { Renderer } from "./wxrender";
let win = getWindow();
let prevReact = win.React;
let React;
//用于保存所有用miniCreateClass创建的类，然后在事件系统中用到
let classCache = eventSystem.classCache;

let { render } = Renderer;

import { findHostInstance } from "react-fiber/findHostInstance";

React = win.React = win.ReactDOM = {
  //平台相关API
  eventSystem,
  miniCreateClass: function(a, b, c, d) {
    var clazz = miniCreateClass.apply(null, arguments);
    var uuid = ("c" + Math.random()).replace(/0\./, "");
    classCache[uuid] = clazz;
    clazz.discernID = uuid;
    return clazz;
  },
  findDOMNode: function(fiber) {
    if (fiber == null) {
      return null;
    }
    if (fiber.type + "" === fiber.type) {
      return fiber;
    }
    if (!fiber.render) {
      throw "findDOMNode:invalid type";
    }
    return findHostInstance(fiber);
  },
  //fiber底层API
  version: "VERSION",
  render: render,
  hydrate: render,
  template,
  createPage,
  //  unstable_batchedUpdates: DOMRenderer.batchedUpdates,
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
