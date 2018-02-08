import { typeNumber, options, REACT_ELEMENT_TYPE } from "./util";
import { Refs } from "./Refs";
var mapVtype = {
    0: 6, //text
    4 :1, //function
    2: 2, //class
    1: 5  //element
};
export function Vnode(type, vtype, props, key, ref) {
    this.type = type;
    this.vtype = vtype;
    this.tag = mapVtype[vtype];
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
