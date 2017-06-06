import {
    transaction
} from './transaction'

import {
    extend,
    noop,
    isFn,
    options
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
    this.refs = {}
    this._pendingStateQueue = []
    //  if (!this.state)
    this.state = {}
}

Component.prototype = {

    setState(state, cb) {
        this._pendingStateQueue.push(state)

        setStateProxy(this, cb)
    },

    forceUpdate(cb) {
        this._pendingForceUpdate = true
        setStateProxy(this, cb)
    },
    _processPendingState: function (props, context) {
        var n = this._pendingStateQueue.length
        if (n == 0) {
            return this.state
        }
        var queue = this._pendingStateQueue.concat()
        this._pendingStateQueue.length = 0

        var nextState = extend({}, this.state);
        for (var i = 0; i < n; i++) {
            var partial = queue[i]
            extend(nextState, isFn(partial) ?
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
    if (isFn(cb))
        transaction.queueCallback({ //确保回调先进入
            component: instance,
            cb: cb
        })
    if (!instance._updateBatchNumber) {
        instance._updateBatchNumber = options.updateBatchNumber + 1
    }
    transaction.queueComponent(instance)
    if(!transaction.isInTransation){
        options.updateBatchNumber++
        transaction.dequeue()
    }
}