## dom-renderer

ReactDOM的迷你实现

browser.js 提供了nodejs识别，高紴浏览器识别，IE版本识别，一套假的DOM（让它在nodejs中也不会报错），contains与命名空间集合

compat.js 是用来兼容IE6-8，主要是事件系统的修复，input, change,submit, 鼠标事件的pageX/Y修复，key属性修复，select元素的value同步， innerHTML属性的修复

duplex.js 是实现React受控组件

event.js 实现基于事件冒泡的事件系统，重点处理mouseenter,mouseleave（用mouseover/mouseout实现），wheel（对应原生三种事件），focus, blur(全局捕捉)， change事件（它在一些控件中相当于oninput事件，并要处理拼音输入法问题），doubleclick别名

props.js 属性系统，涉及到SVG 一些属性名不规则问题

style.js 样式系统

findDOMNode.js findHostInstance的封装

DOMRenderer.js 注入各种DOM操作方法，如removeElement, createElement, insertElement, emptyElement, updateContent

index.js 入口文件

index.ie8.js 兼容版 