import { registeredComponents, usingComponents, updateMiniApp } from './utils';
import { eventSystem } from './eventSystem';

export function registerComponent(type, name) {
    type.ali = true;
    registeredComponents[name] = type;
    var reactInstances = (type.reactInstances = []);
    type.wxInstances = [];
    return {
        data: {
            props: {},
            state: {},
            context: {}
        },
        didMount() {
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
            this.reactInstance = null;
        },

        methods: {
            dispatchEvent: eventSystem.dispatchEvent
        }
    };
}
