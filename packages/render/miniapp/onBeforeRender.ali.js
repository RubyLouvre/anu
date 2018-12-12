import { delayMounts, _getApp } from './utils';
export function onBeforeRender(fiber) {
    let type = fiber.type;
    let instance = fiber.stateNode;
    let app = _getApp();
    if (type.reactInstances) {
        let uuid = fiber.props['data-instance-uid'] || null;
        if (!instance.instanceUid) {
            instance.instanceUid = uuid;
        }

        if (fiber.props.isPageComponent) {
            let wx = app.$$page;
            instance.wx = wx;
            wx.reactInstance = instance;
        }
        //只处理component目录下的组件
        let wxInstances = type.wxInstances;
        if (wxInstances && !instance.wx) {
            type.reactInstances.push(instance);
        }
    }
    if (!app.$$pageIsReady && instance.componentDidMount) {
        delayMounts.push({
            instance: instance,
            fn: instance.componentDidMount
        });
        instance.componentDidMount = Date;
    }
}
