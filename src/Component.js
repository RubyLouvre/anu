import { transaction } from './transaction'
import { updateComponent, toDOM } from './diff'
import { clone, extend } from './util'

/**
 * 
 * 
 * @param {any} props 
 * @param {any} context 
 */
export function Component(props, context) {
    this.context = context
    this.props = props
    this.uuid = Math.random()
    this.refs = {}
    if (!this.state)
        this.state = {}
}


Component.prototype = {

        setState(state, cb) {
            setStateProxy(this, state, cb)
        },

        forceUpdate(cb) {
            setStateProxy(this, this.state, cb, true)
        },

        render() {}

    }
    /**
     * 让外面的setState与forceUpdate都共用同一通道
     * 
     * @param {any} instance 
     * @param {any} state 
     * @param {any} cb fire by component did update
     * @param {any} force ignore shouldComponentUpdate
     */
function setStateProxy(instance, state, cb, force) {
    if (typeof cb === 'function')
        transaction.enqueueCallback({ //确保回调先进入
            component: instance,
            cb: cb
        })
    transaction.enqueue({
        component: instance,
        state: state,
        init: force ? gentleSetState : roughSetState,
        exec: updateComponentProxy
    })

}


function gentleSetState() { //只有必要时才更新
    var instance = this.component
    var state = instance.state
    instance.prevState = instance.prevState || clone(state)
    var s = this.state
    extend(state, typeof s === 'function' ? s(state, instance.props) : s)
}

function roughSetState() { //强制更新
    var instance = this.component
    instance.forceUpdate = true
}

function updateComponentProxy() { //这里触发视图更新
    var instance = this.component
    if (!instance.vnode.dom) {
        var parentNode = instance.container
        instance.state = this.state //将merged state赋给它
        toDOM(instance.vnode, instance.context, parentNode)
    } else {
        updateComponent(this.component)
    }
    this.forceUpdate = false
}