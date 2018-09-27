import { Children } from 'react-core/Children';
import { PropTypes } from 'react-core/PropTypes';
import { Component } from 'react-core/Component';
import { PureComponent } from 'react-core/PureComponent';
import { createPortal } from 'react-core/createPortal';
import { createContext } from 'react-core/createContext';
import {
    createElement,
    cloneElement,
    isValidElement,
    createFactory
} from 'react-core/createElement';
import { Fragment, getWindow, miniCreateClass } from 'react-core/util';
import { classCached,currentPage } from './utils';
import { injectAPIs } from './api';
import { eventSystem } from './eventSystem';
import { Renderer } from './wxrender';

import { toComponent } from './toComponent';
import { toStyle } from './toStyle';
import { toRenderProps } from './toRenderProps';
import { toPage, applyAppStore } from './toPage';
import { buApis } from './buApis';


let win = getWindow();
let React;

let { render } = Renderer;

React = win.React =  {
    //平台相关API
    eventSystem,

    findDOMNode: function() {
        console.log('小程序不支持findDOMNode');
    },
    //fiber底层API
    version: 'VERSION',
    render: render,
    hydrate: render,

    Fragment,
    PropTypes,
    Children,
    createPortal,
    createContext,
    Component,
    createElement,
    cloneElement,
    PureComponent,
    isValidElement,
    createFactory,
    currentPage,
    toClass: function() {
        //保存所有class到classCache中，方便在事件回调中找到对应实例
        var clazz = miniCreateClass.apply(null, arguments);
        var uuid = clazz.prototype.classUid;
        classCached[uuid] = clazz;
        return clazz;
    },
    applyAppStore,
    toRenderProps,
    toComponent,
    toPage,
    toStyle,
    appType: 'bu'
};
var apiContainer = {};
if (typeof wx != 'undefined'){
    apiContainer = wx;
} else if (typeof my !== 'undefined'){
    apiContainer = my;
} else if (typeof swan !== 'undefined'){
    apiContainer = swan;
}
injectAPIs(React, apiContainer, buApis);
export default React;
export {
    Children,
    createElement,
    Component
};