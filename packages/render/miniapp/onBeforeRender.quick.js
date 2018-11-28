import { getUUID, delayMounts, pageState, _getApp } from './utils';
export function onBeforeRender(fiber) {
    let type = fiber.type;
    let instance = fiber.stateNode;
    //let noMount = !fiber.hasMounted;
    if (type.reactInstances) {
        let uuid = fiber.props['data-instance-uid'] || 'i' + getUUID();
        if (!instance.instanceUid) {
            instance.instanceUid = uuid;
        }
        if (fiber.props.isPageComponent) {
            _getApp().page = instance;
        }
        //只处理component目录下的组件
        let wxInstances = type.wxInstances;
        if (wxInstances) {
            type.reactInstances.push(instance);
        }
    }
    if (!pageState.isReady && instance.componentDidMount) {
        delayMounts.push({
            instance: instance,
            fn: instance.componentDidMount
        });
        instance.componentDidMount = Date;
    }
}
