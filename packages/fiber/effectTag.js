export const NOWORK = 1; //用于叠加其他任务
export const PLACE = 2; //插入或移动
export const CONTENT = 3; //设置文本
export const ATTR = 5; //更新属性
export const NULLREF = 7; //delete null
export const DETACH = 11; //移出DOM树
export const HOOK = 13; //componentDidMount/Update/WillUnmount
export const CHANGEREF = 17;//change ref
export const REF = 19; //init ref
export const CALLBACK = 23; //回调
export const CAPTURE = 29; //出错
export const effectNames = [PLACE, CONTENT, ATTR, NULLREF, HOOK,
    CHANGEREF, REF, DETACH, CALLBACK, CAPTURE].sort(function (a, b) {
    return a - b;
});
export const effectLength = effectNames.length;

// PLACE, CONTENT, DETACH 是基础因子，其他因子只能在它上面相乘