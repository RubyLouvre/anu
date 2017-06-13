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
} from './compat'
import {
    win as window
} from './browser'

import {
    options
} from './util'

import {
    render, findDOMNode
} from './diff'
import './ieEvent'


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
    isValidElement:function(el){
        return el && el.$$typeof === 1
    },
    version: "VERSION",
    createElement,
    cloneElement,
    PureComponent,
    Component
}

window.ReactDOM = React

export default React
