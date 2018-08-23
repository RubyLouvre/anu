import { Children } from 'react-core/Children';
import { PropTypes } from 'react-core/PropTypes';
import { Component } from 'react-core/Component';
import { PureComponent } from 'react-core/PureComponent';
import { createRef, forwardRef } from 'react-core/createRef';
import { createPortal } from 'react-core/createPortal';
import { createContext } from 'react-core/createContext';
import {
  createElement,
  cloneElement,
  isValidElement,
  createFactory
} from 'react-core/createElement';
import { Fragment, getWindow, miniCreateClass } from 'react-core/util';
import { createPage } from './createPage';
import { template } from './template';
import { eventSystem } from './eventSystem';
import { initNativeApi } from './api';
import { collectStyle } from './collectStyle';

import { Renderer } from './wxrender';
let win = getWindow();
let React;
//用于保存所有用miniCreateClass创建的类，然后在事件系统中用到
let classCache = eventSystem.classCache;

let { render } = Renderer;

React = win.React = win.ReactDOM = {
  //平台相关API
  eventSystem,
  miniCreateClass: function(a, b, c, d) {
    //保存所有class到classCache中，方便在事件回调中找到对应实例
    var clazz = miniCreateClass.apply(null, arguments);
    var uuid = clazz.prototype.classCode;
    classCache[uuid] = clazz;
    return clazz;
  },
  findDOMNode: function(fiber) {
    console.log('小程序不支持findDOMNode');
  },
  //fiber底层API
  version: 'VERSION',
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
  createFactory,
  collectStyle
};
initNativeApi(React);
export default React;
