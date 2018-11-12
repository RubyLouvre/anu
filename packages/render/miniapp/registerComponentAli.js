import { registeredComponents, usingComponents, updateMiniApp } from './utils';
import { dispatchEvent } from './eventSystem';

export function registerComponent(type, name) {
    // type.ali = true;
    registeredComponents[name] = type;
    var reactInstances = (type.reactInstances = []);
    var wxInstances = type.wxInstances = [];
    var hasInit = false;
    return {
        data: {
            props: {},
            state: {},
            context: {}
        },
        onInit() {
            hasInit = true;
        },
        onMount() {
            usingComponents[name] = type;
            var instance = reactInstances.shift();
            if (instance) {
                /* eslint-disable-next-line */
                console.log("onMount时为", name, "添加wx");
                instance.wx = this;
                this.reactInstance = instance;
            } else {
                wxInstances.push(this);
            }
            if (this.reactInstance) {
                updateMiniApp(this.reactInstance);
            }

        },
        onUnmount() {
            this.reactInstance = null;
        },
        didMount() {
            if (hasInit) {
                return;
            }
            usingComponents[name] = type;
            var uid = this.props.instanceUid;
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
            //支付宝小程序的实例didMount是没有顺序的
        },
        didUnmount() {
            if (hasInit) {
                return;
            }
            this.reactInstance = null;
        },

        methods: {
            dispatchEvent
        }
    };
}
