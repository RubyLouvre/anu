
import { removeElement } from "./browser";
import { innerHTML, toArray, createUnique, collectAndResolveImpl} from "./util";
import { Refs } from "./Refs";
import { diffProps } from "./diffProps";
import { processFormElement, formElements } from "./ControlledComponent";

export function DOMUpdater(vnode) {
    this.name = vnode.type;
    this._jobs = ["init"];
    this.vnode = vnode;
    vnode.updater = this;
    this._mountOrder = Refs.mountOrder++;
}

DOMUpdater.prototype = {
    addJob: function(newJob) {
        var jobs = this._jobs;
        if (jobs[jobs.length - 1] !== newJob) {
            jobs.push(newJob);
        }
    },
    exec(updateQueue) {
        var job = this._jobs.shift();
        if (job) {
            this[job](updateQueue);
        }
    },
    init(updateQueue){
        this._jobs = ["batchMount"];
        updateQueue.push(this);
    },
    batchMount(updateQueue){
        //父节点主动添加它的孩子
        var vnode = this.vnode, nodes = [], updaters = [];
        var dom = vnode.stateNode;
        if(vnode.child) {
            collectAndResolveImpl(vnode.child, nodes, updateQueue);
        }
        nodes.forEach(function(c){
            dom.appendChild(c);
        });
        //先放自己再放孩子， ref是从里到外执行
        //  updaters.forEach(function(el){
        //      updateQueue.push(el);
        //  });
        
        /* for(var i = updaters.length-1; i >= 0; i--){
            var el = updaters[i];
            updateQueue.push(el);
        }*/
        this.addJob("resolve");
        updateQueue.push(this);
    },
    resolve(){
        var vnode = this.vnode;
        var dom = vnode.stateNode;
        var { type, props} = vnode;
        diffProps(dom, this.oldProps || {}, props, vnode);
        if (formElements[type]) {
            processFormElement(vnode, dom, props);
        }
        vnode.hasMounted = true;
        Refs.fireRef(vnode, dom);
       
    },
    batchUpdate(lastChildren, nextChildren) {//子节点主动让父节点来更新其孩子
        var vnode = this.vnode;
        var parentNode = vnode.stateNode,
            newLength = nextChildren.length,
            oldLength = lastChildren.length,
            unique = createUnique();
        var fullNodes = toArray(parentNode.childNodes);
        var startIndex = fullNodes.indexOf(lastChildren[0]);
        var insertPoint = fullNodes[startIndex] || null;
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
    },
    dispose(){
        var vnode = this.vnode;
        Refs.detachRef(vnode);
        if (vnode.props[innerHTML]) {//这里可能要重构
            removeElement(vnode.stateNode);
        }
        delete vnode.stateNode;
    }
   
};
