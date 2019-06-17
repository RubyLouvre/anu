import { Children } from 'react-core/Children';
import { PropTypes } from 'react-core/PropTypes';
import { Component } from 'react-core/Component';
import { PureComponent } from 'react-core/PureComponent';
import { createRef, forwardRef } from 'react-core/createRef';
import {
    createElement,
    cloneElement,
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
// import { registerPage } from './registerPage.wx';
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
    Children,
    Component,
    // createPortal,
    createContext,
    createElement,
    createFactory,
    // cloneElement,
    PureComponent,
    isValidElement,

    toClass: miniCreateClass,
    
    registerComponent,
    getCurrentPage,
    getCurrentPages: _getCurrentPages,
    getApp: function() {
        return this.__app;
    },
    // registerPage,
    registerApp: function(app){
        this.__app = app;
    },
    registerPage: function(PageClass, path) {
        this.__pages[path] = PageClass;
        return PageClass;
    },
    // toStyle,
    useState,
    useReducer, 
    useCallback,
    useMemo,
    useEffect, 
    useContext,
    useComponent,
    createRef,
    cloneElement,
    appType: 'h5',
    __app: {},
    __pages: {},
});
let apiContainer = {
    redirectTo: function({url, success, fail, complete}) {
        var [path, query] = getQuery(url);
        var appInstance = React.__app;
        var appConfig = appInstance.constructor.config;
        if (appConfig.pages.indexOf(path) === -1){
            console.log(appConfig.pages, path);
            throw "没有注册该页面: "+ path;
        }
        appInstance.setState({
            path,
            query, 
            success, 
            fail, 
            complete
        });
    },
    navigateTo: function(...args) {
        this.redirectTo.call(this, ...args);
    }
};
function getQuery(url) {
    return url.split('?');
}

registerAPIs(React, apiContainer, more);

export default React;
