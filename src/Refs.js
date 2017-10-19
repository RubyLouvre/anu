//fix 0.14对此方法的改动，之前refs里面保存的是虚拟DOM
function getDOMNode() {
    return this;
}
export var pendingRefs = [];
export var Refs = {
    currentOwner: null,
    clearRefs: function() {
        var callback = this.fireRef;
        var refs = pendingRefs.splice(0, pendingRefs.length);
        for (var i = 0, n = refs.length; i < n; i += 2) {
            var vnode = refs[i];
            var data = refs[i + 1];
            callback(vnode, data);
        }
    },
    detachRef: function(lastVnode, nextVnode, dom) {
        if (lastVnode.ref === nextVnode.ref) {
            return;
        }
        if (lastVnode._hasRef) {
            this.fireRef(lastVnode, null);
        }
        if (nextVnode._hasRef && dom) {
            pendingRefs.push(nextVnode, dom);
        }
    },
    fireRef: function(vnode, dom) {
        var ref = vnode.ref;
        if (typeof ref === "function") {
            return ref(dom);
        }
        var owner = vnode._owner;
        if (!owner) {
            throw "ref位置错误";
        }
        if (dom) {
            if (dom.nodeType) {
                dom.getDOMNode = getDOMNode;
            }
            owner.refs[ref] = dom;
        } else {
            delete owner.refs[ref];
        }
    },
};
