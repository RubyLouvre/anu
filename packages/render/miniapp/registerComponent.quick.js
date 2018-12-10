
import { registeredComponents, usingComponents, updateMiniApp } from './utils';
import { dispatchEvent } from './eventSystem.quick';
export function registerComponent(type, name) {
    registeredComponents[name] = type;
    var reactInstances = (type.reactInstances = []);
    var wxInstances = (type.wxInstances = []);
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
            var uuid = this.dataInstanceUid || null;
            for (var i = 0; i < reactInstances.length; i++) {
                var reactInstance = reactInstances[i];
                if (reactInstance.instanceUid === uuid) {
                    reactInstance.wx = this;
                    this.reactInstance = reactInstance;
                    updateMiniApp(reactInstance);
                    return reactInstances.splice(i, 1);
                }
            }
            wxInstances.push(this);
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
