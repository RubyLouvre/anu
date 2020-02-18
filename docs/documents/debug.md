# 真机调试

如果在真机中显示日志非常麻烦。

建立一个页面用于显示错误信息

```jsx
// pages/error/index
import React from '@react';

class P extends React.Component {
    constructor(props){
       super(props)
       console.log(props)
    }
    render() {
        return <div>
            <div>错误页面</div>
            <div>{this.props.query.filename}</div>
            <div>{this.props.query.msg}</div>
            </div>
       
    }
}

export default P;
```

在app.js添加一个onError钩子, 用于捕获错误并且跳转到刚才的页面将它显示出来

```javascript

 onError(e) {
    console.log("捕获到错误",e)
    React.api.navigateTo({
        url: "/pages/error/index?msg=" + e.message+"&filename="+e.filename
    });
}
```

最后别忘了在要app.js的上面添加`import "./pages/error/index";`

像百度小程序在真机调试时，需要在项目信息中填入真实的appid才能用

