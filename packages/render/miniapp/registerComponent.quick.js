import { registeredComponents, usingComponents, refreshComponent, detachComponent } from './utils';
import { dispatchEvent } from './eventSystem.quick';

export function registerComponent (type, name) {
    type.isMPComponent = true;
    registeredComponents[name] = type;
    let reactInstances = type.reactInstances = [];
    return {
        data() {
            return {
                props: {},
                state: {},
                context: {}
            };
        },
        onInit() {
            usingComponents[name] = type;
            let uuid = this.dataInstanceUid || null;
            refreshComponent(reactInstances, this, uuid);
        },
        onDestroy: detachComponent,
        dispatchEvent: dispatchEvent
    };
}
