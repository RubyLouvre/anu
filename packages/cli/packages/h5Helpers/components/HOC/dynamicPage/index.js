import React from '@react';
import ErrorBoundary from '../../ErrorBoundary';
import PullDownLoading from '../../PullDownLoading';
import TitleBar from '../../TitleBar';
import TabBar from '../../TabBar';
import { deepMerge } from '../../../share/index';

export default function dynamicPage(Comp) {
    return class DynamicPage extends React.Component {
        constructor(props) {
            super(props);
            this.$app = props.app;
            this.Ref = React.createRef();
            this.state = {
                containerOffsetTop: 0,
                onPullRefreshRelease: true,
                showTitleBar: true,
                titleBar: {
                    height: 48,
                    needBackButton: false
                },
                tabBar: {
                    list: [],
                    borderStyle: 'black'
                },
                backgroundColor: '#ffffff',
                isTabPage: false,
                hide: false
            };
            this.resetContainer.bind(this);
            this.shouldPullDown.bind(this);
            this.touchCoordinate = {
                pageY: 0
            };
            this.triggerLifeCycle('onLoad');
            this.pageConfig = Comp.config;
            this.appConfig = this.$app.constructor.config;
        }
        static maxPullRefreshDistance = 75;
        static maxPullRefreshTime = 3000;
        static defaultOnReachBottomThreshold = 0;
        static extractCoordinate(event) {
            const {
                nativeEvent: {
                    changedTouches: [{ pageY }]
                }
            } = event;
            return { pageY };
        }
        shouldPullDown() {
            if (
                (this.pageConfig &&
                    this.pageConfig.enablePullDownRefresh) ||
                (this.appConfig &&
                    this.appConfig.window &&
                    this.appConfig.window.enablePullDownRefresh)
            ) {
                return true;
            }
            return false;
        }
        componentWillUnmount() {
            this.triggerLifeCycle('onUnload');
        }
        componentDidMount() {
            this.triggerLifeCycle('onShow');
            this.triggerLifeCycle('onReady');
        }
        componentWillReceiveProps(nextProps) {
            if (nextProps.stopPullDownRefresh) {
                this.resetContainer();
            }
            if (nextProps.show !== this.props.show) {
                this.triggerLifeCycle(nextProps.show ? 'onShow' : 'onHide');
            }
            if (nextProps.config !== this.props.config) {
                const mixinConfig = {};
                if (nextProps.config !== this.props.config) {
                    deepMerge(
                        mixinConfig,
                        this.appConfig,
                        this.pageConfig,
                        nextProps.config
                    );
                }
                this.setTitleAndTabs(mixinConfig, this.$app.state.path);
            }
        }
        resetContainer() {
            this.setState({
                containerOffsetTop: 0,
                onPullRefreshRelease: true
            });
        }
        onScroll(e) {
            const { scrollHeight, scrollTop, clientHeight } = e.target;
            const {
                onReachBottom,
                onPageScroll,
                config: {
                    onReachBottomDistance = DynamicPage.defaultOnReachBottomThreshold
                } = {}
            } = this.Ref.current;

            onPageScroll && onPageScroll.call(this, { scrollTop });
            if (
                scrollHeight - clientHeight - scrollTop <=
                onReachBottomDistance
            ) {
                if (!this.onReachBottomCallLock) {
                    onReachBottom && onReachBottom.call(this.Ref.current);
                    return (this.onReachBottomCallLock = true);
                }
            }
            this.onReachBottomCallLock = false;
        }
        onTouchStart(e) {
            if (!this.shouldPullDown()) {
                return;
            }
            const { pageY } = DynamicPage.extractCoordinate(e);

            this.touchCoordinate = {
                pageY
            };
            this.setState({
                onPullRefreshRelease: false
            });
        }
        onTouchMove(e) {
            if (!this.shouldPullDown()) {
                return;
            }
            const { scrollTop } = this.Ref;
            const deltaY = this.calculateDeltaY(e);

            if (scrollTop > 0 || deltaY > 0) return;

            this.setState({
                containerOffsetTop: Math.min(
                    DynamicPage.maxPullRefreshDistance,
                    -deltaY
                )
            });
        }
        onTouchEnd(e) {
            if (!this.shouldPullDown()) {
                return;
            }
            const deltaY = this.calculateDeltaY(e);
            if (deltaY > -DynamicPage.maxPullRefreshDistance) {
                this.resetContainer();
                return;
            }
            this.triggerLifeCycle('onPullDownRefresh', this.Ref);
            setTimeout(
                this.resetContainer.bind(this),
                DynamicPage.maxPullRefreshTime
            );
        }
        calculateDeltaY(e) {
            const { pageY } = DynamicPage.extractCoordinate(e);
            return this.touchCoordinate.pageY - pageY;
        }
        triggerLifeCycle(name, ...args) {
            const instance = this.Ref.current;
            const appInstance = this.$app;
            const globalName = name.replace(/^on/, '$&Global');
            appInstance &&
                appInstance[globalName] &&
                appInstance[globalName].call(appInstance, ...args);

            instance &&
                instance[name] &&
                instance[name].call(instance, ...args);
        }
        componentWillMount() {
            setTimeout(() => {
                this.setState({
                    hide: true
                });
            }, 500);
            this.setTitleAndTabs(
                deepMerge(
                    {},
                    this.appConfig,
                    this.pageConfig,
                    this.props.config
                ),
                this.props.path
            );
        }
        setTitleAndTabs(config, path) {
            var mixin = deepMerge(
                {
                    navigationBarTitleText: '',
                    navigationBarTextStyle: 'white',
                    navigationBarBackgroundColor: '#000000'
                },
                config
            );
            this.setState({
                showTitleBar:
                    mixin.navigationStyle !== 'custom' &&
                    (mixin.navigationBarTitleText !== ''),
                backgroundColor: mixin.backgroundColor || '#ffffff',
                titleBar: deepMerge({}, this.state.titleBar, {
                    text: mixin.navigationBarTitleText,
                    textColor: mixin.navigationBarTextStyle,
                    backgroundColor: mixin.navigationBarBackgroundColor,
                    needBackButton:
                        React.getCurrentPages().length > 1 ? true : false
                }),
                pagePath: this.pagePath
            });
            var tabBar = config.tabBar;
            if (tabBar && tabBar.list && tabBar.list.length) {
                var isTabPage = false;
                tabBar.backgroundColor =
                    tabBar.backgroundColor || '#f9faf5';
                tabBar.color = tabBar.color || '#000';
                tabBar.selectedColor = tabBar.selectedColor || '#48adc4';
                tabBar.list.forEach((el, i) => {
                    if (!el.pagePath) {
                        console.warn(`tabBar.list[${i}] miss pagePath`, el); //eslint-disable-line
                        return;
                    }
                    if (el.pagePath === path.replace(/^\//, '')) {
                        el.selected = true;
                        isTabPage = true;
                    } else {
                        el.selected = false;
                    }
                });
                this.setState({
                    tabBar: tabBar,
                    isTabPage
                });
            }
        }
        get titleAndTabHeight() {
            let height = 0;
            if (this.state.isTabPage) {
                height += 60;
            }
            if (this.state.showTitleBar) {
                height += 48;
            }
            return height;
        }
        handleTabChange(item) {
            this.triggerLifeCycle('onTabItemTap', item);
        }
        render() {
            return (
                <div className='__internal_DynamicPage'>
                    {this.state.showTitleBar ? (
                        <TitleBar
                            titleBarHeight={this.state.titleBar.height}
                            navigationBarTextStyle={
                                this.state.titleBar.textColor
                            }
                            navigationBarTitleText={
                                this.state.titleBar.text
                            }
                            navigationBarBackgroundColor={
                                this.state.titleBar.backgroundColor
                            }
                            backButton={this.props.needBackButton}
                            // animation: { duration, timingFunc }
                        />
                    ) : null}
                    <div className="__internal__Page-pull-refresh __internal__Page-release-animation">
                        <PullDownLoading />
                    </div>
                    <div
                        className="__internal__DynamicPage-container"
                        onScroll={this.onScroll.bind(this)}
                        onTouchStart={this.onTouchStart.bind(this)}
                        onTouchMove={this.onTouchMove.bind(this)}
                        onTouchEnd={this.onTouchEnd.bind(this)}
                        onTouchCancel={this.resetContainer.bind(this)}
                    >
                        <ErrorBoundary>
                            <Comp ref={this.Ref} {...this.props} />
                        </ErrorBoundary>
                    </div>
                    {this.state.isTabPage ? (
                        <TabBar
                            list={this.state.tabBar.list}
                            backgroundColor={
                                this.state.tabBar.backgroundColor
                            }
                            borderStyle={this.state.tabBar.borderStyle}
                            onChange={this.handleTabChange.bind(this)}
                        />
                    ) : null}
                    <style
                        ref={node => {
                            Object(node).textContent = `
                    .__internal_DynamicPage {
                        background-color: ${this.state.backgroundColor};
                        z-index: -100;
                        width: 100%;
                        height: 100%;
                    }
                    .__internal__DynamicPage-container {
                        height: ${
                this.titleAndTabHeight
                    ? `calc(100% - ${this.titleAndTabHeight}px)`
                    : '100%'
                };
                        overflow-x: hidden;
                        overflow-y: auto;
                        padding-top: ${
                this.state.showTitleBar
                    ? 48 + this.state.containerOffsetTop
                    : this.state.containerOffsetTop
                }px;
                        ${
                this.state.onPullRefreshRelease
                    ? 'transition: all .3s ease;'
                    : ''
                }
                        background-color: ${this.state.backgroundColor};
                    }
                    .__internal__Page-pull-refresh {
                        position: absolute;
                        background-color: ${this.state.backgroundColor};
                        ${
                this.state.onPullRefreshRelease
                    ? 'visibility: hidden;'
                    : 'visibility: visible;'
                }
                        width: 100%;
                        top: ${
                -DynamicPage.maxPullRefreshDistance +
                            this.state.showTitleBar
                    ? 48
                    : 0 + this.state.containerOffsetTop
                }px;
                        height: ${DynamicPage.maxPullRefreshDistance}px;
                        line-height: ${
                DynamicPage.maxPullRefreshDistance
                }px;
                        z-index: 0;
                        text-align: center;
                        color: #999;
                    }
                    `;
                        }}
                    />
                </div>
            );
        }
    };
}
