import { deprecatedWarn, returnFalse } from "./util";
import { Refs } from "./Refs";
/**
 *组件的基类
 *
 * @param {any} props
 * @param {any} context
 */
export function Component(props, context) {
    //防止用户在构造器生成JSX
    Refs.currentOwner = this;
    this.context = context;
    this.props = props;
    this.refs = {};
    this.state = null;
}
var fakeObject = {
    enqueueSetState: returnFalse,
    isMounted: returnFalse
};


Component.prototype = {
    constructor: Component, //必须重写constructor,防止别人在子类中使用Object.getPrototypeOf时找不到正确的基类
    replaceState() {
        deprecatedWarn("replaceState");
    },
    isMounted() {
        deprecatedWarn("isMounted");
        return (this.updater || fakeObject).isMounted();
    },
    setState(state, cb) {
        (this.updater || fakeObject).enqueueSetState(state, cb);
    },
    forceUpdate(cb) {
        (this.updater || fakeObject).enqueueSetState(true, cb);
    },
    render() {}
};

