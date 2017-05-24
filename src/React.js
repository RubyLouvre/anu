import {createElement} from './createElement'

import {PureComponent} from './PureComponent'
import {Component} from './Component'
import {Children} from './compat'
//import {transaction} from './transaction'
import {win as window} from './browser'

import {getNodes,options} from './util'

import {diff} from './diff'

var React = {
    Children, //为了react-redux
    render,
    options,
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
    var context = {},
        prevVnode = container._component,
        hostParent = {
            _hostNode: container
        }
    if (!prevVnode) {

        var nodes = getNodes(container)
        for (var i = 0, el; el = nodes[i++];) {
            if (el.getAttribute && el.getAttribute('data-reactroot') !== null) {
                hostNode = el
                vnode._prevCached = el //进入节点对齐模块
            } else {
                el
                    .parentNode
                    .removeChild(el)
            }
        }
        prevVnode = {}
    }
    // 如果存在后端渲染的对象（打包进去），那么在ReactDOM.render这个方法里，它就会判定容器的第一个孩子是否元素节点
    // 并且它有data-reactroot与data-react-checksum，有就根据数据生成字符串，得到比较数
    var rootNode = diff(vnode, prevVnode, hostParent, context)
    if (rootNode.setAttribute) {
        rootNode.setAttribute('data-reactroot', '')
    }
  
    var instance = vnode._instance
    container._component = vnode
    delete vnode._prevCached
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