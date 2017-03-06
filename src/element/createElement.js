import { nsMath, nsSvg, createElementShape, createEmptyShape, createComponentShape, createFragmentShape } from '../shapes'
import createChild from './createChild'
/**
 * create virtual element
 *
 * @public
 * 
 * @param  {(string|function|Component)} type
 * @param  {Object<string, any>=}        props
 * @param  {...any=}                     children
 * @return {Object<string, any>}
 */

export function createElement(type, props) {
    if (type == null) {
        return createEmptyShape()
    }

    var length = arguments.length
    var children = []

    var index = 0

    // construct children
    for (var i = 2; i < length; i++) {
        var child = arguments[i]

        // only add non null/undefined children
        if (child != null) {
            // if array, flatten
            if (child.constructor === Array) {
                // add array child
                for (var j = 0, len = child.length; j < len; j++) {
                    index = createChild(child[j], children, index)
                }
            } else {
                index = createChild(child, children, index)
            }
        }
    }


    var typeOf = typeof type

    if (typeOf === 'string') {

        if (props === null) {
            props = {}
        }

        // svg and math namespaces
        if (type === 'svg') {
            props.xmlns = nsSvg
        } else if (type === 'math') {
            props.xmlns = nsMath
        }

        return createElementShape(type, props, children)

    } else if (typeOf === 'function') {
        return createComponentShape(type, props, children)
    } else if (type.Type != null) {
        return cloneElement(type, props, children)
    }

}
/**
 * clone and return an element having the original element's props
 * with new props merged in shallowly and new children replacing existing ones.
 *
 * @public
 * 
 * @param  {VNode}                subject
 * @param  {Object<string, any>=} newProps
 * @param  {any[]=}               newChildren
 * @return {VNode}
 */
export function cloneElement(subject, newProps, newChildren) {
    var type = subject.type
    var props = subject.props
    var children = newChildren || subject.children

    newProps = newProps || {}

    // copy old props
    for (var name in subject.props) {
        if (newProps[name] === void 0) {
            newProps[name] = props[name]
        }
    }

    // replace children
    if (newChildren !== void 0) {
        var length = newChildren.length

        // if not empty, copy
        if (length > 0) {
            var index = 0

            children = []

            // copy old children
            for (var i = 0; i < length; i++) {
                index = createChild(newChildren[i], children, index)
            }
        }
    }

    return createElement(type, newProps, children)
}