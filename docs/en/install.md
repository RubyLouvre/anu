
# Install

```javascript
npm i anujs
```

How to use in projects that already use React, modify webpack.config.js

```javascript
const es3ifyPlugin = require('es3ify-webpack-plugin');

resolve: {
    alias: {
       'react': 'anujs',
       'react-dom': 'anujs',
         // For compatibility with IE please use the following configuration
         // 'react': 'anujs/dist/ReactIE',
         // 'react-dom': 'anujs/dist/ReactIE',
         // If you reference prop-types or create-react-class
         // Need to add the following alias
         'prop-types': 'anujs/lib/ReactPropTypes',
         'create-react-class': 'anujs/lib/createClass'
         // If you use the onTouchTap event on the mobile side
         'react-tap-event-plugin': 'anujs/lib/injectTapEventPlugin',
    }
},
plugins: [ new es3ifyPlugin()]
```