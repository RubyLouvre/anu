import React from '@react';
import TitleBar from '../TitleBar';
import TabBar from '../TabBar';
class PageWrapper extends React.Component{
    constructor(props){
        super(props);
        this.$app = props.app;
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
            isTabPage: true
        };
    }
    componentWillMount() {
        this.setTitleAndTabs(this.$app);
    }
    componentWillUpdate(){
        this.setTitleAndTabs(this.$app);
    }
    onSelected(item) {
        if (item.selected){
            return false;
        }
        var page = React.api.getCurrentPage();
        if (page.onTabItemTap) {
            page.onTabItemTap(item);
        }
        React.api.navigateTo({
            url: item.pagePath
        });
    }
    setTitleAndTabs(app) {
        
        var path = app.state.path;
        var PageClass = React.__pages[path];
        var appConfig = app.constructor.config || {};
        var pageConfig = PageClass.config || {};
        var mixin = Object.assign({
            navigationBarTitleText: "",
            navigationBarTextStyle: "white",
            navigationBarBackgroundColor: "#000000"
        }, appConfig && appConfig.window, pageConfig);
        this.setState({
            showTitleBar: mixin.navigationStyle !== "custom",
            backgroundColor: mixin.backgroundColor || "#ffffff",
            titleBar: Object.assign({}, this.state.titleBar, {
                text: mixin.navigationBarTitleText,
                textColor: mixin.navigationBarTextStyle,
                backgroundColor: mixin.navigationBarBackgroundColor,
                needBackButton: React.getCurrentPages().length > 1 ? true : false
            })
        });
    
        var tabBar = pageConfig.tabBar || appConfig.tabBar;
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
        const Page = React.__pages[this.props.path];
        return (
            <div className='__internal__Page__' >
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
                <div
                    className="__internal__Page-container __internal__Page-release-animation"
                //   ref={this.container}
                //   onScroll={this.onScroll}
                //   onTouchStart={this.onTouchStart}
                //   onTouchMove={this.onTouchMove}
                //   onTouchEnd={this.onTouchEnd}
                //   onTouchCancel={this.resetContainer}
                >
                    <Page {...this.props}></Page>
                </div>
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
                            height: ${this.state.isTabPage ? 'calc(100% - 60px - 48px)' : 'calc(100% - 48px)'};
                            overflow-x: hidden;
                            overflow-y: auto;
                            background-color: ${this.state.backgroundColor};
                            -webkit-overflow-scrolling: touch;
                            transform: translateY(48px);
                        }
                    `}
                </style>
            </div>
        );
    }
}

export default PageWrapper;