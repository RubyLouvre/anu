
import { Children } from 'react-core/Children';
import { PropTypes } from 'react-core/PropTypes';
import { Component } from 'react-core/Component';
import { PureComponent } from 'react-core/PureComponent';
import { createRef, forwardRef } from 'react-core/createRef';
import { createPortal } from 'react-core/createPortal';
import { createContext } from 'react-core/createContext';
import { createElement,cloneElement, isValidElement, createFactory } from 'react-core/createElement';
import { Fragment, getWindow } from 'react-core/util';

import { NoopRenderer} from './NoopRenderer';

var win = getWindow();
var prevReact = win.ReactNoop;
let ReactNoop;
if (prevReact && prevReact.isReactNoop) {
    ReactNoop = prevReact; //解决引入多个
} else {
    let {render, flush, reset, getRoot, getChildren} = NoopRenderer;
    ReactNoop = win.ReactNoop = { //放出全局的ReactNoop
        //平台相关API
        yield: NoopRenderer.yield,
        flush,
        reset,
        getRoot,
        getChildren,
        isReactNoop: true,
        //ReactFiber API
        version: 'VERSION',
        render,
        Fragment,
        PropTypes,
        Children,
        createPortal,
        createContext,
        Component,
        createRef,
        forwardRef,
        createElement,
        cloneElement,
        PureComponent,
        isValidElement,
        createFactory
    };
}
export default ReactNoop;
