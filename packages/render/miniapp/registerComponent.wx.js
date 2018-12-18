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
                //https://github.com/RubyLouvre/anu/issues/531
                var uuid = this.dataset.instanceUid || null;
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
            detached() {
                let t = this.reactInstance;
                if (t) {
                    t.wx = null;
                    this.reactInstance = null;
                }
                console.log(`detached ${name} 组件`); //eslint-disabled-line
            }
        },
        methods: {
            dispatchEvent
        }
    };
    Object.assign(config, config.lifetimes);
    return config;
}
