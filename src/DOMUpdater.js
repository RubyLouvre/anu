
import { removeElement } from "./browser";
import { disposeChildren } from "./dispose";
import { innerHTML ,returnFalse} from "./util";
import { Refs } from "./Refs";

export function DOMUpdater(vnode) {
    this.vnode = vnode;
    vnode.updater = this;
    this._mountOrder = Refs.mountOrder++;
    this.name = vnode.type;
}

DOMUpdater.prototype = {
    exec(updateQueue) {
        var vnode = this.vnode;
        if (vnode._disposed) { 
            Refs.detachRef(vnode);
            if (vnode.props[innerHTML]) {//这里可能要重构
                removeElement(vnode.stateNode);
            }
            delete vnode.stateNode;
        } else {
            var lastVnode = this.lastVnode;
            if (lastVnode) {
                Refs.detachRef(lastVnode);
                delete this.lastVnode;
                updateQueue.push(this);
            }else{
                Refs.fireRef(vnode, vnode.stateNode);
            }
           
        }
    },
    update(nextVnode) {
        var lastVnode = this.vnode;
        if (lastVnode._hasRef && lastVnode.ref !== nextVnode.ref) {
            this.lastVnode = lastVnode;
        }
        this.vnode = nextVnode;
        if (lastVnode.namespaceURI) {
            nextVnode.namespaceURI = lastVnode.namespaceURI;
        }
    }
};
