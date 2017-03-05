// https://github.com/snabbdom/snabbdom/blob/master/src/h.ts
// https://github.com/thysultan/dio.js
import { createEmptyShape, createPortalShape, createComponentShape, createTextShape } from './shapes'

import { createElement } from './element/createElement'
import { createClass, Component } from './component/index'
import { assignDefaultProps } from './props'
import { objEmpty, arrEmpty } from './shapes'

//用到objEmpty, arrEmpty
/**
 * extract render node
 *
 * @param  {Component} component
 * @return {VNode}
 */
export function applyComponentRender(component) {
    try {
        return extractVirtualNode(
            component.render(component.props, component.state, component),
            component
        )
    } catch (e) {
        return createEmptyShape()
    }

}

/**
 * extract virtual node
 * 
 * @param  {(VNode|function|Component)} subject
 * @param  {Component}                  component
 * @return {VNode}
 */
export function extractVirtualNode(subject, component) {
    // empty
    var type = Object.prototype.toString.call(subject).slice(8, -1)
    switch (type) {
        // booleans
        case 'Boolean':
        case 'Null':
        case 'Undefined':
            return createEmptyShape()
        case 'Array':
            return createEmptyShape()
        case 'String':
        case 'Number':
            return createTextShape(subject)
        case 'Function':
            // stream
            if (subject.then != null && typeof subject.then === 'function') {
                if (subject['--listening'] !== true) {
                    subject.then(function resolveStreamComponent() {
                        component.forceUpdate()
                    }).catch(function() {})

                    subject['--listening'] = true
                }
                return extractVirtualNode(subject(), component)
            }
            // component constructor
            else if (subject.prototype !== void 0 && subject.prototype.render !== void 0) {
                return createComponentShape(subject, objEmpty, arrEmpty)
            }
            // function
            else {
                return extractVirtualNode(subject(component != null ? component.props : {}), component)
            }
            break

        default:
            //VNode
            if (subject.Type) {
                return subject
            }
            //  component instance
            if (subject instanceof Component) {
                return createComponentShape(subject, objEmpty, arrEmpty)
            }
            //plain object with render
            if (typeof subject.render === 'function') {
                return (
                    subject.COMPCache ||
                    createComponentShape(subject.COMPCache = createClass(subject, null), objEmpty, arrEmpty)
                )
            }
            return createEmptyShape()
    }
}


/**
 * extract function node
 *
 * @param  {function}            type
 * @param  {Object<string, any>} props
 * @return {VNode}
 */
export function extractFunctionNode(type, props) {
    try {
        var vnode
        var func = type['--func'] !== void 0

        if (func === false) {
            vnode = type(createElement)
        }

        if (func || vnode.Type !== void 0) {
            try {
                vnode = type(props)

                if (func === false) {
                    type['--func'] = true
                }
            } catch (e) {
                vnode = createEmptyShape()
            }
        }

        return vnode
    }
    // error thrown
    catch (error) {
        return createEmptyShape()
    }
}



/**
 * extract component node
 * 
 * @param  {VNode}      subject
 * @param  {Component?} instance
 * @param  {VNode?}     parent
 * @return {VNode} 
 */
export function extractComponentNode(subject, instance, parent) {
    var owner

    var vnode

    var type = subject.type

    var props = subject.props

    // default props
    if (type.defaultProps !== void 0) {
        // clone default props if props is not an empty object, else use defaultProps as props
        props !== objEmpty ? assignDefaultProps(type.defaultProps, props) : (props = type.defaultProps)
    }
    // assign children to props if not empty
    if (subject.children.length !== 0) {
        // prevents mutating the empty object constant
        if (props === objEmpty) {
            props = { children: subject.children }
        } else {
            props.children = subject.children
        }
    }

    // cached component
    if (type.COMPCache !== void 0) {
        owner = type.COMPCache
    }
    // Stateless functional component
    else if (type.constructor === Function && (type.prototype === void 0 || type.prototype.render === void 0)) {
        vnode = extractFunctionNode(type, props)

        if (vnode.Type === void 0) {
            // create component
            owner = createClass(vnode, props)
        } else {
            // pure function
            return vnode
        }
    }
    // class / createClass components
    else {
        owner = type
    }
    // create component instance
    var component = subject.instance = new owner(props)

    // get render vnodes
    var vnode = applyComponentRender(component)

    // if render returns a component, extract component recursive
    if (vnode.Type === 2) {
        vnode = extractComponentNode(vnode, component, parent || subject)
    }

    // if keyed, assign key to vnode
    if (subject.key !== void 0 && vnode.key === void 0) {
        vnode.key = subject.key
    }

    // replace props and children
    subject.props = vnode.props
    subject.children = vnode.children

    // recursive component
    if (instance !== null) {
        component['--vnode'] = parent
    } else {
        component['--vnode'] = subject

        subject.nodeName = vnode.type
    }

    return vnode
}