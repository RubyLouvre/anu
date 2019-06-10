import React from '@react';
import './index.scss';
class PageWrapper extends React.Component{
    constructor(props){
        super(props);
        this.$app = props.app;
        this.state = {
            tabBar: {
                list: []
            },
            titleBar: { },
            showTitleBar: true,
            pagePath: "",
            backgroundColor: "#ffffff"
        }
    }
    componentWillMount() {
        this.setTitleAndTabs(this.$app);
    }
    componentWillUpdate(){
        this.setTitleAndTabs(this.$app);
    }
    onSelected(item) {
        if(item.selected){
            return false;
        }
        var page = React.api.getCurrentPage();
        if (page.onTabItemTap) {
            page.onTabItemTap(item)
        }
        React.api.navigateTo({
            url: item.pagePath
        })
    }
    setTitleAndTabs(app) {
        var path = app.state.path;
        var PageClass = React.__pages[path];
        var appConfig =  app.constructor.config || {}
        var pageConfig = PageClass.config || {}
        var mixin = Object.assign({
            navigationBarTitleText: "",
            navigationBarTextStyle: "white",
            navigationBarBackgroundColor: "#000000"
        }, appConfig && appConfig.window, pageConfig && pageConfig.window);
        this.setState({
            showTitleBar: mixin.navigationStyle !== "custom",
            backgroundColor: mixin.backgroundColor || "#ffffff",
            titleBar: {
                text: mixin.navigationBarTitleText,
                textColor: mixin.navigationBarTextStyle,
                backgroundColor: mixin.navigationBarBackgroundColor,
            }
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
        return (<div style={{
            width:"100%",
            paddingBottom: this.state.tabBar.list.length? '110px': '0px',
            backgroundColor: this.state.backgroundColor}}>
            {
                this.state.showTitleBar ? 
                    <header className="__internal__Header-title" style={{display: this.state.showTitleBar ? 'block': 'none'}}>
                        <div class="title" style={{ 
                            color: this.state.titleBar.textColor,
                            backgroundColor: this.state.titleBar.backgroundColor
                        }} >
                            {this.state.titleBar.text}
                        </div>
                        <div class="menu"></div>
                    </header> : null
            }
            <Page></Page>
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
        </div>);
    }
}

export default PageWrapper;