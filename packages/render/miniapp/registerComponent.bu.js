import { registeredComponents, usingComponents, refreshComponent, detachComponent } from './utils';
import { dispatchEvent } from './eventSystem';

export function registerComponent (type, name) {
    type.isMPComponent = true;
    registeredComponents[name] = type;
    let reactInstances = type.reactInstances = [];
    return {
        data: {
            props: {},
            state: {},
            context: {}
        },
        options: type.options,
        attached() {
            usingComponents[name] = type;
            let uuid = this.dataset.instanceUid || null;
            refreshComponent(reactInstances, this, uuid);
        },
        detached: detachComponent,
        dispatchEvent: dispatchEvent
    };
}
