import { typeNumber } from "./util";
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
        _hasProps = 0,
        vtype = 1,
        key = null,
        ref = null,
        argsLen = children.length;
    if (type && type.call) {
        vtype = type.prototype && type.prototype.render ? 2 : 4;
    } else if (type + "" !== type) {
        console.error("React.createElement: type is invalid");
        type ="#comment";
        vtype = 0;
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
            } else if (i === "children") {
                props[i] = val;
            } else {
                _hasProps = 1;
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
                _hasProps = 1;
                props[propName] = defaultProps[propName];
            }
        }
    }
    return new Vnode(type, vtype, props, key, ref, _hasProps);
}

export function createVText(type, text) {
    var vnode = new Vnode(type, 0);
    vnode.text = text;
    return vnode;
}

// 用于辅助XML元素的生成（svg, math),
// 它们需要根据父节点的tagName与namespaceURI,知道自己是存在什么文档中
export function createVnode(node) {
    var type = node.nodeName, vnode;
    if (node.nodeType === 1) {
        vnode = new Vnode(type, 1);
        var ns = node.namespaceURI;
        if (!ns || ns.indexOf("html") >= 22) {
            vnode.type = type.toLowerCase(); //HTML的虚拟DOM的type需要小写化
        } else {
            //非HTML需要加上命名空间
            vnode.namespaceURI = ns;
        }
    } else {
        vnode = createVText(type, node.nodeValue);
    }
    vnode.stateNode = node;
    return vnode;
}

export function restoreChildren(parent) {
    var ret = [];
    for (var el = parent.child; el; el = el.sibling) {
        ret.push(el);
    }
    return ret;
}

export function fiberizeChildren(vnode) {
    let c = vnode.props.children,
        ret = [],
        prev;
    if (c !== void 666) {
        var lastText; 
        ret = operateChildren(c, false, function(ret, child) {
            let childType = typeNumber(child);
            if (childType < 3) {
                //undefined, null, boolean
                child = createVText("#comment","empty");
                lastText = null;
            } else if (childType < 5) {
                //number string
                if(lastText){ //合并相邻的文本节点
                    lastText.text += child;
                    return;
                }
                lastText = child =  createVText("#text", child+"");
            }else{
                lastText = null;
            }
            child.index = ret.length;
            child.return = vnode;
            if (prev) {
                prev.sibling = child;
            }
            prev = child;
            ret.push(child);
        });
    }
    var child = ret[0];
    if (child) {
        vnode.child = child;
    }
    return ret;
}

export function operateChildren(children, isMap, callback) {
    let ret = [],
        keeper = {
            unidimensionalIndex: 0
        },
        child,
        iteractorFn,
        temp = Array.isArray(children) ? children.slice(0) : [children];
    while (temp.length) {
        if ((child = temp.shift()) && (child.shift || (iteractorFn = getIteractor(child)))) {
            //比较巧妙地判定是否为子数组
            if (iteractorFn) {
                //兼容Immutable.js, Map, Set
                child = callIteractor(iteractorFn, child);
                iteractorFn = false;
                temp.unshift.apply(temp, child);
                continue;
            }
            if (isMap) {
                if (!child._prefix) {
                    child._prefix = "." + keeper.unidimensionalIndex;
                    keeper.unidimensionalIndex++; //维护第一层元素的索引值
                }
                for (let i = 0; i < child.length; i++) {
                    if (child[i]) {
                        child[i]._prefix = child._prefix + ":" + i;
                    }
                }
            }
            temp.unshift.apply(temp, child);
        } else {
            if (typeNumber(child) === 8  && !child.type) {
                throw Error("invalid type");
            }
            callback(ret, child, keeper);
        }
    }
    return ret;
}

var REAL_SYMBOL = typeof Symbol === "function" && Symbol.iterator;
var FAKE_SYMBOL = "@@iterator";
function getIteractor(a) {
    if (typeNumber(a) > 7) {
        var iteratorFn = (REAL_SYMBOL && a[REAL_SYMBOL]) || a[FAKE_SYMBOL];
        if (iteratorFn && iteratorFn.call) {
            return iteratorFn;
        }
    }
}
function callIteractor(iteratorFn, children) {
    var iterator = iteratorFn.call(children),
        step,
        ret = [];
    if (iteratorFn !== children.entries) {
        while (!(step = iterator.next()).done) {
            ret.push(step.value);
        }
    } else {
        //Map, Set
        while (!(step = iterator.next()).done) {
            var entry = step.value;
            if (entry) {
                ret.push(entry[1]);
            }
        }
    }
    return ret;
}

