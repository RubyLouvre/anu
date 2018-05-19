function collectVDOM(vdom, array) {
    if (vdom.tag == 5) {
        var children = [];
        var element = {
            type: vdom.type,
            children: children
        };
        array.push(element);
        var c = vdom.children;
        for (var i in c) {
            collectVDOM(c[i], children);
        }
    } else if (vdom.tag === 6) {
        array.push(vdom.text + "");
    } else {
        var c = vdom.children;
        for (var i in c) {
            collectVDOM(c[i], array);
        }
    }
}
export function createReactNoop(div, ReactDOM) {
    var yieldData = [];
    return {
        render(vdom) {
            ReactDOM.render(vdom, div);
        },
        yield(a) {
            yieldData.push(a);
        },
        flush() {
            var ret = yieldData.concat();
            yieldData.length = 0;
            return ret;
        },
        getChildren() {
            var c = div.__component || div._reactInternalFiber,
                ret = [];
            collectVDOM(c, ret);
            return ret;
        }
    };
} 