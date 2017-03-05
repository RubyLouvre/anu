import { cloneElement, createElement, createFactory, isValidElement } from './element/index'
import { createClass, Component, PureComponent } from './component/index'
import render from './render'




export default {
    cloneElement,
    createElement,
    h: createElement,

    createFactory,
    isValidElement,

    createClass,
    Component,
    PureComponent,

    render
}