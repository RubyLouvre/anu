import React from "../../../../ReactWX";
class P extends React.Component {
    constructor() {
        super();
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
            {
                url: `${ROOT_PATH}/slider/index`,
                name: 'slider'
            },
            {
                url: `${ROOT_PATH}/picker/index`,
                name: 'picker'
            },
            {
                url: `${ROOT_PATH}/radio/index`,
                name: 'radio'
            },
            {
                url: `${ROOT_PATH}/textarea/index`,
                name: 'textarea'
            },
            {
                url: `${ROOT_PATH}/label/index`,
                name: 'label'
            }
            
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
                <ul class='item-list'>
                    {   
                        //issues, 渲染class上非state数据
                        this.state.nv.map(function(item){
                            return (
                                <li class='item'><navigator open-type="navigate" hover-class="navigator-hover" url={item.url}>{item.name}</navigator></li>
                            ) 
                        }, true)
                    }
                </ul>
            </div>
        );
    }
}

export default P;
