import { Refs } from "./Refs";
import { formElements, inputControll } from "./inputControll";
import { returnFalse, returnTrue } from "../src/util";
import { diffProps } from "./diffProps";

export function HostFiber(vnode) {
    this.type = this.name = vnode.type;
    this.props = vnode.props;
    this.tag = vnode.tag;
    this._states = ["resolve"];
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
    isMounted: returnFalse,
    attr() {
        var vnode = this._reactInternalFiber;
        var dom = this.stateNode;
        var { type, props, lastProps } = vnode;
        diffProps(dom, lastProps || {}, props, this);
        if (formElements[type]) {
            inputControll(vnode, dom, props);
        }
    },
    resolve() {
        var vnode = this._reactInternalFiber;
        var dom = this.stateNode;
        this.isMounted = returnTrue;
        Refs.fireRef(vnode, dom);
    },
    dispose() {
        var vnode = this._reactInternalFiber;
        Refs.fireRef(vnode, null);
    }
};
