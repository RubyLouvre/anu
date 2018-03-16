import { typeNumber, hasSymbol, Fragment } from "./util";
import { Vnode } from "./vnode";

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
        throw "React.createElement第一个参数只能是函数或字符串";
    }
    if (config != null) {
        for (let i in config) {
            let val = config[i];
            if (i === "key") {
                if (val !== void 0) {
                    key = val + "";
                }
            } else if (i === "ref") {
                if (val !== void 0) {
                    ref = val;
                }
            } else {
                props[i] = val;
            }
        }
    }

    if (argsLen === 1) {
        props.children = children[0];
    } else if (argsLen > 1) {
        props.children = children;
    }

    let defaultProps = type.defaultProps;
    if (defaultProps) {
        for (let propName in defaultProps) {
            if (props[propName] === void 666) {
                props[propName] = defaultProps[propName];
            }
        }
    }
    return new Vnode(type, tag, props, key, ref);
}

export function createVText(type, text) {
    let vnode = new Vnode(type, 6);
    vnode.text = text;
    return vnode;
}

// 用于辅助XML元素的生成（svg, math),
// 它们需要根据父节点的tagName与namespaceURI,知道自己是存在什么文档中
export function createVnode(node) {
    let type = node.nodeName,
        vnode;
    if (node.nodeType === 1) {
        vnode = new Vnode(type, 5);
        let ns = node.namespaceURI;
        if (!ns || ns.indexOf("html") >= 22) {
            vnode.type = type.toLowerCase(); //HTML的虚拟DOM的type需要小写化
        } else {
            //非HTML需要加上命名空间
            vnode.namespaceURI = ns;
        }
        vnode.props = getProps(node);
    } else {
        vnode = createVText(type, node.nodeValue);
    }
    vnode.stateNode = node;
    return vnode;
}

function getProps(node) {
    let attrs = node.attributes,
        props = {};
    for (let i = 0, attr; (attr = attrs[i++]);) {
        if (attr.specified) {
            let name = attr.name;
            if (name === "class") {
                name = "className";
            }
            props[name] = attr.value;
        }
    }
    return props;
}

let lastText, flattenIndex, flattenObject;
function flattenCb(child, key) {
    let childType = typeNumber(child);
    if (childType < 3) {
        //在React16中undefined, null, boolean不会产生节点
        lastText = null;
        return;
    } else if (childType < 5) {
        //number string
        if (lastText) {
            //合并相邻的文本节点
            lastText.text += child;
            return;
        }
        lastText = child = createVText("#text", child + "");
    } else {
        lastText = null;
    }
    if (!flattenObject["." + key]) {
        flattenObject["." + key] = child;
    } else {
        key = "." + flattenIndex;
        flattenObject[key] = child;
    }
    child.index = flattenIndex++;
    // flattenArray.push(child);
}

export function fiberizeChildren(c, fiber) {
    flattenObject = {};
    flattenIndex = 0;
    //  flattenArray = [];
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
            throw "children中存在非法的对象";
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
