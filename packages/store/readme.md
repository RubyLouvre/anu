## Rematch

redux一直以难用著称，太多模板代码，并且对异步不友好，于是社区出现各种封装

著名的有

1. dva, 使用更加著名的`redux-saga`来处理异步，但是涉及太多概念
2. redux-act, 封装了action与reducer, 但没有处理异步
3. redux-box, 对`redux-saga`进行简化
4. rematch, 最近的新起之秀，使用`async/await`处理异步，简化概念！

rematch原来是基于ts编写的，使用于大量的`Object.keys`与`for of`，本人将它进行大量改写，优化性能，并让支持IE8 

文档地址：

https://github.com/rematch/rematch

例子： rematch.ex

```
webpack
```
运行index7.html

-----------

React/anujs只是一个视图库，因此它是不完整的，传统的MVVM架构非常好用，依次划分为M， V， VM， M可以看作是后端传过来的数据， V是我们的视图，我们需要一个VM 来转换我们的M ，并且让它通知V变更。

回想一下VM，它是一个个访问器属性构成，访问器包含了setter, getter

```
//models.js ,还记得ng-model, v-model或ms-duplex吗
export const count = {
  state: 0, // 它的初始值
  //reducers与effects都是各种操作count的方法，但是我们不应该有action概念，省得自己被绕进去
  reducers: {
    //reducers你可以看作是一种纯正的setter，由于immutable的需求，要求传入旧的state, 返回新的state
    increment(state, payload) {
      return state + payload
    }
  },
  // 
  effects: (dispatch) => ({
    // effects可以看作是一种`异步`的setter，dispatch为访问器属性count所在的vm， 之所以单独出来，因为async/await需要特殊处理
    async incrementAsync(payload, rootState) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      dispatch.count.increment(payload)
    })
  }
}
```

为了将它整进视图，我们需要react-redux， `Provider`负责创建一个顶层的容器，一个大管家，控制下面由`connect`方法创建的组件更新。

connect是以HOC的形式创建组件的，组件需要传入三个对象，第一个对象只有字段，用于显示在视图上，
第二个对象则是将它的setter改造成一些事件回调，謪视图返回同步它们，第三个是这个组件的其他自有属性或方法
```jsx
import React from 'react';
import { connect } from 'react-redux';

const Count = props => (
    <div>
        <h1>The count is: {props.count}</h1>
        <button onClick={props.addByOne}>Add 1</button>
        <button onClick={props.addByOneAsync}>Add 1 Async</button>
    </div>
);
//将vm.count访问器定义拿出来，放到新组件的props中
const mapState = state => ({
    count: state.count,
});
//将vm中的count的setter拿出来，转换成事件回调，放到新组件的props中
const mapDispatch = ({ count: { addBy, addByAsync }}) => ({
    addByOne: () => addBy(1),
    addByOneAsync: () => addByAsync(1)
});
/*
//babel转换后的真面目
function mapDispatch(vm){
   var count = vm.count
   return {
        addByOne: function(){
            count.addBy(1)
        }
        addByOneAsync:  function(){
            count.addByAsync(1)
        } 
   }
}
*/
//创建一个HOC
export default connect(mapState, mapDispatch)(Count);
```

最后
```jsx
import React from 'react';
import ReactDOM from 'react-dom';
//或 import { init } from "anujs/dist/Rematch"
import { init }  from '../packages/store/index';
import { Provider } from 'react-redux';
import * as models from './models';
import Count from './Count';

// generate Redux store
const store = init({
    models
});

const Root = () => (
    <Provider store={store}>
        <Count />
    </Provider>
);

ReactDOM.render(<Root />, document.querySelector('#root'));

```


Rematch/Redux还一个重要概念叫Selector， 这其实相当于MVVM的计算属性。

state来源于后端数据库，是跨页面共享的领域模型，而select或叫计属性或叫应用狀态，它是存在局部用于判定页面显示的临时数据，
它可以是多个state的组合，或一个state与其他东西的组合。

https://zhuanlan.zhihu.com/p/33985606

https://zhuanlan.zhihu.com/p/34199586


