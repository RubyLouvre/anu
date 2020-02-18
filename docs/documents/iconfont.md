# Iconfont 的支持情况

## 使用方式

定义 iconfont 样式：

```scss
// 本地字体
@font-face {
    font-family: 'fontLocal';
    src: url('../../../assets/fonts/font.ttf');
}
// 远程地址
@font-face {
    font-family: 'fontOnline';
    src: url(https://ss.qunarzz.com/yo/font/1.0.3/font.ttf);
}

.iconfont-local {
    font-family: 'fontLocal';
}
.iconfont-online {
    font-family: 'fontOnline';
}
```

定义组件：

```js
import React from '@react';
import './index.scss';

class P extends React.Component {

    render() {
        return (<div>
            <p>本地字体</p>
            <div className="iconfont-local">&#xe351;</div>
            <div className="iconfont-local">&#xe351;</div>
            <p>远程字体</p>
            <div className="iconfont-online">&#xf077;</div>
            <div className="iconfont-online">&#xf078;</div>
        </div>);
    }
}

export default P;
```
## 需要注意的点

- 字体图标文件必须放在 assets 目录下。

- 为了兼容快应用，字体文件应仅使用 ttf(TrueType) 格式字体且不要加 format 属性，参考上面的示例。

- 使用远程 iconfont 时必须填写完整的 url 地址，不能省略前面的 http 或者 https。

- 因为娜娜奇的样式是组件封闭的，为了能够共用 iconfont 相关的样式，我们推荐建立一个公共的 iconfont 样式文件，然后在需要使用 iconfont 的组件里通过 `@import` 引入该样式。

- 如果本地路径出错，建议使用兼容性更好的远程路径


如果出错，可以参考这篇文章 https://blog.csdn.net/u013022210/article/details/80926383

## 支持情况

|     | 本地 | 远程 |
| --- | --- | --- |
| 微信小程序 | ✗ | ✓ |
| 支付宝小程序 | ✓ | ✓ |
| 百度小程序 | ✗ | ✓ |
| 快应用 | ✓ | ✓ |