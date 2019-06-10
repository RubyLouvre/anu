import { observable, action, computed, runInAction } from 'mobx';
import { parse } from 'url';
import * as R from 'ramda';
import Page, { PAGE_SWITCH_DURATION } from '../Page';
import TabPage from '../TabPage';
import log from '@shared/decorators/log';
import ensurePageRegistered from '@shared/decorators/ensurePageRegistered';
import ensureTabPage from '@shared/decorators/ensureTabPage';
import ensureNotTabPage from '@shared/decorators/ensureNotTabPage';
import ensureUrlValidate from '@shared/validate/ensureUrlValidate';
import ensurePageCountIsInRange from '@shared/decorators/ensurePageCountIsInRange';
import { DEBUG } from '@shared/env';

export default class App {
  displayName = 'Route';
  firstRegisteredComponentUrl;
  components = {};
  internalHistoryEvents = false;
  @observable tabPage = null;
  @observable pages = [];
  @observable viewport = {
    width: 0,
    height: 0
  };
  @observable config = {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#0088a4',
    navigationBarTitleText: '去哪儿网',
    navigationBarTextStyle: '#ffffff',
    backgroundColor: '#ffffff'
  };

  @computed get firstPage() {
    return this.pages[0];
  }

  @computed get lastPage() {
    const {
      pages,
      pages: { length }
    } = this;
    // 如果页面堆栈中有页面，返回最后一个
    if (pages[length - 1]) return pages[length - 1];
    // 否则返回 Tab Pages 的当前页面
    return this.tabPage.currentPage;
  }

  ensureIfPagesRegistered() {
    if (this.components.length === 0) {
      throw new Error(
        'You seems to forget to register pages, ' +
          'make sure your pages are imported in the `app.js`'
      );
    }
  }

  @action.bound
  init(location) {
    this.ensureIfPagesRegistered();

    const { pathname, search } = location;
    const locationPathname = pathname.slice(1);
    const fullPathname = locationPathname + search;

    window.addEventListener('popstate', ({ state }) => {
      // internalHistoryEvents 可以确定该事件是否是内部触发的
      // 内部触发的事件应该忽略并重置以监听下次事件
      if (this.internalHistoryEvents)
        return (this.internalHistoryEvents = false);

      let delta = 1;
      let url = this.firstRegisteredComponentUrl;

      if (state) {
        url = state.url;

        const targetIndex = this.pages.findIndex(
          ({ url: { originalPagePath } }) => originalPagePath === url
        );

        if (targetIndex > -1) {
          delta = Math.max(1, this.pages.length - 1 - targetIndex);

          return this.navigateBack({
            delta,
            url
          });
        }
      }

      if (this.tabPage.tabPages.has(url)) {
        this.switchTab({ url });
      } else {
        this.navigateTo({ url });
      }
    });

    // NOTE tab Page 的优先级高于 stack Page
    if (this.tabPage.components[pathname])
      return this.tabPage.setCurrentPagePath(pathname);

    if (this.components[pathname])
      return this.navigateTo({ url: fullPathname });

    if (this.tabPage.tabBarItems.length) {
      this.tabPage.loadDefaultPage();
    } else {
      this.navigateTo({ url: this.firstRegisteredComponentUrl });
    }
  }

  @action.bound
  initTabBar(tabBar) {
    this.tabPage = new TabPage(this, tabBar);
  }

  @action.bound
  @log(DEBUG)
  initAppConfig(config) {
    Object.assign(this.config, config);
  }

  @action.bound
  @log(DEBUG)
  getCurrentPage() {
    return this.lastPage && this.lastPage.pageReference;
  }

  @action.bound
  @log(DEBUG)
  getCurrentPages() {
    const tabPageReference = R.filter(R.is(Object), [
      R.path(['tabPage', 'currentPage', 'Comp'])(this)
    ]);

    const stackPageReferences = this.pages.map(
      ({ pathname }) => this.components[pathname]
    );

    return R.concat(tabPageReference, stackPageReferences);
  }

  @action.bound
  @log(DEBUG)
  showNavigationBarLoading() {
    this.lastPage.loading = true;
  }

  @action.bound
  @log(DEBUG)
  hideNavigationBarLoading() {
    this.lastPage.loading = false;
  }

  @action.bound
  @log(DEBUG)
  setNavigationBarTitle(title) {
    requestAnimationFrame(() => {
      this.lastPage.setNavigationBarTitle(title);
    });
  }

