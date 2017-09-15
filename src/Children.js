import { _flattenChildren } from "./createElement";
import { limitWarn } from "./util";
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
        return _flattenChildren(children, false).length;
    },
    forEach(children, callback, context) {
        _flattenChildren(children, false).forEach(callback, context);
    },
    map(children, callback, context) {
        return _flattenChildren(children, false).map(callback, context);
        /*
        return _flattenChildren(children, false).map(function (el, index) {
            if (el && el.type) {
                if (el.vtype) {
                    var key = (el.key || "") + ":" + index;
                    el = cloneElement(el, { key });
                } else {
                    el = Object.assign({}, el);
                }
            }
            return callback.call(context, el, index);
        });*/
    },
    toArray: function (children) {
        return _flattenChildren(children, false);
    }
};

for (let key in Children) {
    let fn = Children[key];
    limitWarn[key] = 1;
    Children[key] = function () {
        if (limitWarn[key]-- > 0) {
            console.warn("请限制使用Children." + key + ",不要窥探虚拟DOM的内部实现,会导致升级问题");
        }
        return fn.apply(null, arguments);
    };
}