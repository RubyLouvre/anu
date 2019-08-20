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
            let wx = this;
            defer(() => {
                usingComponents[name] = type;
                //百度小程度3.9之后，改变了小程序生命周期，与微信小程序保持一致
                let uuid = wx.dataset.instanceUid || null;
                refreshComponent(reactInstances, wx, uuid);
            });
        },
        detached: detachComponent,
        dispatchEvent: dispatchEvent
    };
}
