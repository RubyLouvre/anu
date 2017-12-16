import { createVnode, fiberizeChildren, createElement } from "./createElement";
import { options } from "./util";
import { DOMUpdater } from "./DOMUpdater";

function Portal(props) {
    this.container = props.container;
}
Portal.prototype = {
    constructor: Portal,
    componentWillUnmount() {
        var parentVnode = this.container;
        console.log("移除");
        options.diffChildren(this.portalUpdater.children, {}, parentVnode, {}, [], []);
    },
    componentWillReceiveProps(nextProps, context) {
        var parentVnode = this.container;
        options.receiveVnode(parentVnode, nextProps.container, context, [], []);
    },
    componentWillMount() {
        var parentVnode = this.container;
        var updater = new DOMUpdater(parentVnode);
        this.portalUpdater = updater;
        this.insertQueue = [];
        var nextChildren = fiberizeChildren(parentVnode.props.children, updater);
        options.diffChildren({}, nextChildren, parentVnode, {}, [], []);
    },
    render() {
        return null;
    }
};
//[Top API] ReactDOM.createPortal
export function createPortal(children, node) {
    var container = createVnode(node);
    var props = container.props;
    props.children = children;
    var portal = createElement(Portal, {
        container
    });
    container.return = portal;
    return portal;
}
