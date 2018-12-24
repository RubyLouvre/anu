import { toWarnDev, returnFalse,returnTrue, get } from "./util";
import { Renderer } from "./createRenderer";


export const fakeObject = {
    enqueueSetState: returnFalse,
    isMounted: returnFalse
};
/**
 *组件的基类
 *
 * @param {any} props
 * @param {any} context
 */
export function Component(props, context) {
    //防止用户在构造器生成JSX
    
    Renderer.currentOwner = this;
    this.context = context;
    this.props = props;
    this.refs = {};
    this.updater = fakeObject;
    this.state = null;
}


Component.prototype = {
    constructor: Component, //必须重写constructor,防止别人在子类中使用Object.getPrototypeOf时找不到正确的基类
    replaceState() {
        toWarnDev("replaceState", true);
    },
    isReactComponent:returnTrue,
    isMounted() {
        toWarnDev("isMounted", true);
        return this.updater.isMounted(this);
    },
    setState(state, cb) {
        this.updater.enqueueSetState(get(this), state, cb);
    },
    forceUpdate(cb) {
        this.updater.enqueueSetState(get(this), true, cb);
    },
    render() {
        throw "must implement render";
    }
};

