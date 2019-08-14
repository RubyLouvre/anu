import { Children } from 'react-core/Children';
import { PropTypes } from 'react-core/PropTypes';
import { Component } from 'react-core/Component';
import { PureComponent } from 'react-core/PureComponent';
import { createRef, forwardRef } from 'react-core/createRef';
import { createPortal } from 'react-core/createPortal';
import {
    createElement,
    cloneElement,
    isValidElement,
    createFactory
} from 'react-core/createElement';

import { createContext } from 'react-core/createContext';

import { Fragment, getWindow, miniCreateClass, noop } from 'react-core/util';


//import { dispatchEvent, webview } from './eventSystem';
import { DOMRenderer} from '../dom/DOMRenderer';

import {registerAppRender} from './registerApp.all';
// import { toStyle } from './toStyle';
import { 
    _getApp , 
    getCurrentPage, 
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
import { findDOMNode } from '../dom/findDOMNode';
let { render } = DOMRenderer;

let __currentPages = [];
const MAX_PAGE_STACK_NUM = 10;

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
    createPortal,
    createContext,
    createElement,
    createFactory,
    PureComponent,
    isValidElement,

    toClass: miniCreateClass,
    
    registerComponent,
    getCurrentPage: function() {
        return __currentPages[__currentPages.length - 1];
    },
    getCurrentPages: function() {
        return __currentPages;
    },
    getApp: function() {
        return this.__app;
    },
    // registerPage,
    registerApp: function(app){
        this.__app = app;
    },
    registerAppRender,
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
    forwardRef,
    cloneElement,
    appType: 'h5',
    __app: {},
    __pages: {},
    __isTab: function(pathname) {
        if (this.__app.constructor.config.tabBar 
            && this.__app.constructor.config.tabBar.list 
            && this.__app.constructor.config.tabBar.list.some(
                item => item.pagePath.replace(/^\.\//, '') === pathname.replace(/^\//, '')
            )
        ) return true;
        return false;
    }
});

function router({url, success, fail, complete}) {
    const [path, query] = getQuery(url);
    const appInstance = React.__app;
    const appConfig = appInstance.constructor.config;
    if (appConfig.pages.indexOf(path) === -1){
        throw "没有注册该页面: "+ path;
    }
    if (__currentPages.length >= MAX_PAGE_STACK_NUM) __currentPages.shift();
    const pageClass = React.__pages[path];
    __currentPages.forEach((page, index, self) => {
        self[index] = React.cloneElement(self[index], {
            show: false
        });
    });
    const pageInstance = React.createElement(pageClass, {
        isTabPage: React.__isTab(path),
        path,
        query,
        url,
        app: React.__app,
        show: true,
        needBackButton: __currentPages.length > 0 ? true : false
    });
    __currentPages.push(pageInstance);
    appInstance.setState({
        path,
        query, 
        success, 
        fail, 
        complete,
        showBackAnimation: false
    });
}
const titleBarColorMap = {
    'backgroundColor': 'navigationBarBackgroundColor',
    'frontColor': 'navigationBarTextStyle'
};
const titleBarTitleMap = {
    'title': 'navigationBarTitleText'
};

const prefix = '/web';

let apiContainer = {
    redirectTo: function(options) {
        if (__currentPages.length > 0) {
            __currentPages.pop();
        }
        router(options);
        history.replaceState({url: options.url}, null, prefix + options.url);
    },
    navigateTo: function(options) {
        router(options);
        history.pushState({url: options.url}, null, prefix + options.url);
    },
    navigateBack: function(options = {}) {
        let { delta = 1, success, fail, complete } = options;
        __currentPages.slice(0, -delta).forEach(page => {
            const url = page.props.url;
            history.pushState({url: url}, null, prefix + url);
        });
        const appInstance = React.__app;
        appInstance.setState({
            showBackAnimation: true
        });
        setTimeout(() => {
            while (delta && __currentPages.length) {
                __currentPages.pop();
                delta--;
            }
            const { path, query } = __currentPages[__currentPages.length - 1].props;
            React.api.redirectTo({url: path + parseObj2Query(query), success, fail, complete});
        }, 300);
    },
    switchTab: function({url, success, fail, complete}) {
        var [path, query] = getQuery(url);
        var config = React.__app.constructor.config;
        if (config && config.tabBar && config.tabBar.list) {
            if (config.tabBar.list.length < 2 || config.tabBar.list.length > 5) {
                console.warn('tabBar数量非法，必须大于2且小于5个');
                return;
            }
            if (config.tabBar.list.every(item => item.pagePath !== path.replace(/^\//, ''))) {
                console.warn(`${path}未在tabBar.list中定义!`);
                return;
            }
            __currentPages = [];
            this.navigateTo.call(this, {url, query, success, fail, complete});
        }
    },
    reLaunch: function({ url, success, fail, complete }) {
        __currentPages = [];
        this.navigateTo.call(this, { url, success, fail, complete });
    },
    setNavigationBarColor: function(options) {
        const processedOptions = Object.keys(options).reduce(function(accr, curr) {
            let key = titleBarColorMap[curr];
            return Object.assign({}, accr, { [key || curr]: options[curr] });
        }, {}) ;
        const currentPage = __currentPages.pop();
        __currentPages.push(cloneElement(currentPage, {
            config: processedOptions
        }));
        var appInstance = React.__app;
        appInstance.setState({});
    },
    setNavigationBarTitle: function(options) {
        const processedOptions = Object.keys(options).reduce(function(accr, curr) {
            let key = titleBarTitleMap[curr];
            return Object.assign({}, accr, { [key || curr]: options[curr] });
        }, {}) ;
        const currentPage = __currentPages.pop();
        __currentPages.push(cloneElement(currentPage, {
            config: processedOptions
        }));
        var appInstance = React.__app;
        appInstance.setState({});
    },
    stopPullDownRefresh: function() {
        const pageInstance = React.getCurrentPages().pop();
        React.getCurrentPages().push(cloneElement(pageInstance, {
            stopPullDownRefresh: true
        }));
        const appInstance = React.__app;
        appInstance.setState({});
    },
    createModal: function(instance) {
        return createPortal(instance, document.getElementsByClassName('__internal__Modal__')[0]);
    }
};
function getQuery(url) {
    var [path, query] = url.split('?');
    query = parseQueryStr2Obj(query);
    return [path, query];
}

function parseQueryStr2Obj(query) {
    if (typeof query === 'undefined') {
        return {};
    }
    return query.split('&').reduce(function(accr, curr) {
        if (curr === '') {
            return accr;
        }
        var temp = curr.split('=');
        accr[temp[0]] = temp[1];
        return accr;
    }, {});
}

function parseObj2Query(obj) {
    const keys = Object.keys(obj);
    return (keys.length ? '?' : '') + keys.map(key => `${key}=${obj[key]}`).join('&');
}

registerAPIs(React, apiContainer, more);
export default React;
