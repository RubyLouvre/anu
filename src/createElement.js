import {__push, typeNumber} from "./util";
const stack = [];
const EMPTY_CHILDREN = [];

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

export function createElement(type, configs) {
    var props = {},
        key = null,
        ref = null,
        vtype = 1,
        checkProps = 0;

    for (let i = 2, n = arguments.length; i < n; i++) {
        stack.push(arguments[i]);
    }

    if (configs) {

        // eslint-disable-next-line
        for (let i in configs) {
            var val = configs[i];
            switch (i) {
                case "key":
                    key = val + "";
                    break;
                case "ref":
                    ref = val;
                    break;
                case "children":
                    // 只要不是通过JSX产生的createElement调用，props内部就千奇百度， children可能是一个数组，也可能是一个字符串，数字，布尔，
                    // 也可能是一个虚拟DOM
                    if (!stack.length && val) {
                        if (Array.isArray(val)) {
                            __push.apply(stack, val);
                        } else {
                            stack.push(val);
                        }
                    }
                    break;
                default:
                    checkProps = 1;
                    props[i] = val;
            }
        }

    }
    let defaultProps = type.defaultProps
    if (defaultProps) {
        for (let propKey in defaultProps) {
            if (props[propKey] === void 0) {
                props[propKey] = defaultProps[propKey]
            }
        }
    }
    var children = flattenChildren(stack);

    if (typeNumber(type) === 5) {
        //fn
        vtype = type.prototype && type.prototype.render
            ? 2
            : 4;
        if (children.length) 
            props.children = children;
        }
    else {
        props.children = children;
    }

    return new Vnode(type, props, key, ref, vtype, checkProps);
}

function flattenChildren(stack) {
    var lastText,
        child,
        children = [];

    while (stack.length) {
        //比较巧妙地判定是否为子数组
        if ((child = stack.pop()) && child.pop) {
            if (child.toJS) {
                //兼容Immutable.js
                child = child.toJS();
            }
            for (let i = 0; i < child.length; i++) {
                stack[stack.length] = child[i];
            }
        } else {
            // eslint-disable-next-line
            var childType = typeNumber(child);
            if (childType < 3 // 0, 1,2
            ) {
                continue;
            }

            if (childType < 6) {
                //!== 'object' 不是对象就是字符串或数字
                if (lastText) {
                    lastText.text = child + lastText.text;
                    continue;
                }
                child = {
                    type: "#text",
                    text: child + "",
                    vtype: 0
                };
                lastText = child;
            } else {
                lastText = null;
            }

            children.unshift(child);
        }
    }
    if (!children.length) {
        children = EMPTY_CHILDREN;
    }
    return children;
}

//fix 0.14对此方法的改动，之前refs里面保存的是虚拟DOM
function getDOMNode() {
    return this;
}
export function __ref(dom) {
    var instance = this._owner;
    if (dom && instance) {
        dom.getDOMNode = getDOMNode;
        instance.refs[this.__refKey] = dom;
    }
}
function Vnode(type, props, key, ref, vtype, checkProps) {
    this.type = type;
    this.props = props;
    this.vtype = vtype;
    this._owner = CurrentOwner.cur
    if (key) {
        this.key = key;
    }

    if (vtype === 1) {
        this.checkProps = checkProps;
    }
    var refType = typeNumber(ref);
    if (refType === 4) {
        //string
        this.__refKey = ref;
        this.ref = __ref;
    } else if (refType === 5) {
        //function
        this.ref = ref;
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
