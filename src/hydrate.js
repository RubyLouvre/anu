import { extractComponentNode } from './extract'
import { assignProps } from './props'
import { objEmpty } from './shapes'

// 用到objEmpty
/** 
/ * 
/ * @export
/ * @param {any} parent
/ * @param {any} subject
/ * @param {any} index
/ * @param {any} parentVNode
/ * @param {any} component
/ */
/**
 * According to the generated virtual DOM element node, 
 * or all children from the parent node to extract a matching element nodes,
 *  then this node into a virtual DOM DOMNode properties
 * 
 * @param  {Node}       parent
 * @param  {VNode}      subject
 * @param  {number}     index
 * @param  {VNode}      parentNode
 * @param  {?Component} component
 */
export default function hydrate(parent, subject, index, parentVNode, component) {
    var newNode = subject.Type === 2 ? extractComponentNode(subject, null, null) : subject

    var nodeType = newNode.Type
    var type = newNode.type //标签名

    var childNodes = parent.childNodes
    var element = childNodes[index]
    var nodeName = element.nodeName

    // DOMNode type does not match
    if (type !== nodeName.toLowerCase()) {
        // root(mount target) context
        if (parentVNode === null) {
            // find a DOMNode match
            for (var i = 0, l = childNodes.length; i < l; i++) {
                if ((element = childNodes[i]).nodeName.toLowerCase() === type) {
                    break
                }
            }
        } else {
            // whitespace
            if (nodeName === '#text' && element.nodeValue.trim() === '') {
                parent.removeChild(element)
            }

            element = childNodes[index]
        }
    }

    // newNode is not a textNode, hydrate its children
    if (nodeType !== 3) {
        var props = newNode.props
        var children = newNode.children
        var length = children.length

        // vnode has component attachment
        if (subject.instance !== null) {
            ;(component = subject.instance)['--vnode'].DOMNode = parent
        }

        // hydrate children
        for (var i = 0; i < length; i++) {
            var newChild = children[i]

            // hoisted, clone VNode
            if (newChild.DOMNode !== null) {
                newChild = children[i] = cloneNode(newChild)
            }

            hydrate(element, newChild, i, newNode, component)
        }


        // not a fragment, not an emtpy object
        if (props !== objEmpty) {
            // events
            assignProps(element, props, true, component)
        }

        // hydrate the dom element to the virtual node
        subject.DOMNode = element
    } else if (nodeType === 3) { // textNode
        var children = parentVNode.children
        var length = children.length

        // when we reach a string child that is followed by a string child, 
        // it is assumed that the dom representing it is a single textNode
        // case in point h('h1', 'Hello', 'World') output: <h1>HelloWorld</h1>
        // HelloWorld is one textNode in the DOM but two in the VNode
        if (length > 1 && index + 1 < length && children[index + 1].Type === 3) {
            var fragment = document.createDocumentFragment()

            // look ahead of this nodes siblings and add all textNodes to the fragment
            // and exit when a non-textNode is encounted
            for (var i = index, len = length - index; i < len; i++) {
                var textNode = children[i]

                // exit early once we encounter a non textNode
                if (textNode.Type !== 3) {
                    break
                }

                // create textNode, hydrate and append to fragment
                fragment.appendChild(textNode.DOMNode = document.createTextNode(textNode.children))
            }

            // replace the textNode with a set of textNodes
            parent.replaceChild(fragment, element)
        } else {
            var nodeValue = newNode.children + ''

            // DOMNode text does not match, reconcile
            if (element.nodeValue !== nodeValue) {
                element.nodeValue = nodeValue
            }

            // hydrate single textNode
            newNode.DOMNode = element
        }
    }
}