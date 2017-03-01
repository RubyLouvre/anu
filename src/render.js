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
function render(subject, target, callback, hydration) {
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
                if (
                    typeof component.shouldComponentUpdate === 'function' &&
                    component.shouldComponentUpdate(newProps, component.state) === false
                ) {
                    // exit early
                    return renderer;
                }

                component.props = newProps;
            }

            // update component
            component.forceUpdate();
        }

        return renderer;
    }

    // exit early
    if (browser === false) {
        return renderer;
    }

    // Object
    if (subject.render !== void 0) {
        vnode = createComponentShape(createClass(subject, null), objEmpty, arrEmpty);
    }
    // array/component/function
    else if (subject.Type === void 0) {
        // array
        if (subject.constructor === Array) {
            vnode = createElement('@', null, subject);
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

    // element
    if (vnode.Type !== 2) {
        vnode = createComponentShape(createClass(vnode, null), objEmpty, arrEmpty);
    }

    // mount
    if (target != null && target.nodeType != null) {
        // target is a dom element
        element = target === document ? docuemnt.body : target;
    } else {
        // selector
        target = document.querySelector(target);

        // default to document.body if no match/document
        element = (target === null || target === document) ? document.body : target;
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
        hydration === false && (element.textContent = '');

        renderer();
    }

    // if present call root components context, passing root node as argument
    if (callback && typeof callback === 'function') {
        callback.call(component, vnode.DOMNode || target);
    }

    return renderer;
}