/*
  .tabBar {
    border-style: solid;
    border-color: #ddd;
    border-top-width: 1px;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 110px;
  }

  .tabBar .tab {
    flex: 1;
    margin: 10px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .tabBar .tab image {
    width: 45px;
    height: 45px;
  }

  .tabBar .tab a {
    margin: 10px;
    border: 1px solid #eeeeee;
  }
*/
  import React from '../../ReactH5.js';
  class PageWrapper extends React.Component{
      constructor(props){
          super(props);
          this.$app = props.app;
         
          this.state = {
           // isPageComponent: true
            tabBar: {
                list: []
            },
            titleBar: { },
            showTitleBar: true,
            pagePath: "",
            backgroundColor: "#ffffff"
          }
          setTitleAndTabs(this, this.$app);
      }
      componentWillUpdate(){
         setTitleAndTabs(this, this.$app);
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
      render(){
          return (<div style={{
            width:"100%",
            paddingBottom: this.state.tabBar.list.length? '110px': '0px',
            backgroundColor: this.state.backgroundColor}}>
            <header style={{display: this.state.showTitleBar ? 'block': 'none'}}>
                <div class="title" style={{ 
                    color: this.state.titleBar.textColor,
                    backgroundColor: this.state.titleBar.backgroundColor
                    }} >
                  {this.state.titleBar.text}
                </div>
                <div class="menu"></div>
            </header>
          <this.state.is query={this.state.query} query={this.state.Path} isPageComponent={ true } />
          { !this.state.tabBar.list.length ? 
            null:
            <main class="tabBar" style={{backgroundColor: this.state.tabBar.backgroundColor}}>
            { this.state.tabBar.list.map(
                function(item ){
                  return  <div class="tab" onClick={ this.onSelected.bind(this,item)}>
                    <img src={ item.selected ? item.selectedIconPath : item.iconPath } />
                    <span style={{
                           color: item.selected ? tabBar.selectedColor: tabBar.color ,
                           fontSize: "20px"
                         }}>
                      {item.text}
                    </span>
                    </div>
            })
        }</main> }
        </div>)
      }
  }

  function setTitleAndTabs(instance, app) {
      var path = app.state.path;
      var PageClass = React.api.__pages[path];
      var appConfig =  app.constructor.config || {}
      var pageConfig = PageClass.config || {}
      var mixin = Object.assign({
        navigationBarTitleText: "",
        navigationBarTextStyle: "white",
        navigationBarBackgroundColor: "#000000"
      }, appConfig.window, pageConfig);

      instance.setState({
          showTitleBar: mixin.navigationStyle !== "custom",
          backgroundColor: mixin.backgroundColor || "#ffffff",
          titleBar: {
            text: mixin.navigationBarTitleText,
            textColor: mixin.navigationBarTextStyle,
            backgroundColor: mixin.navigationBarBackgroundColor,
          }
      })

      var tabBar = pageConfig.tabBar || appConfig.tabBar;
      if (tabBar && tabBar.list && tabBar.list.length) {
          tabBar.backgroundColor = tabBar.backgroundColor || "#f9faf5";
          tabBar.color = tabBar.color || "#000";
          tabBar.selectedColor = tabBar.selectedColor || "#48adc4";
          tabBar.list.forEach(function(el, i){
            if(!el.pagePath){
               console.warn(`tabBar.list[${i}] miss pagePath`, el);//eslint-disable-line
               return
            }
            el.selected = trimPagePath(el.pagePath) === trimPagePath(instance.pagePath);
          })
          instance.setState({
            tabBar: tabBar
          })
      }   
  }
  export default PageWrapper