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

            var instance = reactInstances.shift();
            if (instance) {
                /* eslint-disable-next-line */
                console.log("created时为", name, "添加wx");
                instance.wx = this;
                this.reactInstance = instance;
                updateMiniApp(instance);
            } else {
                /* eslint-disable-next-line */
                console.log("created时为", name, "没有对应react实例");
                wxInstances.push(this);
            }
            /*
            var uuid = this.dataset.instanceUid;
            for (var i = 0; i < reactInstances.length; i++) {
                var reactInstance = reactInstances[i];
                if (reactInstance.instanceUid === uuid) {
                    reactInstance.wx = this;
                    this.reactInstance = reactInstance;
                    updateMiniApp(reactInstance);
                    reactInstances.splice(i, 1);
                    break;
                }
            }
            if (!this.reactInstance) {
                wxInstances.push(this);
            }
            */
        },
        detached() {
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