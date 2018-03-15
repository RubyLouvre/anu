import { typeNumber, options, REACT_ELEMENT_TYPE } from "./util";
import { Refs } from "./Refs";

/*
 IndeterminateComponent = 0; // 不用
 FunctionalComponent = 1;
 ClassComponent = 2;
 HostRoot = 3; // 不用
 HostPortal = 4; // 不用
 HostComponent = 5; 
 HostText = 6;
 CallComponent = 7; // 不用
 CallHandlerPhase = 8;// 不用
 ReturnComponent = 9;// 不用
 Fragment = 10;// 不用
 Mode = 11; // 不用
 ContextConsumer = 12;// 不用
 ContextProvider = 13;// 不用
*/
export function Vnode(type, tag, props, key, ref) {
    this.type = type;
    this.tag = tag;
    if (tag !== 6) {
        this.props = props;
        this._owner = Refs.currentOwner;

        if (key) {
            this.key = key;
        }

        let refType = typeNumber(ref);
        if (refType === 3 || refType === 4 || refType === 5 || refType === 8) {
            //number, string, function
            this._hasRef = true;
            this.ref = ref;
        }
    }
    options.afterCreate(this);
}

Vnode.prototype = {
    getDOMNode() {
        return this.stateNode || null;
    },

    $$typeof: REACT_ELEMENT_TYPE
};