  @action.bound
  @log(DEBUG)
  setNavigationBarColor(color) {
    requestAnimationFrame(() => {
      this.lastPage.setNavigationBarColor(color);
    });
  }

  @action.bound
  @log(DEBUG)
  setViewport(viewport) {
    this.viewport = viewport;
  }

  @action.bound
  @log(DEBUG)
  register({ url, Comp }) {
    const pathname = ensureUrlValidate(url);
    this.components[pathname] = Comp;
    this.firstRegisteredComponentUrl =
      this.firstRegisteredComponentUrl || pathname;
  }

  pushHistory(url) {
    history.pushState({ url }, null, url);
  }

  @action.bound
  @log(DEBUG)
  @ensurePageRegistered
  @ensureNotTabPage
  @ensurePageCountIsInRange
  navigateTo({ url, withAnimation }) {
    const { pathname } = parse(url);
    const Comp = this.components[pathname];

    const page = new Page({
      url,
      Comp: Comp,
      App: this,
      debug: DEBUG,
      withAnimation: withAnimation
    });

    this.lastPage && this.lastPage.hide();

    this.pages.push(page);

    if (!history.state || history.state.url !== url) this.pushHistory(url);
  }

  popImmediately(delta) {
    // 调用 reLaunch / switchTab 时禁用动画
    this.lastPage.disableAnimation();

    for (let i = 0; i < delta; i++) {
      this.pages.pop();
    }
  }

  notifyPagesWillBeDestroyed(length, delta) {
    // 通知要被弹出的页面执行退场动画
    for (let i = length - delta; i < length; i++) {
      this.pages[i].willDestroy();
    }
  }

  resetPagesIfAllPagesAreNull() {
    // SPECIAL CASE
    // 如果页面为空则 this.pages.every(fn) 的结果为 true
    // 会导致 this.pages 被意外修改
    // 导致意外的重新渲染
    if (this.pages.length === 0) return;
    // NOTE
    // 用户在打开很多页面时
    // 最早的页面会被自动卸载
    // 导致 this.pages 是类似于这样的结构：[null, null, Page0, Page1]
    // 如果用户通过 navigateBack() 将所有非 null 的页面弹出
    // 则 this.pages 应该被清空
    if (this.pages.every(v => v === null)) this.pages = [];
  }

  loadPreviousTabPage(url) {
    this.internalHistoryEvents = true;
    this.tabPage.setCurrentPagePath(url);
    history.back();
  }

  @action.bound
  @log(DEBUG)
  navigateBack({ delta = 1, url = this.firstRegisteredComponentUrl } = {}) {
    const {
      pages,
      pages: { length }
    } = this;
    const immediate = this.tabPage.tabPages.size === 0;

    if (length === 0) return this.loadPreviousTabPage(url);

    delta = Math.min(length, delta);

    if (immediate) return this.popImmediately(delta);

    this.notifyPagesWillBeDestroyed(length, delta);

    this.internalHistoryEvents = true;

    history.back();

    // 动画结束之后弹出页面
    setTimeout(() => {
      runInAction(() => {
        pages.splice(length - delta, delta);

        this.resetPagesIfAllPagesAreNull();

        if (this.lastPage) {
          this.lastPage.show();
        } else {
          this.tabPage.loadDefaultPage();
        }

        // history.back();
      });
    }, PAGE_SWITCH_DURATION);
  }

  @action.bound
  @log(DEBUG)
  @ensurePageRegistered
  redirectTo({ url }) {
    this.navigateBack({ delta: 1 }, true);

    requestAnimationFrame(() => {
      runInAction(() => {
        this.navigateTo({ url });
      });
    });
  }

  @action.bound
  @log(DEBUG)
  @ensurePageRegistered
  @ensureNotTabPage
  reLaunch({ url }) {
    this.navigateBack({ delta: this.pages.length }, true);

    requestAnimationFrame(() => {
      runInAction(() => {
        this.navigateTo({ url });
      });
    });
  }

  @action.bound
  @log(DEBUG)
  @ensurePageRegistered
  @ensureTabPage
  switchTab({ url }) {
    this.navigateBack({ delta: this.pages.length });

    requestAnimationFrame(() => {
      runInAction(() => {
        this.tabPage.setCurrentPagePath(url);
      });
    });
  }
}
