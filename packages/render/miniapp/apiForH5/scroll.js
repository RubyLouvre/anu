import { handleSuccess, handleFail } from '../utils';

/**
 * 将页面滚动到目标位置
 */
function pageScrollTo({
  scrollTop,
  duration = 300,
  success = () => {},
  fail = () => {},
  complete = () => {},
} = {}) {
  // TODO 暂不考虑动画效果
  return new Promise(function(resolve, reject) {
    const container = document.getElementsByClassName('__internal__DynamicPage-container');
    if (container.length > 0) {
      container[container.length - 1].scrollTo(0, scrollTop);
      handleSuccess({ scrollTop }, success, complete, resolve);
    } else {
      handleFail({errMsg: 'pageScrollTo fail'}, fail, complete, reject);
    }
  });
}

export default {
  pageScrollTo
};
