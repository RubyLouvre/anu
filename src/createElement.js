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
        var key = null,
            ref = null,
            props = {},
            vtype = 1,
            typeType = typeof type
        if (configs) {
            for (var i in configs) {
                var val = configs[i]
                if (i === 'key') {
                    key = val
                } else if (i === 'ref') {
                    ref = val
                } else {
                    props[i] = val
                }
            }
        }

        var c = []
        for (var i = 2, n = arguments.length; i < n; i++) {
            c.push(arguments[i])
        }
        var useEmpty = true
        if (!c.length) {
            if (props.children && props.children.length) {
                c = props.children
                useEmpty = false
            }
        } else {
            useEmpty = false
        }
        if (typeType === 'function') {
            vtype = type.prototype && type.prototype.render
                ? 2
                : 4
        }

        if (useEmpty) {
            c = shallowEqualHack
            if (vtype === 1) {
                props.children = c
            }
        } else {
            c = flatChildren(c)
            delete c.merge //注意这里的顺序
            //  Object.freeze(c) //超紴影响性能
            props.children = c
        }

        //  Object.freeze(props) //超紴影响性能
        return new Vnode(type, props, key, ref, vtype, CurrentOwner.cur)
    }
    //fix 0.14对此方法的改动，之前refs里面保存的是虚拟DOM
    function getDOMNode() {
        return this
    }

    function Vnode(type, props, key, ref, vtype, owner) {
        this.type = type
        this.props = props
        this.vtype = vtype
        if (key) {
            this.key = key
        }
        if (owner) {
            this._owner = owner
        }
        if (vtype === 1) {
            var ns = getNs(type)
            if (ns) {
                this.ns = ns
            }
        }
        var refType = typeof ref
        if (refType === 'string') {
            this._refKey = ref
        } else if (refType === 'function') {
            this.__ref = ref
        } else {
            this.__ref = null
        }

        /*
    this._hostNode = null
    this._instance = null
    this._hostParent = null
  */

    }

    Vnode.prototype = {
        getDOMNode: function () {
            return this._hostNode || null
        },
        __ref: function (dom) {
            var instance = this._owner
            if (dom) {
                dom.getDOMNode = getDOMNode
            }
            if (instance) {
                instance.refs[this._refKey] = dom
            }
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
                            _deep: deep
                        })
                    ret.merge = true
                }
            } else if (Array.isArray(el)) {
                flatChildren(el, ret, deep + 1)
            } else {
                ret.unshift(el)
                el._deep = deep
                ret.merge = false
            }

        }
        return ret
    }