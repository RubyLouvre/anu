# npm模块管理
针对小程序无法友好管理npm第三方模块问题，nanachi给与了最大限度支持，当文件中引入第三方npm模块，nanachi监听到后会自动安装，并且最小量打包你所依赖的npm模块。

例如
```jsx
import cookie from 'cookie';
```
打包后
```jsx
dist/npm/
└── cookie
    └── index.js
```

> 微信小程序或快应用的JS环境 与浏览器的JS环境是不一样，不支持许多全局方法，比如fetch, requestAnimationFrame, location, 因此需要自行检测一下
第三方库的可用性。


