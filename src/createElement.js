import { EMPTY_CHILDREN, typeNumber } from "./util";

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

export function createElement(type, config, children) {
    let props = {},
        checkProps = 0,
        vtype = 1,
        key = null,
        ref = null,
        argsLen = arguments.length - 2;
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
        props.children = typeNumber(children) > 2 ? children : EMPTY_CHILDREN;
    } else if (argsLen > 1) {
        let childArray = Array(argsLen);
        for (let i = 0; i < argsLen; i++) {
            childArray[i] = arguments[i + 2];
        }
        props.children = childArray;
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
    if (typeNumber(type) === 5) {
        //fn
        vtype = type.prototype && type.prototype.render
            ? 2
            : 4;
    }
    return new Vnode(type, key, ref, props, vtype, checkProps);
}

//fix 0.14对此方法的改动，之前refs里面保存的是虚拟DOM
function getDOMNode() {
    return this;
}

function createStringRef(owner, ref) {
    function stringRef(dom) {
        if (dom) {
            if (dom.nodeType) {
                dom.getDOMNode = getDOMNode;
            }
            owner.refs[ref] = dom;
        }
    }
    stringRef.string = ref;
    return stringRef;
}
function Vnode(type, key, ref, props, vtype, checkProps) {
    this.type = type;
    this.props = props;
    this.vtype = vtype;
    var owner = CurrentOwner.cur;
    this._owner = owner;

    if (key) {
        this.key = key;
    }

    if (vtype === 1) {
        this.checkProps = checkProps;
    }
    let refType = typeNumber(ref);
    if (refType === 4) {
        //string
        this.ref = createStringRef(owner, ref);
    } else if (refType === 5) {
        if (ref.string) {
            var ref2 = createStringRef(owner, ref.string);
            this.ref = function (dom) {
                ref(dom);
                ref2(dom);
            };
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

export function _flattenChildren(original, convert) {
    let children = [],
        lastText,
        child,
        temp = Array.isArray(original)
            ? original.slice(0)
            : [original];

    while (temp.length) {
        //比较巧妙地判定是否为子数组
        if ((child = temp.pop()) && child.pop) {
            if (child.toJS) {
                //兼容Immutable.js
                child = child.toJS();
            }
            for (let i = 0; i < child.length; i++) {
                temp[temp.length] = child[i];
            }
        } else {
            // eslint-disable-next-line
            let childType = typeNumber(child);

            if (childType < 3) { // 0, 1, 2
                if (convert) {
                    continue;
                } else {
                    child = null;
                }
            } else if (childType < 6) {
                if (lastText && convert) { //false模式下不进行合并与转换
                    children[0].text = child + children[0].text;
                    continue;
                }
                child = child + "";
                if (convert) {
                    child = {
                        type: "#text",
                        text: child,
                        vtype: 0
                    };
                }
                lastText = true;
            } else {
                lastText = false;
            }

            children.unshift(child);
        }
    }
    return children;
}

export function flattenChildren(vnode) {
    let arr = EMPTY_CHILDREN,
        c = vnode.props.children;
    if (c !== null) {
        arr = _flattenChildren(c, true);
        if (arr.length === 0) {
            arr = EMPTY_CHILDREN;
        }
    }
    return vnode.vchildren = arr;
}