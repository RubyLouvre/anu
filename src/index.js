import { cloneElement, createElement, createFactory, isValidElement } from './element/index'
import { createClass, Component } from './component/index'
import render from './render'

var objEmpty = {};
var arrEmpty = [];
var nodeEmpty = createNodeShape(0, '', objEmpty, arrEmpty, null, null, 0, null, void 0);
var funcEmpty = function() {};


export default {
    cloneElement,
    createElement,

    createFactory,
    isValidElement,

    createClass,
    Component,

    render
}