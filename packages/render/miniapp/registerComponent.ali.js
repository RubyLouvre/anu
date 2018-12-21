import { registeredComponents, usingComponents, updateMiniApp } from './utils';
import { dispatchEvent } from './eventSystem';

export function registerComponent(type, name) {
    registeredComponents[name] = type;
    var reactInstances = type.reactInstances = [];
    type.wxInstances = {};
    var hasInit = false;
    function didUpdate() {
        usingComponents[name] = type;
        var uuid = this.props['data-instance-uid'] || null;
        for (var i = reactInstances.length - 1; i >= 0; i--) {
            var reactInstance = reactInstances[i];
            if (reactInstance.instanceUid === uuid) {
                reactInstance.wx = this;
                this.reactInstance = reactInstance;
                updateMiniApp(reactInstance);
                return reactInstances.splice(i, 1);
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
            didUpdate.call(this);
        },
        didMount: function () {
            if (!hasInit) {
                didUpdate.call(this);
            }
        },
        didUpdate: didUpdate,
        didUnmount: function didUnmount() {
            var t = this.reactInstance;
            this.disposed = true;
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