import {
    getContext,
    getInstances,
    matchInstance,
    midway
} from './util'
import {
    applyComponentHook
} from './lifecycle'
import {
    transaction
} from './transaction'
import {
    toVnode
} from './toVnode'
import {
    diffProps
} from './diffProps'
import {
    document,
    createDOMElement
} from './browser'

import {
    setControlledComponent
} from './ControlledComponent'

/**
 * 渲染组件
 *
 * @param {any} instance
 */
export function updateComponent(instance) {
    var {
        props,
        state,
        context,
        vnode,
        prevProps,
        prevState
    } = instance
    prevState = prevState || state
    instance.props = prevProps
    instance.state = prevState
    var nextProps = props
    var nextState = state
    if (!instance._forceUpdate && applyComponentHook(instance, 4, nextProps, nextState, context) === false) {
        return dom //注意
    }
    applyComponentHook(instance, 5, nextProps, nextState, context)
    instance.props = nextProps
    instance.state = nextState

    var rendered = transaction.renderWithoutSetState(instance, nextProps, context)
    //context只能孩子用，因此不要影响原instance.context

    context = getContext(instance, context)

    var dom = diff(rendered, instance.vnode, vnode._hostParent, context)
    instance.vnode = rendered
    // rendered.dom = dom
    delete instance.prevState //方便下次能更新this.prevState
    instance.prevProps = props // 更新prevProps
    applyComponentHook(instance, 6, nextProps, nextState, context)
    return dom //注意
}
/**
 * call componentWillUnmount
 *
 * @param {any} vnode
 */
function removeComponent(vnode) {
    var instance = vnode.instance

    applyComponentHook(instance, 7) //7

    '_hostParent,_wrapperState,_instance,_owner'.replace(/\w+/g, function (name) {
        delete vnode[name]
    })

    vnode
        .props
        .children
        .forEach(function (el) {
            if (el.props) {
                removeComponent(el)
            }
        })
}

/**
 * 参数不要出现DOM,以便在后端也能运行
 *
 * @param {any} vnode 新的虚拟DOM
 * @param {any} prevVnode 旧的虚拟DOM
 * @param {any} vParentNode 父虚拟DOM
 * @param {any} context
 * @returns
 */
export function diff(vnode, prevVnode, vParentNode, context) { //updateComponent
    var dom = prevVnode.dom
    var parentNode = vParentNode && vParentNode.dom
    var prevProps = prevVnode.props || {}
    var prevChildren = prevProps.children || []
    var Type = vnode.type

    //更新组件
    var isComponent = typeof Type === 'function'
    var instance = prevVnode.instance

    if (instance) {
        instance = isComponent && matchInstance(instance, Type)
        if (instance) { //如果类型相同，使用旧的实例进行 render新的虚拟DOM
            vnode.instance = instance
            instance.context = context //更新context
            var nextProps = vnode.props
            //处理非状态组件
            if (instance.statelessRender) {
                instance.props = nextProps
                instance.prevProps = prevProps
                return updateComponent(instance, context)
            }

            prevProps = instance.prevProps

            instance.props = prevProps
            applyComponentHook(instance, 3, nextProps)
            instance.prevProps = prevProps
            instance.props = nextProps
            return updateComponent(instance, context)
        } else {
            if (prevVnode.type !== Type) {
                removeComponent(prevVnode)
            }
        }
    }
    if (isComponent) {

        vnode._hostParent = vParentNode
        return toDOM(vnode, context, parentNode, prevVnode.dom)
    }
    if (!dom || prevVnode.type !== Type) { //这里只能是element 与#text
        var nextDom = createDOMElement(vnode)
        if (dom) {
            while (dom.firstChild) {
                nextDom.appendChild(dom.firstChild)
            }
        }
        if (parentNode) {
            if (dom) {
                parentNode.replaceChild(nextDom, dom)
            } else {
                parentNode.appendChild(nextDom)
            }
        }
        dom = nextDom
    }
    //必须在diffProps前添加它的dom
    vnode.dom = dom
    if (!('text' in vnode && 'text' in prevVnode)) {
        diffProps(vnode.props || {}, prevProps, vnode, prevVnode)
    }
    if (prevVnode._hasSetInnerHTML) {

        while (dom.firstChild) {
            dom.removeChild(dom.firstChild)
        }
    }
    if (!vnode._hasSetInnerHTML && vnode.props) {
        diffChildren(vnode.props.children, prevChildren, vnode, context)
    }
    var wrapperState = vnode._wrapperState
    if (wrapperState && wrapperState.postUpdate) { //处理select
        wrapperState.postUpdate(vnode)
    }
    return dom
}

/**
 * 获取虚拟DOM对应的顶层组件实例的类型
 *
 * @param {any} vnode
 * @param {any} instance
 * @param {any} pool
 */
function getTopComponentName(vnode, instance) {
    while (instance.parentInstance) {
        instance = instance.parentInstance
    }
    var ctor = instance.statelessRender || instance.constructor
    return (ctor.displayName || ctor.name)
}

/**
 *
 *
 * @param {any} type
 * @param {any} vnode
 * @returns
 */
function computeUUID(type, vnode) {
    if (type === '#text') {
        return type + '/' + vnode.deep + '/' + vnode.text
    }
    return type + '/' + vnode.deep + (vnode.key !== null ?
        '/' + vnode.key :
        '')
}

/**
 *
 *
 * @param {any} newChildren
 * @param {any} oldChildren
 * @param {any} vParentNode
 * @param {any} context
 */
