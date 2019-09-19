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

import { dispatchEvent } from "./eventSystem.quick";

//快应用的API注入
import { facade, more } from "./apiForQuick/index";
import { registerAPIsQuick } from "./registerAPIs";
//快应用的渲染层
import { Renderer } from "./render.all";

import { toStyle } from "./toStyle.quick";
import { _getApp, getCurrentPage, useComponent } from "./utils";
import { registerApp } from "./registerApp.quick";
import { getCurrentPages } from "./getCurrentPages.quick";
import { registerComponent } from "./registerComponent.quick";
import { registerPage } from "./registerPage.quick";
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

    Fragment,
    PropTypes,
    // Children,
    Component,
    // createPortal,
    createElement,
    createFactory,
    // cloneElement,
    memo,
    PureComponent,
    isValidElement,
    createContext,
    toClass: miniCreateClass,
    registerComponent,
    getCurrentPage,
    getCurrentPages: getCurrentPages,
    getApp: _getApp,
    registerPage,
    toStyle,
    useState,
    useReducer,
    useCallback,
    useMemo,
    useEffect,
    useContext,
    useComponent,
    useRef,
    appType: "quick",
    registerApp
});

if (typeof global !== "undefined") {
    var ref = Object.getPrototypeOf(global) || global;
    ref.ReactQuick = React;
}
registerAPIsQuick(React, facade, more);

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
