
import { registeredComponents, usingComponents, updateMiniApp } from './utils';
import { dispatchEvent } from './eventSystemQuick';
export function registerComponent(type, name) {
    registeredComponents[name] = type;
    var reactInstances = (type.reactInstances = []);
    var wxInstances = (type.wxInstances = []);
    return {
        props: {
            props: {
                type: Object,
                default: {}
            },
            state: {
                type: Object,
                default: {}
            },
            context: {
                type: Object,
                default: {}
            }
        },

        onInit() {
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
        onReady() {
            if (this.reactInstance) {
                updateMiniApp(this.reactInstance);
                /* eslint-disable-next-line */
                console.log("attached时更新", name);
            }
        },
        onDestroy() {
            this.reactInstance = null;
        },
        dispatchEvent
        
    };
}
