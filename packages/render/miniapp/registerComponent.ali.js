import { registeredComponents, usingComponents, updateMiniApp } from './utils';
import { dispatchEvent } from './eventSystem';

export function registerComponent(type, name) {
    type.ali = true;
    registeredComponents[name] = type;
    var reactInstances = type.reactInstances = [];
    var wxInstances = type.wxInstances = [];
    var hasInit = false;
    function didUpdate() {
        usingComponents[name] = type;
        var uid = this.props['data-instance-uid'];
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
    }
    return {
        data: {
            props: {},
            state: {},
            context: {}
        },
        onInit: function onInit() {
            hasInit = true;
            usingComponents[name] = type;
            var instance = reactInstances.shift();
            if (instance) {
                instance.wx = this;
                this.reactInstance = instance;
                updateMiniApp(this.reactInstance);
            } else {
                wxInstances.push(this);
            }
        },
        didMount: function(){
            if ( !hasInit){
                didUpdate.call(this);
            }
        },
        didUpdate: didUpdate,
        didUnmount: function didUnmount() {
            var t = this.reactInstance;
            if (t) {
                t.wx = null;
                this.reactInstance = null;
            }
            console.log(`detached ${name} 组件`); //eslint-disabled-line
        },
        methods: {
            dispatchEvent: dispatchEvent
        }
    };
}