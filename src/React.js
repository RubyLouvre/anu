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
    render
} from './diff'

var React = {
    Children, //为了react-redux
    render,
    options,
    version: "VERSION",
    createElement,
    cloneElement,
    PureComponent,
    Component
}

window.ReactDOM = React

export default React
