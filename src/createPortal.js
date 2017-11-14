import { createVnode, restoreChildren, fiberizeChildren, createElement } from "./createElement";
import { options } from "./util";

function Portal(props) {
    this.container = props.container;
}
Portal.prototype = {
    constructor: Portal,
    componentWillUnmount() {
        var parentVnode = this.container;
        var lastChildren = restoreChildren(parentVnode);
        options.diffChildren(lastChildren, [], parentVnode, {}, []);
    },
    componentWillReceiveProps(nextProps, context) {
        var parentVnode = this.container;
        options.alignVnode(parentVnode, nextProps.container, context, []);
    },
    componentWillMount() {
        var parentVnode = this.container;
        var nextChildren = fiberizeChildren(parentVnode);
        options.diffChildren([], nextChildren, parentVnode, {}, []);
        parentVnode.batchMount();
    },
    render() {
        return null;
    }
};
//[Top API] ReactDOM.createPortal
export function createPortal(children, node) {
    var container = createVnode(node);
    container.props = container.props || {};
    var props = container.props;
    props.children = children;
    var portal = createElement(Portal, {
        container
    });
    container.return = portal;
    return portal;
}
