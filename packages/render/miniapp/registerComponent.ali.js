import { registeredComponents, usingComponents, refreshComponent, detachComponent } from './utils';
import { dispatchEvent } from './eventSystem';

export function registerComponent (type, name) {
    type.isMPComponent = true;
    registeredComponents[name] = type;
    let reactInstances = type.reactInstances = [];
    let hasInit = false;
    function didUpdate () {
        usingComponents[name] = type;
        let uuid = this.props['data-instance-uid'] || null;
        refreshComponent(reactInstances, this, uuid);
    }
    return {
        data: {
            props: {},
            state: {},
            context: {}
        },
        onInit: function onInit () {
            hasInit = true;
            didUpdate.call(this);
        },
        didMount: function () {
            if (!hasInit) {
                didUpdate.call(this);
            }
        },
        didUpdate: didUpdate,
        didUnmount: detachComponent,
        methods: {
            dispatchEvent: dispatchEvent
        }
    };
}
