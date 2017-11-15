import { clearArray } from "./util";

//fix 0.14对此方法的改动，之前refs里面保存的是虚拟DOM
function getDOMNode() {
    return this;
}
export const pendingRefs = [];
window.pendingRefs = pendingRefs;
export var Refs = {
    currentOwner: null,
    clearElementRefs: function() {
        let callback = Refs.fireRef;
        let refs = clearArray(pendingRefs);
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
            pendingRefs.push(lastVnode, null);
            delete lastVnode._hasRef;
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
            throw  `Element ref was specified as a string (${ref}) but no owner was set`;
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