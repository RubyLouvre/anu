import { Refs } from "./Refs";
import { formElements, inputControll } from "./inputControll";
import { returnFalse, returnTrue, emptyObject } from "../src/util";
import { diffProps } from "./diffProps";

/**
 * 将虚拟DOM转换为Fiber
 * @param {vnode} vnode 
 * @param {Fiber} parentFiber 
 */
export function HostFiber(vnode, parentFiber) {
    this.type = this.name = vnode.type;
    this.props = vnode.props;
    this.tag = vnode.tag;
    this.return = parentFiber;
    this._states = ["resolve"];
  //  this.namesplace 
    this._reactInternalFiber = vnode;
    this._mountOrder = Refs.mountOrder++;
}

HostFiber.prototype = {
    addState: function(state) {
        var states = this._states;
        if (states[states.length - 1] !== state) {
            states.push(state);
        }
    },
    transition(updateQueue) {
        var state = this._states.shift();
        if (state) {
            this[state](updateQueue);
        }
    },
    init(updateQueue) {
        updateQueue.push(this);
    },
    _isMounted: returnFalse,
    attr() {
        var { type, props, lastProps, stateNode: dom } = this;
        diffProps(dom, lastProps || emptyObject, props, this);
        if (formElements[type]) {
            inputControll(this, dom, props);
        }
    },
    resolve() {
        this._isMounted = returnTrue;
        Refs.fireRef(this, this.stateNode, this._reactInternalFiber);
    },
    dispose() {
        Refs.fireRef(this, null, this._reactInternalFiber);
    }
};
