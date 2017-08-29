##注意点

它没有实现如下方法：
1. replaceState
2. isMounted
3. setProps
4. replaceProps

这些方法在所有迷你库都没有实现，官网上也不再出现，逐渐变边缘化与可能被废弃，不建议使用

https://facebook.github.io/react/docs/react-component.html


### 低版本浏览器可能需要以下 语言补丁, 详见IE栏目的处理

1. [Array.isArray](https://github.com/juliangruber/isarray/)
2. [Object.assign](https://github.com/ryanhefner/Object.assign)
3. [JSON.stringify](https://github.com/flowersinthesand/stringifyJSON)
4. [console-polyfill](https://github.com/paulmillr/console-polyfill) 
5. [Object.keys](https://github.com/ljharb/object-keys)
6. [Object.is](https://github.com/ljharb/object-is)
7. [Array.prototype.forEach](polyfill/Array.prototype.forEach)
8. [Function.prototype.bind](https://github.com/leahciMic/polyfill-function-prototype-bind)

或者直接使用**polyfill.js** https://github.com/RubyLouvre/anu/blob/master/lib/polyfill.js
=======
并且还需要修复Array.prototype.splice的BUG 
