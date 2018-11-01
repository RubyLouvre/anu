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
import { Renderer } from './wxRender';
import { toStyle } from './toStyle';
import { useComponent, registeredComponents } from './registerComponent';

import {
    registerPage,
    applyAppStore,
} from './registerPageAli';
import { toRenderProps, updateMiniApp } from './utils';
import { aliApis } from './aliApis';

let win = getWindow();
let React;

let { render } = Renderer;

export function registerComponent(type, name) {
    registeredComponents[name] = type;
    type.ali = true;
    var reactInstances = type.reactInstances = [];
    type.wxInstances = [];
    return {
        data: {
            props: {},
            state: {},
            context: {}
        },

        didMount() {
            var uid = this.props.instanceUid;
            for (var i = reactInstances.length - 1; i >= 0; i--) {
                var reactInstance = reactInstances[i];
                if (reactInstance.instanceUid === uid) {
                    reactInstance.wx = this;
                    console.log("命中", this);
                    this.reactInstance = reactInstance;
                    updateMiniApp(reactInstance);
                    reactInstances.splice(i, 1);
                    break;
                }
            }
            //支付宝小程序的实例didMount是没有顺序的
            /*
            wxInstances.push(this);
            currentPageComponents[name] = type;
            if (
                currentPageComponents.$$pageIsReady &&
                Object.keys(currentPageComponents).length > 1
            ) {
                setTimeout(updateChildComponents, 40);
            }
            */
        },
        didUnmount() {
            this.reactInstance = null;
        },

        methods: {
            dispatchEvent: eventSystem.dispatchEvent
        }
    };
}

React = win.React = {
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
    createPortal,
    Component,
    createElement,
    cloneElement,
    PureComponent,
    isValidElement,
    createFactory,
    toClass: function() {
        //保存所有class到classCache中，方便在事件回调中找到对应实例
        return miniCreateClass.apply(null, arguments);
    },
    applyAppStore,
    toRenderProps,
    useComponent,
    registerComponent,
    registerPage,
    toStyle,
    appType: 'ali'
};
var apiContainer = {};
if (typeof my != 'undefined') {
    apiContainer = my;
}
injectAPIs(React, apiContainer, aliApis);
export default React;
export { Children, createElement, Component };
