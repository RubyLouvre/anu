import { classCached } from './utils';

export function toRenderProps(props) {
    var parentClass = classCached[props.classUid];
    if (parentClass) {
        var instance = parentClass[props.instanceUid];
        var wxData= instance.wxData;
        instance.wxData.renderData = Object.assign({}, wxData);
    }
    return null;
}