import { operateChildren, isIterable } from "./createElement";
import { cloneElement } from "./cloneElement";
import { extend } from "./util";

let mapStack = [];
function mapWrapperCb(old, prefix) {
    if (old === void 0 || old === false || old === true) {
        old = null;
    }
    let cur = mapStack[0];
    let el = cur.callback.call(cur.context, old, cur.index);
    let index = cur.index;
    cur.index++;
    if (cur.isEach || el == null) {
        return;
    }
    if (el.tag < 6) {
        //如果返回的el等于old,还需要使用原来的key, _prefix
        let key = computeKey(old, el, prefix, index);
        cur.arr.push(cloneElement(el, { key: key }));
    } else if (el.type) {
        cur.arr.push(extend({}, el));
    } else {
        cur.arr.push(el);
    }
}
function K(el) {
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
        let index = 0;
        Children.map(
            children,
            function () {
                index++;
            },
            null,
            true
        );
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
        operateChildren(children, "", mapWrapperCb, isIterable(children), true);
        let top = mapStack.shift();
        return top.arr;
    },
    forEach(children, callback, context) {
        Children.map(children, callback, context, true);
    },
    toArray: function (children) {
        if (children == null) {
            return [];
        }
        return Children.map(children, K);
    }
};

function computeKey(old, el, prefix, index) {
    let curKey = el && el.key != null ? el.key : null;
    let oldKey = old && old.key != null ? old.key : null;
    let dot = "." + prefix;
    if (oldKey && curKey && oldKey !== curKey) {
        return curKey + "/" + dot;
    }
    if (prefix) {
        return dot;
    }
    return curKey ? "." + curKey : "." + index;
}
