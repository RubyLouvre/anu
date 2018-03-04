import { operateChildren } from "./createElement";
import { cloneElement } from "./cloneElement";
import { extend } from "./util";

var mapStack = [];
function mapWrapperCb(old, prefix) {
    if (old === void 0 || old === false || old === true) {
        old = null;
    }
    var cur = mapStack[0];
    var el = cur.callback.call(cur.context, old, cur.index);
    var index = cur.index;
    cur.index++;
    if (cur.isEach || el == null) {
        return;
    }
    if (el.tag < 6) {
        //如果返回的el等于old,还需要使用原来的key, _prefix
        var key = computeKey(old, el, prefix, index);
        cur.arr.push(cloneElement(el, { key: key }));
    } else if (el.type) {
        cur.arr.push(extend({}, el));
    } else {
        cur.arr.push(el);
    }
}
function K (el){
    return el;
}
export const Children = {
    only(children) {
        //only方法接受的参数只能是一个对象，不能是多个对象（数组）。
        if (children && children.tag) {
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
    map(children, callback, context, isEach) {
        if (children == null) {
            return children;
        }
        mapStack.unshift({
            index: 0,
            callback,
            context,
            isEach,
            arr: []
        });
        operateChildren(children, "", mapWrapperCb);
        var top = mapStack.shift();
        return top.arr;
    },
    forEach(children, callback, context) {
        Children.map(children, callback, context, true);
    },
    toArray: function(children) {
        if (children == null) {
            return [];
        }
        return Children.map(children, K);
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
            key = prefix === "." ? prefix + index : prefix;
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
