import { _flattenChildren } from "./createElement";
import { cloneElement } from "./cloneElement";
export const Children = {
    only(children) {
    //only方法接受的参数只能是一个对象，不能是多个对象（数组）。
        if (Array.isArray(children)) {
            children = children[0];
        }
        if (children && children.vtype) {
            return children;
        }
        throw new Error("expect only one child");
    },
    count(children) {
        if(children == null){
            return 0;
        }
        return _flattenChildren(children, false).length;
    },
    map(children, callback, context) {
        if (children === null || children === void 0) {
            return children;
        }
        
        var ret = [];
        _flattenChildren(children, "").forEach(function(old, index) {
            let el = callback.call(context, old, index);
            if (el === null) {
                return;
            }
            if (el.vtype) {
                //如果返回的el等于old,还需要使用原来的key, _prefix
                var key = computeKey(old, el, index);
                ret.push(cloneElement(el, { key }));
            } else if (el.type) {
                ret.push(Object.assign({}, el));
            } else {
                ret.push(el);
            }
        });
        return ret;
    },
    forEach(children, callback, context) {
        if(children != null){
            _flattenChildren(children, false).forEach(callback, context);
        }
    },

    toArray: function(children) {
        if(children == null) {
            return [];
        }
        return Children.map(children, function(el){
            return el;
        });
    }
};

function computeKey(old, el, index){
    let curKey = el && el.key != null ? escapeKey(el.key) : null;
    let oldKey = old && old.key != null ? escapeKey(old.key) : null;
    let oldFix = old && old._prefix,
        key;
    if (oldKey && curKey) {
        key = oldFix + "$" + oldKey;
        if (oldKey !== curKey) {
            key = curKey + "/" + key;
        } 
    } else {
        key = curKey || oldKey;
        if (key) {
            if (oldFix) {
                key = oldFix + "$" + key;
            }
        } else {
            key = oldFix || "." + index;
        }
    }
    return key.replace(/\d+\$/, "$");
}
function escapeKey(key){
    return  String(key).replace(/[=:]/g, escaperFn);
}
var escaperLookup = {
    "=": "=0",
    ":": "=2"
};
function escaperFn(match) {
    return escaperLookup[match]; 
}
