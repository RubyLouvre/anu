import { Component, toDOM } from './Component'
import { PureComponent } from './PureComponent'
import { extend } from './util'

var React = {
    render,
    createElement,
    PureComponent,
    Component
}

/**
 * 创建虚拟DOM
 * 
 * @param {string} type 
 * @param {object} props 
 * @param {array} children 
 * @returns 
 */
function createElement(type, configs = {}, children) {
    var props = {}
    extend(props, configs)
    var c = [].slice.call(arguments, 2)
    if (!c.length && props.children) {
        c = props.children
    }
    c = flatChildren(c)
    delete c.merge
    props.children = Object.freeze(c)
    Object.freeze(props)
    return {
        type: type,
        props: props
    }
}
/**
 * 遍平化children，并合并相邻的简单数据类型
 * 
 * @param {array} children 
 * @param {any} [ret=[]] 
 * @returns 
 */

function flatChildren(children, ret) {
    ret = ret || []
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
                ret.unshift(el.type ? el : { type: '#text', text: String(el) })
                ret.merge = true
            }
        } else if (Array.isArray(el)) {
            flatChildren(el, ret)
        } else {
            ret.unshift(el)
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