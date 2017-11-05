var cacheTree = {};
window.cacheTree = cacheTree;
var UUID = 1;
export function precacheNode(vnode) {
    var uid = vnode._uid || (vnode._uid = UUID++);
    if (!cacheTree[uid]) {
        if(vnode.vtype>1 && !vnode._instance){
            throw ["error",vnode];
        }
        cacheTree[uid] = {
            dom: vnode._hostNode,
            instance: vnode._instance,
            vdom: vnode
        };
    } else {
        var a = cacheTree[uid];
        var put = vnode.vtype > 1 ? vnode._instance: vnode._hostNode;
        if(put){
            a.instance = vnode._instance,
            a.dom = vnode._hostNode;
            a.vdom = vnode;
        }
    }
    return uid;
}
export function removeCache(vnode){
    delete vnode._uids;
    delete cacheTree[vnode._uid]; 
}
export function restoreChildren(vnode){
    var ret = [];
    for(var i = 0, n = vnode._uids.length; i  <n; i++ ){
        var c = cacheTree[vnode._uids[i]];
        if(c){
            //  if(c.instance){
            //      c.vdom._instance = c.instance;
            //  }
            ret.push(c.vdom);
        }
    }
    return ret;
}