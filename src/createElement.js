import {extend} from './util'
import {getNs} from './browser'
import {CurrentOwner} from './CurrentOwner'

var shallowEqualHack = Object.freeze([]) //用于绕过shallowEqual
/**
 * 创建虚拟DOM
 *
 * @param {string} type
 * @param {object} props
 * @param {array} children
 * @returns
 */
export function createElement(type, configs, children) {
    var props = {}
    var key = null
    configs = configs || {}
    if (configs.key != null) {
        key = configs.key + ''
        delete configs.key
    }

    var ref = configs.ref
    delete configs.ref

    extend(props, configs)
    var c = []
        .slice
        .call(arguments, 2)
    var useEmpty = true
    if (!c.length) {
        if (props.children && props.children.length) {
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
        delete c.merge //注意这里的顺序
        Object.freeze(c)
    }

    props.children = c
    Object.freeze(props)
    return new Vnode(type, props, key, CurrentOwner.cur, ref)
}
//fix 0.14对此方法的改动，之前refs里面保存的是虚拟DOM
function getDOMNode() {
    return this
}

function Vnode(type, props, key, owner, ref) {
    this.type = type
    this.props = props

    if (key) {
        this.key = key
    }
    var ns = getNs(type)
    if (ns) {
        this.ns = ns
    }
    var refType = typeof ref
    if (refType === 'string') {
        var refKey = ref
        this.__ref = function (dom) {
            var instance = this._owner
            if(dom && !dom.getDOMNode){
                dom.getDOMNode = getDOMNode
            }
            if(instance){
                instance.refs[refKey] = dom
            }
        }
    } else if (refType === 'function') {
        this.__ref = ref
    }
    /*
    this._hostNode = null
    this._instance = null
    this._hostParent = null
  */
    if (owner) {
        this._owner = owner
    }
}

Vnode.prototype = {
    getDOMNode: function () {
        return this._hostNode || null
    },
    $$typeof: 1
}
// 如果是组件的虚拟DOM，如果它
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
                ret[0].text = (el.type
                    ? el.text
                    : el) + ret[0].text
            } else {
                ret.unshift(el.type
                    ? el
                    : {
                        type: '#text',
                        text: String(el),
                        deep: deep
                    })
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