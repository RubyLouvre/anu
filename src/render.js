import applyComponentHook from './component/lifecycle'
import createClass from './component/createClass'

import hydrate from './hydrate'
import { createComponentShape, objEmpty, arrEmpty } from './shapes'
import { appendNode, createNode } from './vnode'
var browser = typeof window === 'object' && !!window.document
    //用到objEmpty, arrEmpty

/**
 * render
 *
 * @public
 * 
 * @param  {(Component|VNode|function|Object<string, any>)} subject
 * @param  {(Node|string)=}                                 target
 * @param  {function(this:Component, Node)=}                callback
 * @param  {boolean=}                                       hydration
 * @return {function(Object=)}
 */
export default function render(subject, target, callback, hydration) {
    var initial = true;
    var nodeType = 2;

    var component;
    var vnode;
    var element;

    // renderer
    function renderer(newProps) {
        if (initial) {
            // dispatch mount
            appendNode(nodeType, vnode, element, createNode(vnode, null, null));

            // register mount has been dispatched
            initial = false;

            // assign component instance
            component = vnode.instance;
        } else {
            // update props
            if (newProps !== void 0) {
                // component with shouldComponentUpdate
                if (applyComponentHook(component, 3, newProps, component.state) === false) {
                    // exit early
                    return renderer;
                }

                component.props = newProps;
            }

            // update component
            component.forceUpdate();
        }

        return component // renderer;
    }

    // exit early
    if (browser === false) {
        return renderer;
    }
    // Try to convert the first parameter to the virtual DOM
    // h('type', null, []) ==> createElementShape
    // h(Scoller, null, []) === > createComponentShape
    // Booleans, Null, and Undefined ==> createEmptyShape
    // String, Number ===> createTextShape
    if (subject.render !== void 0) {
        vnode = createComponentShape(createClass(subject, null), objEmpty, arrEmpty);
    }
    // array/component/function
    else if (subject.Type === void 0) {
        // array
        if (Array.isArray(subject)) {
            throw 'The first argument can\'t be an array'
        }
        // component/function
        else {
            vnode = createComponentShape(subject, objEmpty, arrEmpty);
        }
    }
    // element/component
    else {
        vnode = subject;
    }

    // Encapsulated into components, in order to use forceUpdate inside the render
    if (vnode.Type !== 2) {
        vnode = createComponentShape(createClass(vnode, null), objEmpty, arrEmpty);
    }

    // mount
    if (target != null && target.nodeType != null) {
        // target is a dom element
        element = target === document ? docuemnt.body : target;
    }
    // hydration
    if (hydration != null && hydration !== false) {
        // dispatch hydration
        hydrate(element, vnode, typeof hydration === 'number' ? hydration : 0, null, null);

        // register mount has been dispatched
        initial = false;

        // assign component
        component = vnode.instance;
    } else {
        // destructive mount
        if (hydration === false) {
            while (element.firstChild) {
                element.removeChild(element.firstChild)
            }
        }

        renderer();
    }

    // if present call root components context, passing root node as argument
    if (callback && typeof callback === 'function') {
        callback.call(component, vnode.DOMNode || target);
    }

    return component //renderer;
}