import {
    createElement
} from './createElement'
import {
    cloneElement
} from './cloneElement'

import {
    PureComponent
} from './PureComponent'
import {
    Component
} from './Component'
import {
    Children
} from './Children'
import {
    win as window
} from './browser'

import {
    options
} from './util'

import {
    render, findDOMNode, unstable_renderSubtreeIntoContainer, isValidElement
} from './diff'
var check = function(){
	return check
}
check.isRequired = check
var PropTypes = {
    "array": check,
    "bool": check,
    "func": check,
    "number": check,
    "object": check,
    "string": check,
    "any": check,
    "arrayOf": check,
    "element": check,
    "instanceOf": check,
    "node": check,
    "objectOf": check,
    "oneOf": check,
    "oneOfType": check,
    "shape": check
}
var React = {
    PropTypes,
    Children, //为了react-redux
    render,
    findDOMNode,
    options,
    unstable_renderSubtreeIntoContainer,
    isValidElement,
    version: "VERSION",
    createElement,
    cloneElement,
    PureComponent,
    Component
}

window.ReactDOM = React

export default React
