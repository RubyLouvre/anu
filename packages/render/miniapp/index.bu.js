import { Children } from "react-core/Children";
import { PropTypes } from "react-core/PropTypes";
import { Component } from "react-core/Component";
import { PureComponent } from "react-core/PureComponent";
import {
    createElement,
    isValidElement,
    createFactory
} from "react-core/createElement";
import { createContext } from "react-core/createContext";

import { Fragment, getWindow, miniCreateClass } from "react-core/util";

import { dispatchEvent, webview } from "./eventSystem";
import { Renderer } from "./render.all";

import { toStyle } from "./toStyle";
import {
    _getApp,
    getCurrentPage,
    _getCurrentPages,
    useComponent
} from "./utils";
//小程序的API注入
import { registerAPIs } from "./registerAPIs";
import { more } from "./apiForBaidu/index";

import { registerApp } from "./registerApp.all";
import { registerComponent } from "./registerComponent.bu";
import { registerPage } from "./registerPage.wx";
import {
    useState,
    useReducer,
    useCallback,
    useMemo,
    useEffect,
    useContext,
    useRef
} from "react-core/hooks";
import { memo } from "react-fiber/memo";

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
    version: "VERSION",
    render: render,
    hydrate: render,
    webview,
    Fragment,
    PropTypes,
    // Children,
    Component,
    // createPortal,
    createContext,
    createElement,
    createFactory,
    // cloneElement,
    PureComponent,
    isValidElement,

    toClass: miniCreateClass,

    registerComponent,
    getCurrentPage,
    getCurrentPages: _getCurrentPages,
    getApp: _getApp,
    registerApp,
    registerPage,
    memo,
    toStyle,
    useState,
    useReducer,
    useCallback,
    useMemo,
    useEffect,
    useContext,
    useComponent,
    useRef,
    appType: "bu"
});
let apiContainer = {};
if (typeof swan != "undefined") {
    apiContainer = swan; //eslint-disable-line
}
registerAPIs(React, apiContainer, more);

export default React;
export { Children, createElement, Component, PureComponent,
    memo,
    useState,
    useReducer,
    useCallback,
    useMemo,
    useEffect,
    useContext,
    useComponent,
    useRef 
};
