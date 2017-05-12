import {
    CurrentOwner
} from './CurrentOwner'

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
                    instance: instance,
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
    enqueue: function (obj) {
        if (obj)
            queue.push(obj)
        if (!this.isInTransation) {
            this.isInTransation = true
            var preProcessing = queue.concat()
            var processingCallbacks = callbacks.concat()
            var mainProcessing = []
            queue.length = callbacks.length = 0
            var unique = {}
            preProcessing.forEach(function (request) {
                try {
                    request.init() //预处理， 合并参数，同一个组件的请求只需某一个进入主调度程序
                    if (!unique[request.component.uuid]) {
                        unique[request.component.uuid] = 1
                        mainProcessing.push(request)
                    }
                } catch (e) {
                    /* istanbul ignore next */
                    console.log(e)
                }

            })

            mainProcessing.forEach(function (request) {
                try {
                    request.exec() //执行主程序
                } catch (e) {
                    /* istanbul ignore next */
                    console.log(e)
                }
            })
            processingCallbacks.forEach(function (request) {
                request
                    .cb
                    .call(request.instance)
            })
            this.isInTransation = false
            this.uuid = NaN
            /* istanbul ignore next */
            if (queue.length) {
                this.enqueue() //用于递归调用自身)
            }
        }
    }
}