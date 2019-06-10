import { DEBUG } from '@shared/env';
import * as R from 'ramda';

const PAGE_SIZE_LIMIT = 10;

export default function ensurePageCountIsInRange(target, name, descriptor) {
  const fn = descriptor.value;

  descriptor.value = function(...args) {
    if (this.pages.length >= PAGE_SIZE_LIMIT) {
      // NOTE
      // 当页面堆栈长度超过限制时
      // 堆栈最早的一部分页面会被设置成 null
      // 以释放防止过多页面导致的性能问题
      // 如限制是 5，在打开第六个页面之后
      // this.pages 应该为 [null, Page, Page, Page, Page, Page]
      // NOTE 不能使用 shift，会导致所有页面重新渲染以及生命周期钩子重复执行
      const leadingPageIndex = this.pages.length - PAGE_SIZE_LIMIT;

      if (DEBUG) {
        const url = R.path([leadingPageIndex, 'url'], this.pages);
        // eslint-disable-next-line
        console.warn(
          `page(${url}) has been removed ` +
            `due to page stack has exceeded the page size limit ${PAGE_SIZE_LIMIT}`
        );
      }

      // SPECIAL CASE
      // 先手动以 immediate 为 true 调用最近页面的 hide 方法
      // 否则堆栈底部页面的 onUnload、堆栈顶部页面的 onHide 以及新页面的 onReady onShow 及 onLoad
      // 生命周期顺序会不正确
      // 因为 hide() 方法不带 immediate 参数是异步执行的
      // 为了实现从 Tab 页打开第一个堆栈页面时 Tab 页面不会被隐藏的效果
      this.lastPage.hide(true);
      this.pages[leadingPageIndex] = null;
    }

    fn.call(this, ...args);
  };
}
