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
import { Fragment, getWindow, miniCreateClass } from 'react-core/util';

import { injectAPIs } from './api';
import { eventSystem } from './eventSystem';
import { Renderer, getCurrentPage } from './wxRender';
import { toStyle } from './toStyle';
import { toRenderProps, useComponent } from './utils';

import { registerPage } from './registerPageWx';
import { registerComponent } from './registerComponentWx';


let { render } = Renderer;

let React = getWindow().React =  {
    //平台相关API
    eventSystem,

    findDOMNode: function() {
        console.log('小程序不支持findDOMNode'); /* eslint-disable-line */
    },
    //fiber底层API
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
   
    toClass: miniCreateClass,
    toRenderProps,
    useComponent,
    registerComponent,
    getCurrentPage,
    registerPage,
    toStyle,
    appType: 'wx'
};
let apiContainer = {};
if (typeof wx != 'undefined'){
    apiContainer = wx;
} 
injectAPIs(React, apiContainer);

export default React;
export { Children, createElement, Component };