import { registeredComponents, usingComponents, updateMiniApp } from './utils';
import { eventSystem } from './eventSystem';

export function registerComponent(type, name) {
    registeredComponents[name] = type;
    let reactInstances = (type.reactInstances = []);
    let wxInstances = (type.wxInstances = []);
    let config = {
        data: {
            props: {},
            state: {},
            context: {}
        },
        lifetimes: {
            //微信需要lifetimes, methods
            created() {
                usingComponents[name] = type;
                let instance = reactInstances.shift();
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
                console.log('detached...',name);//eslint-disabled-line
                this.reactInstance = null;
            }
        },
        methods: {
            dispatchEvent: eventSystem.dispatchEvent
        }
    };
    Object.assign(config, config.lifetimes);
    return config;
}
