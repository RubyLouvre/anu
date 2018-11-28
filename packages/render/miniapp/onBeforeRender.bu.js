import { getUUID, delayMounts, pageState, _getApp } from "./utils";
export function onBeforeRender(fiber) {
    let type = fiber.type;
    let instance = fiber.stateNode;
    if (type.reactInstances) {
        let uuid = fiber.props["data-instance-uid"] || "i" + getUUID();
        instance.instanceUid = uuid;
        if (fiber.props.isPageComponent) {
            _getApp().page = instance;
        }
        //只处理component目录下的组件
        let wxInstances = type.wxInstances;
        if (wxInstances) {
            if (!instance.wx && wxInstances.length) {
                var wx = instance.wx = wxInstances.shift();
                wx.reactInstance = instance;
            }
            if (!instance.wx) {
                type.reactInstances.push(instance);
            }
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
