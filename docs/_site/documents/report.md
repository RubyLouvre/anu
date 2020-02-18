# 日志收集与上传

出于运营的需要，我们需要将页面的流转信息，用户点击分布，错误，页面渲染情况发送到后端

小程序编译阶段，会将所有事件转换为一个全局的dispatchEvent方法，因此我们可以这里做统一的日志的收集

```jsx
 <div onclick="dispatchEvent" data-beacon-uid="clickForVibration" class="item" data-click-uid="e1765" data-class-uid="c1321">
     <text>震动</text>
 </div>
```

如果我们发现这事件类型是click/tap/change/blur, 我们就会为这些元素添加一个`data-beacon-uid`, 值为default,(如果你已经写了，它就不会添加)，然后在dispatchEvent执行app.js的全局对象的`onCollectLogs`方法，让用户整理成一个对象，放到一个数组中, 并尝试使用`onReportLogs`自动发送；

```javascript
//dispatchEvent的源码
export function dispatchEvent(e) {
    const instance = this.reactInstance;
    if (!instance || !instance.$$eventCached) {
        return;
    }
    const eventType = toLowerCase(e.type);
    const app = _getApp();
    const target = e.currentTarget;
    const dataset = target.dataset || {};
    const eventUid = dataset[eventType + 'Uid'];
    const fiber = instance.$$eventCached[eventUid + 'Fiber'] || {
        props: {},
        type: 'unknown'
    };
    if (app && app.onCollectLogs && /click|tap/.test(eventType) ) {
        app.onCollectLogss(dataset, eventType, fiber && fiber.stateNode);
    }
   
    //....略
}
```

当用户退出APP时，会进入onHide事件，这时我们就会上传剩余的所有日志

因此用户只需要在app.js定义好这两个事件，框架帮你搞定日志上传。下面是示例：

```jsx
import React from '@react';
import './pages/index/index';
import './pages/demo/base/index';
import './pages/demo/native/index/index';
import './app.scss';
function computeXpath(node){ //通过xpath实现自动埋点
    var xpath = [];
    while (node.parentNode){
        var index = node.parentNode.children.indexOf(node);
        var tag = node.type == 'div' ? 'view': node.type;
        xpath.unshift(tag+'['+index+']');
        node = node.parentNode;
    }
    return  '/page/'+ xpath.join('/');
}
function computeCompressedXpath(node){ //压缩后的xpath
    var xpath = [];
    while (node.parentNode){
        var index = node.parentNode.children.indexOf(node);
        xpath.unshift(index);
        node = node.parentNode;
    }
    return xpath.join('/');
}
var openChange = false;
class Global extends React.Component {
    static config = {
        window: {
            backgroundTextStyle: 'light',
            navigationBarBackgroundColor: '#0088a4',
            navigationBarTitleText: 'mpreact',
            navigationBarTextStyle: '#fff'
        }
    };
    // 全局数据
    globalData = {
        ufo: 'ufo'
    };
    onCollectLogs(dataset, eventType, node){ //这里会在框架的dispatchEvent自动调起，实现自动理点
        var beaconId = dataset.beaconUid;
        if( beaconId == 'default' && node ){
            beaconId = computeCompressedXpath(node);
        }
        if (eventType === 'input') {//input事件触发太频繁了，我们只想收集一次
            if (openChange) return;
            openChange = true;
            setTimeout(() => {
                openChange = false;
            }, 1000);
        }

        var otherData = dataset.xxx//data-xxxx
        var otherData2 = dataset.xxx2;
        var timeStamp = new Date - 0;
        var path = React.getCurrentPage().props.path;//页面路径
        var logs =  this.globalData.logs || (this.globalData.logs = [])
        logs.push({
            pid: beaconId,
            path: path,
            timeStamp: timeStamp
            action: eventType
        });
        if(logs.length > 20){
            var uploadLogs = logs.splice(0, 10);//截取前十条；
            if(this.onReportLogs){
                this.onReportLogs(uploadLogs)
            }
        }
    };
    onHide(){
      this.onReportLogs(); //微信，支付宝，百度
    };
    onDistory(){
      this.onReportLogs(); //快应用
    };
    onReportLogs(logs){ //自己实现
        if(!logs){
            var existLogs = this.globalData.logs
            if(!Array.isArray(existLogs) || existLogs.length == 0){
               return
            }
            logs = existLogs;
            this.globalData.logs = [];
        }
        if(!logs.length){
            return
        }
        var buildType = this.globalData.buildType;// wx, bu, ali
        var info =  this.globalData.systemInfo | React.api.getSystemInfornSync();
        var { brand, model, version, platform} = info ;//获取手机品牌，手机型号， 微信版本号, 客户端平台;
        React.api.request({
            url: "/fdsfdsf/sdfds",
            type: 'GET',
            data： {
                logs,  //logData
                buildType,//wx, bu, ali, quick, tt, qq
                brand, //commonData
                model, //commonData
                version,//commonData
                platform,//commonData
             //other
            } 
        })
    }, 
    onLaunch() {
        console.log('App launched');
    }
}

export default App(new Global());
```

在common目录下

```jsx
import React from '@react'
//此方法用于手动埋点
function createLog(dataset, eventType){
    var app =  React.getApp();
    if(typeof app.onCollectLogs === 'function' ){
        app.onCollectLogs(dataset, eventType, null)
    }
}
```

## 各种日志的处理

1. 订单 等这样重要的行为， 要业务中进行手动埋点，使用上面的createLog方法
2. 点击，输入这样的事件，使用自动埋点，框架会在内部的dispatchEvent方法中自行调用全局的
onCollectLogs方法
3. 页面流转情况， 建议对React.api.redirectTo等四个方法进行再包装，里面封入onCollectLogs方法，
4. 页面渲染时间，通过全局的onGlobalLoad, onGlobalReady等到某一页的渲染时间
5. 页面停留时间，通过全局的onGlobalShow onGlobalHide等到某一页的停留时间

> 如果一些页面没有使用nanachi,可以通过下面的方法调用app.js的全局钩子：

```javascript
    var appHook = {
        onLoad: "onGlobalLoad",
        onReady: "onGlobalReady",
        onShow: "onGlobalShow",
        onHide: "onGlobalHide"
     }
     function addGlobalHooks(obj){
         "onLoad,onReady,onShow,onHide".replace(/\w+/g,function(method){
             var fn = obj[method] || Number
             obj[method] = function(param){
                fn.call(obj, param);
                var app = getApp();
                var hook = appHook[method];
                if(typeof app[hook] === 'function'){
                    app[hook](param)
                }
             }
         })
     }
     Page(addGlobalHooks({
         
     }))
```


## 快应用的UUID

咱们的uv统计 以及未登录下单就是用的这玩意 andid就是ime号
