import React from '@react';
import './index.scss';
import Navigator from '@components/Navigator/index';
class Express extends React.Component {
    constructor() {
        super();
        this.state = {
            title: '语法相关',
            pages: [
                {
                    title: '继承',
                    url: '/pages/syntax/extend/index'
                },
                {
                    title: '无状态组件',
                    url: '/pages/syntax/stateless/index'
                },
                {
                    title: 'React Hooks',
                    url: '/pages/syntax/hooks/index'
                },
                {
                    title: '条件语句',
                    url: '/pages/syntax/if/index'
                },
                {
                    title: '条件语句遇到组件',
                    url: '/pages/syntax/ifcom/index'
                },
                {
                    title: '一重循环',
                    url: '/pages/syntax/loop/index'
                },
                {
                    title: '二重循环',
                    url: '/pages/syntax/loop2/index'
                },
                {
                    title: '三重循环',
                    url: '/pages/syntax/loop3/index'
                },
                {
                    title: '循环里面交替使用两种不同组件（对话形式）',
                    url: '/pages/syntax/loop4/index'
                },
                {
                    title: '行内样式',
                    url: '/pages/syntax/inlineStyle/index'
                },
                {
                    title: '组件套嵌内容',
                    url: '/pages/syntax/children/index'
                },
                {
                    title: 'async/await',
                    url: '/pages/syntax/await/index'
                },
                {
                    title: '组件嵌套组件',
                    url: '/pages/syntax/multiple/index'
                },
                {
                    title: '一个页面多个相同组件',
                    url: '/pages/syntax/loop5/index'
                },
                {
                    title: 'webview',
                    url: '/pages/syntax/webview/index'
                }
            ]
        };
    }
    config = {
        'navigationBarTextStyle': 'white',
        'navigationBarBackgroundColor': '#0088a4',
        'navigationBarTitleText': 'Demo',
        'backgroundColor': '#ffffff',
        'backgroundTextStyle': 'light'
    }
    componentWillMount() {
        // eslint-disable-next-line
        console.log('syntax componentWillMount');
    }
    componentDidMount() {
        // eslint-disable-next-line
        console.log('syntax componentDidMount');
    }
    gotoSome(url) {
        React.api.navigateTo({ url });
    }
    render() {
        return (
            <div class='anu-block'>
                <div class='anu-page-header'>{this.state.title}</div>

                {
                    this.state.pages.map(function (page) {
                        return (<div class='anu-item' key={page.title}>
                            <Navigator open-type="navigate" hover-class="navigator-hover" url={page.url}>{page.title}</Navigator>
                        </div>);
                    })
                }

            </div>
        );
    }
}
export default Express;
