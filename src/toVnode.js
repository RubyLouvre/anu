import {
    extend,
    getContext,
    isComponent,
    isStateless,
    noop
} from './util'
import {
    applyComponentHook
} from './lifecycle'
import {
    transaction
} from './transaction'
import {
    patchRef
} from './ref'
import {
    Component
} from './Component'
import {
    CurrentOwner
} from './CurrentOwner'


/**
 * 将组件节点转化为简单的虚拟节点
 * 
 * @export
 * @param {any} vnode 
 * @param {any} context 
 * @param {any} parentInstance 
 * @returns 
 */
export function toVnode(vnode, context, parentInstance) {

    var Type = vnode.type,
        instance, rendered

    if (isComponent(Type)) {
        var props = vnode.props
        if (isStateless(Type)) {
            //处理无状态组件
            instance = new Component(null, context)
            instance.render = instance.statelessRender = Type
            rendered = transaction.renderWithoutSetState(instance, props, context)

        } else {

            //处理普通组件
            var defaultProps = Type.defaultProps || applyComponentHook(Type, -2) || {}
            props = extend({}, props) //注意，上面传下来的props已经被冻结，无法修改，需要先复制一份
            for (var i in defaultProps) {
                if (props[i] === void 666) {
                    props[i] = defaultProps[i]
                }
            }
            instance = new Type(props, context)

            //必须在这里添加vnode，因为willComponent里可能进行setState操作
            Component.call(instance, props, context) //重点！！
            applyComponentHook(instance, 0) //componentWillMount
            rendered = transaction.renderWithoutSetState(instance)

        }
        instance._rendered = rendered
        if (vnode.key)
            rendered.key = vnode.key
        vnode._instance = instance

        if (parentInstance) {

            instance.parentInstance = parentInstance
        } else {
            instance.vnode = vnode
        }

        //<App />下面存在<A ref="a"/>那么AppInstance.refs.a = AInstance
        patchRef(vnode._owner, vnode.props.ref, instance)

        if (instance.getChildContext) {
            context = rendered.context = getContext(instance, context) //将context往下传
        }
        return toVnode(rendered, context, instance)
    } else {
        
        vnode.context = context
        return vnode
    }
}