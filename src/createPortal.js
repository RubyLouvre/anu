import { createVnode, fiberizeChildren, createElement } from "./createElement";
import { options } from "./util";

function Portal(props) {
    this.container = props.container;
}
Portal.prototype = {
    constructor: Portal,
    componentWillUnmount() {
        var parentVnode = this.container;
        options.diffChildren(this.updater.children, {}, parentVnode, {},[]);
    },
    componentWillReceiveProps(nextProps, context) {
        var parentVnode = this.container;
        options.alignVnode(parentVnode, nextProps.container, context, []);
    },
    componentWillMount() {
        var parentVnode = this.container;
        var updater = this.updater;
        var nextChildren = fiberizeChildren(parentVnode.props.children, updater);
        options.diffChildren({}, nextChildren, parentVnode, {},[]);
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
