import { observable, action, computed } from 'mobx';
import * as R from 'ramda';
import Page from '../Page';
import PagePath from '@shared/entities/PagePath';
import log from '@shared/decorators/log';
import { DEBUG } from '@shared/env';
import ensureTabPageRegistered from '@shared/decorators/ensureTabPageRegistered';
import { ensureTabBarColorIsHexColor } from '@shared/validate/ensureColor';
import { ensureTabBarBorderStyle } from '@shared/validate/ensureEnum';
import ensureTabList from '@shared/validate/ensureTabList';
import TabBarItem from './TabBarItem';

export default class TabPage {
  App = null;
  displayName = 'TabPage';
  @observable color;
  @observable selectedColor;
  @observable backgroundColor;
  @observable currentPagePath;
  @observable currentPage = null;
  @observable borderStyle = 'black';
  @observable list = [];
  @observable position = 'bottom';
  @observable tabPages = new Map();
  @observable tabBarItems = [];
  @observable components = {};

  constructor(App, tabBar) {
    this.App = App;
    tabBar && this.prepare(tabBar);
    this.initTabs();
  }

  @action.bound
  activePage(pagePath) {
    pagePath = PagePath.normalizeWithLeadingSlash(pagePath);

    if (this.tabPages.has(pagePath)) {
      const nextPage = this.tabPages.get(pagePath);

      this.currentPage.hide();

      nextPage.show();

      this.currentPage = nextPage;
    } else {
      const Comp = this.App.components[pagePath];
      const page = new Page({ url: pagePath, Comp, App: this.App });

      page.disableAnimation();

      this.tabPages.set(pagePath, page);
      this.currentPage && this.currentPage.hide();
      this.currentPage = page;
    }
    this.refreshHighlight();
  }

  @computed
  get pages() {
    return R.map(R.last, [...this.tabPages]);
  }

  extendItemConfig(itemConfig) {
    return Object.assign({}, itemConfig, {
      color: this.color,
      selectedColor: this.selectedColor,
      setCurrentPagePath: this.setCurrentPagePath
    });
  }

  @action.bound
  initTabs() {
    this.tabBarItems = this.list.map(
      itemConfig => new TabBarItem(this.extendItemConfig(itemConfig))
    );

    if (this.list.length > 0) this.activateCurrentPage();
  }

  @action.bound
  loadDefaultPage() {
    // NOTE
    // 用户通过 URL 进入 App 时如果该应用没有 Tab Bar
    // 且当前页面不是首页
    // 则在点击返回时加载首页
    if (R.equals(0, this.tabBarItems.length)) {
      return this.App.navigateTo({
        url: this.App.firstRegisteredComponentUrl,
        withAnimation: false
      });
    }
  }

  @action.bound
  activateCurrentPage() {
    // NOTE
    // 如果该 App 有 Tab Bar
    // 则加载 Tab Bar 的激活页面
    const initialTab = R.defaultTo(
      R.head(this.tabBarItems),
      this.tabBarItems.find(R.prop('selected'))
    );

    this.currentPagePath = initialTab.pagePath;
    this.activePage(this.currentPagePath);
    this.refreshHighlight();
  }

  @action.bound
  setCurrentPagePath(pagePath) {
    pagePath = PagePath.normalizeWithLeadingSlash(pagePath);

    this.currentPagePath = pagePath;
    this.refreshHighlight();
    this.activePage(pagePath);
    this.App.pushHistory(pagePath);
  }

  @action.bound
  refreshHighlight() {
    this.tabBarItems.forEach(item => {
      if (
        item.pagePath ===
        PagePath.normalizeWithoutLeadingSlash(this.currentPagePath)
      ) {
        item.check();
      } else {
        item.unCheck();
      }
    });
  }

  @action.bound
  @ensureTabPageRegistered
  registerTabPage({ url }) {
    this.components[url] = this.App.components[url];
  }

  @action.bound
  @log(DEBUG)
  prepare(tabBar) {
    const {
      color,
      selectedColor,
      borderStyle,
      backgroundColor,
      list = []
    } = tabBar;

    this.color = ensureTabBarColorIsHexColor(color);
    this.selectedColor = ensureTabBarColorIsHexColor(selectedColor);
    this.backgroundColor = ensureTabBarColorIsHexColor(backgroundColor);
    this.borderStyle = ensureTabBarBorderStyle(borderStyle);
    this.list = ensureTabList(list);
    this.list.forEach(this.registerTabPage);
  }
}
