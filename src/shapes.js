/**
 * To quickly create a series of virtual DOM
 */
//用到objEmpty, arrEmpty

export let objEmpty = {}
export let arrEmpty = []
export let nsMath = 'http://www.w3.org/1998/Math/MathML'
export let nsXlink = 'http://www.w3.org/1999/xlink'
export let nsSvg = 'http://www.w3.org/2000/svg'

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
export function createComponentShape(type, props, children) {
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
export function createElementShape(type, props, children) {
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
export function createEmptyShape() {
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
 * fragment shape
 *
 * @public
 * 
 * @param  {VNode[]} children
 * @return {VNode}
 */
export function createFragmentShape(children) {
    return {
        Type: 1,
        type: 'fragment',
        props: fragProps,
        children: children,
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
export function createNodeShape(Type, type, props, children, DOMNode, instance, index, nodeName, key) {
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
export function createPortalShape(type, props, children) {
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
 * svg shape
 *
 * @public
 * 
 * @param  {string}               type
 * @param  {Object<string, any>=} props
 * @param  {VNode[]=}             children
 * @return {VNode}
 */
export function createSvgShape(type, props, children) {
    return {
        Type: 1,
        type: type,
        props: (props == null ? (props = { xmlns: nsSvg }) : (props.xmlns = nsSvg, props)),
        children: (children == null ? [] : children),
        DOMNode: null,
        instance: null,
        index: 0,
        nodeName: null,
        key: props.key
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
export function createTextShape(text) {
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

export var nodeEmpty = createNodeShape(0, '', objEmpty, arrEmpty, null, null, 0, null, void 0)