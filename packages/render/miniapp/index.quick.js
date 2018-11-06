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

import { eventSystem } from './eventSystemQuick';
import { api } from './api.quick';
import { Renderer, getCurrentPage } from './wxRender';
import { toStyle } from './toStyleQuick';
import { toRenderProps, _getCurrentPages, useComponent } from './utils';

import { registerComponent } from './registerComponentQuick';
import { registerPage, getApp, shareObject } from './registerPageQuick';



let { render } = Renderer;


let React = getWindow().React = {
    //平台相关API
    eventSystem,
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
   
    toClass: miniCreateClass,
    toRenderProps,
    useComponent,
    registerComponent,
    getCurrentPage,
    getCurrentPages: _getCurrentPages,
    registerPage,
    shareObject,
    toStyle,
    getApp,
    appType: 'quick',
    registerApp(demo){
        var app = {};
        for (var i in demo){
            app[i] = demo[i];
        }
        delete app.constructor;//有这属性会报错
        return app;
    },
    api: api
   
};

export default React;
export { Children, createElement, Component };