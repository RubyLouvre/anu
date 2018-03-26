import { typeNumber, options, REACT_ELEMENT_TYPE, Flutter } from "./util";

export function Vnode(type, tag, props, key, ref) {
    this.type = type;
    this.tag = tag;
    if (tag !== 6) {
        this.props = props;
        this._owner = Flutter.currentOwner;

        if (key) {
            this.key = key;
        }

        let refType = typeNumber(ref);
        if (refType === 2 || refType === 3 || refType === 4 || refType === 5 || refType === 8) {
            //boolean number, string, function
            if (refType < 4) {
                ref += "";
            }
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
