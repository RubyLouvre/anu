## router

**anujs** works perfectly with `react-router`.

However, it is strongly recommended that you use **reach router**, which is better than `react-router`.

**anujs** also modified it to allow it to support IE8's hashchange

Reach the official website

Https://reach.tech/router


```javascript
resolve: {
    alias: {
       react: "anujs",
       "react-dom": "anujs",
       router: "anujs/dist/Router.js"
      
    }
},
```