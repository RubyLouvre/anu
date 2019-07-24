import { Children } from 'react-core/Children';
import { PropTypes } from 'react-core/PropTypes';
import { Component } from 'react-core/Component';
import { PureComponent } from 'react-core/PureComponent';
import { createRef, forwardRef } from 'react-core/createRef';
import { createPortal } from 'react-core/createPortal';
import { createContext } from 'react-core/createContext';
import {
    createElement,
    cloneElement,
    isValidElement,
    createFactory
} from 'react-core/createElement';
import { Fragment, getWindow } from 'react-core/util';

import { findDOMNode } from './findDOMNode';
import { DOMRenderer } from './DOMRenderer';
import { useState, useReducer, useEffect, useLayoutEffect, useCallback, useMemo, useRef, useContext, useImperativeHandle } from 'react-core/hooks';
import { lazy } from 'react-fiber/lazy';
import { Suspense } from 'react-fiber/Suspense';
import './compat';
let win = getWindow();
let prevReact = win.React;
let React;
if (prevReact && prevReact.eventSystem) {
    React = prevReact; //解决引入多个
} else {
    let {
        render,
        eventSystem,
        unstable_renderSubtreeIntoContainer,
        unmountComponentAtNode
    } = DOMRenderer;

    React = win.React = win.ReactDOM = {
        //平台相关API
        eventSystem,
        findDOMNode,
        unmountComponentAtNode,
        unstable_renderSubtreeIntoContainer,
        //fiber底层API
        version: 'VERSION',
        render: render,
        hydrate: render,
        unstable_batchedUpdates: DOMRenderer.batchedUpdates,
        Fragment,
        PropTypes,
        Children,
        createPortal,
        createContext,
        Component,
        lazy,
        Suspense,
        createRef,
        forwardRef,
        useState, 
        useReducer, 
        useEffect, 
        useLayoutEffect,
        useContext,
        useCallback, 
        useMemo, 
        useRef,
        useImperativeHandle,
        createElement,
        cloneElement,
        PureComponent,
        isValidElement,
        createFactory
    };
}
export default React;
