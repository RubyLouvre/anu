(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.anu = factory());
}(this, function () {

    /**
     * To quickly create a series of virtual DOM
     */
    //用到objEmpty, arrEmpty

    let objEmpty = {}
    let arrEmpty = []
    let nsMath = 'http://www.w3.org/1998/Math/MathML'
    let nsXlink = 'http://www.w3.org/1999/xlink'
    let nsSvg = 'http://www.w3.org/2000/svg'

    /**
     * component shape
     *
     * @public
     * 
     * @param  {(function|Component)} type
     * @param  {Object<string, any>=} props
     * @param  {any[]=}               children
     * @return {VNode}
     */
    function createComponentShape(type, props, children) {
        return {
            Type: 2,
            type: type,
            props: (props = props != null ? props : objEmpty),
            children: (children == null ? arrEmpty : children),
            DOMNode: null,
            instance: null,
            index: 0,
            nodeName: null,
            key: props !== objEmpty ? props.key : void 0
        }
    }

    /**
     * element shape
     *
     * @public
     * 
     * @param  {string}               type
     * @param  {Object<string, any>=} props
     * @param  {VNode[]=}             children
     * @return {VNode}
     */
    function createElementShape(type, props, children) {
        return {
            Type: 1,
            type: type,
            props: (props = props != null ? props : objEmpty),
            children: (children == null ? [] : children),
            DOMNode: null,
            instance: null,
            index: 0,
            nodeName: null,
            key: props !== objEmpty ? props.key : void 0
        }
    }

    /**
     * empty shape
     * 
     * @return {VNode}
     */
    function createEmptyShape() {
        return {
            Type: 1,
            type: 'noscript',
            props: objEmpty,
            children: [],
            DOMNode: null,
            instance: null,
            index: 0,
            nodeName: null,
            key: void 0
        }
    }

    /**
     * create node shape
     *
     * @param  {number}                      Type
     * @param  {(string|function|Component)} type
     * @param  {Object<string, any>}         props
     * @param  {VNode[]}                     children
     * @param  {Node}                        DOMNode
     * @param  {Component}                   instance
     * @param  {number}                      index
     * @param  {string?}                     nodeName
     * @param  {any}                         key
     * @return {VNode}
     */
    function createNodeShape(Type, type, props, children, DOMNode, instance, index, nodeName, key) {
        return {
            Type: Type,
            type: type,
            props: props,
            children: children,
            DOMNode: DOMNode,
            instance: instance,
            index: index,
            nodeName: nodeName,
            key: key
        }
    }


    /**
     * portal shape
     *
     * @public
     * 
     * @param  {Node} DOMNode
     * @return {VNode}
     */
    function createPortalShape(type, props, children) {
        return {
            Type: 4,
            type: type.nodeName.toLowerCase(),
            props: (props = props != null ? props : objEmpty),
            children: (children == null ? [] : children),
            DOMNode: type,
            instance: null,
            index: 0,
            nodeName: null,
            key: props !== objEmpty ? props.key : void 0
        }
    }

    /**
     * create text shape
     *
     * @public
     * 
     * @param  {(string|boolean|number)} text
     * @return {VNode}
     */
    function createTextShape(text) {
        return {
            Type: 3,
            type: '#text',
            props: objEmpty,
            children: text,
            DOMNode: null,
            instance: null,
            index: 0,
            nodeName: null,
            key: void 0
        }
    }

    var nodeEmpty = createNodeShape(0, '', objEmpty, arrEmpty, null, null, 0, null, void 0)

    //用到objEmpty, arrEmpty

    function createChild(child, children, index) {
        if (child != null) {
            // vnode
            if (child.Type !== void 0) {
                children[index++] = child
            }
            // portal
            else if (child.nodeType !== void 0) {
                children[index++] = createPortalShape(child, objEmpty, arrEmpty)
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

    function createElement(type, props) {
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
    function cloneElement(subject, newProps, newChildren) {
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

    function createFactory(type, props) {
        var factory = createElement.bind(null, type, props)
        factory.type = type
        return factory
    }

    function isValidElement(subject) {
        return subject != null && subject.Type != null
    }

    /**
     * assign default props
     * 
     * @param  {Object<string, any>} defaultProps
     */
    function assignDefaultProps(defaultProps, props) {
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
    function assignProps(target, props, onlyEvents, component) {
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

    function isEventProp(name) {
        return ron.test(name)
    }

    /**
     * patch props
     * 
     * @param  {VNode} newNode
     * @param  {VNode} oldNode
     */
    function patchProps(newNode, oldNode) {
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
    function updateProp(target, set, name, value, namespace) {

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
    function updatePropObject(parent, prop, target) {
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

    //用到objEmpty, arrEmpty
    /**
     * extract render node
     *
     * @param  {Component} component
     * @return {VNode}
     */
    function applyComponentRender(component) {
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
    function extractVirtualNode(subject, component) {
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
    function extractFunctionNode(type, props) {
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
    function extractComponentNode(subject, instance, parent) {
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

    var componentHooks = {
        '0': 'componentWillMount',
        '1': 'componentDidMount',
        '2': 'componentWillReceiveProps',
        '3': 'shouldComponentUpdate', //componentShouldUpdate
        '4': 'componentWillUpdate',
        '5': 'componentDidUpdate',
        '6': 'componentWillUnmount',
        '-2': 'getDefaultProps',
        '-1': 'getInitialState'
    }

    function applyComponentHook(el, index) {
        var hook = componentHooks[index]
        if (el && el[hook]) {
            return el[hook].apply(el, Array.prototype.slice.call(arguments, 2))
        }
    }

    /**
     * ------------------ The Life-Cycle of a Composite Component ------------------
     *
     * - constructor: Initialization of state. The instance is now retained.
     *   - componentWillMount
     *   - render
     *   - [children's constructors]
     *     - [children's componentWillMount and render]
     *     - [children's componentDidMount]
     *     - componentDidMount
     *
     *       Update Phases:
     *       - componentWillReceiveProps (only called if parent updated)
     *       - shouldComponentUpdate
     *         - componentWillUpdate
     *           - render
     *           - [children's constructors or receive props phases]
     *         - componentDidUpdate
     *
     *     - componentWillUnmount
     *     - [children's componentWillUnmount]
     *   - [children destroyed]
     * - (destroyed): The instance is now blank, released by React and ready for GC.
     *
     * -----------------------------------------------------------------------------
     */

    //用到objEmpty

    /**
     * append node
     *
     * @param {number} newType
     * @param {VNode}  newNode
     * @param {Node}   parentNode
     * @param {Node}   nextNode
     */
    function appendNode(newType, newNode, parentNode, nextNode) {
        var instance = newNode.instance
            // lifecycle, componentWillMount
        applyComponentHook(instance, 0, nextNode)
            // append element
        parentNode.appendChild(nextNode)

        // lifecycle, componentDidMount
        applyComponentHook(instance, 1, nextNode)
    }


    /**
     * create DOMNode
     *
     * @param {number}    type
     * @param {Component} component
     */
    function createDOMNode(type, component) {
        try {
            return document.createElement(type)
        } catch (error) {
            return document.createComment('create element fail')

        }
    }



    /**
     * create namespaced DOMNode
     *
     * @param {namespace} namespace
     * @param {number}    type
     * @param {Componnet} component
     */
    function createDOMNodeNS(namespace, type, component) {
        try {
            return document.createElementNS(namespace, type)
        } catch (error) {
            return document.createComment('create element fail')
        }
    }

    /**
     * remove node
     *
     * @param {number} oldType
     * @param {VNode}  oldNode
     * @param {Node}   parentNode
     */
    function removeNode(oldType, oldNode, parentNode) {
        // lifecycle, componentWillUnmount
        var instance = oldNode.instance
        applyComponentHook(instance, 6, oldNode.DOMNode)


        // remove element
        parentNode.removeChild(oldNode.DOMNode)

        // clear references
        oldNode.DOMNode = null
    }

    /**
     * replace node
     *
     * @param {VNode} newType
     * @param {VNode} oldType
     * @param {VNode} newNode
     * @param {VNode} oldNode
     * @param {Node}  parentNode 
     * @param {Node}  nextNode
     */
    function replaceNode(newType, oldType, newNode, oldNode, parentNode, nextNode) {
        // lifecycle, componentWillUnmount
        var instance = oldNode.instance
        applyComponentHook(instance, 6, oldNode.DOMNode)

        // lifecycle, componentWillMount
        instance = newNode.instance

        applyComponentHook(instance, 0, nextNode)

        // replace element
        parentNode.replaceChild(nextNode, oldNode.DOMNode)

        // lifecycle, componentDidmount
        applyComponentHook(instance, 1, nextNode)


        // clear references
        oldNode.DOMNode = null
    }

    /**
     * replace root node
     * 
     * @param  {VNode}     newNode
     * @param  {VNode}     oldNode
     * @param  {number}    newType
     * @param  {number}    oldType
     * @param  {Component} component
     */
    function replaceRootNode(newNode, oldNode, newType, oldType, component) {
        var refDOMNode = oldNode.DOMNode
        var newProps = newNode.props

        // replace node
        refDOMNode.parentNode.replaceChild(createNode(newNode, component, null), refDOMNode)

        // hydrate new node
        oldNode.props = newProps
        oldNode.nodeName = newNode.nodeName || newNode.type
        oldNode.children = newNode.children
        oldNode.DOMNode = newNode.DOMNode

        //  stylesheet
        if (newType !== 3 && component.stylesheet !== void 0) {
            //  createScopedStylesheet(component, component.constructor, newNode.DOMNode);
        }
    }


    /**
     * empty node
     *
     * @param {VNode}  oldNode
     * @param {number} oldLength
     */
    function emptyNode(oldNode, oldLength) {
        var children = oldNode.children
        var parentNode = oldNode.DOMNode
        var oldChild

        // umount children
        for (var i = 0; i < oldLength; i++) {
            oldChild = children[i]
            var instance = oldChild.instance
                // lifecycle, componentWillUnmount
            applyComponentHook(instance, 6, oldChild.DOMNode)

            // clear references
            oldChild.DOMNode = null
        }

        parentNode.textContent = ''
    }


    /**
     * create node
     * 
     * @param  {VNode}      subject
     * @param  {Component?} component
     * @param  {string?}    namespace
     * @return {Node}
     */
    function createNode(subject, component, namespace) {
        var nodeType = subject.Type

        // create text node element	
        if (nodeType === 3) {
            return subject.DOMNode = document.createTextNode(subject.children)
        }

        var vnode
        var element
            // DOMNode exists
        if (subject.DOMNode !== null) {
            element = subject.DOMNode
                // hoisted

            return subject.DOMNode = element.cloneNode(true)

        } else { // create DOMNode
            vnode = nodeType === 2 ? extractComponentNode(subject, null, null) : subject
        }

        var Type = vnode.Type
        var children = vnode.children

        // text		
        if (Type === 3) {
            return vnode.DOMNode = subject.DOMNode = document.createTextNode(children)
        }

        var type = vnode.type
        var props = vnode.props
        var length = children.length

        var instance = subject.instance !== null
        var thrown = 0

        // assign namespace
        if (props.xmlns !== void 0) {
            namespace = props.xmlns
        }

        // has a component instance, hydrate component instance
        if (instance) {
            component = subject.instance
            thrown = component['--throw']
        }


        // create namespaced element
        if (namespace !== null) {
            // if undefined, assign svg namespace
            if (props.xmlns === void 0) {
                props === objEmpty ? (props = { xmlns: namespace }) : (props.xmlns = namespace)
            }

            element = createDOMNodeNS(namespace, type, component)
        }
        // create html element
        else {
            element = createDOMNode(type, component)
        }

        vnode.DOMNode = subject.DOMNode = element


        if (instance) {
            // avoid appending children if an error was thrown while creating a DOMNode
            if (thrown !== component['--throw']) {
                return vnode.DOMNode = subject.DOMNode = element
            }

            vnode = component['--vnode']

            // hydrate
            if (vnode.DOMNode === null) {
                vnode.DOMNode = element
            }

            // stylesheets
            if (nodeType === 2 && component.stylesheet !== void 0 && type !== 'noscript' && type !== '#text') {
                // createScopedStylesheet(component, subject.type, element);
            }
        }

        // has children
        if (length !== 0) {
            // append children
            for (var i = 0; i < length; i++) {
                var newChild = children[i]

                // hoisted, clone
                if (newChild.DOMNode !== null) {
                    newChild = children[i] = cloneNode$1(newChild)
                }

                // append child
                appendNode(newChild.Type, newChild, element, createNode(newChild, component, namespace))
            }
        }

        // has props
        if (props !== objEmpty) {
            // props and events
            assignProps(element, props, false, component)
        }

        // cache DOM reference
        return element
    }

    function cloneNode$1(subject) {
        return createNodeShape(
            subject.Type,
            subject.type,
            subject.props,
            subject.children,
            subject.DOMNode,
            null,
            0,
            null,
            void 0
        )
    }

    /**
     * reconcile nodes
     *  
     * @param  {VNode}  newNode
     * @param  {VNode}  oldNode
     * @param  {number} newNodeType
     * @param  {number} oldNodeType
     */
    function reconcileNodes(newNode, oldNode, newNodeType, oldNodeType) {
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
    function reconcileKeys(newKeys, oldKeys, parentNode, newNode, oldNode, newLength, oldLength, position, length) {
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

    /**
     * Component class
     * 
     * @public
     * @export
     * @param {Object} props
     */
    function Component(props) {
        // initial props
        if (props === objEmpty) {
            props = {}
        }
        // apply getDefaultProps Hook
        if (this.getDefaultProps) {
            var defaultProps = this.getDefaultProps(props === objEmpty ? props : null)
            assignDefaultProps(defaultProps, props)
        }

        // apply componentWillReceiveProps Hook
        applyComponentHook(this, 2, props)

        this.props = props

        // assign state
        this.state = this.state || applyComponentHook(this, -1, null) || {}


        this.refs = null

        this['--vnode'] = null
    }


    /**
     * Component prototype
     * 
     * @type {Object<string, function>}
     */
    Component.prototype = {
        constructor: Component,
        setState: setState,
        forceUpdate: forceUpdate
    }


    /**
     * set state
     *
     * @public
     * 
     * @param {Object}                    newState
     * @param {function(this:Component)=} callback
     */
    function setState(newState, callback) {
        // shouldComponentUpdate 
        if (applyComponentHook(this, 3, this.props, newState) === false) {
            return
        }

        // update state
        updateState(this.state, newState)

        // callback
        if (typeof callback === 'function') {
            callback.call(this)
        }

        // update component
        this.forceUpdate()
    }


    /**
     * 
     * @param {Object|function} oldState
     * @param {any} newState
     */
    function updateState(oldState, newState) {
        if (oldState != null) {
            if (typeof newState === 'function') {
                newState(oldState)
            } else {
                for (var name in newState) {
                    oldState[name] = newState[name]
                }
            }
        }
    }

    /**
     * force an update
     *
     * @public
     * 
     * @param  {function(this:Component)=} callback
     */
    function forceUpdate(callback) {
        // componentWillUpdate
        applyComponentHook(this, 4, this.props, this.state)


        var oldNode = this['--vnode']
        var newNode = applyComponentRender(this)

        var newType = newNode.Type
        var oldType = oldNode.Type

        // different root node
        if (newNode.type !== oldNode.nodeName) {
            replaceRootNode(newNode, oldNode, newType, oldType, this)
        }
        // patch node
        else {
            // element root node
            if (oldType !== 3) {
                reconcileNodes(newNode, oldNode, newType, 1)
            }
            // text root node
            else if (newNode.children !== oldNode.children) {
                oldNode.DOMNode.nodeValue = oldNode.children = newNode.children
            }
        }

        // componentDidUpdate
        applyComponentHook(this, 5, this.props, this.state)

        // callback
        if (typeof callback === 'function') {
            callback.call(this)
        }
    }

    /**
     * create class
     *
     * @public
     * 
     * @param  {(Object<string, any>|function(createElement): (Object<string, any>|function))} subject
     * @param  {Object<string, any>=} props
     * @return {function(new:Component, Object<string, any>)}
     */
    function createClass(subject, props) {
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
            // numbers, strings, arrays
        if (type !== 2 && shape.constructor !== Object && shape.render === void 0) {
            shape = extractVirtualNode(shape, { props: props })
        }

        // elements/functions
        if (type !== 0) {
            // render method
            render = type === 1 ? (vnode = shape, function() { return vnode; }) : shape;

            // new shape
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
        function component(props) {
            // constructor
            if (construct) {
                constructor.call(this, props)
            }

            // extend Component
            Component.call(this, props)
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
    function hydrate(parent, subject, index, parentVNode, component) {
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

    var browser = typeof window === 'object' && !!window.document
        //用到objEmpty, arrEmpty

    /**
     * render
     *
     * @public
     * 
     * @param  {(Component|VNode|function|Object<string, any>)} subject
     * @param  {(Node)=}                                 target
     * @param  {function(this:Component, Node)=}                callback
     * @param  {boolean=}                                       hydration
     * @return {function(Object=)}
     */
    function render(subject, target, callback, hydration) {
        var initial = true
        var nodeType = 2

        var component
        var vnode
        var container

        // renderer
        function renderer(newProps) {
            if (initial) {
                // dispatch mount
                // vnode.Type, vnode, container, vnode.DOMNode
                appendNode(nodeType, vnode, container, createNode(vnode, null, null))

                // register mount has been dispatched
                initial = false

                // assign component instance
                component = vnode.instance
            } else {
                // update props
                if (newProps !== void 0) {
                    // component with shouldComponentUpdate
                    if (applyComponentHook(component, 3, newProps, component.state) === false) {
                        // exit early
                        return renderer
                    }

                    component.props = newProps
                }

                // update component
                component.forceUpdate()
            }

            return component // renderer;
        }

        // exit early
        if (browser === false) {
            return renderer
        }
        // Try to convert the first parameter to the virtual DOM


        vnode = extractVirtualNode(subject)


        // Encapsulated into components, in order to use forceUpdate inside the render
        if (vnode.Type !== 2) {
            vnode = createComponentShape(createClass(vnode, null), objEmpty, arrEmpty)
        }

        // mount
        if (target != null && target.nodeType != null) {
            // target is a dom container
            container = target === document ? docuemnt.body : target
        }
        // hydration
        if (hydration != null && hydration !== false) {
            // dispatch hydration
            hydrate(container, vnode, typeof hydration === 'number' ? hydration : 0, null, null)

            // register mount has been dispatched
            initial = false

            // assign component
            component = vnode.instance
        } else {
            // destructive mount
            if (hydration === false) {
                while (container.firstChild) {
                    container.removeChild(container.firstChild)
                }
            }

            renderer()
        }

        // if present call root components context, passing root node as argument
        if (callback && typeof callback === 'function') {
            callback.call(component, vnode.DOMNode || target)
        }

        return component //renderer;
    }

    var index = {
        cloneElement,
        createElement,
        h: createElement,

        createFactory,
        isValidElement,

        createClass,
        Component,

        render
    }

    return index;

}));