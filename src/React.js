import { Component, toDOM } from './Component'
import { PureComponent } from './PureComponent'
import { extend } from './util'

var React = {
    render,
    createElement,
    PureComponent,
    Component
}
var shallowEqualHack = Object.freeze([]) //用于绕过shallowEqual
    /**
     * 创建虚拟DOM
     * 
     * @param {string} type 
     * @param {object} props 
     * @param {array} children 
     * @returns 
     */
function createElement(type, configs, children) {
    var props = {}
    var key = null
    configs = configs || {}
    if (configs.key != null) {
        key = configs.key + ''
        delete configs.key
    }
    extend(props, configs)
    var c = [].slice.call(arguments, 2)
    var useEmpty = true
    if (!c.length) {
        if (props.children) {
            c = props.children
            useEmpty = false
        }
    } else {
        useEmpty = false
    }
    if (useEmpty) {
        c = shallowEqualHack
    } else {
        c = flatChildren(c)
        Object.freeze(c)
        delete c.merge
    }
    props.children = c
    Object.freeze(props)
    var vnode = {
        type: type,
        props: props
    }
    if (key) {
        vnode.key = key
    }
    return vnode
}
/**
 * 遍平化children，并合并相邻的简单数据类型
 * 
 * @param {array} children 
 * @param {any} [ret=[]] 
 * @returns 
 */

function flatChildren(children, ret, deep) {
    ret = ret || []
    deep = deep || 0
    for (var i = children.length; i--;) { //从后向前添加
        var el = children[i]
        if (el == null) {
            el = ''
        }
        var type = typeof el
        if (el === '' || type === 'boolean') {
            continue
        }
        if (/number|string/.test(type) || el.type === '#text') {
            if (el === '' || el.text == '') {
                continue
            }
            if (ret.merge) {
                ret[0].text = (el.type ? el.text : el) + ret[0].text
            } else {
                ret.unshift(el.type ? el : { type: '#text', text: String(el), deep: deep })
                ret.merge = true
            }
        } else if (Array.isArray(el)) {
            flatChildren(el, ret, deep + 1)
        } else {
            ret.unshift(el)
            el.deep = deep
            ret.merge = false
        }

    }
    return ret
}
/**
 * 
 * @param {any} vnode 
 * @param {any} container 
 */
function render(vnode, container) {
    container.textContent = ''
    while (container.firstChild) {
        container.removeChild(container.firstChild)
    }
    var context = {}
    toDOM(vnode, context, container)
}



window.ReactDOM = React

export default React