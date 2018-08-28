import React from '@react';
import Dialog from '@components/Dialog/index';
class P extends React.Component {
    constructor() {
        super();
        this.state = {
            title: '使用 React 编写小程序',
            pages: [
                {
                    title: '基础内容',
                    url: '/pages/demo/baseContent/base/index'
                },
                {
                    title: '内置组件',
                    url: '/pages/demo/native/index/index'
                },
                {
                    title: '语法',
                    url: '/pages/demo/syntax/index'
                }
            ]
        };
    }
    config = {
        navigationBarTextStyle: '#fff',
        navigationBarBackgroundColor: '#0088a4',
        navigationBarTitleText: 'Demo',
        backgroundColor: '#eeeeee',
        backgroundTextStyle: 'light'
    };
    render() {
        return (
            <div class="container">
                <div class="page_hd">{this.state.title}</div>
                <div class="page_bd">
                    <div class="navigation">
                        {this.state.pages.map(function(page) {
                            return (
                                <navigator
                                    open-type="navigate"
                                    class="item"
                                    hover-class="navigator-hover"
                                    url={page.url}
                                >
                                    {page.title}
                                </navigator>
                            );
                        })}
                    </div>
                </div>
                <Dialog><p class="dialog">这是出现在弹窗组件的内部{this.state.title}</p>
                </Dialog>
            </div>
        );
    }
}
export default P;
