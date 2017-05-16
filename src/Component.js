import {
    transaction
} from './transaction'

import {
    extend,
    midway,
    noop
} from './util'

/**
 *
 *
 * @param {any} props
 * @param {any} context
 */

export function Component(props, context) {
    this.context = context
    this.props = props
    // this.uuid = Math.random()
    this.refs = {}
    if (!this.state)
        this.state = {}
}

Component.prototype = {

    setState(state, cb) {
        var arr = this._pendingStateQueue = this._pendingStateQueue || []
        arr.push(state)
        setStateProxy(this, cb)
    },
    getVnode() {
        var p = this
        do {
            if (p.vnode) {
                return p.vnode
            }
        } while (p = p.parentInstance)
    },
    forceUpdate(cb) {
        this._pendingForceUpdate = true
        setStateProxy(this, cb)
    },
    _processPendingState: function (props, context) {

        var queue = this._pendingStateQueue
        delete this._pendingStateQueue

        if (!queue) {
            return this.state
        }


        var nextState = extend({}, this.state);
        for (var i = 0; i < queue.length; i++) {
            var partial = queue[i]
            extend(nextState, typeof partial === 'function' ?
                partial.call(this, nextState, props, context) :
                partial)
        }

        return nextState
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

function setStateProxy(instance, cb) {
    if (typeof cb === 'function')
        transaction.enqueueCallback({ //确保回调先进入
            component: instance,
            cb: cb
        })
    if (!instance._updateBatchNumber) {
        instance._updateBatchNumber = midway.updateBatchNumber + 1
    }
    transaction.enqueue(instance)
}