import { registeredComponents, usingComponents, refreshMatchedApp } from './utils';
import { dispatchEvent } from './eventSystem';

export function registerComponent(type, name) {
    registeredComponents[name] = type;
    let reactInstances = type.reactInstances = [];
    type.wxInstances = {};
    return {
        data: {
            props: {},
            state: {},
            context: {}
        },

        attached() {
            usingComponents[name] = type;
            let uuid = this.dataset.instanceUid || null;
            refreshMatchedApp(reactInstances, this, uuid);
        },
        detached() {
            let t = this.reactInstance;
            this.disposed = true;
            if (t) {
                t.wx = null;
                this.reactInstance = null;
            }
            console.log(`detached ${name} 组件`); //eslint-disabled-line
        },
        dispatchEvent
    };
}