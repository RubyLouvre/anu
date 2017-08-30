function toArray(children) {
    return children == null ? [] : Array.isArray(children) ? children : [children]
}

export const Children = {
    only(children) {
        //only方法接受的参数只能是一个对象，不能是多个对象（数组）。
        if(Array.isArray(children)){
            children = children[0]
        }
        if(children && children.vtype)
            return children
        throw new Error('expect only one child')
    },
    count(children) {
        return (children && children.length) || 0;
    },
    forEach(children, callback, context) {
        toArray(children).forEach(callback, context);
    },
    map(children, callback, context) {
        return toArray(children).map(callback, context);
    },
    toArray
};
