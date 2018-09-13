import React from '@react';
class Express extends React.Component {
    constructor() {
        super();
        this.state = {
            title: '语法相关',
            pages: [
                /*
                {
                    title: 'API',
                    url: '/pages/demo/syntax/api/index'
                },
                {
                    title: '继承',
                    url: '/pages/demo/syntax/extend/index'
                },
                {
                    title: '无状态组件',
                    url: '/pages/demo/syntax/stateless/index'
                },
                {
                    title: '条件语句',
                    url: '/pages/demo/syntax/if/index'
                },
                {
                    title: '一重循环',
                    url: '/pages/demo/syntax/loop/index'
                },
                */
                {
                    title: '二重循环',
                    url: '/pages/demo/syntax/loop2/index'
                },
                /*
                {
                    title: '三重循环',
                    url: '/pages/demo/syntax/loop3/index'
                },
               
                {
                    title: '循环里面交替使用两种不同组件（对话形式）',
                    url: '/pages/demo/syntax/loop4/index'
                },
               
                {
                    title: '行内样式',
                    url: '/pages/demo/syntax/inlineStyle/index'
                },
                {
                    title: '组件套嵌内容',
                    url: '/pages/demo/syntax/children/index'
                },
                {
                    title: 'async/await',
                    url: '/pages/demo/syntax/await/index'
                },
                {
                    title: '组件嵌套组件',
                    url: '/pages/demo/syntax/multiple/index'
                }
                */
            ]
        };
    }
    config = {
        'navigationBarTextStyle': '#fff',
        'navigationBarBackgroundColor': '#0088a4',
        'navigationBarTitleText': 'Demo',
        'backgroundColor': '#eeeeee',
        'backgroundTextStyle': 'light'
    }
    componentWillMount(){
        // eslint-disable-next-line
        console.log('syntax componentWillMount');
    }
    componentDidMount(){
        // eslint-disable-next-line
        console.log('syntax componentDidMount');
    }
    render() {
        return (
            <div class='container'>
                <div class='page_hd'>{this.state.title}</div>
                <div class='page_bd'>
                    <div class='navigation'>
                        {
                            this.state.pages.map(function(page) {
                                return <navigator open-type="navigate" class='item' hover-class="navigator-hover" url={page.url}>{page.title}</navigator>;
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}
export default Express;
