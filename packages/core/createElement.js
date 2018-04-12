import { typeNumber, toWarnDev, hasSymbol, Fragment, REACT_ELEMENT_TYPE, hasOwnProperty } from "./util";
import { Renderer } from "./createRenderer";


const RESERVED_PROPS = {
    key: true,
    ref: true,
    __self: true,
    __source: true,
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
    } else if (type + "" !== type) {
        toWarnDev("React.createElement: type is invalid.");
    }
    if (config != null) {
        if (hasValidRef(config)) {
            ref = config.ref;
        }
        if (hasValidKey(config)) {
            key = "" + config.key;
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
            key = "" + config.key;
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
        if (refType === 2 || refType === 3 || refType === 4 || refType === 5 || refType === 8) {
            //boolean number, string, function
            if (refType < 4) {
                ref += "";
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

export function createVText(type, text) {
    let vnode = ReactElement(type, 6, { children: text });
    return vnode;
}


let lastText, flattenIndex, flattenObject;
function flattenCb(child, key) {
    let childType = typeNumber(child);
    let textType = childType === 3 || childType === 4;
    if (textType) {
        //number string
        if (lastText) {
            lastText.props.children += child;
            return;
        }
        lastText = child = createVText("#text", child + "");
    } else if (childType < 7) {
        lastText = null;//undefined, null, boolean, X, Y, function, symbol
        return;
    } else {
        lastText = null;
    }
    if (!flattenObject["." + key]) {
        flattenObject["." + key] = child;
    } else {
        key = "." + flattenIndex;
        flattenObject[key] = child;
    }
    flattenIndex++;
}

export function fiberizeChildren(c, fiber) {
    flattenObject = {};
    flattenIndex = 0;
    if (c !== void 666) {
        lastText = null;//c 为fiber.props.children
        operateChildren(c, "", flattenCb, isIterable(c), true);
    }
    flattenIndex = 0;
    return (fiber._children = flattenObject);
}

function computeName(el, i, prefix, isTop) {
    let k = i + "";
    if (el) {
        if (el.type == Fragment) {
            k = el.key ? "" : k;
        } else {
            k = el.key ? "$" + el.key : k;
        }
    }
    if (!isTop && prefix) {
        return prefix + ":" + k;
    }
    return k;
}
export function isIterable(el) {
    if (el instanceof Object) {
        if (el.forEach) {
            return 1;
        }
        if (el.type === Fragment) {
            return 2;
        }
        let t = getIteractor(el);
        if (t) {
            return t;
        }
    }
    return 0;
}
//operateChildren有着复杂的逻辑，如果第一层是可遍历对象，那么
export function operateChildren(children, prefix, callback, iterableType, isTop) {
    let key, el, t, iterator;
    switch (iterableType) {
    case 0:
        if (Object(children) === children && !children.call && !children.type) {
            if(children.hasOwnProperty("toString")){
                children = children+""
            }else{
                throw "React.createElement: type is invalid.";
            }
        }
        key = prefix || (children && children.key ? "$" + children.key : "0");
        callback(children, key);
        break;
    case 1: //数组，Map, Set
        children.forEach(function (el, i) {
            operateChildren(el, computeName(el, i, prefix, isTop), callback, isIterable(el), false);
        });
        break;
    case 2: //React.Fragment
        key = children && children.key ? "$" + children.key : "";
        key = isTop ? key : (prefix ? prefix + ":0" : key || "0");
        el = children.props.children;
        t = isIterable(el);
        if (!t) {
            el = [el];
            t = 1;
        }
        operateChildren(el, key, callback, t, false);
        break;
    default:
        iterator = iterableType.call(children);
        var ii = 0,
            step;
        while (!(step = iterator.next()).done) {
            el = step.value;
            operateChildren(el, computeName(el, ii, prefix, isTop), callback, isIterable(el), false);
            ii++;
        }
        break;
    }
}
let REAL_SYMBOL = hasSymbol && Symbol.iterator;
let FAKE_SYMBOL = "@@iterator";
function getIteractor(a) {
    let iteratorFn = (REAL_SYMBOL && a[REAL_SYMBOL]) || a[FAKE_SYMBOL];
    if (iteratorFn && iteratorFn.call) {
        return iteratorFn;
    }
}