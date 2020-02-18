# 隐藏标题栏

标题栏又叫titleBar, navigationBar, 在webview或某些特殊场合下，我们想隐藏它


我们只要设置成空字符就行了（注意，如果不设置会统一使用app.js的标题）
```javascript
class P extends React.Component{
    static config = {
        navigationBarTitleText: ""
    }
    render(){
        return <div>隐藏标题栏</div>
    }
}
```