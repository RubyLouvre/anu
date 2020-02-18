# 智能webview化

有一些场合，我们不得不使用webview. 虽说webview有很多缺点，比如它都是远程加载的，没有直接停驻于被寄生的APP上，导致页面加载慢，一些高级的APP特性用不了，需要跳转到小程序才能支付云云。但webview也有一个重要的不可忽视的优势，开发简单——就是我们熟悉的HTML开发。

## webview的使用场合

1. CSS兼容难度大，一些样式不支持需要调整，尤其是快应用，没有display:block/inline, position:absolute/relative, float:left/right,  只能用flexbox布局。这需要小公司来说，大大提高研发成本。
2. 小程序/快应用的size问题， 尤其是快应用只有1MB大小，很容易超出大小，而webview加载的页面不计入它的size.
3. 特定平台的限制问题，比如说支付宝不能使用video标签，你想做直播类，需要特殊申请，并必须用优酷上传视频，这时就可以将这个页面变成webview.

## 使用

在对应频道的页面对象的 config 添加一个参数。其中 pages 字段可能存在两种类型值，数组和布尔值。

当为数组时，数组中的各项为 webview 化的页面路径。nanachi 会将这些路径编译成 webview。

当为布尔值，且值为 true 时，nanachi 将这个页面所在文件夹（频道）的所有页面及子页面都 webview 化。


```
class Demo extends React.Component {
    static config = {
        webview: {
            quick: {
                pages: true,  
                showTitleBar: false, //是否隐藏快应用的 titlebar
                allowthirdpartycookies: false,
                trustedurl: []
            }
        }
    }
}
```

>  频道就是 pages下面的某个文件夹的意思


既然是智能 webview 化，之前页面跳转的路径也会自动变成访问 H5 的 URL。


需要注意的是，要手动在`package.json`中配置有效`H5_HOST`字段。用于访问 H5 页面对应的 URL。

```
{
    "nanachi" : {
        "H5_HOST": "https://www.qunar.com"
    }
}
```

如在应用中从`pages/a/b/index`路由跳转`pages/c/d/index`。其中`pages/c/d/index`会变成一个对应的 H5 访问地址（比如：`https://www.qunar.com/pages/c/d/index`）。

运行`nanachi watch:h5`, 会将`pages/c/d/index`页面编译成一个H5, 并启动一个运行 H5 页面的 server 服务。

注：智能 webview 化目前只支持快应用，其他平台正在陆续支持中。


## webview标签的兼容

webview标签在不同平台，它的名称与事件名有点出入

|wx	    |ali    |	  bu   |tt | quick  |
|:-----:|:------:|:------:|:------:|:-------:|
|web-view| web-view|web-view|web-view  |web |
