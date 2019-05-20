import React, { Component } from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import * as R from 'ramda';
import Loading from './Loading';

@observer
class Header extends Component {
  @computed
  get page() {
    return this.props.page;
  }

  @computed
  get App() {
    return this.props.page.App;
  }

  @computed
  get shouldShowBackButton() {
    // NOTE
    // 如果有 Tab 页面，且当前页面不是 Tab 页中的某一个显示返回按钮
    if (this.App.tabPage.list.length)
      return R.not(this.App.tabPage.components[this.page.url.pathnameWithLeadingSlash]);

    // 如果没有 Tab 页面，而页面堆栈大于 1 时，显示返回按钮
    if (this.App.pages.length > 1) return true;

    // 如果既没有 Tab 页面且当前页面不是小程序的默认首页，显示返回按钮
    // 否则不显示
    return R.not(R.equals(this.page.url.path, this.App.firstRegisteredComponentUrl));
  }

  render() {
    const {
      page: {
        titleBarHeight,
        navigationBarTextStyle,
        navigationBarTitleText,
        navigationBarBackgroundColor,
        loading,
        animation: { duration, timingFunc }
      }
    } = this.props;
    return (
      <header className="__internal__Header">
        {this.shouldShowBackButton ? (
          <div
            className="__internal__Header-back"
            onClick={this.props.page.destroy}
          >
            返回
          </div>
        ) : null}
        <div className="__internal__Header-title">
          {loading && <Loading color={navigationBarTextStyle} />}
          <div className="__internal__Header-title">
            {navigationBarTitleText}
          </div>
        </div>
        <style jsx>
          {`
            .__internal__Header {
              width: 100%;
              height: ${titleBarHeight}px;
              line-height: ${titleBarHeight}px;
              background-color: ${navigationBarBackgroundColor};
              position: fixed;
              top: 0;
              left: 0;
              text-align: center;
              color: ${navigationBarTextStyle};
              transition: color, background-color ${duration}ms ${timingFunc};
            }
            .__internal__Header-title {
              flex-grow: 1;
              padding: 0 48px;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .__internal__Header-title {
              margin-left: 6px;
            }
            .__internal__Header-back {
              width: 48px;
              height: 100%;
              font-size: 14px;
              position: absolute;
              top: 0;
              left: 0;
            }
            .__internal__Header-back:active {
              background-color: rgba(255, 255, 255, 0.15);
            }
          `}
        </style>
      </header>
    );
  }
}

export default Header;
