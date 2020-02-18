# 全局对象

在小程序中，一个应用由多个页面组成，一个页面由多个组件组成。

app.js就是用来定义全局配置对象， 全局数据对象，全局回调，全局样式及import所有页面。

app.js外表上看来是一个React组件

*  全局配置对象 config 配置标题栏与tab栏
*  全局数据对象 globalData
*  全局回调
   -  onGlobalLoad 每个页面在初次加载时就会执行此回调，注意不存在页面级别的onLoad方法
   -  onGlobalReady 每个页面在初次渲染后（布局完成）就会执行此回调，注意不存在页面级别的onReady方法
   -  onGlobalUnload 每个页面在被销毁时就会调用此方法，注意不存在页面级别的onUnload方法, 其次路由切换导致当前页面隐藏时，页面不一定销毁，只有此页面被踢出页面栈时才会销毁。页面栈一共保存10个页面. 想用页面级别的onUnload方法，可以用componentWillUnmount代替。
   -  onGlobalShow 每个页面在显示时就会调用此方法，页面有onShow方法时，也会同时执行此方法
   -  onGlobalHide 每个页面在隐藏时就会调用此方法，页面有onHide方法时，也会同时执行此方法
   -  onGlobalShare  只有页面组件**没有**定义onShare/onShareAppMessage方法，才会调用此方法，此方法要求返回对象
   -  onCollectLogs 所有click/tap/change/input/blur等核心的与用户行为相关的事件触发时，都会调用这个回调
   -  onSendLogs  onCollectLogs理应凑够一定数量的日志就会调用此方法，用于上传日


*  全局样式 自己手动`import 'app.scss'`或`import 'app.less'`
*  import 所有以 `./pages/` 开头的依赖放到 `app.json` 中 `pages` 配置项中。
*  默认我们会把 第一个`./pages`开头的依赖当作**首页**。

此外，app.js还支持原生的onLaunch, onError, `onShow`, onHide。

其中onShow, onHide不等同于onGlobalShow, onGlobalHide, 前两者是小程序从前台进入后台或从后台进入前台触发的， 后两者是页面级别的监听方法。由于快应用不支持应用级别的onShow方法，因此不要使用。

在快应用下，它没有onLaunch, onHide, 娜娜奇会在自动转译成 onCreate、onDestroy方法。

```jsx
import React from '@react';
import './pages/index/index'; //引入所有页面。
import './pages/demo/base/index';
import './pages/demo/native/index/index';
import './app.less';

class Global extends React.Component {
    //全局配置
    static config = {
        window: {
            backgroundTextStyle: 'light',
            navigationBarBackgroundColor: '#0088a4',
            navigationBarTitleText: 'mpreact',
            navigationBarTextStyle: '#fff'
        }
        needRedirectPages: {
            "pages/bargain/helper/helper":  "pages/ticket/bargain/helper/index",
            "pages/bargain/ticket/index":  "pages/ticket/bargain/list/index",
            "pages/bargain/award/index":  "pages/ticket/bargain/award/index"
        },
        tabBar: {
            backgroundColor: '#0077c7',
            list: [{
              pagePath: "pages/platform/index/index",
              text: "首页"
            }, {
              pagePath: "pages/service/index/index",
              text: "客服"
            }]
        }
    };
    // 全局数据
    globalData = {
        ufo: 'nanachi',//only test
        __storage: {}  //快应用的storage在这里保存一份副本,
    };
    onGlobalReady(){}  //全局的页面钩子
    onGlobalUnload(){} //全局的页面钩子
    onGlobalShow(){}   //全局的页面钩子
    onGlobalHide(){}   //全局的页面钩子
    onGlobalLoad(){    //全局的页面钩子
        //快应用需要在每个页面打开的瞬间初始化同步storage API
        //即getStorageSync, setStorageSync, removeStorageSync, clearStorageSync
        if ( process.env.ANU_ENV === 'quick' ) {
           React.api.initStorageSync &&
           React.api.initStorageSync(this.globalData.__storage)
        }
    }
    onGlobalShare(){   //全局的小程序分享钩子， 如果页面没有定义onShare, 或onShare没有返回对象，就会触发它
        return {};
    }
    onPageNotFound(e){
        //这里专门迁移之前的业务，比如一些广告，二维图已经印出来，贴在各大广场上，不可能再改这些二维码
        //而二维码对应一些旧页面，现在用nanachi重写，并根据nanachi的规范，只能以index结尾
        //随着业务的拆分，它们分到新部门（门票），为了方便分包，它们的目录结构也要改动
        //我们可以在config中添加needRedirectPages映射
        var [path, query] = e;
        //在微信小程序中path不以"/"开头，但不保证其他小程序是以"./", "/"开头
        path = path.replace(/^\/,""/)
        var newPath = Global.config.needRedirectPages[path] || "pages/platform/404/index";
        var queryString = Object.keys(query).map(function(k){
          return `${k}=${query[k]}`
        }).join("&");
        React.api.redirectTo({
            url:path + (queryString? '?'+ queryString: '')
        });
    }
    onShowMenu(pageInstance, app){} //供快应用实现右上角菜单与转发分享（onShare, onGlobalShare都在这里）
    onCollectLogs(){}  //全局的用户行为日志收集钩子
    onHide(){          //全局的app钩子, 当app切换后台时触发
          var app = React.getApp()
          console.log(app == this)//由于平台的差异性，React.getApp(）得到的对象不定是new App的实例
    }
    onLaunch() {     //全局的app钩子 （快应用会自动转译成onCreate）
        if ( process.env.ANU_ENV === 'quick' ) { //非快应用的平台在编译阶段会被干掉
            if ( this.$data && typeof global === 'object') {  //针对快应用的全局getApp补丁
                var ref = Object.getPrototypeOf(global) || global;
                var _this = this;
                ref.getApp = function() {
                    return _this;
                };
                this.globalData = this.$def.globalData;
            }
        }
        console.log('App launched');
    }
}

export default App(new Global());
```

