import applyComponentHook from './lifecycle'
import { assignDefaultProps } from '../props'
import { extractRenderNode } from '../extract'
import { replaceRootNode } from '../vnode'
import { reconcileNodes } from '../reconcile'
import { objEmpty, arrEmpty } from '../shapes'
//用到objEmpty
/**
 * Component class
 *
 * @public
 * 
 * @param {Object<string, any>=} props
 */
export default function Component(props) {
    // initial props
    if (props === objEmpty) {
        props = {}
    }
    // |this| used uninitialized in Hello class constructor
    // assign props
    if (props !== objEmpty) {
        // hydrate default props
        if (this.getDefaultProps) {
            assignDefaultProps(applyComponentHook(this, -1, props), props);
        }

        applyComponentHook(this, 2, props)

        this.props = props;
    }
    // default props
    else {
        this.props = this.props || applyComponentHook(this, -1, null) || {}
    }


    // assign state
    this.state = this.state || applyComponentHook(this, -2, null) || {}


    this.refs = null;

    this['--vnode'] = null;
}


/**
 * Component prototype
 * 
 * @type {Object<string, function>}
 */
Component.prototype = {
    constructor: Component,
    setState: setState,
    forceUpdate: forceUpdate
};


/**
 * set state
 *
 * @public
 * 
 * @param {Object}                    newState
 * @param {function(this:Component)=} callback
 */
function setState(newState, callback) {
    // shouldComponentUpdate 
    if (applyComponentHook(this, 3, this.props, newState) === false) {
        return
    }

    // update state
    updateState(this.state, newState);

    // callback
    if (typeof callback === 'function') {
        callback.call(this)
    }

    // update component
    this.forceUpdate();
}


/**
 * update state, hoisted to avoid `for in` deopts
 * 
 * @param {Object} oldState
 * @param {Object} newState
 */
function updateState(oldState, newState) {
    if (oldState != null) {
        for (var name in newState) {
            oldState[name] = newState[name];
        }
    }
}

/**
 * force an update
 *
 * @public
 * 
 * @param  {function(this:Component)=} callback
 */
function forceUpdate(callback) {
    // componentWillUpdate
    applyComponentHook(this, 4, this.props, this.state)


    var oldNode = this['--vnode'];
    var newNode = extractRenderNode(this);

    var newType = newNode.Type;
    var oldType = oldNode.Type;

    // different root node
    if (newNode.type !== oldNode.nodeName) {
        replaceRootNode(newNode, oldNode, newType, oldType, this);
    }
    // patch node
    else {
        // element root node
        if (oldType !== 3) {
            reconcileNodes(newNode, oldNode, newType, 1);
        }
        // text root node
        else if (newNode.children !== oldNode.children) {
            oldNode.DOMNode.nodeValue = oldNode.children = newNode.children;
        }
    }

    // componentDidUpdate
    applyComponentHook(this, 5, this.props, this.state)

    // callback
    if (typeof callback === 'function') {
        callback.call(this)
    }
}