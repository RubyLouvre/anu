import React from "../../ReactWX";
class P extends React.Component {
    constructor() {
        super();
        this.state = {
            title: "使用 React 编写小程序",
            pages: [
                {
                    title: '表单组件',
                    url: '/pages/demo/form/index/index'
                },
                {
                    title: '视图组件',
                    url: '/pages/demo/view/index/index'
                },
                {
                    title: '媒体组件',
                    url: '/pages/demo/media/index/index'
                },
                {
                    title: '基础内容',
                    url: '/pages/demo/baseContent/base/index'
                },
                {
                    title: 'API',
                    url: '/pages/demo/api/index'
                },
                {
                    title: '继承',
                    url: '/pages/demo/extend/index'
                },
                {
                    title: "无状态组件",
                    url: "/pages/demo/stateless/index"
                },
                {
                    title: "循环",
                    url: "/pages/demo/loop/index"
                }
            ]
        };
    }
    config = {
        "navigationBarTextStyle": "#fff",
        "navigationBarBackgroundColor": "#0088a4",
        "navigationBarTitleText": "Demo",
        "backgroundColor": "#eeeeee",
        "backgroundTextStyle": "light"
    }
    render() {
        return (
            <div class='container'>
                <div class='page_hd'>{this.state.title}</div>
                <div class='page_bd'>
                    <div class='navigation'>
                        {
                            this.state.pages.map(function(page) {
                                return <navigator open-type="navigate" class='item' hover-class="navigator-hover" url={page.url}>{page.title}</navigator>
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}
export default P;
