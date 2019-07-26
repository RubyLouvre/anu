## ReachRouter

Reach Router的改造版 

去掉一些高级的es6语法糖，让它最终编译后的代码量更少，兼容性更好

并且在Router组件上添加一个mode属性，值为"history" 或"hash"，“hash“用于兼容IE8， 默认是“history”

依赖于anujs内部的createContext版本

```
npm start
```

选择 index8.html index9.html