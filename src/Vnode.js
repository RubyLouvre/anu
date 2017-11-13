import { typeNumber, options, toArray, createUnique, REACT_ELEMENT_TYPE } from "./util";
import { removeElement } from "./browser";
import { Refs } from "./Refs";

export function Vnode(type, vtype, props, key, ref, _hasProps) {
    this.type = type;
    this.vtype = vtype;
    if (!options.uuid) {
        this.uuid = Math.random() + Math.random();
    }
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
}

Vnode.prototype = {
    getDOMNode() {
        return this.stateNode || null;
    },

    collectNodes(isChild, ret) {
        ret = ret || [];
        if (isChild && this.vtype < 2) {
            ret.push(this.stateNode);
        } else {
            for (var a = this.child; a; a = a.sibling) {
                a.collectNodes(true, ret);
            }
        }
        return ret;
    },
    batchMount() {
        var parentNode = this.stateNode,
            childNodes = this.collectNodes();
        childNodes.forEach(function(dom) {
            parentNode.appendChild(dom);
        });
    },
    batchUpdate(updateMeta, nextChildren) {
        var parentVnode = updateMeta.parentVElement,
            parentNode = parentVnode.stateNode,
            lastChildren = updateMeta.lastChilds,
            newLength = nextChildren.length,
            oldLength = lastChildren.length,
            unique = createUnique();
        var fullNodes = toArray(parentNode.childNodes);
        var startIndex = fullNodes.indexOf(lastChildren[0]);
        var insertPoint = fullNodes[startIndex] || null;
        // if(fullNodes.length === 1 && oldLength && startIndex === -1 ){

        // }

        for (let i = 0; i < newLength; i++) {
            let child = nextChildren[i];
            let last = lastChildren[i];
            if (last === child) {
                //如果相同
            } else if (last && !unique.has(last)) {
                parentNode.replaceChild(child, last); //如果这个位置有DOM，并且它不在新的nextChildren之中
            } else if (insertPoint) {
                parentNode.insertBefore(child, insertPoint.nextSibling);
            } else {
                parentNode.appendChild(child);
            }
            insertPoint = child;
            unique.add(child);
        }
        if (newLength < oldLength) {
            for (let i = newLength; i < oldLength; i++) {
                if (!unique.has(lastChildren[i])) {
                    removeElement(lastChildren[i]);
                }
            }
        }
        //   parentNode.childNodes.length = 0;
        //delete parentVnode.childNodes.updateMeta;
        delete parentVnode.updateMeta;
    },

    $$typeof: REACT_ELEMENT_TYPE
};
