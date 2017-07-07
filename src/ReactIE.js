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
  isValidElement,
  createClass,
  createElement,
  cloneElement,
  PureComponent,
  Component
};

window.ReactDOM = React;

export default React;
