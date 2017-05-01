import {createElement} from './createElement'

import {PureComponent} from './PureComponent'
import {Component} from './Component'

//import {transaction} from './transaction'
import {win as window} from './browser'


import {diff} from './diff'


var React = {
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
    container.textContent = ''
    while (container.firstChild) {
        container.removeChild(container.firstChild)
    }
    let context = {}

   // transaction.isInTransation = true

    var rootElement = diff(vnode, {}, {
        dom: container
    }, context)

  //  transaction.isInTransation = false
    
   //组件返回组件实例，而普通虚拟DOM 返回元素节点
    return vnode.instance || rootElement
}

window.ReactDOM = React

export default React