import { operateChildren } from "./createElement";
import { cloneElement } from "./cloneElement";
import { extend } from "./util";

export const Children = {
    only(children) {
        //only方法接受的参数只能是一个对象，不能是多个对象（数组）。
        if (children && children.vtype) {
            return children;
        }
        throw new Error("expect only one child");
    },
    count(children) {
        if (children == null) {
            return 0;
        }
        var index = 0;
        operateChildren(children, "", function() {
            index++;
        });
        return index;
    },
    map(children, callback, context) {
        if (children == null) {
            return children;
        }
        var index = 0,
            ret = [];
        operateChildren(children, "", function(old, prefix) {
            if (old == null || old === false || old === true) {
                old = null;
            }
            let outerIndex = index;
            let el = callback.call(context, old, index);
            index++;
            if (el == null) {
                return;
            }
            if (el.vtype) {
                //如果返回的el等于old,还需要使用原来的key, _prefix
                var key = computeKey(old, el, prefix, outerIndex);
                ret.push(cloneElement(el, { key }));
            } else if (el.type) {
                ret.push(extend({}, el));
            } else {
                ret.push(el);
            }
        });
        return ret;
    },
    forEach(children, callback, context) {
        if (children != null) {
            var index = 0;
            operateChildren(children, "", function(el) {
                if (el == null || el === false || el === true) {
                    el = null;
                }       
                callback.call(context, el, index++);
            });
        }
    },
    toArray: function(children) {
        if (children == null) {
            return [];
        }
        return Children.map(children, function(el) {
            return el;
        });
    }
};
var rthimNumer = /\d+\$/;
function computeKey(old, el, prefix, index) {
    let curKey = el && el.key != null ? escapeKey(el.key) : null;
    let oldKey = old && old.key != null ? escapeKey(old.key) : null;
    let key;
    if (oldKey && curKey) {
        key = prefix + "$" + oldKey;
        if (oldKey !== curKey) {
            key = curKey + "/" + key;
        }
    } else {
        key = curKey || oldKey;
        if (key) {
            key = prefix + "$" + key;
        } else {
            key = prefix ==="." ? prefix + index: prefix;
        }
    }
    return key.replace(rthimNumer, "$");
}
function escapeKey(key) {
    return String(key).replace(/[=:]/g, escaperFn);
}
var escaperLookup = {
    "=": "=0",
    ":": "=2"
};
function escaperFn(match) {
    return escaperLookup[match];
}
