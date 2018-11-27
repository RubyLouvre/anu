import { registeredComponents, usingComponents, updateMiniApp } from './utils';
import { dispatchEvent } from './eventSystem';

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
            attached: function attached() {
                usingComponents[name] = type;
                /*
                let instance = reactInstances.shift();
                if (instance) {
                    console.log("attached时为", name, "添加wx");//eslint-disabled-line
                    instance.wx = this;
                    this.reactInstance = instance;
                    this.isUpdate = true;
                    updateMiniApp(this.reactInstance);
                } else {
                    console.log("attached时为", name, "没有对应react实例");//eslint-disabled-line
                    wxInstances.push(this);
                }*/
                var uid = this.dataset.instanceUid;
                for (var i = reactInstances.length - 1; i >= 0; i--) {
                    var reactInstance = reactInstances[i];
                    if (reactInstance.instanceUid === uid) {
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

            },
            detached() {
                let t = this.reactInstance;
                if (t) {
                    t.wx = null;
                    this.reactInstance = null;
                }
                console.log('detached...', name);//eslint-disabled-line
            }
        },
        methods: {
            dispatchEvent
        }
    };
    Object.assign(config, config.lifetimes);
    return config;
}
