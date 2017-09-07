import { __push, EMPTY_CHILDREN, typeNumber } from "./util";

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
    // Reserved names are extracted
    var props = {};
    var checkProps = 0
    var vtype = 1;
    var key = null;
    var ref = null;
    if (config != null) {
        for (var i in config) {
            var val = config[i];
            if (i === "key") {
                if (val !== void 0) key = val + "";
            } else if (i === "ref") {
                if (val !== void 0) ref = val;
            } else {
                checkProps = 1;
                props[i] = val;
            }
        }
    }
    var childrenLength = arguments.length - 2;
    if (childrenLength === 1) {
        if (children !== void 0)
            props.children = children;
    } else if (childrenLength > 1) {
        var childArray = Array(childrenLength);
        for (var i = 0; i < childrenLength; i++) {
            childArray[i] = arguments[i + 2];
        }
        props.children = childArray;
    }

    // Resolve default props
    var defaultProps = type.defaultProps;
    if (defaultProps) {
        for (propName in defaultProps) {
            if (props[propName] === void 666) {
                checkProps = 1
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
export function __ref(dom) {
    var instance = this._owner;
    if (dom && instance) {
        instance.refs[this.__refKey] = dom;
    }
}
var fakeOwn = {
    __collectRefs: function () { }
}
function getRefValue(vnode, key) {
    if (vnode._instance)
        return vnode._instance
    var dom = vnode._hostNode
    if (!dom) {
        dom = vnode._hostNode = vnode._owner.__current._hostNode
    }
    dom.getDOMNode = getDOMNode
    return dom
}
function Vnode(type, key, ref, props, vtype, checkProps) {
    this.type = type;
    this.props = props;
    this.vtype = vtype;
    var owner = CurrentOwner.cur
    if (owner) {
        this._owner = owner
    } else {
        owner = fakeOwn
    }
    // this._owner.__pe  console.log(type, this._owner)
    if (key) {
        this.key = key;
    }

    if (vtype === 1) {
        this.checkProps = checkProps;
    }
    var refType = typeNumber(ref);
    var self = this
    if (refType === 4) {
        //string
        this.__refKey = ref;
        this.ref = __ref;
        var self = this
        owner.__collectRefs(function () {
            owner.refs[ref] = getRefValue(self, ref)
        })
    } else if (refType === 5) {
        //function
        this.ref = ref;
        owner.__collectRefs(function () {
            ref(getRefValue(self, ref))
        })
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
    var children = [],
        temp,
        lastText,
        child
    if (Array.isArray(original)) {
        temp = original.slice(0)
    } else {
        temp = [original]
    }

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
            var childType = typeNumber(child);

            if (childType < 3 // 0, 1, 2
            ) {
                continue;
            }

            if (childType < 6) {
                if (lastText) {
                    if (convert) {
                        children[0].text = child + children[0].text;
                    } else {
                        children[0] = child + children[0]
                    }
                    continue;
                }
                child = child + ''
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
    return children

}
export function flattenChildren(vnode) {
    var arr = _flattenChildren(vnode.props.children, true)
    if (arr.length == 0) {
        arr = EMPTY_CHILDREN
    }
    return vnode.vchildren = arr;
}