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
 *
 *
 * @param {any} vnode
 * @param {any} context
 * @returns
 */
export function toVnode(vnode, context) {

    var Type = vnode.type,
        instance, rendered

    if (isComponent(Type)) {
        var props = vnode.props
        if (!isStateless(Type)) {
            var defaultProps = Type.defaultProps || applyComponentHook(Type, -2) || {}
            props = extend({}, props) //注意，上面传下来的props已经被冻结，无法修改，需要先复制一份
            for (var i in defaultProps) {
                if (props[i] === void 666) {
                    props[i] = defaultProps[i]
                }
            }
            instance = new Type(props, context)

            //必须在这里添加vnode，因为willComponent里可能进行setState操作
            instance.vnode = vnode

            Component.call(instance, props, context) //重点！！

            applyComponentHook(instance, 0) //willMount

            rendered = transaction.renderWithoutSetState(instance)
        } else { //添加无状态组件的分支
            instance = new Component(null, context)
            instance.render = instance.statelessRender = Type
            instance.vnode = vnode
            rendered = transaction.renderWithoutSetState(instance, props, context)
        }
        if (vnode.instance) {
            instance.parentInstance = vnode.instance
            vnode.instance.childInstance = instance
        }

        instance.prevProps = vnode.props //实例化时prevProps

        var key = vnode.key
       //<App />下面存在<A ref="a"/>那么AppInstance.refs.a = AInstance
        patchRef(vnode._owner, vnode.props.ref, instance)
        extend(vnode, rendered)
        vnode.key = key
        vnode.instance = instance

        if (instance.getChildContext) {
           context = vnode.context = getContext(instance, context)//将context往下传
        }


        return toVnode(vnode, context)
    } else {
        return vnode
    }
}