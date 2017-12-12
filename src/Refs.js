//fix 0.14对此方法的改动，之前refs里面保存的是虚拟DOM
function getDOMNode() {
    return this;
}
export const pendingRefs = [];
window.pendingRefs = pendingRefs;
export var Refs = {
    mountOrder: 1,
    currentOwner: null,
    // errorHook: string,//发生错误的生命周期钩子
    // errorInfo: [],    //已经构建好的错误信息
    // doctors: null     //医生节点
    // error: null       //第一个捕捉到的错误
    fireRef(vnode, dom) {
        if (vnode._disposed || vnode.stateNode.__isStateless) {
            dom = null;
        }
        var ref = vnode.ref;
        if (typeof ref === "function") {
            return ref(dom);
        }
        var owner = vnode._owner;
        if (!ref) {
            return;
        }
        if (!owner) {
            throw `Element ref was specified as a string (${ref}) but no owner was set`;
        }
        if (dom) {
            if (dom.nodeType) {
                dom.getDOMNode = getDOMNode;
            }
            owner.refs[ref] = dom;
        } else {
            delete owner.refs[ref];
        }
    }
};
