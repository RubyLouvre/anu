import { traverseAllChildren, isValidElement } from "./createElement";
import { extend, noop } from "./util";

export const Children = {
    only(children) {
        //only方法接受的参数只能是一个对象，不能是多个对象（数组）。
        if (isValidElement(children)) {
            return children;
        }
        throw new Error("expect only one child");
    },
    count(children) {
        if (children == null) {
            return 0;
        }
        return traverseAllChildren(children, "", noop);
    },
    map(children, func, context) {
        return proxyIt(children, func, [], context);
    },
    forEach(children, func, context) {
        return proxyIt(children, func, null, context);
    },
    toArray: function(children) {
        return proxyIt(children, K, []);
    }
};

function proxyIt(children, func, result, context) {
    if (children == null) {
        return [];
    }
    mapChildren(children, null, func, result, context);
    return result;
}

function K(el) {
    return el;
}

function mapChildren(children, prefix, func, result, context) {
    let keyPrefix = "";
    if (prefix != null) {
        keyPrefix = escapeUserProvidedKey(prefix) + "/";
    }
    traverseAllChildren(children, "", traverseCallback, {
        context,
        keyPrefix,
        func,
        result,
        count: 0
    });
}
const userProvidedKeyEscapeRegex = /\/+/g;
function escapeUserProvidedKey(text) {
    return ("" + text).replace(userProvidedKeyEscapeRegex, "$&/");
}

function traverseCallback(bookKeeping, child, childKey) {
    const { result, keyPrefix, func, context } = bookKeeping;

    let mappedChild = func.call(context, child, bookKeeping.count++);
    if (!result) {
        return;
    }
    if (Array.isArray(mappedChild)) {
        mapChildren(mappedChild, childKey, K, result);
    } else if (mappedChild != null) {
        if (isValidElement(mappedChild)) {
            mappedChild = extend({}, mappedChild);
            mappedChild.key =
                keyPrefix +
                (mappedChild.key && (!child || child.key !== mappedChild.key)
                    ? escapeUserProvidedKey(mappedChild.key) + "/"
                    : "") +
                childKey;
        }
        result.push(mappedChild);
    }
}
