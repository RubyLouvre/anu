import { typeNumber, hasSymbol, Fragment, options, REACT_ELEMENT_TYPE } from "./util";
import { Renderer } from "./createRenderer";

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
                    key = ""+val;
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
    return Vnode(type, tag, props, key, ref);
}

export function isValidElement(vnode) {
    return !!vnode && vnode.tag > 0 && vnode.tag !== 6;
}

export function createVText(type, text) {
    let vnode = Vnode(type, 6);
    vnode.props = { children: text };
    return vnode;
}

let lastText, flattenIndex, flattenObject;
function flattenCb(child, key, childType) {
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
    //  flattenArray = [];
    if (c !== void 666) {
        lastText = null;//c 为fiber.props.children
        operateChildren(c, "", flattenCb, typeNumber(c), true);
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

function operateArray(children, prefix, isTop, callback) {
    children.forEach(function (el, i) {
        operateChildren(el, computeName(el, i, prefix, isTop), callback, typeNumber(el), false);
    });
}
//operateChildren有着复杂的逻辑，如果第一层是可遍历对象，那么
export function operateChildren(children, prefix, callback, number, isTop) {
    let key, el, iterator;
    switch (number) {
    case 0://undefined
    case 1://null
    case 2://boolean
    case 3://number
    case 4://string
    case 5://function
    case 6://string
        callback(children, key, number);
        break;
    case 7://array
        operateArray(children, prefix, isTop, callback);
        break;
    case 8://object
        if (children.forEach) {
            operateArray(children, prefix, isTop, callback);
            return;
        } else if (children.type === Fragment) {
            key = children.key ? "$" + children.key : "";
            key = isTop ? key : (prefix ? prefix + ":0" : key || "0");
            el = children.props.children;
            var innerNumber = typeNumber(el);
            if (innerNumber < 7 || !isIterable(el)) {
                el = [el];
                innerNumber = 7;
            }
            operateChildren(el, key, callback, innerNumber, false);
            return;
        }
        var cursor = getIteractor(children);
        if (cursor) {
            iterator = cursor.call(children);
            var ii = 0,
                step;
            while (!(step = iterator.next()).done) {
                el = step.value;
                operateChildren(el, computeName(el, ii, prefix, isTop), callback, typeNumber(el), false);
                ii++;
            }
        } else {
            if (Object(children) === children && !children.call && !children.type) {
                throw "children中存在非法的对象";
            }
            key = prefix || children.key ? "$" + children.key : "0";
            callback(children, key, number);
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

export function createFactory(type) {
    //  console.warn('createFactory is deprecated');
      var factory = createElement.bind(null, type);
      factory.type = type;
      return factory;
  }

function Vnode(type, tag, props, key, ref) {
    var ret =  {
        type,
        tag,
        $$typeof: REACT_ELEMENT_TYPE,
        key: key || null,
        ref: null
    }
   
    if (tag !== 6) {
        ret.props = props;
        ret._owner = Renderer.currentOwner;


        let refType = typeNumber(ref);
        if (refType === 2 || refType === 3 || refType === 4 || refType === 5 || refType === 8) {
            //boolean number, string, function
            if (refType < 4) {
                ref += "";
            }
            ret.ref = ref;
        }
    }
    options.afterCreate(ret);
    return ret
}
