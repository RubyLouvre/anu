import { objEmpty, arrEmpty, createComponentShape, createTextShape } from '../shapes'
//用到objEmpty, arrEmpty

export default function createChild(child, children, index) {
    if (child != null) {
        // vnode
        if (child.Type !== void 0) {
            children[index++] = child

        } else {
            var type = typeof child

            // function/component
            if (type === 'function') {
                children[index++] = createComponentShape(child, objEmpty, arrEmpty)
            }
            // array
            else if (type === 'object') {
                for (var i = 0, length = child.length; i < length; i++) {
                    index = createChild(child[i], children, index)
                }
            }
            // text
            else {
                children[index++] = createTextShape(type !== 'boolean' ? child : '')
            }
        }
    }

    return index
}