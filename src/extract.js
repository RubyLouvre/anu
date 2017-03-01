export default {
    vnodes: function(obj) { return obj }
}

// https://github.com/snabbdom/snabbdom/blob/master/src/h.ts
// https://github.com/thysultan/dio.js


/**
 * extract render node
 *
 * @param  {Component} component
 * @return {VNode}
 */
function extractRenderNode(component) {
    try {

        return extractVirtualNode(
            component.render(component.props, component.state, component),
            component
        );

    }
    // error thrown
    catch (error) {
        return componentErrorBoundary(error, component, 'render');
    }
}

/**
 * extract virtual node
 * 
 * @param  {(VNode|function|Component)} subject
 * @param  {Component}                  component
 * @return {VNode}
 */
function extractVirtualNode(subject, component) {
    // empty
    if (subject == null) {
        return createEmptyShape();
    }

    // element
    if (subject.Type !== void 0) {
        return subject;
    }

    // portal
    if (subject.nodeType !== void 0) {
        return (
            subject = createPortalShape(subject, objEmpty, arrEmpty),
            subject.Type = 5,
            subject
        );
    }

    switch (subject.constructor) {
        // component
        case Component:
            {
                return createComponentShape(subject, objEmpty, arrEmpty);
            }
            // booleans
        case Boolean:
            {
                return createEmptyShape();
            }
            // fragment
        case Array:
            {
                return createElement('@', null, subject);
            }
            // string/number
        case String:
        case Number:
            {
                return createTextShape(subject);
            }
            // component/function
        case Function:
            {
                // stream
                if (subject.then != null && typeof subject.then === 'function') {
                    if (subject['--listening'] !== true) {
                        subject.then(function resolveStreamComponent() {
                            component.forceUpdate();
                        }).catch(funcEmpty);

                        subject['--listening'] = true;
                    }

                    return extractVirtualNode(subject(), component);
                }
                // component
                else if (subject.prototype !== void 0 && subject.prototype.render !== void 0) {
                    return createComponentShape(subject, objEmpty, arrEmpty);
                }
                // function
                else {
                    return extractVirtualNode(subject(component != null ? component.props : {}), component);
                }
            }

    }


    // component descriptor
    if (typeof subject.render === 'function') {
        return (
            subject.COMPCache ||
            createComponentShape(subject.COMPCache = createClass(subject, null), objEmpty, arrEmpty)
        );
    }
    // unsupported render types, fail gracefully
    else {
        return componentRenderBoundary(
            component,
            'render',
            subject.constructor.name,
            ''
        );
    }
}


/**
 * extract function node
 *
 * @param  {function}            type
 * @param  {Object<string, any>} props
 * @return {VNode}
 */
function extractFunctionNode(type, props) {
    try {
        var vnode;
        var func = type['--func'] !== void 0;

        if (func === false) {
            vnode = type(createElement);
        }

        if (func || vnode.Type !== void 0) {
            try {
                vnode = type(props);

                if (func === false) {
                    type['--func'] = true;
                }
            } catch (e) {
                vnode = componentErrorBoundary(e, type, 'function');
            }
        }

        return vnode;
    }
    // error thrown
    catch (error) {
        return componentErrorBoundary(error, type, 'function');
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
function extractComponentNode(subject, instance, parent) {
    /** @type {Component} */
    var owner;

    /** @type {VNode} */
    var vnode;

    /** @type {(Component|function(new:Component, Object<string, any>))} */
    var type = subject.type;

    /** @type {Object<string, any>} */
    var props = subject.props;

    // default props
    if (type.defaultProps !== void 0) {
        // clone default props if props is not an empty object, else use defaultProps as props
        props !== objEmpty ? assignDefaultProps(type.defaultProps, props) : (props = type.defaultProps);
    }

    // assign children to props if not empty
    if (subject.children.length !== 0) {
        // prevents mutating the empty object constant
        if (props === objEmpty) {
            props = { children: subject.children };
        } else {
            props.children = subject.children;
        }
    }

    // cached component
    if (type.COMPCache !== void 0) {
        owner = type.COMPCache;
    }
    // function components
    else if (type.constructor === Function && (type.prototype === void 0 || type.prototype.render === void 0)) {
        vnode = extractFunctionNode(type, props);

        if (vnode.Type === void 0) {
            // create component
            owner = createClass(vnode, props);
        } else {
            // pure function
            return vnode;
        }
    }
    // class / createClass components
    else {
        owner = type;
    }

    // create component instance
    var component = subject.instance = new owner(props);

    // retrieve vnode
    var vnode = extractRenderNode(component);

    // if render returns a component, extract component recursive
    if (vnode.Type === 2) {
        vnode = extractComponentNode(vnode, component, parent || subject);
    }

    // if keyed, assign key to vnode
    if (subject.key !== void 0 && vnode.key === void 0) {
        vnode.key = subject.key;
    }

    // replace props and children
    subject.props = vnode.props
    subject.children = vnode.children;

    // recursive component
    if (instance !== null) {
        component['--vnode'] = parent;
    } else {
        component['--vnode'] = subject;

        subject.nodeName = vnode.type;
    }

    return vnode;
}