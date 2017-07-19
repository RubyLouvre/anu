import { createElement } from "./createElement";
import { cloneElement } from "./cloneElement";

import { PureComponent } from "./PureComponent";
import { Component } from "./Component";
import { Children } from "./Children";
import { win as window } from "./browser";
import * as eventSystem from "./event";
import { createClass } from "./createClass";

import { options } from "./util";
import { PropTypes } from "./PropTypes";

import {
  render,
  findDOMNode,
  unstable_renderSubtreeIntoContainer,
  unmountComponentAtNode,
  isValidElement
} from "./diff";

var React = {
  PropTypes,
  Children, //为了react-redux
  render,
  findDOMNode,
  options,
  unstable_renderSubtreeIntoContainer,
  unmountComponentAtNode,  
  isValidElement,
  createClass,
  version: "VERSION",
  createElement,
  cloneElement,
  PureComponent,
  Component,
  eventSystem,
  createFactory(type) {
    console.warn('createFactory将被废弃')
    var factory = createElement.bind(null, type);
    factory.type = type;
    return factory;
  }
};

window.ReactDOM = React;

export default React;
