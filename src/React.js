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
    var hostParent = {
        _hostNode: container
    }
    //如果存在后端渲染的对象（打包进去），那么在ReactDOM.render这个方法里，它就会判定容器的第一个孩子是否元素节点
    //并且它有data-reactroot与data-react-checksum，有就根据数据生成字符串，得到比较数
    var rootVnode = diff(vnode, container.oldVnode || {
      
    }, hostParent, context)
    if(rootVnode.setAttribute){
       rootVnode.setAttribute('data-reactroot','')
    }
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