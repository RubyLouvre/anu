import { Children } from 'react-core/Children';
import { PropTypes } from 'react-core/PropTypes';
import { Component } from 'react-core/Component';
import { PureComponent } from 'react-core/PureComponent';
import { createPortal } from 'react-core/createPortal';
import {
    createElement,
    cloneElement,
    isValidElement,
    createFactory
} from 'react-core/createElement';
import { createContext } from 'react-core/createContext';
import { Fragment, getWindow, miniCreateClass } from 'react-core/util';

import { dispatchEvent } from './eventSystem.quick';
import { facade } from './quickApis/index';
import { processApis } from './api';
import { Renderer } from './render.all';
//import { onBeforeRender } from './onBeforeRender.quick';
//Renderer.onBeforeRender = onBeforeRender;
import { toStyle } from './toStyle.quick';
import { toRenderProps, getCurrentPage, _getApp, _getCurrentPages, useComponent } from './utils';
import { onAndSyncApis } from './apiList';
import { registerComponent } from './registerComponent.quick';
import { registerPage } from './registerPage.quick';
let appMethods = {
    onLaunch: 'onCreate',
    onHide: 'onDestory'
};
let { render } = Renderer;
let React = getWindow().React = {
    //平台相关API
    eventSystem: {
        dispatchEvent
    },
    api: {},
    findDOMNode: function() {
        console.log("小程序不支持findDOMNode"); /* eslint-disable-line */
    },
    //fiber底层API
    version: 'VERSION',
    render: render,
    hydrate: render,

    Fragment,
    PropTypes,
    Children,
    Component,
    createPortal,
    createElement,
    createFactory,
    cloneElement,
    PureComponent,
    isValidElement,
    createContext,
    toClass: miniCreateClass,
    toRenderProps,
    useComponent,
    registerComponent,
    getCurrentPage,
    getCurrentPages: _getCurrentPages,
    getApp: _getApp,
    registerPage,
    toStyle,
    appType: 'quick',
    registerApp(demo){
        var app = {};
        for (let name in demo){
            let value = demo[name];
            name = appMethods[name] || name;
            app[name] = value;
        }
        delete app.constructor;//有这属性会报错
        return app;
    }   
};

if (typeof global !== 'undefined'){
    var ref = Object.getPrototypeOf(global) || global;
    ref.ReactQuick = React;
}
onAndSyncApis.request = true;
processApis(React, facade); 
export default React;
export { Children, createElement, Component };