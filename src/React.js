import {
    createElement
} from './createElement'

import {
    PureComponent
} from './PureComponent'
import {
    Component
} from './Component'
import {
    Children
} from './compat'
//import {transaction} from './transaction'
import {
    win as window
} from './browser'

import {
    getNodes,
    options
} from './util'

import {
    render
} from './diff'

var React = {
    Children, //为了react-redux
    render,
    options,
    createElement,
    PureComponent,
    Component
}


window.ReactDOM = React

export default React