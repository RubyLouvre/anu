import {
    extend
} from './util'
import {
    CurrentOwner
} from './CurrentOwner'
const shallowEqualHack = Object.freeze([]) //用于绕过shallowEqual
const stack = [];
const EMPTY_CHILDREN = [];
/**
 * 创建虚拟DOM
 *
 * @param {string} type
 * @param {object} props
 * @param {array} ...children
 * @returns
 */

export function createElement(type, configs) {
    var props = {},
        key = null,
        ref = null,
        pChildren = null, //位于props中的children
        vtype = 1,
        typeType = typeof type,

        isEmptyProps = true
    if (configs) {
        for (var i in configs) {
            var val = configs[i]
            if (i === 'key') {
                key = val
            } else if (i === 'ref') {
                ref = val
            } else if (i === 'children') {
                pChildren = val
            } else {
                isEmptyProps = false
                props[i] = val
            }
        }
    }
    if (typeType === 'function') {
        vtype = type.prototype && type.prototype.render ?
            2 :
            4
    }

    for (var i = 2, n = arguments.length; i < n; i++) {
        stack.push(arguments[i])
    }

    if (!stack.length && pChildren && pChildren.length) {
        stack.push(pChildren)
    }

    var lastText, child, text, i, children = EMPTY_CHILDREN
    while (stack.length) {
        //比较巧妙地判定是否为子数组
        if ((child = stack.pop()) && child.pop !== undefined) {
            for (i = 0; i < child.length; i++) {
                stack.push(child[i])
            }
        } else {
            if (child === null || child === void 666 || child === false || child === true) {
                continue
            }
            var childType = typeof child
            if (childType !== 'object') {
                text = true
                if (childType === 'number')
                    child = child + ''
            } else {
                text = child.type === '#text'
            }

            if (text && lastText) {
                lastText.text = child + lastText.text
            } else {
                if (childType === 'string') {
                    child = {
                        type: '#text',
                        text: child
                    }
                    lastText = child
                } else {
                    lastText = null
                }
                if (children === EMPTY_CHILDREN) {
                    children = [child];
                } else {
                    children.unshift(child);
                }
            }
        }
    }
    if (children !== EMPTY_CHILDREN) {
        props.children = children
    } else if (vtype === 1) {
        props.children = shallowEqualHack
    }

    /*
    if (c.length) {
        c = flatChildren(c)
        delete c.merge //注意这里的顺序
        //  Object.freeze(c) //超紴影响性能
        props.children = c
    } else if (vtype === 1) {
        props.children = shallowEqualHack
    }

*/


    //  Object.freeze(props) //超紴影响性能
    return new Vnode(type, props, key, ref, vtype, CurrentOwner.cur, !isEmptyProps)
}
//fix 0.14对此方法的改动，之前refs里面保存的是虚拟DOM
function getDOMNode() {
    return this
}

function Vnode(type, props, key, ref, vtype, owner, checkProps) {
    this.type = type
    this.props = props
    this.vtype = vtype
    this.checkProps = checkProps
    if (key) {
        this.key = key
    }
    if (owner) {
        this._owner = owner
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
        if (el === undefined || el === null || el === false || el === true) {
            continue
        }
        var type = typeof el

        if (/number|string/.test(type) || el.type === '#text') {
            if (el === '' || el.text == '') {
                continue
            }
            if (ret.merge) {
                ret[0].text = (el.type ?
                    el.text :
                    el) + ret[0].text
            } else {
                ret.unshift(el.type ?
                    el : {
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