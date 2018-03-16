import { Refs } from "./Refs";
import { formElements, inputControll } from "./inputControll";
import { returnFalse, returnTrue, emptyObject, extend } from "../src/util";
import { diffProps } from "./diffProps";
import { createElement, insertElement } from "./browser";

/**
 * 将虚拟DOM转换为Fiber
 * @param {vnode} vnode 
 * @param {Fiber} parentFiber 
 */
export function HostFiber(vnode, parentFiber) {
    extend(this, vnode);
    this.name = vnode.type;
    this.return = parentFiber;
    this._states = ["resolve"];
    //  this.namesplace
    this._reactInternalFiber = vnode;
    this._mountOrder = Refs.mountOrder++;
}

HostFiber.prototype = {
    addState: function (state) {
        let states = this._states;
        if (states[states.length - 1] !== state) {
            states.push(state);
        }
    },
    transition(updateQueue) {
        let state = this._states.shift();
        if (state) {
            this[state](updateQueue);
        }
    },
    init(updateQueue, mountCarrier, initChildren) {
        let dom = (this.stateNode = createElement(this, this.return));
        let beforeDOM = mountCarrier.dom;
        mountCarrier.dom = dom;
        if (this.tag === 5) {
            initChildren(this);
        }
        insertElement(this, beforeDOM);
        if (this.tag === 5) {
            this.attr();
            updateQueue.push(this);
        }
    },
    _isMounted: returnFalse,
    attr() {
        let { type, props, lastProps, stateNode: dom } = this;
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
