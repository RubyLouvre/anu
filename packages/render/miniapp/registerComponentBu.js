import { registeredComponents, usingComponents, updateMiniApp } from './utils';
import { eventSystem } from './eventSystem';

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

        created() {
            usingComponents[name] = type;
            var instance = reactInstances.shift();
            if (instance) {
                /* eslint-disable-next-line */
                console.log("created时为", name, "添加wx");
                instance.wx = this;
                this.reactInstance = instance;
            } else {
                /* eslint-disable-next-line */
                console.log("created时为", name, "没有对应react实例");
                wxInstances.push(this);
            }
        },
        attached() {
            if (this.reactInstance) {
                updateMiniApp(this.reactInstance);
                /* eslint-disable-next-line */
                console.log("attached时更新", name);
            } else {
                /* eslint-disable-next-line */
                console.log("attached时无法更新", name);
            }
        },
        detached() {
            this.reactInstance = null;
        },
        dispatchEvent: eventSystem.dispatchEvent
    };
}