## globalData的设计

在我们公司，globalData会将登录信息（微信的getUserInfo, 里面有openId什么），页面的参数， 场景值全部缓存起来，这样以后大家直接访问React.getApp().globalData就能拿到，建议用户们可以模仿。

```javascript
//app.js
   globalData = {
        systemInfo: {},
        // 页面渲染时间
        _timestamp: 0,
        // 页面留存时间
        _staytime: 0,
        _startimestamp: 0,
        location: {},
        // 外链带入渠道
        bd_origin: '',
        // 小程序内部渠道，路由跳转会自动替换
        hd_origin: '',
        scene: '',
        logs: [] //日志， 满10条就会自动发送后台
    };
    onLaunch(e) {
        this.globalData.scene = e.scene
        if(process.env.ANU_ENV === 'quick') {
            this.onLaunchQuick(e);
        }
        this.onLaunchNormal(e);
    }
    onHide(){
       this.globalData._staytime = Data.now - this.globalData._startimestamp
    }
    async onLaunchNormal(e) {
        // 统计总体停留时长
        this.globalData._startimestamp = +new Date();
        // 这里要把系统信息放到全局 方便日志收集  业务线调用时要使用util下的getSystemInfo
        React.api.getSystemInfo({
            success: res => {
                this.globalData.systemInfo = res;
            }
        });
    }
    onLaunchQuick(e) {
        //针对快应用的全局getApp补丁
        if (this.$data && typeof global === 'object') {
            var ref = Object.getPrototypeOf(global) || global;
            var _this = this;
            this.globalData = this.$def.globalData || {};
            ref.getApp = function() {
                return _this;
            };
        }
        // 统计总体停留时长
        this.globalData._startimestamp = +new Date();
        React.api.getSystemInfo({
            success: res => {
                this.globalData.systemInfo = res;
            }
        });
        // 拿openId 更新token
        user.appLanchInfos();
        // 获取地理位置 埋点所需 百度账号未登录会报错
        React.api.getLocation({
            success: (res) => {
                this.globalData.location = {
                    lat: res.latitude,
                    lgt: res.longitude
                };
            }
        });
        // 将bd_origin存到全局变量内
        const scene = this.globalData.scene;
        if (e.query) {
            // 缓存初始的bdo
            this.globalData.bd_origin = e.query.bd_origin || '';
            this.globalData.hd_origin = e.query.hd_origin || '';
        }
    }
```

## tabBar 的使用

| 属性             | 类型      | 必填   | 默认值 | 描述            |
|-----------------|----------|------|---------|--------------------------------------------|
| color           | HexColor | 是   |&nbsp; |tab 上的文字默认颜色，仅支持十六进制颜色                 |                                            |
| selectedColor   | HexColor | 是   |&nbsp;|tab 上的文字选中时的颜色，仅支持十六进制颜色             |                                            |
| backgroundColor | HexColor | 是   |&nbsp;| tab 的背景色，仅支持十六进制颜色    |                                            |
| borderStyle     | string   | 否   | black  | tabbar 上边框的颜色， 仅支持 black / white |
| list            | Array    | 是   | &nbsp;|tab 的列表，详见 list 属性说明，最少 2 个、最多 5 个 tab |
| position        | string   | 否   | bottom     | tabBar 的位置，仅支持 bottom / top         |
| custom          | boolean  | 否   | false      | 自定义 tabBar，见详情                      |

> 快应用不支持 position， tabBar总是在下面

> tabBar下的list也可以根据平台设置，详见[这里](./tabBar.md)

## React.getApp()的使用场合

 `React.getApp()`必须放在app.js 或页面组件或普通组件的生命周期钩子里面执行，不要放在全局作用域下执行

快应用可以这样设置跨页面的全局数据 `this.$app.$data = {a:1}`

其他配置项统一放在config对象中，详细配置列表参见[这里](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html#%E5%85%A8%E5%B1%80%E9%85%8D%E7%BD%AE)

![nanachi](app.jpg)





