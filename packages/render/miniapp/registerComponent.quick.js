import { registeredComponents, usingComponents, refreshMatchedApp } from './utils';
import { dispatchEvent } from './eventSystem.quick';

export function registerComponent(type, name) {
    registeredComponents[name] = type;
    let reactInstances = (type.reactInstances = []);
    type.wxInstances = [];
    return {
        data() {
            return {
                props: {},
                state: {},
                context: {}
            };
        },

        onInit() {
            usingComponents[name] = type;
        },
        onReady() {
            let uuid = this.dataInstanceUid || null;
            refreshMatchedApp(reactInstances, this, uuid);
        },
        onDestroy() {
            let t = this.reactInstance;
            if (t) {
                t.wx = null;
                this.reactInstance = null;
            }
            console.log(`detached ${name} 组件`); //eslint-disabled-line
        },
        dispatchEvent

    };
}
