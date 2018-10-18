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
import { Renderer } from './wxrender';
import { toStyle } from './toStyle';
import { useComponent, registeredComponents } from './registerComponent';

import { registerPage, applyAppStore } from './registerPage';
import { updateMiniApp, toRenderProps } from './utils';

let win = getWindow();
let React;

let { render } = Renderer;

export function registerComponent(type, name) {
    registeredComponents[name] = type;
    var reactInstances = (type.reactInstances = []);
    var wxInstances = (type.wxInstances = []);
    return {
        data: {
            props: {},
            state: {},
            context: {},
        },
        lifetimes: {
            created() {
                var instance = reactInstances.shift();
                if (instance) {
                    /* eslint-disable-next-line */
                    console.log('created时为', name, '添加wx');
                    instance.wx = this;
                    this.reactInstance = instance;
                } else {
                    /* eslint-disable-next-line */
                    console.log('created时为', name, '没有对应react实例');
                    wxInstances.push(this);
                }
            },
            attached() {
                if (this.reactInstance) {
                    updateMiniApp(this.reactInstance);
                    /* eslint-disable-next-line */
                    console.log('attached时更新', name);
                } else {
                    /* eslint-disable-next-line */
                    console.log('attached时无法更新', name);
                }
            },
            detached() {
                this.reactInstance = null;
            },
        },
        methods: {
            dispatchEvent: eventSystem.dispatchEvent,
        },
    };
    
}

React = win.React =  {
    //平台相关API
    eventSystem,

    findDOMNode: function() {
        console.log('小程序不支持findDOMNode'); /* eslint-disable-line */
    },
    //fiber底层API
    version: 'VERSION',
    render: render,
    hydrate: render,

    Fragment,
    PropTypes,
    Children,
    createPortal,
    Component,
    createElement,
    cloneElement,
    PureComponent,
    isValidElement,
    createFactory,
    toClass: function() {
        //保存所有class到classCache中，方便在事件回调中找到对应实例
        return  miniCreateClass.apply(null, arguments);
    },
    applyAppStore,
    toRenderProps,
    useComponent,
    registerComponent,
    registerPage,
    toStyle,
    appType: 'wx'
};
var apiContainer = {};
if (typeof wx != 'undefined'){
    apiContainer = wx;
} 
injectAPIs(React, apiContainer);
export default React;
export {
    Children,
    createElement,
    Component
};