    import {
        clone,
        extend,
        isComponent,
        isStateless
    } from './util'
    import { applyComponentHook } from './lifecycle'
    import { transaction } from './transaction'
    import { Component } from './Component'

    /**
     * 
     * 
     * @param {any} vnode 
     * @param {any} context 
     * @returns 
     */
    export function toVnode(vnode, context) {
        var Type = vnode.type
        if (isComponent(Type)) {
            var props = vnode.props

            if (!isStateless(Type)) {
                var defaultProps = Type.defaultProps || applyComponentHook(Type, -2) || {}
                props = clone(props) //注意，上面传下来的props已经被冻结，无法修改，需要先复制一份
                for (var i in defaultProps) {
                    if (props[i] === void 666) {
                        props[i] = defaultProps[i]
                    }
                }
                var instance = new Type(props, context)
                Component.call(instance, props, context) //重点！！
                applyComponentHook(instance, 0) //willMount

                var rendered = transaction.renderWithoutSetState(instance)
            } else { //添加无状态组件的分支
                rendered = Type(props, context)
                instance = {
                    statelessRender: Type,
                    context: context
                }
            }
            if (vnode.instance) {
                instance.parentInstance = vnode.instance
                vnode.instance.childInstance = instance
            }


            instance.prevProps = vnode.props //实例化时prevProps
            instance.vnode = vnode
                //压扁组件Vnode为普通Vnode
            if (rendered == null) {
                rendered = ''
            }
            if (/number|string/.test(typeof rendered)) {
                rendered = {
                    type: '#text',
                    text: rendered
                }
            }
            var key = vnode.key
            extend(vnode, rendered)
            vnode.key = key
            vnode.instance = instance

            return toVnode(vnode, context)
        } else {
            return vnode
        }
    }