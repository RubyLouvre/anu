import { pushError } from "./fiber/unwindWork";
import { isFn } from "./util";

//fix 0.14对此方法的改动，之前refs里面保存的是虚拟DOM

function getDOMNode() {
    return this;
}

export let Refs = {
    // errorHook: string,//发生错误的生命周期钩子
    // errorInfo: [],    //已经构建好的错误信息
    // doctors: null     //医生节点
    // error: null       //第一个捕捉到的错误
    fireRef(fiber, dom) {
        let ref = fiber.ref;
        let owner = fiber._owner;
        try {
            if (isFn(ref)) {
                return ref(dom);
            }
            if (ref && Object.prototype.hasOwnProperty.call(ref, "current")) {
                ref.current = dom;
                return;
            }

            if (!owner) {
                throw `Element ref was specified as a string (${ref}) but no owner was set`;
            }
            if (dom) {
                if (dom.nodeType) {
                    dom.getDOMNode = getDOMNode;
                }
                owner.refs[ref] = dom;
            } else {
                delete owner.refs[ref];
            }
        } catch (e) {
            pushError(owner, "ref", e);
        }
    }
};
