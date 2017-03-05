/**
 * The diff algorithm
 */
import { emptyNode, removeNode, createNode, replaceNode, appendNode } from './vnode'
import applyComponentHook from './component/lifecycle'
import { nodeEmpty } from './shapes'
import { extractComponentNode } from './extract'
import { patchProps } from './props'
/**
 * reconcile nodes
 *  
 * @param  {VNode}  newNode
 * @param  {VNode}  oldNode
 * @param  {number} newNodeType
 * @param  {number} oldNodeType
 */
export function reconcileNodes(newNode, oldNode, newNodeType, oldNodeType) {
    // If both are equal, then quit immediately
    if (newNode === oldNode) {
        return
    }

    // extract node from possible component node
    var currentNode = newNodeType === 2 ? extractComponentNode(newNode, null, null) : newNode

    // a component
    if (oldNodeType === 2) {
        // retrieve components
        var oldComponent = oldNode.instance
        var newComponent = newNode.instance

        // retrieve props
        var newProps = newComponent.props
        var newState = newComponent.state

        // Trigger shouldComponentUpdate hook
        if (applyComponentHook(oldComponent, 3, newProps, newState) === false) {
            // exit early
            return
        }

        // Trigger componentWillUpdate hook
        applyComponentHook(oldComponent, 4, newProps, newState)
    }

    // children
    var newChildren = currentNode.children
    var oldChildren = oldNode.children

    // children length
    var newLength = newChildren.length
    var oldLength = oldChildren.length

    // no children
    if (newLength === 0) {
        // remove all children if old children is not already cleared
        if (oldLength !== 0) {
            emptyNode(oldNode, oldLength)
            oldNode.children = newChildren
        }
    } else {
        // has children
        // new node has children
        var parentNode = oldNode.DOMNode

        // when keyed, the position that dirty keys begin
        var position = 0

        // non-keyed until the first dirty key is found
        var keyed = false

        // un-initialized key hash maps
        var oldKeys
        var newKeys

        var newKey
        var oldKey

        // the highest point of interest
        var length = newLength > oldLength ? newLength : oldLength

        // children nodes
        var newChild
        var oldChild

        // children types
        var newType
        var oldType

        // for loop, the end point being which ever is the 
        // greater value between new length and old length
        for (var i = 0; i < length; i++) {
            // avoid accessing out of bounds index and Type where unnecessary
            newType = i < newLength ? (newChild = newChildren[i]).Type : (newChild = nodeEmpty, 0)
            oldType = i < oldLength ? (oldChild = oldChildren[i]).Type : (oldChild = nodeEmpty, 0)

            if (keyed) {
                // push keys
                if (newType !== 0) {
                    newKeys[newChild.key] = (newChild.index = i, newChild)
                }

                if (oldType !== 0) {
                    oldKeys[oldChild.key] = (oldChild.index = i, oldChild)
                }
            }
            // remove
            else if (newType === 0) {
                removeNode(oldType, oldChildren.pop(), parentNode)

                oldLength--
            }
            // add
            else if (oldType === 0) {
                appendNode(
                    newType,
                    oldChildren[oldLength++] = newChild,
                    parentNode,
                    createNode(newChild, null, null)
                )
            }
            // text
            else if (newType === 3 && oldType === 3) {
                if (newChild.children !== oldChild.children) {
                    oldChild.DOMNode.nodeValue = oldChild.children = newChild.children
                }
            }
            // key
            else if ((newKey = newChild.key) !== (oldKey = oldChild.key)) {
                keyed = true
                position = i

                // map of key
                newKeys = {}
                oldKeys = {}

                // push keys
                newKeys[newKey] = (newChild.index = i, newChild)
                oldKeys[oldKey] = (oldChild.index = i, oldChild)
            }
            // replace
            else if (newChild.type !== oldChild.type) {
                replaceNode(
                    newType,
                    oldType,
                    oldChildren[i] = newChild,
                    oldChild,
                    parentNode,
                    createNode(newChild, null, null)
                )
            }
            // noop
            else {
                reconcileNodes(newChild, oldChild, newType, oldType)
            }
        }

        // reconcile keyed children
        if (keyed) {
            reconcileKeys(
                newKeys,
                oldKeys,
                parentNode,
                newNode,
                oldNode,
                newLength,
                oldLength,
                position,
                length
            )
        }
    }

    // props objects of the two nodes are not equal, patch
    if (currentNode.props !== oldNode.props) {
        patchProps(currentNode, oldNode)
    }

    // component with componentDidUpdate
    applyComponentHook(oldComponent, 5, newProps, newState)

}


