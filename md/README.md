# anu


[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Rubylouvre/anu/blob/master/LICENSE) 
[![npm version](https://img.shields.io/npm/v/anujs.svg?style=flat)](https://www.npmjs.com/package/anujs)
[![CircleCI](https://circleci.com/gh/RubyLouvre/anu/tree/master.svg?style=svg)](https://circleci.com/gh/RubyLouvre/anu/tree/master)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/RubyLouvre/anu/pulls)

<<<<<<< HEAD:readme.md

```bash
npm install anujs
```
读作 安努 ，苏美尔的主神，开天辟地。一个高级兼容官方React16的迷你React框架，用于上线时无痛替换React，压缩整个项目的体积。
QQ交流学习群：  370262116
=======
```
npm install anujs
```

anu, 读作［安努］，原意为苏美尔的主神。



众所周知，React 一直存在体积过大的诟病，集成了许多在线上环境不需要功能, 因此我在熟读其源码的基础上，去芜存精，重新实现了 React 所有公开接口，体积只有其五分之一，从而解决它在移动端上加载过慢的问题。由于没有使用高级 API，因此只需在 webpack ,uglify 上修改配置，便能运用于 IE8 上，从而解决 PC 端同学使用 React 的问题。

与其他迷你react的比较 

相对于preact， 它的通用性更好， preact是通过preact-compat实现对React的API的兼容，里面用于了Object.definePropety，这会造成两个问题。
一是无法运用于IE8中，二，用于Object.defineProperty,其性能立即从70帧掉到30帧。

相对于react-lite, anujs的事件系统更具扩展性。官方的react-dom，近2万行，有一半花在事件系统上，对mouseenter/mouseleave/focus/blur/change等不可冒泡的事件进行模拟冒泡，react-lite简单几行是实现不了那个效果的。
anujs是作者是精通DOM操作，也费了好大劲才实现的。

![](http://images2017.cnblogs.com/blog/65123/201708/65123-20170830090259687-1322071010.gif)

![image](https://user-images.githubusercontent.com/190846/30572471-6915dbbc-9cb3-11e7-93da-f63c8498a31f.png)

>需要 npm i -g jsize
－－－－－－－－－－


特点：

1. 支持React的无狀态组件，纯组件，高阶组件，受控组件与[非受控组件](https://github.com/RubyLouvre/anu/wiki/%E9%9D%9E%E5%8F%97%E6%8E%A7%E7%BB%84%E4%BB%B6)，
2. 命名空间就是React，此外还暴露了另一个别名ReactDOM在window上
3. 体积足够少，min为60kb, gz后为10kb中，2000多行代码（相对于react+react-dom是3MB与3万行代码)
4. 性能稳定在60帧，使用的是基于列队的异步机制
5. 生命周期函数的参数与官方保持一致
6. 直接与[react-redux, react-router-dom, react-router-redux](https://github.com/RubyLouvre/anu/wiki/react-router-redux%E7%9A%84%E8%B7%AF%E7%94%B1%E4%BE%8B%E5%AD%90)混用
7. 支持[后端渲染](https://github.com/RubyLouvre/anu/wiki/%E5%90%8E%E7%AB%AF%E6%B8%B2%E6%9F%93)
8. 支持[官方的chrome DevTools](https://github.com/RubyLouvre/anu/wiki/react-chrome%E5%BC%80%E5%8F%91%E8%80%85%E5%B7%A5%E5%85%B7)


![image](http://images2017.cnblogs.com/blog/65123/201708/65123-20170830091200593-1052885316.png)



详细用法与示例见 ** [wiki](https://github.com/RubyLouvre/anu/wiki) **

```html
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width">
    <script type='text/javascript' src="./dist/React.js"></script>
    <script src="https://cdn.bootcss.com/babel-standalone/6.24.0/babel.js"></script>

    <script  type="text/babel" >
       class A extends React.PureComponent {
            constructor(props) {
                super(props)
                this.state = {
                    aaa: {
                        a: 7
                    }
                }
            }
          
            click() {
                this.setState(function(state){
                   state.aaa.a = 8
                })
            }
            render() {
                return  <div onClick={this.click.bind(this) }>{this.state.aaa.a}</div>
            }
        }
        window.onload = function () {
            ReactDOM.render(<A />, document.getElementById('example'))
        }
    </script>
</head>

<body>
    <div>这个怎么点击也不会变</div>
    <blockquote id='example'></blockquote>


</body>

</html>
```
-----------


与Redux使用的例子
```html
<!DOCTYPE html>
<html>
>>>>>>> 241a98651f73966e06fa0d86c2ee3428f8a93a32:md/README.md

[体积变化](https://wx1.sinaimg.cn/mw690/7109e87fly1frfqw50lduj21kw0rzk0h.jpg)

数据来源： https://bundlephobia.com/

### 特点：

1. 支持React16的各种**新功能**，Fragment, componentDidCatch, creactContext, createRef, forwardRef...
2. 体积非常迷你(3000行相对于react+react-dom的3万行, gz为其1/3大小)
3. 跑通**官方700多个单元测试**（其他迷你库都无法跑官方测试）
4. 支持**React全家桶**（react-redux, react-router-dom, react-router-redux， react-lazy-load， react-hot-loader...）
5. 支持99％的antd组件

### 官方脚手架 

https://github.com/RubyLouvre/create-anu-app

### IE8脚手架 

https://gitee.com/menhal/React_IE8_boilerplate


![image](https://cloud.githubusercontent.com/assets/190846/26769869/e5e1f6c0-49e4-11e7-94c9-f106179cf40f.png)



### 开源协议 
MIT

### 轻松切换已有的React项目

```js
//webpack配置
resolve: {
   alias: {
      'react': 'anujs',
      'react-dom': 'anujs',
        // 若要兼容 IE 请使用以下配置
        // 'react': 'anujs/dist/ReactIE',
        // 'react-dom': 'anujs/dist/ReactIE',
        // 'redux': 'anujs/lib/ReduxIE',//这主要用于IE6－8，因为官方源码中的isPlainObject方法性能超差
        // 如果引用了 prop-types 或 create-react-class
        // 需要添加如下别名
        'prop-types': 'anujs/lib/ReactPropTypes',
        'create-react-class': 'anujs/lib/createClass'
        //如果你在移动端用到了onTouchTap事件
        'react-tap-event-plugin': 'anujs/lib/injectTapEventPlugin',  
   }
},
```

详细用法与示例见  [wiki](https://github.com/RubyLouvre/anu/wiki) 

<<<<<<< HEAD:readme.md
### 测试

```
npm test
```
=======
>>>>>>> 241a98651f73966e06fa0d86c2ee3428f8a93a32:md/README.md

