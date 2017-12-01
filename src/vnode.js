import { typeNumber, options, REACT_ELEMENT_TYPE } from "./util";
import { Refs } from "./Refs";

export function Vnode(type, vtype, props, key, ref, _hasProps) {
    this.type = type;
    this.vtype = vtype;
    if (vtype) {
        this.props = props;
        this._owner = Refs.currentOwner;

        if (key) {
            this.key = key;
        }

        if (vtype === 1) {
            this.childNodes = [];
            this._hasProps = _hasProps;
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