/**
 * reconcile keyed nodes
 *
 * @param {Object<string, any>}    newKeys
 * @param {Object<string, any>}    oldKeys
 * @param {Node}                   parentNode
 * @param {VNode}                  newNode
 * @param {VNode}                  oldNode
 * @param {number}                 newLength
 * @param {number}                 oldLength
 * @param {number}                 position
 * @param {number}                 length
 */
export function reconcileKeys(newKeys, oldKeys, parentNode, newNode, oldNode, newLength, oldLength, position, length) {
    var reconciled = new Array(newLength)

    // children
    var newChildren = newNode.children
    var oldChildren = oldNode.children

    // child nodes
    var newChild
    var oldChild

    // DOM nodes
    var nextNode
    var prevNode

    // keys
    var key

    // offsets
    var added = 0
    var removed = 0
    var i = 0
    var index = 0
    var offset = 0
    var moved = 0

    // reconcile leading nodes
    if (position !== 0) {
        for (; i < position; i++) {
            reconciled[i] = oldChildren[i]
        }
    }

    // reconcile trailing nodes
    for (i = 0; i < length; i++) {
        newChild = newChildren[index = (newLength - 1) - i]
        oldChild = oldChildren[(oldLength - 1) - i]

        if (newChild.key === oldChild.key) {
            reconciled[index] = oldChild

            // trim trailing node
            length--
        } else {
            break
        }
    }

    // reconcile inverted nodes
    if (newLength === oldLength) {
        for (i = position; i < length; i++) {
            newChild = newChildren[index = (newLength - 1) - i]
            oldChild = oldChildren[i]

            if (index !== i && newChild.key === oldChild.key) {
                newChild = oldChildren[index]

                nextNode = oldChild.DOMNode
                prevNode = newChild.DOMNode

                // adjacent nodes
                if (index - i === 1) {
                    parentNode.insertBefore(prevNode, nextNode)
                } else {
                    // move first node to inverted postion
                    parentNode.insertBefore(nextNode, prevNode)

                    nextNode = prevNode
                    prevNode = oldChildren[i + 1].DOMNode

                    // move second node to inverted position
                    parentNode.insertBefore(nextNode, prevNode)
                }

                // trim leading node
                position = i

                // trim trailing node
                length--

                // hydrate
                reconciled[i] = newChild
                reconciled[index] = oldChild
            } else {
                break
            }
        }

        // single remaining node
        if (length - i === 1) {
            reconciled[i] = oldChildren[i]
            oldNode.children = reconciled

            return
        }
    }

    // reconcile remaining node
    for (i = position; i < length; i++) {
        // old children
        if (i < oldLength) {
            oldChild = oldChildren[i]
            newChild = newKeys[oldChild.key]

            if (newChild === void 0) {
                removeNode(oldChild.Type, oldChild, parentNode)
                removed++
            }
        }

        // new children
        if (i < newLength) {
            newChild = newChildren[i]
            oldChild = oldKeys[newChild.key]

            // new
            if (oldChild === void 0) {
                nextNode = createNode(newChild, null, null)

                // insert
                if (i < oldLength + added) {
                    insertNode(
                        newChild.Type,
                        newChild,
                        oldChildren[i - added].DOMNode,
                        parentNode,
                        nextNode
                    )
                }
                // append
                else {
                    appendNode(
                        newChild.Type,
                        newChild,
                        parentNode,
                        nextNode
                    )
                }

                reconciled[i] = newChild
                added++
            }
            // old
            else {
                index = oldChild.index
                offset = index - removed

                // moved
                if (offset !== i) {
                    key = oldChildren[offset].key

                    // not moving to a removed index
                    if (newKeys[key] !== void 0) {
                        offset = i - added

                        // not identical keys
                        if (newChild.key !== oldChildren[offset].key) {
                            nextNode = oldChild.DOMNode
                            prevNode = oldChildren[offset - (moved++)].DOMNode

                            if (prevNode !== nextNode) {
                                parentNode.insertBefore(nextNode, prevNode)
                            }
                        }
                    }
                }

                reconciled[i] = oldChild
            }
        }
    }

    oldNode.children = reconciled
}