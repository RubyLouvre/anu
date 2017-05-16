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
    diff
} from './diff'


var React = {
    Children, //为了react-redux
    render,
    createElement,
    PureComponent,
    Component
}

/**
 *
 * @param {any} vnode
 * @param {any} container
 */
function render(vnode, container, cb) {
    let context = {}
    if (!container.oldVnode) {
        while (container.firstChild) {
            container.removeChild(container.firstChild)
        }
    }

    var rootVnode = diff(vnode, container.oldVnode || {}, {
        _hostNode: container
    }, context)

    container.oldVnode = vnode
    var instance = vnode._instance
    if (instance) { //组件返回组件实例，而普通虚拟DOM 返回元素节点
        while (instance.parentInstance) {
            instance = instance.parentInstance
        }
        return instance

    } else {
        return rootVnode
    }

}

window.ReactDOM = React

export default React