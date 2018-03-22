import { extend } from "./util";
import { Refs } from "./Refs";

/**
 * 将虚拟DOM转换为Fiber
 * @param {vnode} vnode 
 * @param {Fiber} parentFiber 
 */
export function ComponentFiber(vnode, parentFiber) {
    extend(this, vnode);
    let type = vnode.type;
    this.name = type.displayName || type.name;
    this.return = parentFiber;
    this._reactInternalFiber = vnode;
  
    this._states = ["resolve"];
    this._mountOrder = Refs.mountOrder++;
    //  fiber总是保存最新的数据，如state, props, context
    //  this._hydrating = true 表示组件会调用render方法及componentDidMount/Update钩子
    //  this._nextCallbacks = [] 表示组件需要在下一周期重新渲染
    //  this._forceUpdate = true 表示会无视shouldComponentUpdate的结果
}
