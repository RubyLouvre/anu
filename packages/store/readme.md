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