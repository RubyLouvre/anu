import React from "../../../../ReactWX";
class P extends React.Component {
    constructor(props) {
        const ROOT_PATH = '/pages/demo/form';
        this.state = {
           nv: [
            {
                url: `${ROOT_PATH}/button/index`,
                name: 'button'
            },
            {
                url: `${ROOT_PATH}/checkbox/index`,
                name: 'checkbox'
            },
            {
                url: `${ROOT_PATH}/input/index`,
                name: 'input'
            },
            // {
            //     url: '',
            //     name: 'label'
            // },
            // {
            //     url: '',
            //     name: 'picker'
            // },
            // {
            //     url: '',
            //     name: 'picker-view'
            // },
            // {
            //     url: '',
            //     name: 'radio'
            // },
            // {
            //     url: '',
            //     name: 'slider'
            // },
            // {
            //     url: '',
            //     name: 'switch'
            // },
            // {
            //     url: '',
            //     name: 'textarea'
            // }
           ]
        }
    }
    config = {
        "navigationBarBackgroundColor": "#ffffff",
        "navigationBarTextStyle": "#fff",
        "navigationBarBackgroundColor": "#0088a4",
        "navigationBarTitleText": "button demo",
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
Page(React.createPage(P, "pages/demo/form/index/index"));
export default P;
