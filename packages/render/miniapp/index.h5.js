import { Children } from 'react-core/Children';
import { PropTypes } from 'react-core/PropTypes';
import { Component } from 'react-core/Component';
import { PureComponent } from 'react-core/PureComponent';
import {
    createElement,
    isValidElement,
    createFactory
} from 'react-core/createElement';
import { createContext } from 'react-core/createContext';

import { Fragment, getWindow, miniCreateClass } from 'react-core/util';


//import { dispatchEvent, webview } from './eventSystem';
import { DOMRenderer} from '../dom/DOMRenderer';


// import { toStyle } from './toStyle';
import { 
    _getApp , 
    getCurrentPage, 
    _getCurrentPages, 
    useComponent } from './utils';
//小程序的API注入
import { registerAPIs } from './registerAPIs';
import { more } from './apiForH5/index';

import { registerComponent } from './registerComponent.bu';
import { registerPage } from './registerPage.wx';
import { 
    useState,
    useReducer, 
    useCallback,
    useMemo,
    useEffect, 
    useContext } from 'react-core/hooks';

let { render, findDOMNode } = DOMRenderer;

let React = (getWindow().React = {
    //平台相关API
  //  eventSystem: {
  //      dispatchEvent
  //  },

    findDOMNode,
    //fiber底层API
    version: 'VERSION',
    render: render,
    hydrate: render,
  //  webview,
    Fragment,
    PropTypes,
    // Children,
    Component,
    createPortal,
    createContext,
    createElement,
    createFactory,
    cloneElement,
    PureComponent,
    isValidElement,

    toClass: miniCreateClass,
    
    registerComponent,
    getCurrentPage,
    getCurrentPages: _getCurrentPages,
    getApp: _getApp,
    registerPage,
    registerApp:function(){
        this.api.__app = app;
    },
    toStyle,
    useState,
    useReducer, 
    useCallback,
    useMemo,
    useEffect, 
    useContext,
    useComponent,
    appType: 'h5'
});
let apiContainer = {
    __app: {},
    __pages: {},
};

registerAPIs(React, apiContainer, more);

export default React;
export { Children, createElement, Component };
