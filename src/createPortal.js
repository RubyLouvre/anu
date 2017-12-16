import { createVnode, createElement, fiberizeChildren } from "./createElement";
import { Refs } from "./Refs";
import { DOMUpdater } from "./DOMUpdater";
import { disposeChildren } from "./dispose";

function Portal(props, context) {
    this.isPortal = true;
    this.props = props;
    this.context = context;
}
Portal.prototype = {
    constructor: Portal,
    componentWillUnmount() {
        disposeChildren(this._children, this.updater.updateQueue);
    },
    componentWillReceiveProps(props, context) {
        this.props = props;
        this.context = context;
        updateDialog(this);
    },
    componentWillMount() {
        updateDialog(this);
    },
    render() {
        return null;
    }
};
function updateDialog(self) {
    let vnode = self.props.vnode;
    let lastChildren = self._children || {};
    let updateQueue = self.updater.updateQueue;
    if (!self._updater) {
        self._updater = new DOMUpdater(vnode);
    }
    let nextChildren = (self._children = fiberizeChildren(self.props.child, self._updater));
    Refs.diffChildren(lastChildren, nextChildren, vnode, self.context, updateQueue, []);
}

//[Top API] ReactDOM.createPortal
export function createPortal(child, node) {
    var vnode = createVnode(node);
    var portal = createElement(Portal, {
        vnode,
        child
    });
    vnode.return = portal;
    return portal;
}
