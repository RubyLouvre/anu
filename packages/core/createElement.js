import {
    typeNumber,
    toWarnDev,
    hasSymbol,
    REACT_ELEMENT_TYPE,
    hasOwnProperty
} from './util';
import { Renderer } from './createRenderer';
import { Component } from './Component';

const RESERVED_PROPS = {
    key: true,
    ref: true,
    __self: true,
    __source: true
};

function makeProps(type, config, props, children, len) {
    // Remaining properties override existing props
    let defaultProps, propName;
    for (propName in config) {
        if (
            hasOwnProperty.call(config, propName) &&
            !RESERVED_PROPS.hasOwnProperty(propName)
        ) {
            props[propName] = config[propName];
        }
    }
    if (type && type.defaultProps) {
        defaultProps = type.defaultProps;
        for (propName in defaultProps) {
            if (props[propName] === undefined) {
                props[propName] = defaultProps[propName];
            }
        }
    }
    if (len === 1) {
        props.children = children[0];
    } else if (len > 1) {
        props.children = children;
    }

    return props;
}
function hasValidRef(config) {
    return config.ref !== undefined;
}

function hasValidKey(config) {
    return config.key !== undefined;
}
/**
 * 虚拟DOM工厂
 *
 * @param {string|function|Component} type
 * @param {object} props
 * @param {array} ...children
 * @returns
 */

export function createElement(type, config, ...children) {
    let props = {},
        tag = 5,
        key = null,
        ref = null,
        argsLen = children.length;
    if (type && type.call) {
        tag = type.prototype && type.prototype.render ? 2 : 1;
    } else if (type + '' !== type) {
        toWarnDev('React.createElement: type is invalid.');
    }
    if (config != null) {
        if (hasValidRef(config)) {
            ref = config.ref;
        }
        if (hasValidKey(config)) {
            key = '' + config.key;
        }
    }
    props = makeProps(type, config || {}, props, children, argsLen);

    return ReactElement(type, tag, props, key, ref, Renderer.currentOwner);
}

export function cloneElement(element, config, ...children) {
    // Original props are copied
    let props = Object.assign({}, element.props);

    // Reserved names are extracted
    let type = element.type;
    let key = element.key;
    let ref = element.ref;
    let tag = element.tag;
    // Owner will be preserved, unless ref is overridden
    let owner = element._owner;
    let argsLen = children.length;
    if (config != null) {
        if (hasValidRef(config)) {
            // Silently steal the ref from the parent.
            ref = config.ref;
            owner = Renderer.currentOwner;
        }
        if (hasValidKey(config)) {
            key = '' + config.key;
        }
    }

    props = makeProps(type, config || {}, props, children, argsLen);

    return ReactElement(type, tag, props, key, ref, owner);
}

export function createFactory(type) {
    //  console.warn('createFactory is deprecated');
    var factory = createElement.bind(null, type);
    factory.type = type;
    return factory;
}
/*
tag的值
FunctionComponent = 1;
ClassComponent = 2;
HostPortal = 4; 
HostComponent = 5;
HostText = 6;
Fragment = 7;
*/
function ReactElement(type, tag, props, key, ref, owner) {
    var ret = {
        type,
        tag,
        props
    };
    if (tag !== 6) {
        ret.$$typeof = REACT_ELEMENT_TYPE;
        ret.key = key || null;
        let refType = typeNumber(ref);
        if (
            refType === 2 ||
            refType === 3 ||
            refType === 4 ||
            refType === 5 ||
            refType === 8
        ) {
            //boolean number, string, function,object
            if (refType < 4) {
                ref += '';
            }
            ret.ref = ref;
        } else {
            ret.ref = null;
        }
        ret._owner = owner;
    }
    return ret;
}

export function isValidElement(vnode) {
    return !!vnode && vnode.$$typeof === REACT_ELEMENT_TYPE;
}

export function createVText(text) {
    return ReactElement('#text', 6, text + '');
}

