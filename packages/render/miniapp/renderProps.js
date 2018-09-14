import { classCached } from './utils';

export function renderProps(props) {
    var parentClass = classCached[props.classUid];
    if (parentClass && parentClass.instances) {
        var instance = parentClass.instances[props.instanceUid];
        var wxData= instance.wxData;
        instance.wxData.renderData = Object.assign({}, wxData);
    }
    return null;
}