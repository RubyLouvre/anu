## 据平台设置tabBar

tabBar是小程序、快应用下面可能出现的按钮列表，用于快速回到首页或某一重要页面。

默认是使用tabBar.list数组

```javascript
class Global extends React.Component {
   static config = {
	    window: {
	        backgroundTextStyle: 'light',
	        // navigationBarBackgroundColor: '#0088a4',
	        navigationBarTitleText: 'mpreact',
	        navigationBarTextStyle: '#fff'
	    },
	    tabBar: {
	        color: '#929292',
	        selectedColor: '#00bcd4',
	        borderStyle: 'black',
	        backgroundColor: '#ffffff',
	        list: [ /*略*/]
        }
   }
   render(){
       //略
   }
}
export default App(new Global());
```

如果你想在快应用下，list的内容有点不一样，那么你可以添加一个quickList. 在转译阶段，会用quickList覆盖list, 并把quickList删掉。

同理，你可以添加wxList, buList, ttList进行不同的设置。


```javascript
class Global extends React.Component {
   static config = {
	    window: {
	        backgroundTextStyle: 'light',
	        // navigationBarBackgroundColor: '#0088a4',
	        navigationBarTitleText: 'mpreact',
	        navigationBarTextStyle: '#fff'
	    },
	    tabBar: {
	        color: '#929292',
	        selectedColor: '#00bcd4',
	        borderStyle: 'black',
	        backgroundColor: '#ffffff',
	        list: [ /*略*/],
            buList:  [ /*略*/],
            quickList:  [ /*略*/],
            aliList:  [ /*略*/]
        }
   }
   render(){
       //略
   }
}
export default App(new Global());
```