function escape(key) {
    const escapeRegex = /[=:]/g;
    const escaperLookup = {
        '=': '=0',
        ':': '=2'
    };
    const escapedString = ('' + key).replace(escapeRegex, function(match) {
        return escaperLookup[match];
    });

    return '$' + escapedString;
}

let lastText, flattenIndex, flattenObject;
function flattenCb(context, child, key, childType) {
    if (child === null) {
        lastText = null;
        return;
    }
    if (childType === 3 || childType === 4) {
        if (lastText) {
            lastText.props += child;
            return;
        }
        lastText = child = createVText(child);
    } else {
        lastText = null;
    }
    if (!flattenObject[key]) {
        flattenObject[key] = child;
    } else {
        key = '.' + flattenIndex;
        flattenObject[key] = child;
    }
    flattenIndex++;
}

export function fiberizeChildren(children, fiber) {
    flattenObject = {};
    flattenIndex = 0;
    if (children !== void 666) {
        lastText = null; //c 为fiber.props.children
        traverseAllChildren(children, '', flattenCb);
    }
    flattenIndex = 0;
    return (fiber.children = flattenObject);
}

function getComponentKey(component, index) {
    // Do some typechecking here since we call this blindly. We want to ensure
    // that we don't block potential future ES APIs.
    if (Object(component).key != null ) {
        // Explicit key
        return escape(component.key);
    }
    // Implicit key determined by the index in the set
    return index.toString(36);
}

const SEPARATOR = '.';
const SUBSEPARATOR = ':';

//operateChildren有着复杂的逻辑，如果第一层是可遍历对象，那么
export function traverseAllChildren(
    children,
    nameSoFar,
    callback,
    bookKeeping
) {
    let childType = typeNumber(children);
    let invokeCallback = false;
    switch (childType) {
        case 0: //undefined
        case 1: //null
        case 2: //boolean
        case 5: //function
        case 6: //symbol
            children = null;
            invokeCallback = true;
            break;
        case 3: //string
        case 4: //number
            invokeCallback = true;
            break;
        // 7 array
        case 8: //object
            if (children.$$typeof || children instanceof Component) {
                invokeCallback = true;
            } else if (children.hasOwnProperty('toString')) {
                children = children + '';
                invokeCallback = true;
                childType = 3;
            }
            break;
    }

    if (invokeCallback) {
        callback(
            bookKeeping,
            children,
            // If it's the only child, treat the name as if it was wrapped in an array
            // so that it's consistent if the number of children grows.
            nameSoFar === ''
                ? SEPARATOR + getComponentKey(children, 0)
                : nameSoFar,
            childType
        );
        return 1;
    }

    let subtreeCount = 0; // Count of children found in the current subtree.
    const nextNamePrefix =
        nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;
    if (children.forEach) {
        //数组，Map, Set
        children.forEach(function(child, i) {
            let nextName = nextNamePrefix + getComponentKey(child, i);
            subtreeCount += traverseAllChildren(
                child,
                nextName,
                callback,
                bookKeeping
            );
        });
        return subtreeCount;
    }
    const iteratorFn = getIteractor(children);
    if (iteratorFn) {
        let iterator = iteratorFn.call(children),
            child,
            ii = 0,
            step,
            nextName;

        while (!(step = iterator.next()).done) {
            child = step.value;
            nextName = nextNamePrefix + getComponentKey(child, ii++);
            subtreeCount += traverseAllChildren(
                child,
                nextName,
                callback,
                bookKeeping
            );
        }
        return subtreeCount;
    }
    throw 'children: type is invalid.';
}
let REAL_SYMBOL = hasSymbol && Symbol.iterator;
let FAKE_SYMBOL = '@@iterator';
function getIteractor(a) {
    let iteratorFn = (REAL_SYMBOL && a[REAL_SYMBOL]) || a[FAKE_SYMBOL];
    if (iteratorFn && iteratorFn.call) {
        return iteratorFn;
    }
}
