# 兼容

对于原生自定义组件兼容，只需要将原生组件配置到属性config里usingComponents字段，与微信小程序原生开发配置方式一致。

```jsx
class Animal extends React.component{
    config = {
        usingComponents: {
            Tom: '/components/NativeComponentTom/index'
        }
    }
    //other code
    render(){
        return (
            <div>
                <Tom />
            </div>
        )
    }
}
```