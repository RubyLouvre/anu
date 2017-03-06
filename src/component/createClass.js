import { createEmptyShape } from '../shapes'
import { createElement } from '../element/index'
import { extractVirtualNode } from '../extract'
import Component from './Component'

/**
 * create class
 *
 * @public
 * 
 * @param  {Object|function} subject
 * @param  {Object} props
 * @return {function(new:Component, Object<string, any>)}
 */
export default function createClass(subject, props) {
    // empty class
    if (subject == null) {
        subject = createEmptyShape()
    }

    // component cache
    if (subject.COMPCache !== void 0) {
        return subject.COMPCache
    }

    // is function?
    var func = typeof subject === 'function'
        // extract shape of component
    var shape = func ? (subject(createElement) || createEmptyShape()) : subject
    var type = func && typeof shape === 'function' ? 2 : (shape.Type != null ? 1 : 0)
    var construct = false

    var vnode
    var constructor
    var render
        // numbers, strings
    if (type !== 2 && shape.constructor !== Object && shape.render === void 0) {
        shape = extractVirtualNode(shape, { props: props })
    }

    // elements/functions
    if (type !== 0) {
        // render method
        render = type === 1 ? (vnode = shape, function() { return vnode; }) : shape;
        shape = { render: render };
    } else {
        if (construct = shape.hasOwnProperty('constructor')) {
            constructor = shape.constructor
        }

        // create render method if one does not exist
        if (typeof shape.render !== 'function') {
            shape.render = function() { return createEmptyShape() }
        }
    }

    // create component class
    function component(props, context) {
        // constructor
        if (construct) {
            constructor.call(this, props, context)
        }

        // extend Component
        Component.call(this, props, context)
    }

    // extends shape
    component.prototype = shape
        // extends Component class
    shape.setState = Component.prototype.setState
    shape.forceUpdate = Component.prototype.forceUpdate
    component.constructor = Component

    // function shape, cache component
    if (func) {
        shape.constructor = subject
        subject.COMPCache = component
    }

    // stylesheet namespaced
    if (func || shape.stylesheet !== void 0) {
        // displayName / function name / random string
        shape.displayName = (
            shape.displayName ||
            (func ? subject.name : false) ||
            ((Math.random() + 1).toString(36).substr(2, 5))
        )
    }

    return component
}

// https://github.com/atom/etch/blob/master/lib/patch.js