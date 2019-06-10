import { observable, computed, action } from 'mobx';
import PagePath from '@shared/entities/PagePath';
import { defaultTo } from 'ramda';
import validateNavigationBarFrontColor from '@shared/validate/navigationBarFrontColor';
import transformTimingFunctionToDashStyle from '@shared/utils/transformTimingFunctionToDashStyle';

// 页面切换默认动画长度
export const PAGE_SWITCH_DURATION = 300;
// 调试模式
export { DEBUG } from '@shared/env';
// 页面标题渐变动画默认时间长度
const DEFAULT_HEADER_ANIMATION_DURATION = 0;
// 页面标题渐变动画默认动画函数
const DEFAULT_HEADER_ANIMATION_TIMING_FUNCTION = 'linear';

export default class Page {
  static websiteTitlePrefix = '【去哪儿网】';
  @observable url;
  @observable navigationBarTitleText = '';
  @observable navigationBarTextStyle = 'white';
  @observable navigationBarBackgroundColor = '#000000';
  @observable backgroundTextStyle = 'dark';
  @observable backgroundColor = '#ffffff';
  @observable offsetX = 100; // 单位 %
  @observable offsetY = 0; // 单位 %
  @observable titleBarHeight = 48;
  @observable loading = false;
  @observable animation = {
    duration: DEFAULT_HEADER_ANIMATION_DURATION,
    timingFunc: DEFAULT_HEADER_ANIMATION_TIMING_FUNCTION
  };
  pageReference = null;

  constructor({ url, Comp, withAnimation = true, App, App: { viewport } }) {
    this.url = new PagePath(url);
    this.navigationBarTitleText = App.config.navigationBarTitleText;
    this.navigationBarTextStyle = App.config.navigationBarTextStyle;
    this.navigationBarBackgroundColor = App.config.navigationBarBackgroundColor;
    this.backgroundTextStyle = App.config.backgroundTextStyle;
    this.backgroundColor = App.config.backgroundColor;
    this.Comp = Comp;
    this.App = App;
    this.viewport = viewport;
    this.withAnimation = withAnimation;
    this.hidden = observable.box(false);
    this.updateDocumentTitle();
  }

  updateDocumentTitle() {
    document.title = `${Page.websiteTitlePrefix} ${
      this.navigationBarTitleText
    }`;
  }

  setPageReference(ref) {
    this.pageReference = ref;
  }

  @action
  setNavigationBarColor({
    frontColor: navigationBarTextStyle,
    backgroundColor: navigationBarBackgroundColor,
    animation
  }) {
    if (!validateNavigationBarFrontColor(navigationBarTextStyle)) return false;

    this.navigationBarTextStyle = defaultTo(
      this.navigationBarTextStyle,
      navigationBarTextStyle
    );
    this.navigationBarBackgroundColor = defaultTo(
      this.navigationBarBackgroundColor,
      navigationBarBackgroundColor
    );
    this.animation = defaultTo(this.animation, animation);
    this.animation.timingFunc = transformTimingFunctionToDashStyle(
      this.animation.timingFunc
    );
  }

  @action
  setNavigationBarTitle({ title }) {
    this.navigationBarTitleText = title || this.navigationBarTitleText;
    this.updateDocumentTitle();
  }

  @action
  show() {
    setTimeout(() => {
      this.hidden.set(false);
      this.offsetX = 0;
      const url = this.url.originalPagePath;

      if (history.state && history.state.url !== url) {
        history.replaceState({ url: url }, null, url);
      }
    }, 0);
  }

  @action.bound
  hideImplement() {
    this.hidden.set(true);

    // SPECIAL CASE
    // 如果存在 Tab 页而页面堆栈中不存在页面
    // 则开启页面堆栈第一个页面时不调用当前 Page 实例的 hide 方法
    // 而是仅将当前 Page 的 hidden 属性设置为 true
    // 以在阻止 Tab 页被移出页面 viewport 的同时
    // 触发当前 Page 实例的 onHide 以及 onUnload 钩子
    if (this.App.tabPage && this.App.pages.length) return;

    this.offsetX = 100;
  }

  @action
  hide(immediate) {
    if (immediate) return this.hideImplement();

    setTimeout(this.hideImplement);
  }

  @action.bound
  destroy() {
    this.App.navigateBack();
  }

  @action
  willDestroy() {
    this.offsetX = 100;
    this.hidden.set(true);
  }

  @action
  disableAnimation() {
    this.withAnimation = false;
  }

  @action
  enableAnimation() {
    this.withAnimation = true;
  }

  @computed get animationDuration() {
    return this.withAnimation ? PAGE_SWITCH_DURATION : 0;
  }

  @computed get translateX() {
    return `${this.offsetX}%`;
  }

  @computed get translateY() {
    return `${this.offsetY}%`;
  }

  @computed get pathname() {
    return this.url.pathname;
  }

  @computed get query() {
    return this.url.query;
  }

  @computed get search() {
    return this.url.search;
  }
}
