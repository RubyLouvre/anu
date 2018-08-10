import React from "../../../../ReactWX";
class P extends React.Component {
    constructor(props) {
        const ROOT_PATH = '/pages/demo/view';
        this.state = {
           nv: [
            {
                url: `${ROOT_PATH}/view/index`,
                name: 'view'
            },
            {
                url: `${ROOT_PATH}/scroll_view/index`,
                name: 'scroll view'
            }
           ]
        }
    }
    config = {
        "navigationBarBackgroundColor": "#ffffff",
        "navigationBarTextStyle": "#fff",
        "navigationBarBackgroundColor": "#0088a4",
        "navigationBarTitleText": "view demo",
        "backgroundColor": "#eeeeee",
        "backgroundTextStyle": "light"
    }
    render() {
        return (
            <div class='container'>
                {   
                    //issues, 渲染class上非state数据
                    this.state.nv.map(function(item){
                        return (
                            <div><navigator open-type="navigate" class='item' hover-class="navigator-hover" url={item.url}>{item.name}</navigator></div>
                        ) 
                    }, true)
                }
            </div>
        );
    }
}
Page(React.createPage(P, "pages/demo/view/index/index"));
export default P;
