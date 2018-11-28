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

import { dispatchEvent } from './eventSystemQuick';
import { api } from './api.quick';
import { Renderer, getCurrentPage } from './render.all';
import { onBeforeRender } from './onBeforeRender.quick';
Renderer.onBeforeRender = onBeforeRender;
import { toStyle } from './toStyleQuick';
import { toRenderProps, shareObject, _getApp, _getCurrentPages, useComponent } from './utils';

import { registerComponent } from './registerComponent.quick';
import { registerPage } from './registerPage.quick';



let { render } = Renderer;


let React = getWindow().React = {
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
    getApp: _getApp,
    registerPage,
    shareObject,
    toStyle,
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