import React from 'react';
import { observer, inject } from 'mobx-react';
import TabPage from '../TabPage';
import PageStack from '../PageStack';
import AppConfig, { Pages } from '@app';
import injectApi from '@shared/utils/injectApi';
import api from '../../api';
import createApiNameSpace from '@shared/utils/createApiNameSpace';
import MAX_VIEWPORT_WIDTH from '@shared/runtime/MAX_VIEWPORT_WIDTH';
import MIN_VIEWPORT_WIDTH from '@shared/runtime/MIN_VIEWPORT_WIDTH';

@inject('App')
@observer
class App extends React.Component {
  constructor(props) {
    super(props);

    this.app = React.createRef();
    this.injectReactApis();
    this.initAppConfig();
    this.injectGlobalData();
    this.injectGetApp();
    this.injectGetCurrentPage();
    this.listenExit();
    this.listenVisibilityChange();

    this.guardCallLifeCycle('onLaunch');
    this.guardCallLifeCycle('onLoad');
  }

  guardCallLifeCycle(name, ...args) {
    AppConfig[name] && AppConfig[name].call(AppConfig, ...args);
  }

  listenExit() {
    window.addEventListener('beforeunload', () =>
      this.guardCallLifeCycle('onHide')
    );
  }

  listenVisibilityChange() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.guardCallLifeCycle('onHide');
      } else if (document.visibilityState === 'visible') {
        this.guardCallLifeCycle('onLoad');
      }
    });
  }

  initAppConfig() {
    this.props.App.initAppConfig(AppConfig.config.window);
  }

  injectGetCurrentPage() {
    React.getCurrentPage = this.props.App.getCurrentPage;
    React.getCurrentPages = this.props.App.getCurrentPages;
  }

  injectReactApis() {
    const dest = (React.api = React.api || createApiNameSpace());

    const apis = [
      'navigateTo',
      'navigateBack',
      'redirectTo',
      'reLaunch',
      'switchTab',
      'setNavigationBarColor',
      'setNavigationBarTitle',
      'getCurrentPage',
      'getCurrentPages',
      'hideNavigationBarLoading',
      'showNavigationBarLoading'
    ];

    injectApi(this.props.App, dest, apis);
    injectApi(api, dest, Object.keys(api));
  }

  injectGlobalData() {
    this.globalData = AppConfig.globalData;
  }

  injectGetApp() {
    React.getApp = () => this;
  }

  measure() {
    const { current } = this.app;
    const { width, height } = current.getBoundingClientRect();

    this.props.App.setViewport({ width, height });
  }

  registerPages(pages) {
    pages.forEach(this.props.App.register);
  }

  componentDidMount() {
    const { initTabBar, init } = this.props.App;

    // 注册所有页面
    this.registerPages(Pages);

    // 初始化 TabBar（如果有的话）
    initTabBar(AppConfig.config.tabBar);

    // 加载第一页
    init(location);
  }

  render() {
    const {
      pages,
      tabPage,
      config: { backgroundColor }
    } = this.props.App;

    return (
      <div className="__internal__App__" ref={this.app}>
        {/* Tab 页面，包含底部 Tab */}
        {tabPage ? <TabPage tabPage={tabPage} /> : null}

        <PageStack pages={pages} />

        <style jsx>{`
          .__internal__App__ {
            width: 100%;
            height: 100%;
            min-width: ${MIN_VIEWPORT_WIDTH}px;
            max-width: ${MAX_VIEWPORT_WIDTH}px;
            margin: 0 auto;
            overflow: hidden;
            position: relative;
            background-color: ${backgroundColor};
          }
        `}</style>
      </div>
    );
  }
}

export default App;
