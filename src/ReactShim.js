import { Component } from "./Component";
import { options } from "./util";
import { Children } from "./Children";
import * as eventSystem from "./event";
import { win as window } from "./browser";
import { createElement } from "./createElement";
import { cloneElement } from "./cloneElement";
import { PureComponent } from "./PureComponent";

import { render, findDOMNode } from "./diff";
import "./ieEvent";

var React = {
  version: "VERSION",
  Children, //支持react-redux
  render,
  findDOMNode,
  options,
  createElement,
  cloneElement,
  PureComponent,
  Component
};

window.React = window.ReactDOM = React;

export default React;
