import React, { Fragment } from 'react';
import Page from './index';
import Header from './Header';
import ErrorBoundary from './ErrorBoundary';
import * as R from 'ramda';

function dynamicPageLoad(Comp) {
  return class DynamicPageLoader extends React.Component {
    state = {
      containerOffsetTop: 0,
      onPullRefreshRelease: false
    };

    constructor(props) {
      super(props);
      this.Comp = React.createRef();
      this.touchCoordinate = {
        pageY: 0
      };
      this.onScroll = this.onScroll.bind(this);
      this.onTouchStart = this.onTouchStart.bind(this);
      this.onTouchMove = this.onTouchMove.bind(this);
      this.onTouchEnd = this.onTouchEnd.bind(this);
      this.resetContainer = this.resetContainer.bind(this);
    }

    componentDidMount() {
      this.initPageConfig();
    }

    get current() {
      return this.Comp.current;
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
      const { pageY } = DynamicPageLoader.extractCoordinate(e);
      return this.touchCoordinate.pageY - pageY;
    }

    resetContainer() {
      this.setState({
        containerOffsetTop: 0,
        onPullRefreshRelease: true
      });
    }

    static extractCoordinate(event) {
      const {
        nativeEvent: {
          changedTouches: [{ pageY }]
        }
      } = event;
      return { pageY };
    }

    shouldIgnorePullRefresh() {
      const {
        config: { enablePullDownRefresh: enablePullRefreshPage } = {}
      } = this.Comp.current;
      const {
        config: { enablePullDownRefresh: enablePullRefreshApp } = {}
      } = this.props.page.App;
      return R.not(R.or(enablePullRefreshPage, enablePullRefreshApp));
    }

    onTouchStart(e) {
      const { pageY } = DynamicPageLoader.extractCoordinate(e);

      this.touchCoordinate = {
        pageY
      };

      this.setState({
        onPullRefreshRelease: false
      });
    }

    onTouchMove(e) {
      if (this.shouldIgnorePullRefresh()) return;

      const { scrollTop } = this.container.current;
      const deltaY = this.calculateDeltaY(e);

      if (scrollTop > 0 || deltaY > 0) return;

      this.setState({
        containerOffsetTop: Math.min(Page.maxPullRefreshDistance, -deltaY)
      });
    }

    onTouchEnd(e) {
      const deltaY = this.calculateDeltaY(e);
      const { onPullDownRefresh } = this.current;

      if (deltaY > -Page.maxPullRefreshDistance) return;

      onPullDownRefresh && onPullDownRefresh.call(this.Comp);
      this.resetContainer();
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

    render() {
      const {
        page: {
          url: { originalPagePath },
          pathname,
          query,
          titleBarHeight,
          backgroundColor
        },
        isTabPage
      } = this.props;

      return (
        <Fragment>
          <div className="__internal__Page">
            <Header page={this.props.page} />
            <div className="__internal__Page-pull-refresh __internal__Page-release-animation">
              下拉刷新
            </div>
            <div
              className="__internal__Page-container __internal__Page-release-animation"
              ref={this.container}
              onScroll={this.onScroll}
              onTouchStart={this.onTouchStart}
              onTouchMove={this.onTouchMove}
              onTouchEnd={this.onTouchEnd}
              onTouchCancel={this.resetContainer}
            >
              <ErrorBoundary>
                <Comp
                  ref={this.Comp}
                  pathname={pathname}
                  url={originalPagePath}
                  query={query}
                  path={originalPagePath}
                />
              </ErrorBoundary>
            </div>
          </div>
          <style jsx>{`
            .__internal__Page {
              height: calc(100% - ${titleBarHeight}px);
              overflow: hidden;
              position: relative;
            }
            .__internal__Page-container {
              width: 100%;
              height: ${isTabPage ? 'calc(100% - 60px)' : '100%'};
              overflow-x: hidden;
              overflow-y: auto;
              background-color: ${backgroundColor};
              -webkit-overflow-scrolling: touch;
              transform: translateY(${this.state.containerOffsetTop}px);
            }
            .__internal__Page-release-animation {
              ${this.state.onPullRefreshRelease
                ? 'transition: all .3s ease;'
                : ''}
            }
            .__internal__Page-pull-refresh {
              position: absolute;
              width: 100%;
              height: ${Page.maxPullRefreshDistance}px;
              line-height: ${Page.maxPullRefreshDistance}px;
              text-align: center;
              color: #999;
              transform: translateY(
                ${-Page.maxPullRefreshDistance +
                  this.state.containerOffsetTop}px
              );
            }
          `}</style>
        </Fragment>
      );
    }
  };
}

export default dynamicPageLoad;
