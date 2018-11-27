import { registeredComponents, usingComponents, updateMiniApp } from './utils';
import { dispatchEvent } from './eventSystem';

export function registerComponent(type, name) {
    registeredComponents[name] = type;
    var reactInstances = (type.reactInstances = []);
    var wxInstances = (type.wxInstances = []);
    return {
        data: {
            props: {},
            state: {},
            context: {}
        },

        attached() {
            usingComponents[name] = type;
            let instance = reactInstances.shift();
            if (instance) {
                console.log('attached时为', name, '添加wx');//eslint-disabled-line
                instance.wx = this;
                this.reactInstance = instance;
                updateMiniApp(this.reactInstance);
            } else {
                console.log('attached时为', name, '没有对应react实例');//eslint-disabled-line
                wxInstances.push(this);
            }
        },
        detached() {
            this.reactInstance = null;
        },
        dispatchEvent
    };
}