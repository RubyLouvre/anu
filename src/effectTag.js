export const NOWORK = 0; //不处理此节点及孩子
export const WORKING = 1; //用于叠加其他任务
export const PLACE = 2; //插入或移动
export const CONTENT = 3; //设置文本
export const ATTR = 5; //更新属性
export const NULLREF = 7; //ref null
export const HOOK = 11; //componentDidMount/Update/WillUnmount
export const REF = 13; //ref stateNode
export const DETACH = 17; //移出DOM树
export const CALLBACK = 19; //回调
export const CAPTURE = 23; //出错
export const effectNames = [ PLACE, CONTENT, ATTR, NULLREF, HOOK, REF, DETACH, CALLBACK, CAPTURE ];
export const effectLength = effectNames.length;

// PLACE, CONTENT, DETACH 是基础因子，其他因子只能在它上面相乘