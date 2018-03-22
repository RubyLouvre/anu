import { Refs } from "./Refs";
import {  extend } from "../src/util";
/**
 * 将虚拟DOM转换为Fiber
 * @param {vnode} vnode 
 * @param {Fiber} parentFiber 
 */
export function HostFiber(vnode, parentFiber) {
    extend(this, vnode);
    this.name = vnode.type;
    this.return = parentFiber;
    this._states = ["resolve"];
    //  this.namesplace
    this._reactInternalFiber = vnode;
    this._mountOrder = Refs.mountOrder++;
}

