import { registeredComponents, usingComponents, updateMiniApp } from './utils';
import { dispatchEvent } from './eventSystem';
const defer = typeof Promise=='function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

export function registerComponent(type, name) {
    registeredComponents[name] = type;
    let reactInstances = (type.reactInstances = []);
    type.wxInstances = {};
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
                //微信小程序的组件的实例化可能先于页面的React render,需要延迟
                //https://github.com/RubyLouvre/anu/issues/531
                defer(()=>{
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
                });
              
            },
            detached() {
                let t = this.reactInstance;
                this.disposed = true;
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
