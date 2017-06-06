import {
    extend
} from './util'
import {
    CurrentOwner
} from './CurrentOwner'

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
        isEmptyProps = true
    if (configs) {
        // eslint-disable-next-line
        for (let i in configs) {
            var val = configs[i]
            switch (i) {
                case 'key':
                    key = val
                    break
                case 'ref':
                    ref = val
                    break
                case 'children':
                    pChildren = val
                    break
                default:
                    isEmptyProps = false
                    props[i] = val
            }
        }
    }
    for (let i = 2, n = arguments.length; i < n; i++) {
        stack.push(arguments[i])
    }

    if (!stack.length && pChildren && pChildren.length) {
        stack.push(pChildren)
    }
    var children = flattenChildren(stack)

    if (typeof type === 'function') {
        vtype = type.prototype && type.prototype.render ?
            2 :
            4
        if (children.length)
            props.children = children
    } else {
        props.children = children
    }

    return new Vnode(type, props, key, ref, vtype, CurrentOwner.cur, !isEmptyProps)
}

function flattenChildren(stack) {
    var lastText, child, children = EMPTY_CHILDREN
    while (stack.length) {
        //比较巧妙地判定是否为子数组
        if ((child = stack.pop()) && child.pop !== undefined) {
            for (let i = 0; i < child.length; i++) {
                stack.push(child[i])
            }
        } else {
            // eslint-disable-next-line
            if (child === null || child === void 666 || child === false || child === true) {
                continue
            }
            var childType = typeof child
            if (childType !== 'object') {
                if (lastText) {
                    lastText.text = child + lastText.text
                    continue
                }
                child = child + ''
                childType = 'string'
            }

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
    return children
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