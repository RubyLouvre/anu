##注意点

### 目前没有支持的方法与对象

1. PropTypes
2. childContextTypes(不需要定义它，就能使用context)
3. Children的方法集合（不完整）
4. mixin机制
5. createClass
6. cloneElement

### 低版本浏览器可能需要以下 语言补丁

1. [Array.isArray](https://github.com/juliangruber/isarray/blob/master/index.js)
2. [Object.assign](https://github.com/ryanhefner/Object.assign/blob/master/index.js)
3. [JSON.stringify](https://github.com/flowersinthesand/stringifyJSON)
4. [console-polyfill](https://github.com/paulmillr/console-polyfill) 
5. [es6-Map](https://github.com/medikoo/es6-map/blob/master/polyfill.js)

或者直接使用**polyfill.js** https://github.com/RubyLouvre/anu/tree/master/dist/polyfill.js