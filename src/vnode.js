import { typeNumber, options, REACT_ELEMENT_TYPE } from "./util";
import { Refs } from "./Refs";
var vtype2tag = {
    0: 6, //text,
    1: 5, //element,
    4 :1, //function
    2: 2 //class
};
/*
 IndeterminateComponent = 0; // Before we know whether it is functional or class
 FunctionalComponent = 1;
 ClassComponent = 2;
 HostRoot = 3; // Root of a host tree. Could be nested inside another node.
 HostPortal = 4; // A subtree. Could be an entry point to a different renderer.
 HostComponent = 5;
 HostText = 6;
 CallComponent = 7;
 CallHandlerPhase = 8;
 ReturnComponent = 9;
 Fragment = 10;
 Mode = 11;
 ContextConsumer = 12;
 ContextProvider = 13;
*/
export function Vnode(type, vtype, props, key, ref) {
    this.type = type;
    this.vtype = vtype;
    this.tag = vtype2tag[vtype];
    if (vtype) {
        this.props = props;
        this._owner = Refs.currentOwner;

        if (key) {
            this.key = key;
        }

        let refType = typeNumber(ref);
        if (refType === 3 || refType === 4 || refType === 5) {
            //number, string, function
            this._hasRef = true;
            this.ref = ref;
        }
    }
    /*
      this.stateNode = null
    */
    
    options.afterCreate(this);
}

Vnode.prototype = {
    getDOMNode() {
        return this.stateNode || null;
    },

    $$typeof: REACT_ELEMENT_TYPE
};
