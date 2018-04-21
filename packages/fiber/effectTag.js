export const NOWORK = 1; //用于叠加其他任务
export const PLACE = 2; //插入或移动
export const CONTENT = 3; //设置文本
export const ATTR = 5; //更新属性
export const NULLREF = 7; //delete null
export const DETACH = 11; //移出DOM树 componentWillUnmount
export const HOOK = 13; //componentDidMount/Update/
export const REF = 17; // ref 总在钩子之后
export const CALLBACK = 19; //回调
export const CAPTURE = 23; //出错
//上面的副作用的功能与位置可能变化频繁，我们需确保它们从小到大排列
export const effectNames = [PLACE, CONTENT, ATTR, NULLREF, HOOK,
    REF, DETACH, CALLBACK, CAPTURE].sort(function (a, b) {
    return a - b;
});
export const effectLength = effectNames.length;

// PLACE, CONTENT, DETACH 是基础因子，其他因子只能在它上面相乘

/** 
 * 
 Ref是基于Fiber的，当Fiber插入DOM树后，就会执行一次，Fiber的生命周期与渲染周期一致
 在receive阶段，新旧Fiber的类型与key一致时，旧Fiber的实例就会移动到新Fiber上，这时如果新旧Fiber的ref的引用不一致时，
 （只会在函数的情况出现），就会为旧ref传入null, 新ref继续在hook后执行

*/