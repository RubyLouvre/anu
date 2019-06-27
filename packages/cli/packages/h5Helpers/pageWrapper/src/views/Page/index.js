import React from 'react';
import * as R from 'ramda';
import { observer } from 'mobx-react';
import log from '@shared/decorators/log';
import { DEBUG } from '@shared/env';
import AppConfig from '@app';

@observer
class Page extends React.Component {
  static maxPullRefreshDistance = 75;

  state = {
    containerOffsetTop: 0,
    onPullRefreshRelease: false
  };

  constructor(props) {
    super(props);

    this.displayName = `Page(${props.page.url})`;
    this.page = React.createRef();
    this.container = React.createRef();
    this.Comp = React.createRef();
    this.triggerLifeCycle('onLoad', props.page.query);
    this.pageMounted = false;
    this.onReachBottomCallLock = false;
    this.touchCoordinate = {
      pageY: 0
    };

    this.present = this.present.bind(this);
  }

  get current() {
    return this.Comp.current;
  }

  componentDidMount() {
    this.props.page.setNavigationBarTitle({
      title: R.path(['config', 'navigationBarTitleText'])(this.current)
    });
    this.pageMounted = true;
    this.triggerLifeCycle('onShow');
    this.props.page.show();
    this.triggerLifeCycle('onReady');
    this.props.page.hidden.observe(this.present);
    this.props.page.setPageReference(this.current);
    this.initPageConfig();
  }

  guardCallLifeCycle(name, ...args) {
    AppConfig[name] && AppConfig[name].call(this, ...args);
  }

  initPageConfig() {
    // SPECIAL CASE
    // 当用户页面渲染出错触发 ErrorBoundary 时
    // this.Comp.current 是 null 而非 DOM 节点
    if (this.current == null) return;
    // NOTE
    // 用户可能不提供 config 也可能提供 null
    // 此处使用 == 而非 ===
    if (this.current.config == null) return;

    Object.keys(this.current.config).forEach(
      key => (this.props.page[key] = this.current.config[key])
    );
  }

  present(change) {
    this.pageMounted &&
      this.triggerLifeCycle(change.newValue ? 'onHide' : 'onShow');
  }

  componentWillUnmount() {
    this.triggerLifeCycle('onUnload');
  }

  triggerLifeCycle(name, ...args) {
    const instance = R.path(['Comp', 'current'], this);

    instance && instance[name] && instance[name].call(instance, ...args);
  }

  @log(DEBUG)
  onLoad(...args) {
    this.guardCallLifeCycle('onLoad');
    const fn = R.path(['current', 'onLoad'], this);
    fn && fn.apply(this.current, args);
  }

  @log(DEBUG)
  onReady() {
    this.guardCallLifeCycle('onReady');
    const fn = R.path(['current', 'onReady'], this);
    fn && fn.apply(this.current);
  }

  @log(DEBUG)
  onShow() {
    this.guardCallLifeCycle('onShow');
    const fn = R.path(['current', 'onShow'], this);
    fn && fn.apply(this.current);
  }

  @log(DEBUG)
  onHide() {
    this.guardCallLifeCycle('onHide');
    const fn = R.path(['current', 'onHide'], this);
    fn && fn.apply(this.current);
  }

  @log(DEBUG)
  onUnload() {
    this.guardCallLifeCycle('onUnload');
    const fn = R.path(['current', 'onUnload'], this);
    fn && fn.apply(this.current);
  }

  onScroll(e) {
    const { scrollHeight, scrollTop, clientHeight } = e.target;
    const {
      onReachBottom,
      onPageScroll,
      config: { onReachBottomDistance } = {}
    } = this.current;

    onPageScroll && onPageScroll.call(this, { scrollTop });

    if (scrollHeight - clientHeight - scrollTop < onReachBottomDistance) {
      if (!this.onReachBottomCallLock) {
        onReachBottom && onReachBottom.call(this.current);
        return (this.onReachBottomCallLock = true);
      }
    }
    this.onReachBottomCallLock = false;
  }

  calculateDeltaY(e) {
    const { pageY } = Page.extractCoordinate(e);
    return this.touchCoordinate.pageY - pageY;
  }

  resetContainer() {
    this.setState({
      containerOffsetTop: 0,
      onPullRefreshRelease: true
    });
  }

  render() {
    const {
      page: { Comp, translateX, animationDuration }
    } = this.props;

    return (
      <div className="__internal__Page-wrapper" ref={this.page}>
        <Comp {...this.props} />
        <style jsx>
          {`
            .__internal__Page-wrapper {
              width: 100%;
              height: 100%;
              transform: translateX(${translateX});
              overflow: hidden;
              transition: all ${animationDuration}ms ease;
              position: absolute;
              padding-top: 48px;
              background-color: #fff;
            }
          `}
        </style>
      </div>
    );
  }
}

export default Page;
