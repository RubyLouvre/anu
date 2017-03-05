/**
 * there are all kinds of methods of handling VNode props
 */

import { nsSvg, nsMath, nsXlink } from './shapes'
/**
 * assign default props
 * 
 * @param  {Object<string, any>} defaultProps
 */
export function assignDefaultProps(defaultProps, props) {
    for (var name in defaultProps) {
        if (props[name] === void 666) {
            props[name] = defaultProps[name]
        }
    }
}

function refs(ref, component, element) {
    if (typeof ref === 'function') {
        ref.call(component, element)
    } else {
        ;(component.refs = component.refs || {})[ref] = element
    }
}

/**
 * assign prop for create element
 * 
 * @param  {Node}       target
 * @param  {Object}     props
 * @param  {boolean}    onlyEvents
 * @param  {Component}  component
 */
export function assignProps(target, props, onlyEvents, component) {
    for (var name in props) {
        var value = props[name]

        // refs
        if (name === 'ref' && value != null) {
            refs(value, component, target)
        }
        // events
        else if (isEventProp(name)) {
            addEventListener(target, name.substring(2).toLowerCase(), value, component)
        }
        // attributes
        else if (onlyEvents === false && name !== 'key' && name !== 'children') {
            // add attribute
            updateProp(target, true, name, value, props.xmlns)
        }
    }
}

function addEventListener(el, type, fn) {
    if (el.addEventListener) {
        el.addEventListener(type, fn)
    } else if (el.attachEvent) {
        el.attachEvent('on' + type, fn)
    }

}
var ron = /^on[A-Z]\w+$/
var rskipProps = /^(children|key|on[A-Z]\w+)$/

export function isEventProp(name) {
    return ron.test(name)
}

/**
 * patch props
 * 
 * @param  {VNode} newNode
 * @param  {VNode} oldNode
 */
export function patchProps(newNode, oldNode) {
    var newProps = newNode.props
    var oldProps = oldNode.props
    var namespace = newNode.props.xmlns || ''
    var target = oldNode.DOMNode
    var updated = false

    // diff newProps
    for (var newName in newNode.props) {

        if (!rskipProps.test(newName)) {
            var newValue = newProps[newName]
            var oldValue = oldProps[newName]

            if (newValue != null && oldValue !== newValue) {
                updateProp(target, true, newName, newValue, namespace)

                if (updated === false) {
                    updated = true
                }
            }
        }
    }

    // diff oldProps
    for (var oldName in oldNode.props) {

        if (!rskipProps.test(oldName)) {
            var newValue = newProps[oldName]

            if (newValue == null) {
                updateProp(target, false, oldName, '', namespace)

                if (updated === false) {
                    updated = true
                }
            }
        }
    }

    if (updated) {
        oldNode.props = newNode.props
    }
}

/**
 * assign/update/remove prop
 * 
 * @param  {Node}    target
 * @param  {boolean} set
 * @param  {string}  name
 * @param  {any}     value
 * @param  {string}  namespace
 */
export function updateProp(target, set, name, value, namespace) {

    // avoid xmlns namespaces
    if ((value === nsSvg || value === nsMath)) {
        return
    }

    // if xlink:href set, exit, 
    if (name === 'xlink:href') {
        target[(set ? 'set' : 'remove') + 'AttributeNS'](nsXlink, 'href', value)
        return
    }

    var svg = false

    // svg element, default to class instead of className
    if (namespace === nsSvg) {
        svg = true

        if (name === 'className') {
            name = 'class'
        } else {
            name = name
        }
    }
    // html element, default to className instead of class
    else {
        if (name === 'class') {
            name = 'className'
        }
    }

    var destination = target[name]
    var defined = value != null && value !== false

    // objects
    if (defined && typeof value === 'object') {
        destination === void 0 ? target[name] = value : updatePropObject(name, value, destination)
    }
    // primitives `string, number, boolean`
    else {
        // id, className, style, etc..
        if (destination !== void 0 && svg === false) {
            if (name === 'style') {
                target.style.cssText = value
            } else {
                target[name] = value
            }
        }
        // set/remove Attribute
        else {
            if (defined && set) {
                // assign an empty value with boolean `true` values
                target.setAttribute(name, value === true ? '' : value)
            } else {
                // removes attributes with false/null/undefined values
                target.removeAttribute(name)
            }
        }
    }
}

/**
 * update prop objects, i.e .style
 *
 * @param {string} parent
 * @param {Object} prop
 * @param {Object} target
 */
export function updatePropObject(parent, prop, target) {
    for (var name in prop) {
        var value = prop[name] || null

        // assign if target object has property
        if (name in target) {
            target[name] = value
        }
        // style properties that don't exist on CSSStyleDeclaration
        else if (parent === 'style') {
            // assign/remove
            value ? target.setProperty(name, value, null) : target.removeProperty(name)
        }
    }
}