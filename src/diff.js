import {getContext, getInstances, matchInstance, midway, extend} from './util'
import {applyComponentHook} from './lifecycle'

import {transaction} from './transaction'
import {toVnode} from './toVnode'
import {diffProps} from './diffProps'
import {document, createDOMElement} from './browser'
import {removeRef} from './ref'
import {setControlledComponent} from './ControlledComponent'

/**
 * 渲染组件
 *
 * @param {any} instance
 */
export function updateComponent(instance) {
    var {props, state, context, prevProps, vnode} = instance

    if (instance._unmount) {
        return vnode.dom //注意
    }

    var nextProps = props
    var nextState = instance._processPendingState(props, context)

    instance.props = prevProps
    delete instance.prevProps

    if (!instance._forceUpdate && applyComponentHook(instance, 4, nextProps, nextState, context) === false) {
        return vnode.dom //注意
    }

    applyComponentHook(instance, 5, nextProps, nextState, context)
    instance.props = nextProps
    instance.state = nextState
    delete instance._updateBatchNumber



    var rendered = transaction.renderWithoutSetState(instance, nextProps, context)
    //context只能孩子用，因此不要影响原instance.context
    context = getContext(instance, context)
    var hostParent = rendered._hostParent = vnode._hostParent
    var oldRendered = instance._rendered
    instance._rendered = rendered
    var dom = diff(rendered, oldRendered, hostParent, context, vnode.dom)

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
    var disabedInstance = instance

    applyComponentHook(instance, 7) //componentWillUnmount hook
    while (disabedInstance) {
        disabedInstance._unmount = true
        disabedInstance = disabedInstance.parentInstance
    }

    '_hostParent,_wrapperState,_owner'
        .replace(/\w+/g, function (name) {
            delete vnode[name]
        })
    var props = vnode.props
    if (props) {
        removeRef(instance, props.ref)
        props
            .children
            .forEach(function (el) {
                // if (el.props) {
                removeComponent(el)
                // }
            })
    }

}

/**
 * 参数不要出现DOM,以便在后端也能运行
 *
 * @param {any} vnode 新的虚拟DOM
 * @param {any} prevVnode 旧的虚拟DOM
 * @param {any} hostParent 父虚拟DOM
 * @param {any} context
 * @returns
 */
