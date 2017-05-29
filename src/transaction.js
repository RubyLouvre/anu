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

            var renderQueue = queue.concat()
            var processingCallbacks = callbacks.concat()

            queue.length = callbacks.length = 0
            renderQueue.forEach(function (inst) {
                try {
                    if (inst._updateBatchNumber === globalBatchNumber) {
                        options
                            .immune
                            .refreshComponent(inst)
                    }

                } catch (e) {
                    /* istanbul ignore next */
                    console.warn(e)
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