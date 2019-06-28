import React from '@react';
import TitleBar from '../TitleBar';
import TabBar from '../TabBar';

import pageConfigMap from '@pageConfig';

import { deepMerge } from '../../share/index';

class PageWrapper extends React.Component{
    constructor(props){
        super(props);
        this.Comp = React.createRef();
        this.$app = props.app;
        this.initAppConfig();
        this.state = {
            tabBar: {
                list: [],
                borderStyle: 'black'
            },
            titleBar: {
                height: 48,
                needBackButton: false
            },
            showTitleBar: true,
            pagePath: "",
            backgroundColor: "#ffffff",
            isTabPage: false,
            hide: false
        };
    }
    initAppConfig() {
        this.appConfig = this.props.app.constructor.config || {};
        // 将window字段扁平化
        Object.assign(this.appConfig, this.appConfig.window);
        delete this.appConfig.window;
    }
    get pagePath() {
        return this.$app.state.path;
    }
    componentWillMount() {
        setTimeout(() => {
            this.setState({
                hide: true
            });
        }, 500);
        const pageConfig = pageConfigMap[this.pagePath];
        this.setTitleAndTabs(deepMerge({}, this.appConfig, pageConfig, this.props.config), this.pagePath);
    }
    componentWillUpdate(nextProps){
        const mixinConfig = {};
        if (nextProps.path !== this.props.path || nextProps.config !== this.props.config) {
            const pageConfig = pageConfigMap[this.pagePath];
            if (nextProps.path !== this.props.path) {
                deepMerge(mixinConfig, this.appConfig, pageConfig);
            }
            if (nextProps.config !== this.props.config) {
                deepMerge(mixinConfig, this.appConfig, pageConfig, nextProps.config);
            }
            this.setTitleAndTabs(mixinConfig, this.$app.state.path);
        }
    }
    setTitleAndTabs(config, path) {
        var mixin = deepMerge({
            navigationBarTitleText: "",
            navigationBarTextStyle: "white",
            navigationBarBackgroundColor: "#000000"
        }, config);
        this.setState({
            showTitleBar: mixin.navigationStyle !== "custom" && mixin.navigationBarTitleText !== "",
            backgroundColor: mixin.backgroundColor || "#ffffff",
            titleBar: deepMerge({}, this.state.titleBar, {
                text: mixin.navigationBarTitleText,
                textColor: mixin.navigationBarTextStyle,
                backgroundColor: mixin.navigationBarBackgroundColor,
                needBackButton: React.getCurrentPages().length > 1 ? true : false
            }),
            pagePath: this.pagePath
        });
        var tabBar = config.tabBar;
        if (tabBar && tabBar.list && tabBar.list.length) {
            var isTabPage = false;
            tabBar.backgroundColor = tabBar.backgroundColor || "#f9faf5";
            tabBar.color = tabBar.color || "#000";
            tabBar.selectedColor = tabBar.selectedColor || "#48adc4";
            tabBar.list.forEach((el, i) => {
                if (!el.pagePath){
                    console.warn(`tabBar.list[${i}] miss pagePath`, el);//eslint-disable-line
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
    render(){
        const instances = React.getCurrentPages();
        return (
            <div className={`__internal__Page__`} >
                {
                    this.state.showTitleBar ? 
                        <TitleBar
                            titleBarHeight={this.state.titleBar.height}
                            navigationBarTextStyle={this.state.titleBar.textColor}
                            navigationBarTitleText={this.state.titleBar.text}
                            navigationBarBackgroundColor={this.state.titleBar.backgroundColor}
                            backButton={this.state.titleBar.needBackButton}
                            // animation: { duration, timingFunc }
                        ></TitleBar> : null
                }
                {/* <div
                    className="__internal__Page-container __internal__Page-release-animation" */}
                {/* //   onScroll={this.onScroll}
                //   onTouchStart={this.onTouchStart}
                //   onTouchMove={this.onTouchMove}
                //   onTouchEnd={this.onTouchEnd}
                //   onTouchCancel={this.resetContainer}
                > */}
                {instances.map((page, index) => {
                    let className = '__hidden';
                    if (index === instances.length - 1) {
                        className = `__internal__Page-container ${this.props.showBackAnimation ? '__backAnimation' : ''}`;
                    } else if (index === instances.length - 2) {
                        className = "__bottom";
                    }
                    return <div className={className}>
                        {page}
                    </div>;
                })}
                { 
                    this.state.isTabPage ? 
                        <TabBar
                            list={this.state.tabBar.list}
                            backgroundColor={this.state.tabBar.backgroundColor}
                            borderStyle={this.state.tabBar.borderStyle}
                        /> :
                        null
                }
                <style jsx>{`
                        .__internal__Page__ {
                            width: 100%;
                            height: 100%;
                            min-width: 320px;
                            max-width: 480px;
                            margin: 0 auto;
                            overflow: hidden;
                            position: relative;
                        }
                        .__internal__Page-container {
                            width: 100%;
                            height: ${this.state.isTabPage ? `calc(100% - 60px - ${this.state.showTitleBar ? '48px': '0px'})` : `calc(100% - ${this.state.showTitleBar ? '48px': '0px'})`};
                            overflow-x: hidden;
                            overflow-y: auto;
                            background-color: ${this.state.backgroundColor};
                            -webkit-overflow-scrolling: touch;
                            transform: translateY(${this.state.showTitleBar ? '48px': 0});
                        }
                        .__hidden {
                            display: none;
                        }
                        .__bottom {
                            position: fixed;
                            width: 100%;
                            transform: translateY(${this.state.showTitleBar ? '48px': 0});
                        }
                        .__backAnimation {
                            transform: translate(375px, ${this.state.showTitleBar ? '48px': 0});
                            transition: transform 500ms ease;
                        }
                    `}
                </style>
            </div>
        );
    }
}

export default PageWrapper;