# 按平台打包代码或样式

很多场景下可能需要差异化打包不同平台的代码，娜娜奇提供环境变量process.env.ANU_ENV来识别不同平台。在编译前，ANU_ENV变量已静默配置。

```jsx
componentDidMount(){
    let ANU_ENV = process.env.ANU_ENV;//wx ali bu quick h5 360
    if(ANU_ENV === 'wx'){
        //微信小程序业务逻辑
    }else if(ANU_ENV === 'ali'){
        //支付宝小程序业务逻辑
    }else {
        
    }
}
```

又如我们在微信小程序要获取用户信息， 需要这样实现

```javascript
 this.state = {
     isWx: process.env.ANU_ENV == 'wx'
 }
```

```jsx
<div>{ this.state.isWx && <button open-type="getUserInfo"></button>}
</div>
```

有时候需要按平台引入相关模块，在写法上有所不同，必须通过注释节点来匹配相关的import引入。
例如:
```jsx
// if process.env.ANU_ENV == 'wx';
import wx from './wx.js';
// if process.env.ANU_ENV == 'ali';
import ali from './ali.js';
// if process.env.ANU_ENV == 'wx';
import 'wx_specific.css'
```

编译结果(ANU_ENV:wx):
```jsx
import wx from './wx.js';
```



