## 路由器

anu可以完美与`react-router`搭配使用。

但强烈建议使用reach router, 这个比react router更好用。

anujs也对它进行改造，让它支持IE8的hashchange

reach的官网

https://reach.tech/router


```javascript
resolve: {
   alias: {
      react: "anujs",
      "react-dom": "anujs",
      router: "anujs/dist/Router.js"
      
   }
},
```