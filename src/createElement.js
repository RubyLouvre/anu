import {EMPTY_CHILDREN, typeNumber} from "./util";
import {Refs} from "./Refs";

export var CurrentOwner = {
    cur: null
};
/**
 * 创建虚拟DOM
 *
 * @param {string} type
 * @param {object} props
 * @param {array} ...children
 * @returns
 */

export function createElement(type, config, ...children) {
    let props = {},
        checkProps = 0,
        vtype = 1,
        key = null,
        ref = null,
        argsLen = children.length;
    if (type && type.call) {
        vtype = type.prototype && type.prototype.render
            ? 2
            : 4;
    } else if (type + "" !== type) {
        console.error("createElement第一个参数类型错误"); // eslint-disable-line
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
                checkProps = 1;
                props[i] = val;
            }
        }
    }

    if (argsLen === 1) {
        props.children = children[0];
        // : EMPTY_CHILDREN;
    } else if (argsLen > 1) {
        props.children = children;
    }

    let defaultProps = type.defaultProps;
    if (defaultProps) {
        for (let propName in defaultProps) {
            if (props[propName] === void 666) {
                checkProps = 1;
                props[propName] = defaultProps[propName];
            }
        }
    }
    return new Vnode(type, key, ref, props, vtype, checkProps);
}

function Vnode(type, key, ref, props, vtype, checkProps) {
    this.type = type;
    this.props = props;
    this.vtype = vtype;
    var owner =  Refs.currentOwner;
    this._owner = owner;

    if (key) {
        this.key = key;
    }

    if (vtype === 1) {
        this.checkProps = checkProps;
    }
    let refType = typeNumber(ref);
    if (refType === 4 || refType === 3) {
        //string, number
        this.ref = Refs.createStringRef(owner, ref+"");
    } else if (refType === 5) {
        if (ref.string) {
            var ref2 = Refs.createStringRef(owner, ref.string);
            this.ref = function (dom) {
                ref(dom);
                ref2(dom);
            };
            this.ref.string = ref.string;
        } else {
            //function
            this.ref = ref;
        }
    }
    /*
      this._hostNode = null
      this._instance = null
    */
}

Vnode.prototype = {
    getDOMNode: function () {
        return this._hostNode || null;
    },

    $$typeof: 1
};

export function flattenChildren(vnode) {
    let arr = EMPTY_CHILDREN,
        c = vnode.props.children;
    if (c !== null) {
        arr = _flattenChildren(c, true);
        if (arr.length === 0) {
            arr = EMPTY_CHILDREN;
        }
    }
    return (vnode.vchildren = arr);
}

export function _flattenChildren(original, convert) {
    let children = [],
        unidimensionalIndex = 0,
        lastText,
        child,
        isMap = convert === "",
        iteractorFn,
        temp = Array.isArray(original)
            ? original.slice(0)
            : [original];

    while (temp.length) {
        if ((child = temp.shift()) && (child.shift || (iteractorFn = getIteractor(child)))) {
            //比较巧妙地判定是否为子数组

            if (iteractorFn) {
                //兼容Immutable.js, Map, Set
                child = callIteractor(iteractorFn, child);
                iteractorFn = false;
                temp
                    .unshift
                    .apply(temp, child);
                continue;
            }
            if (isMap) {
                if (!child._prefix) {
                    child._prefix = "." + unidimensionalIndex;
                    unidimensionalIndex++; //维护第一层元素的索引值
                }
                for (let i = 0; i < child.length; i++) {
                    if (child[i]) {
                        child[i]._prefix = child._prefix + ":" + i;
                    }
                }
            }
            temp
                .unshift
                .apply(temp, child);
        } else {
            let childType = typeNumber(child);
            if (childType < 3) {
                // 0, 1, 2
                if (convert) {
                    continue;
                } else {
                    child = null;
                }
            } else if (childType < 6) {
                if (lastText && convert) {
                    //false模式下不进行合并与转换
                    lastText.text += child;
                    continue;
                }
                if (convert) {
                    child = {
                        type: "#text",
                        text: child + "",
                        vtype: 0
                    };
                    unidimensionalIndex++;
                }
                lastText = child;
            } else {
                if (isMap && !child._prefix) {
                    child._prefix = "." + unidimensionalIndex;
                    unidimensionalIndex++;
                }
                if (!child.type) {
                    throw Error("这不是一个虚拟DOM");
                }
                lastText = false;
            }

            children.push(child);
        }
    }
    return children;
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