export function diff(vnode, prevVnode, hostParent, context, beforeDom) { //updateComponent

    var parentNode = hostParent && hostParent.dom
    var prevInstance = prevVnode.instance
    var prevProps = prevVnode.props || {}
    var prevChildren = prevProps.children || []
    var Type = vnode.type
    //更新组件
    var isComponent = typeof Type === 'function'
    var dom = prevInstance && prevInstance.vnode.dom
    var instance
    if (prevInstance) {

        if (prevInstance === vnode.instance) {
            instance = vnode.type === '#comment'
                ? null
                : prevInstance
        } else {
            instance = isComponent && matchInstance(prevInstance, Type)
        }

        if (instance) { //如果类型相同，使用旧的实例进行 render新的虚拟DOM
            vnode.instance = instance
            instance.context = context //更新context
            instance.prevProps = prevProps
            var nextProps = vnode.props
            //处理非状态组件
            if (instance.statelessRender) {
                instance.props = nextProps
                return updateComponent(instance, context)
            }

            applyComponentHook(instance, 3, nextProps) //componentWillReceiveProps

            instance.props = nextProps

            return updateComponent(instance, context)
        } else {
            while (prevInstance) {
                prevInstance.vnode = vnode
                prevInstance = prevInstance.parentInstance
            }
        }
    }
    if (isComponent) {

        vnode._hostParent = hostParent
        try {
            return toDOM(vnode, context, parentNode, beforeDom)
        } finally {
            if (dom && dom === beforeDom) {
                parentNode.removeChild(dom)
            }
        }
    }
    if (!dom || prevVnode.type !== Type) { //这里只能是element 与#text
        var nextDom = createDOMElement(vnode)

        parentNode.insertBefore(nextDom, beforeDom || null)
        if (dom && dom === beforeDom) {
            parentNode.removeChild(dom)
        }
        dom = nextDom

    }

    //必须在diffProps前添加它的dom
    vnode.dom = dom
    if (prevProps.dangerouslySetInnerHTML) {
        while (dom.firstChild) {
            var removed = dom.removeChild(dom.firstChild)
        }
    }
    var props = vnode.props
    if (props) {
        if (!props.angerouslySetInnerHTML) {
            diffChildren(props.children, prevChildren, vnode, context)
        }
        diffProps(props, prevProps, vnode, prevVnode)
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
    return type + '/' + vnode.deep + (vnode.key !== null
        ? '/' + vnode.key
        : '')
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

    var mapping = {};
    var str1 = ''
    for (let i = 0, n = oldChildren.length; i < n; i++) {
        let vnode = oldChildren[i]
        let tag = vnode.instance
            ? getTopComponentName(vnode, vnode.instance)
            : vnode.type
        let uuid = computeUUID(tag, vnode)
        str1 += uuid + ' '
        if (mapping[uuid]) {
            mapping[uuid].push(vnode)
        } else {
            mapping[uuid] = [vnode]
        }
    }
    console.log('旧的', str1)
    //第二步，遍历新children, 从hash中取出旧节点

    var removedChildren = oldChildren.concat();
    str1 = ''
    for (let i = 0, n = newChildren.length; i < n; i++) {
        let vnode = newChildren[i];

        let Type = vnode.type

        let tag = typeof Type === 'function'
            ? (vnode._hasInstance = 1, Type.displatName || Type.name)
            : vnode.instance
                ? getTopComponentName(vnode, vnode.instance, vnode._hasInstance = 1)
                : Type

        let uuid = computeUUID(tag, vnode)
        str1 += uuid + ' '
        if (mapping[uuid]) {
            var matchNode = mapping[uuid].shift()
            if (!mapping[uuid].length) {
                delete mapping[uuid]
            }
            if (matchNode) {
                let index = removedChildren.indexOf(matchNode)
                if (index !== -1) {
                    removedChildren.splice(index, 1)
                    vnode.prevVnode = matchNode //重点
                }
            }
        }
    }
    console.log('新的', str1)
    var parentNode = vParentNode.dom,
        //第三，逐一比较
        nativeChildren = parentNode.childNodes,
        branch;
    for (var i = 0, n = newChildren.length; i < n; i++) {
        let vnode = newChildren[i],
            prevVnode = null,
            beforeDom = nativeChildren[i]

        if (vnode.prevVnode) {
            prevVnode = vnode.prevVnode
        } else {
            if (removedChildren.length) {
                prevVnode = removedChildren.shift()
            }

        }
        vnode._hostParent = vParentNode
        if (prevVnode) { //假设两者都存在
            let isTextOrComment = 'text' in vnode
            let prevDom = prevVnode.dom
            delete vnode.prevVnode
            if (vnode.prevVnode && vnode._hasInstance) { //都是同种组件
                //console.log(vnode, 'diff两个组件', prevVnode)

                delete vnode._hasInstance
                delete prevVnode.instance._unmount
                vnode.dom = diff(vnode, prevVnode, vParentNode, context, beforeDom)
                branch = 'A'
            } else if (vnode.type === prevVnode.type) { //都是元素，文本或注释

                if (isTextOrComment) {
                    vnode.dom = prevDom
                    if (vnode.text !== prevVnode.text) {

                        vnode.dom.nodeValue = vnode.text
                    }
                    branch = 'B'
                } else {
                    //  '更新元素' 必须设置vnode.dom = newDOM

                    vnode.dom = diff(vnode, prevVnode, vParentNode, context, beforeDom)
                    branch = 'C'
                }
            } else if (isTextOrComment) { //由其他类型变成文本或注释

                vnode.dom = createDOMElement(vnode)
                branch = 'D'

                removeComponent(prevVnode) //移除元素节点或组件}
            } else { //由其他类型变成元素

                vnode.dom = diff(vnode, prevVnode, vParentNode, context, beforeDom)

                branch = 'E'
            }
            //当这个孩子是上级祖先传下来的，那么它是相等的
            if (vnode !== prevVnode) {
                delete prevVnode.dom //clear reference
            }

        } else { //添加新节点
            if (!vnode.dom) {

                /* istanbul ignore next */
                vnode.dom = toDOM(vnode, context, parentNode, beforeDom)
                branch = 'F'
            }
        }
        if (nativeChildren[i] !== vnode.dom) {
            parentNode.insertBefore(vnode.dom, nativeChildren[i] || null)
        }

    }
    while (nativeChildren[i]) {
        parentNode.removeChild(nativeChildren[i])
    }

    //第4步，移除无用节点
    if (removedChildren.length) {
        for (let i = 0, n = removedChildren.length; i < n; i++) {
            let vnode = removedChildren[i]
            var dom = vnode.dom
            if (dom.parentNode) {
                dom
                    .parentNode
                    .removeChild(dom)
            }
            if (vnode.instance) {
                removeComponent(vnode)
                //  vnode.instance._unmount = true
            }

        }
    }

}

/**
 *
 * @export
 * @param {VNode} vnode
 * @param {DOM} context
 * @param {DOM} parentNode ?
 * @param {DOM} replaced ?
 * @returns
 */
export function toDOM(vnode, context, parentNode, beforeDom) {

    vnode = toVnode(vnode, context)
    var dom = createDOMElement(vnode)
    var props = vnode.props

    if (vnode.context) {
        context = vnode.context
        delete vnode.context
    }
    //文本是没有instance, 只有empty与元素节点有instance
    var instance = vnode.instance
    var canComponentDidMount = instance && !vnode.dom
    vnode.dom = dom
    if (parentNode) {
        parentNode.insertBefore(dom, beforeDom || null)

    }
    //只有元素与组件才有props
    if (props && !props.dangerouslySetInnerHTML) {
        // 先diff Children 再 diff Props 最后是 diff ref
        diffChildren(props.children, [], vnode, context) //添加第4参数
    }
    //尝试插入DOM树
    if (parentNode) {
        var instances
        if (canComponentDidMount) { //判定能否调用componentDidMount方法
            instances = getInstances(instance)
        }
        if (props) {
            diffProps(props, {}, vnode, {})
            setControlledComponent(vnode)
        }

        if (instances) {
            while (instance = instances.shift()) {
                applyComponentHook(instance, 2)
                instance.vnode = vnode
            }
        }
    }

    return dom
}
//将Component中这个东西移动这里
midway.immune.updateComponent = function updateComponentProxy(instance) { //这里触发视图更新

    updateComponent(instance)
    instance._forceUpdate = false
}