import { registeredComponents, usingComponents, refreshMatchedApp } from './utils';
import { dispatchEvent } from './eventSystem';

export function registerComponent(type, name) {
    registeredComponents[name] = type;
    let reactInstances = type.reactInstances = [];
    type.wxInstances = {};
    let hasInit = false;
    function didUpdate() {
        usingComponents[name] = type;
        let uuid = this.props['data-instance-uid'] || null;
        refreshMatchedApp(reactInstances, this, uuid);
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