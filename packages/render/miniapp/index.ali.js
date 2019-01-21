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

import { injectAPIs } from './api';
import { aliApis } from './api.ali';

import { dispatchEvent, webview } from './eventSystem';
import { Renderer } from './render.all';
//import { onBeforeRender } from './onBeforeRender.ali';
//Renderer.onBeforeRender = onBeforeRender;
import { toStyle } from './toStyle';
import {
    toRenderProps,
    _getApp,
    getCurrentPage,
    _getCurrentPages,
    useComponent
} from './utils';

import { registerComponent } from './registerComponent.ali';
import { registerPage } from './registerPage.wx';

let { render } = Renderer;

let React = (getWindow().React = {
    //平台相关API
    eventSystem: {
        dispatchEvent
    },

    findDOMNode: function() {
        console.log("小程序不支持findDOMNode"); /* eslint-disable-line */
    },
    //fiber底层API
    version: 'VERSION',
    render: render,
    hydrate: render,
    webview,
    Fragment,
    PropTypes,
    Children,
    Component,
    createPortal,
    createElement,
    createFactory,
    createContext,
    cloneElement,
    PureComponent,
    isValidElement,

    toClass: miniCreateClass,
    toRenderProps,
    useComponent,
    getCurrentPage,
    getCurrentPages: _getCurrentPages,
    getApp: _getApp,
    registerComponent,
    registerPage,
    toStyle,
    appType: 'ali'
});
let apiContainer = {};
if (typeof my != 'undefined') {
    apiContainer = my; //eslint-disable-line
}
injectAPIs(React, apiContainer, aliApis);

export default React;
export { Children, createElement, Component };
