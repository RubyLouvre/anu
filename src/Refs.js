//fix 0.14对此方法的改动，之前refs里面保存的是虚拟DOM
function getDOMNode() {
    return this;
}
export const pendingRefs = [];
export var Refs = {
    currentOwner: null,
    clearRefs: function() {
        let callback = this.fireRef;
        let refs = pendingRefs.splice(0, pendingRefs.length);
        for (let i = 0, n = refs.length; i < n; i += 2) {
            let vnode = refs[i];
            let data = refs[i + 1];
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
