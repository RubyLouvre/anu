import { handleSuccess, handleFail } from '../utils';

/**
 * 将页面滚动到目标位置
 */
function pageScrollTo({
    scrollTop,   // 要滑动的距离
    duration = 300, // 时长
    success = () => {},
    fail = () => {},
    complete = () => {},
} = {}) {
    // TODO 暂不考虑动画效果
    return new Promise(function(resolve, reject) {
        // 滑动动画
        var bounce = function(per) {
            if (per < (1/2.75)){
                return (7.5625*per*per);
            } else if (per < (2/2.75)) {
                return (7.5625 * (per -= (1.5/2.75)) * per + .75);
            } else if (per < (2.5/2.75)){
                return (7.5625 * (per -= (2.25/2.75)) * per + .9375);
            } else {
                return (7.5625 * (per -= (2.25/2.75)) * per + .984375);
            }
        };

        const container = document.getElementsByClassName('__internal__DynamicPage-container'); 
        if (container.length > 0) {
            const page = container[container.length - 1]; // 滚动的页面
            var begin = page.scrollTop; // 获取当前页面滚动条纵坐标的位置
            const distance = begin + scrollTop;   // 结束位置
            const fps = 60;  // 刷新率
            const internal = 1000/fps; // 每相隔多少ms刷新一次
            const times = duration / 1000*fps;   // 一共刷新这么多次
            const step = distance/times;  // 每次移动的距离
            const beginTime = new Date;
            var id = setInterval(function(){
                var per = (new Date - beginTime) / duration;  // 进度
                if (scrollTop>0){
                    if (begin>=distance){
                        clearInterval(id);
                        handleSuccess({ scrollTop }, success, complete, resolve);
                    } else {
                        page.style.top = begin + bounce(per) * scrollTop + 'px';
                        begin += step;
                    }
                } else if (scrollTop<0) {
                    if (begin<distance){
                        clearInterval(id);
                        handleSuccess({ scrollTop }, success, complete, resolve);
                    } else {
                        page.style.top = begin + bounce(per) * scrollTop + 'px';
                        begin += step;
                    }
                }
                page.scrollTop = begin;
            }, internal);
        } else {
            handleFail({errMsg: 'pageScrollTo fail'}, fail, complete, reject);
        }
    });
}

export default {
    pageScrollTo
};
