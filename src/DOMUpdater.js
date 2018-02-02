import { Refs } from "./Refs";
import { formElements, inputControll } from "./inputControll";
import { returnFalse, returnTrue } from "../src/util";
import { diffProps } from "./diffProps";

export function DOMUpdater(vnode) {
    this.name = vnode.type;
    this._states = ["resolve"];
    this._reactInternalFiber = vnode;
    vnode.updater = this;
    this._mountOrder = Refs.mountOrder++;
}

DOMUpdater.prototype = {
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
    isMounted: returnFalse,
    props() {
        var vnode = this._reactInternalFiber;
        var dom = vnode.stateNode;
        var { type, props, lastProps } = vnode;
        diffProps(dom, lastProps || {}, props, vnode);
        if (formElements[type]) {
            inputControll(vnode, dom, props);
        }
    },
    resolve() {
        var vnode = this._reactInternalFiber;
        var dom = vnode.stateNode;
        this.isMounted = returnTrue;
        Refs.fireRef(vnode, dom);
    },
    dispose() {
        var vnode = this._reactInternalFiber;
        Refs.fireRef(vnode, null);
    }
};
