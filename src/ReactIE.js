import { createElement } from "./createElement";
import { cloneElement } from "./cloneElement";

import { PureComponent } from "./PureComponent";
import { Component } from "./Component";
import { Children } from "./Children";
import { win as window } from "./browser";

import { options } from "./util";
import { createClass } from "./createClass";

import { PropTypes } from "./PropTypes";

import {
  render,
  findDOMNode,
  unstable_renderSubtreeIntoContainer,
  unmountComponentAtNode,
  isValidElement
} from "./diff";
import "./ieEvent";

var React = {
  version: "VERSION",
  PropTypes,
  Children, //为了react-redux
  render,
  findDOMNode,
  options,
  unstable_renderSubtreeIntoContainer,
  unmountComponentAtNode,
  isValidElement,
  createClass,
  createElement,
  cloneElement,
  PureComponent,
  Component,
  createFactory(type) {
    console.warn("createFactory将被废弃"); // eslint-disable-line
    var factory = createElement.bind(null, type);
    factory.type = type;
    return factory;
  }
};

window.React = window.ReactDOM = React;

export default React;
