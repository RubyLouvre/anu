import {CurrentOwner} from './CurrentOwner'
import {options} from './util'
var queue = []
var callbacks = []

export var transaction = {
    isInTransation: false,
    enqueueCallback: function (obj) {
        //它们是保证在ComponentDidUpdate后执行
        callbacks.push(obj)
    },

    enqueue: function (instance) {
        if (typeof instance === 'object') {
            queue.push(instance)
        }
        if (!this.isInTransation) {
            this.isInTransation = true

            if (instance) 
                options.updateBatchNumber++;
            var globalBatchNumber = options.updateBatchNumber

            var renderQueue = queue
            queue = []
            var processingCallbacks = callbacks
            callbacks = []
            var refreshComponent = options.immune.refreshComponent
            //  queue.length = callbacks.length = 0
            for (var i = 0, n = renderQueue.length; i < n; i++) {
                var inst = renderQueue[i]
                try {
                    if (inst._updateBatchNumber === globalBatchNumber) {
                        refreshComponent(inst)
                    }
                } catch (e) {
                    /* istanbul ignore next */
                    console.warn(e)
                }
            }
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