# 转发分享

小程序寄生在大流量的App中，因此转发共享功能非常重要，能实现病毒性传播。

在原生的微信小程序有一个onShareAppMessage方法，它会返回一个对象。
只要定义这个方法，那页面顶部就会自动出一个转发按钮，让用户进行转发。

而快应用是没有这样的API，也没有这样的按钮，一切都需要手动实现。我们可以通过 React.api.showActionSheet创建一个右上角菜单，然后让某一栏为一个转发按钮，当用户点击它时实现这个功能。

与onShow 一样，我们娜娜奇除了提供页面级别的分享钩子，也提供全局级别的分享钩子，分别称为onShare与onGlobalShare。

```javascript
// pages/pagexx/index.js
import React from '@react';
class P extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: 'this is first line\nthis is second line'
        };
    }

    onShare() {
            var navigateToUrl = this.props.path;
            return {
                title: '预订火车票 - 携程',
                imageUrl: 'https://s.aaa.com/bbb/ccc.jpg',
                path: navigateToUrl
            };
    }

    remove() {
        var textAry = this.state.text.split('\n');
        if (!textAry.length) return;
        textAry.pop();
        this.setState({
            text: textAry.join('\n')
        });
    }

    render() {
        return (
            <div class="container">
                <div class="item">
                    <h2 class="item-list-hd">progress</h2>
                    <div class="btn-area">
                        <progress percent="20" show-info />
                        <progress percent="40" show-info stroke-width="12" />
                        <progress percent="60" show-info color="pink" />
                        <progress percent="80" show-info active />
                    </div>
                </div>
            </div>
        );
    }
}

export default P;
```

app.js中需要添加一个onShowMenu方法，专门给快应用生成右上角菜单。

```javascript

class Demo extends React.Component {
    static config = {
        window: {
            backgroundTextStyle: 'light',
            // navigationBarBackgroundColor: '#0088a4',
            navigationBarTitleText: 'mpreact',
            navigationBarTextStyle: '#fff'
        },
        tabBar: {
            'color': '#929292',
            'selectedColor': '#00bcd4',
            'borderStyle': 'black',
            'backgroundColor': '#ffffff',
            'list': [/**/ ]
        }
    };
    globalData = {
        ufo: 'ufo'
    };
    onGlobalShare() {
        if (process.env.ANU_ENV === 'wx') {
                return null; //微信直接使用默认的分享，没有写onShare也有
          }
          // 快应用的分享比较特殊
          if (process.env.ANU_ENV === 'quick') {
                        return {
                            shareType: 0,
                            title: '携程',
                            summary: '携程，总有你要的低价',
                            imagePath: '/assets/image/qlog.png',
                            targetUrl: 'https://miniapp.tujia.com/quickShare?%2Fpages%2Fplatform%2Findex%3Fbd_origin%3Dfrom-quick-share',
                            platforms: ['WEIXIN'],
                            success: function(data) {
                                        console.log('handling success')
                            },
                            fail: function(data, code) {
                                        console.log(`handling fail, code = ${code}`)
                            }
                        };
            }
            const reactInstance = React.getCurrentPage();
            let path = reactInstance && reactInstance.props && reactInstance.props.path;
            let query = reactInstance && reactInstance.props && reactInstance.props.query;
            return {
                        title: '携程',
                        content: '携程，总有你要的低价',
                        path: 'pages/platform/indexWx/index',
                        success: res => {
                            Log({
                                        name: 'share',
                                        channel: res.channelName,
                                        page: path,
                                        query: JSON.stringify(query || {}),
                                        to: 'pages/platform/indexWx/index',
                            });
                        },
            };
    }
    onLaunch() {
        // eslint-disable-next-line
        console.log('App launched');
    },
    //快应用想实现 分享转发， 关于， 保存桌面
    onShowMenu(pageInstance, app){
         if(process.env.ANU_ENV === 'quick'){
            var api = React.api;
            api.showActionSheet({
                itemList: ['转发', '保存到桌面', '关于', '取消'],
                    success: function (ret) {
                        switch (ret.index) {
                            case 0: //分享转发
                                var fn = pageInstance.onShare || app.onGlobalShare;
                                var obj = fn && fn();
                                if (obj){
                                    api.share(obj);
                                }
                                break;
                            case 1:
                                // 保存桌面
                                api.createShortcut();
                                break;
                            case 2:
                                // 关于
                                    api.getSystemInfo({
                                        success: function(appInfo){
                                            api.redirectTo({
                                                url: `pages/about/index?brand=${appInfo.brand}&version=${appInfo.version}`
                                            });
                                        }
                                    });
                                break;
                            case 3:
                                // 取消
                                break;
                        }
                    }
               });
            }
        }
    }
}

// eslint-disable-next-line
export default App(new Demo());
```

## 快应用的分享

1、界面交互 → 分享   import share from '@system.share'    这个分享主要用于不同APP之间的数据传递，因此归到“界面交互”中，可以传递文本数据或文件数据

2、第三方服务 →  第三方分享  import share from '@service.share' 
这个分享主要用于将快应用中的信息通过社交工具（微信、QQ、新浪微博等）分享出去，可以以图文、纯文字、纯图文、音乐、视频等形式进行分享，分享前需要在manifest.json 的 features 中对service.share进行appSign、wxkey、qqkey、sinakey等参数参数的设置，否则分享出去的内容都将以纯文字方式进行展示。

（微信分享时的appSign和wxkey设置可以参照关于[微信分享的实现](https://bbs.quickapp.cn/forum.php?mod=viewthread&tid=481)，亲测可用）
