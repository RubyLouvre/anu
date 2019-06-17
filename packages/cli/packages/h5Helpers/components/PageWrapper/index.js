import React from '@react';
import TitleBar from '../TitleBar';
import './index.scss';
class PageWrapper extends React.Component{
    constructor(props){
        super(props);
        this.$app = props.app;
        this.state = {
            tabBar: {
                list: []
            },
            titleBar: {
                height: 48
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
        })
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
            })
        });
    
        var tabBar = pageConfig.tabBar || appConfig.tabBar;
        if (tabBar && tabBar.list && tabBar.list.length) {
            tabBar.backgroundColor = tabBar.backgroundColor || "#f9faf5";
            tabBar.color = tabBar.color || "#000";
            tabBar.selectedColor = tabBar.selectedColor || "#48adc4";
            tabBar.list.forEach(function(el, i){
                if (!el.pagePath){
                    console.warn(`tabBar.list[${i}] miss pagePath`, el);//eslint-disable-line
                    return;
                }
                // el.selected = trimPagePath(el.pagePath) === trimPagePath(this.pagePath);
            });
            this.setState({
                tabBar: tabBar
            });
        }   
    }
    render(){
        const Page = React.__pages[this.props.path];
        return (<div className=''>
            <div className='__internal__Page__' >
                {
                    this.state.showTitleBar ? 
                        <TitleBar
                            titleBarHeight={this.state.titleBar.height}
                            navigationBarTextStyle={this.state.titleBar.textColor}
                            navigationBarTitleText={this.state.titleBar.text}
                            navigationBarBackgroundColor={this.state.titleBar.backgroundColor}
                            backButton={false}
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
                    <Page></Page>
                </div>
                { !this.state.tabBar.list.length ? 
                    null:
                    <main class="tabBar" style={{backgroundColor: this.state.tabBar.backgroundColor}}>
                        { this.state.tabBar.list.map(item =>  <div class="tab" onClick={ this.onSelected.bind(this,item)}>
                            <img src={ item.selected ? item.selectedIconPath : item.iconPath } />
                            <span style={{
                                color: item.selected ? item.selectedColor: item.color ,
                                fontSize: "20px"
                            }}>
                                {item.text}
                            </span>
                        </div>)
                        }</main> }

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
        </div>
        );
    }
}

export default PageWrapper;