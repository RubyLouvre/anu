import {CurrentOwner} from './CurrentOwner'
import {midway} from './util'
var queue = []
var callbacks = []

export function setStateWarn() {
    /* istanbul ignore next */
    if (transaction.isInTransation) {
        console.warn(`请不要在'render', 'componentWillUpdate','componentDidUpdate',或组件的构造器中
        调用setState，forceUpdate方法，否则会造成死循环，你可以将相关逻辑放到'componentWillMount'钩子`)
    }
}

export var transaction = {
    isInTransation: false,
    enqueueCallback: function (obj) {
        //它们是保证在ComponentDidUpdate后执行
        callbacks.push(obj)
    },
    renderWithoutSetState: function (instance, nextProps, context) {
        instance.setState = instance.forceUpdate = setStateWarn
        try {
            CurrentOwner.cur = instance
            var vnode = instance.render(nextProps, context)
            if (vnode === null) {
                vnode = {
                    _renderedComponent: instance,
                    type: '#comment',
                    text: 'empty'
                };
            }
        } finally {
            CurrentOwner.cur = null
            delete instance.setState
            delete instance.forceUpdate

        }

        return vnode
    },
    enqueue: function (instance) {
        if (typeof instance === 'object') {
            queue.push(instance)
        }
        if (!this.isInTransation) {
            this.isInTransation = true

            if (instance) 
                midway.updateBatchNumber++;
            var globalBatchNumber = midway.updateBatchNumber

            var renderQueue = queue.concat()
            var processingCallbacks = callbacks.concat()

            queue.length = callbacks.length = 0
            renderQueue.forEach(function (inst) {
                try {
                    if (inst._updateBatchNumber === globalBatchNumber) {
                        midway
                            .immune
                            .updateComponent(inst)
                    }

                } catch (e) {
                    /* istanbul ignore next */
                    console.log(e)
                }

            })
            this.isInTransation = false
            processingCallbacks.forEach(function (request) {
                request
                    .cb
                    .call(request.instance)
            })
            /* istanbul ignore next */
            if (queue.length) {
                this.enqueue() //用于递归调用自身)
            }
        }

    }
}