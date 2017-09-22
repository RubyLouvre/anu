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
        return _flattenChildren(children, false).length;
    },
    map(children,callback, context) {
        var ret = [];
        _flattenChildren(children, false).forEach(function(el, index){
            el = callback.call(context, el, index);
            if (el && el.vtype) {
                var key = el.key == null ? "."+ index: ".$"+el.key ;
                ret.push( cloneElement(el, { key }) );
            } else if(el) {
                ret.push( Object.assign({}, el));
            }
        });
        return ret;
    },
    forEach(children, callback, context) {
        _flattenChildren(children, false).forEach(callback, context);
    },

    toArray: function (children) {
        return _flattenChildren(children, false);
    }
};

