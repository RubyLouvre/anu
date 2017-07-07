import { createElement } from "./createElement";
import { cloneElement } from "./cloneElement";

import { PureComponent } from "./PureComponent";
import { Component } from "./Component";
import { win as window } from "./browser";
import { Children } from "./Children";

import { options } from "./util";

import { render } from "./diff";
import "./ieEvent";

var React = {
  version: "VERSION",
  Children, //为了react-redux
  render,
  findDOMNode,
  options,
  createElement,
  cloneElement,
  PureComponent,
  Component
};

window.ReactDOM = React;

export default React;
