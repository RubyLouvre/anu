import { _flattenChildren } from "./createElement";
import { limitWarn } from "./util";
export const Children = {
    only(children) {
        //only方法接受的参数只能是一个对象，不能是多个对象（数组）。
        if (Array.isArray(children)) {
            children = children[0]
        }
        if (children && children.vtype)
            return children
        throw new Error('expect only one child')
    },
    count(children) {
        if (limitWarn.count-- > 0) {
            console.warn('请限制使用Children.count')
        }
        return _flattenChildren(children, false).length
    },
    forEach(children, callback, context) {
        if (limitWarn.forEach-- > 0) {
            console.warn('请限制使用Children.forEach')
        }
        _flattenChildren(children, false).forEach(callback, context);
    },
    map(children, callback, context) {
        if (limitWarn.map-- > 0) {
            console.warn('请限制使用Children.map')
        }
        return _flattenChildren(children, false).map(callback, context);
    },
    toArray: function (children) {
        return _flattenChildren(children, false)
    }
};
