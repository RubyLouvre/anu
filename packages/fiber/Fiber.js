import { extend } from "react-core/util";

// 实例化组件
export function Fiber(vnode) {
    extend(this, vnode);
    let type = vnode.type || "ProxyComponent(react-hot-loader)";
    this.name = type.displayName || type.name || type;
    this.effectTag = 1;
}
