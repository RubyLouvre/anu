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
import { classCached } from './utils';
import { initNativeApi } from './api';
import { eventSystem } from './eventSystem';
import { Renderer } from './wxrender';

import { toComponent } from './toComponent';
import { toStyle } from './toStyle';
import { toRenderProps } from './toRenderProps';
import { toPage } from './toPage';


let win = getWindow();
let React;

let { render } = Renderer;

React = win.React = win.ReactDOM = {
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

    toClass: function(a, b, c, d) {
        //保存所有class到classCache中，方便在事件回调中找到对应实例
        var clazz = miniCreateClass.apply(null, arguments);
        var uuid = clazz.prototype.classUid;
        classCached[uuid] = clazz;
        return clazz;
    },
    toRenderProps,
    toComponent,
    toPage,
    toStyle
};
initNativeApi(React);
export default React;
