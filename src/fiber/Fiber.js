
import { extend} from "../util";

// 实例化组件
export function Fiber (vnode) {
    extend(this, vnode);
    let type = vnode.type;
    this.name = type.displayName || type.name || type;
    this.effectTag = 1;
}