function diffChildren(newChildren, oldChildren, vParentNode, context) {
    //第一步，根据实例的类型，nodeName, nodeValue, key与数组深度 构建hash

    var mapping = {}
    for (let i = 0, n = oldChildren.length; i < n; i++) {
        let vnode = oldChildren[i]
        let tag = vnode.instance ?
            getTopComponentName(vnode, vnode.instance) :
            vnode.type
        let uuid = computeUUID(tag, vnode)
        if (mapping[uuid]) {
            mapping[uuid].push(vnode)
        } else {
            mapping[uuid] = [vnode]
        }
    }
    //第二步，遍历新children, 从hash中取出旧节点
    var removedChildren = oldChildren.concat()
    for (let i = 0, n = newChildren.length; i < n; i++) {
        let vnode = newChildren[i];
        let Type = vnode.type
        let tag = typeof Type === 'function' ?
            (vnode._hasInstance = 1, Type.displatName || Type.name) :
            Type
        let uuid = computeUUID(tag, vnode)
        if (mapping[uuid]) {
            var matchNode = mapping[uuid].shift()
            if (!mapping[uuid].length) {
                delete mapping[uuid]
            }
            if (matchNode) {
                let index = removedChildren.indexOf(matchNode)
                removedChildren.splice(index, 1)
                vnode.prevVnode = matchNode //重点
                matchNode.use = true
            }
        }
    }
    var parentNode = vParentNode.dom
    //第三，逐一比较
    for (let i = 0, n = newChildren.length; i < n; i++) {
        let vnode = newChildren[i]
        let prevVnode = null
        if (vnode.prevVnode) {
            prevVnode = vnode.prevVnode
        } else {
            let k
            loop: while (k = removedChildren.shift()) {
                if (!k.use) {
                    prevVnode = k
                    break loop
                }
            }
        }
        vnode._hostParent = vParentNode
        if (prevVnode) { //假设两者都存在
            let isTextOrComment = 'text' in vnode
            let prevDom = prevVnode.dom
            if (vnode.prevVnode && vnode._hasInstance) { //都是同种组件
                delete vnode.prevVnode
                delete vnode._hasInstance
                vnode.action = '重复利用旧的实例更新组件'
                diff(vnode, prevVnode, vParentNode, context)
            } else if (vnode.type === prevVnode.type) { //都是元素，文本或注释
                if (isTextOrComment) {
                    vnode.dom = prevDom
                    if (vnode.text !== prevVnode.text) {
                        vnode.action = '改文本'
                        vnode.dom.nodeValue = vnode.text
                    } else {
                        vnode.action = '不改文本'
                    }
                } else {
                    vnode.action = '更新元素'
                    diff(vnode, prevVnode, vParentNode, context)
                }
            } else if (isTextOrComment) { //由其他类型变成文本或注释
                let isText = vnode.type === '#text'
                var dom = isText ? document.createTextNode(vnode.text) : /* istanbul ignore next */ document.createComment(vnode.text)
                vnode.dom = dom
                parentNode.replaceChild(dom, prevDom)
                vnode.action = isText ? '替换为文本' : /* istanbul ignore next */ '替换为注释'
                removeComponent(prevVnode) //移除元素节点或组件
            } else { //由其他类型变成元素
                vnode.action = '替换为元素'
                diff(vnode, prevVnode, vParentNode, context)
            }
            //当这个孩子是上级祖先传下来的，那么它是相等的
            if (vnode !== prevVnode) {
                delete prevVnode.dom //clear reference
            }
        } else { //添加新节点
            vnode.action = '添加新' + (vnode.type === '#text' ?
                '文本' :
                '元素')
            if (!vnode.dom) {
                var oldNode = oldChildren[i]
                /* istanbul ignore next */
                toDOM(vnode, context, parentNode, oldNode && oldNode.dom || null)
            }
        }

    }


    //第4步，移除无用节点
    if (removedChildren.length) {
        for (let i = 0, n = removedChildren.length; i < n; i++) {
            let vnode = removedChildren[i]
            parentNode.removeChild(vnode.dom)
            vnode.props && removeComponent(vnode)
        }
    }

}

//var mountOrder = 0
/**
 *
 *
 * @export
 * @param {VNode} vnode
 * @param {DOM} context
 * @param {DOM} parentNode ?
 * @param {DOM} replaced ?
 * @returns
 */
export function toDOM(vnode, context, parentNode, replaced) {
    vnode = toVnode(vnode, context)
    var dom,
        isElement
    if (vnode.type === '#comment') {
        dom = document.createComment(vnode.text)
    } else if (vnode.type === '#text') {
        dom = document.createTextNode(vnode.text)
    } else {
        dom = createDOMElement(vnode)
        isElement = true
    }
    if (vnode.context) {
        context = vnode.context
        delete vnode.context
    }

    var instance = vnode.instance


    var canComponentDidMount = instance && !vnode.dom
    vnode.dom = dom
    if (isElement) {
        diffProps(vnode.props, {}, vnode, {})

        if (!vnode._hasSetInnerHTML) {
            diffChildren(vnode.props.children, [], vnode, context) //添加第4参数
        }
        setControlledComponent(vnode)
    }

    //尝试插入DOM树
    if (parentNode) {
        var instances
        if (canComponentDidMount) { //判定能否调用componentDidMount方法
            instances = getInstances(instance)
        }
        if (replaced) {
            parentNode.replaceChild(dom, replaced)
        } else {
            parentNode.appendChild(dom)
        }
        if (instances) {
            //instance._mountOrder = mountOrder++;
            while (instance = instances.shift()) {
                applyComponentHook(instance, 2)
            }
        }
    }
    return dom
}
//将Component中这个东西移动这里
midway.immune.updateComponent = function updateComponentProxy() { //这里触发视图更新
    var instance = this.component
    updateComponent(instance)
    instance._forceUpdate = false
}