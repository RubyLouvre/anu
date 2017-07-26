##安装

```javascript
npm i anujs
```

如何在已经使用了React的项目中使用，修改webpack.config.js

```javascript
resolve: {
    alias: {
        'react': 'anujs',
        'react-dom': 'anujs',
        'react-tap-event-plugin': 'anujs/lib/injectTapEventPlugin' 　//如果你用到了onTouchTap事件
    }
}
```