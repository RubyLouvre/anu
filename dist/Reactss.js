/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = extend;
/* harmony export (immutable) */ __webpack_exports__["b"] = clone;
/* harmony export (immutable) */ __webpack_exports__["c"] = isEvent;
/**
 * 复制一个对象的属性到另一个对象
 * 
 * @param {any} obj 
 * @param {any} props 
 * @returns 
 */
function extend(obj, props) {
    if (props) {
        for (let i in props) {
            obj[i] = props[i]
        }
    }
    return obj
}
/**
 * 创建一个对象的浅克隆副本
 * 
 * @param {any} obj 
 * @returns 
 */
function clone(obj) {
    return extend({}, obj)
}

/**
 * 判定否为与事件相关
 * 
 * @param {any} name 
 * @param {any} val 
 * @returns 
 */
function isEvent(name, val) {
    return /^on\w/.test(name) && typeof val === 'function'
}

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Component__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util__ = __webpack_require__(0);



var React = {
    render,
    createElement,
    Component: __WEBPACK_IMPORTED_MODULE_0__Component__["a" /* Component */]
}

/**
 * 创建虚拟DOM
 * 
 * @param {string} type 
 * @param {object} props 
 * @param {array} children 
 * @returns 
 */
function createElement(type, configs = {}, children) {
    var props = {}
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__util__["a" /* extend */])(props, configs)
    var c = [].slice.call(arguments, 2)
    if (!c.length && props.children) {
        c = props.children
    }
    c = flatChildren(c)
    props.children = Object.freeze(c)
    Object.freeze(props)
    return {
        type: type,
        props: props
    }
}
/**
 * 遍平化children，并合并相邻的简单数据类型
 * 
 * @param {array} children 
 * @param {any} [ret=[]] 
 * @returns 
 */
function flatChildren(children, ret = []) {
    for (let i = 0, n = children.length; i < n; i++) {
        let el = children[i]
        if (el == null) { //迅速减少要continue的元素
            el = ''
        }
        let type = typeof el
        if (el === '' || type === 'boolean') {
            continue
        }
        if (/number|string/.test(type)) {

            if (ret.merge) {
                ret[ret.length - 1] += el
            } else {
                el = String(el)
                ret.push(el)
                ret.merge = true
            }
        } else if (Array.isArray(el)) {
            flatChildren(el, ret)
        } else {
            ret.push(el)
            ret.merge = false
        }

    }
    return ret
}
/**
 * 
 * @param {any} vnode 
 * @param {any} container 
 */
function render(vnode, container) {
    container.textContent = ''
    while (container.firstChild) {
        container.removeChild(container.firstChild)
    }
    container.appendChild(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__Component__["b" /* toDOM */])(vnode))
}



window.ReactDOM = React

/* harmony default export */ __webpack_exports__["default"] = React;

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["a"] = Component;
/* unused harmony export diffProps */
/* harmony export (immutable) */ __webpack_exports__["b"] = toDOM;
 

 /**
  * 
  * 
  * @param {any} props 
  * @param {any} context 
  */
 function Component(props, context) {
     this.context = context
     this.props = props
     if (!this.state)
         this.state = {}
 }


 Component.prototype = {

     setState(state) {
         let s = this.state;
         this.prevState = this.prevState || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* clone */])(s);
         __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["a" /* extend */])(s, state);
         renderComponent(this)
     },

     forceUpdate() {
         renderComponent(this);
     },

     render() {}

 }

 /**
  * 渲染组件
  * 
  * @param {any} instance 
  */
 function renderComponent(instance) {

     var { props, state, context, vnode } = instance
     if (instance.shouldComponentUpdate &&
         instance.shouldComponentUpdate(props, state, context) === false) {
         return
     }
     if (instance.componentWillUpdate) {
         instance.componeneWillUpdate(props, state, context);
     }

     var rendered = instance.render()
     if (instance.getChildContext) {
         context = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["a" /* extend */])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["b" /* clone */])(context), instance.getChildContext());
     }
     var dom = vnode.dom

     dom = diff(dom, rendered, context, dom.parentNode)

     instance.vnode = rendered
     rendered.dom = dom
     delete instance.prevState //方便下次能更新this.prevState

     if (instance.componenDidUpdate) {
         instance.componentDidUpdate(props, state, context);
     }

 }
 /**
  * 
  * 
  * @param {any} dom 
  * @param {any} vnode 
  * @param {any} context 
  * @param {any} parent 
  * @returns 
  */
 function diff(dom, vnode, context, parent) {
     var oldProps = dom['__props'] || {}
     if (dom.nodeName.toLowerCase() !== vnode.type) {
         var nextDom = document.createElement(type)
         while (dom.firstChild) {
             nextDom.appendChild(dom.firstChild)
         }
         if (parent) {
             parent.replaceChild(nextDom, dom)
         }
         dom = nextDom
     }
     diffProps(dom, oldProps, vnode.props)
     diffChildren(dom, vnode.props.children)
     return dom
 }


 /**
  * 修改dom的属性与事件
  * 
  * @param {any} dom 
  * @param {any} props 
  * @param {any} nextProps 
  */
 function diffProps(dom, props, nextProps) {
     for (var i in nextProps) {
         if (i === 'children') {
             continue
         }
         var val = nextProps[i]
         if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["c" /* isEvent */])(i, val)) {
             if (!props[i]) { //添加新事件
                 dom.addEventListener(i.slice(2).toLowerCase(), val)
             }
             continue
         }
         if (val !== props[i]) {
             //移除属性
             if (val === false || val === void 666 || val === null) {
                 dom.removeAttribute(i)
                 delete props[i]
             } else { //添加新属性
                 dom.setAttribute(i, val + '')
                 props[i] = val
             }
         }
     }
     for (var i in props) {
         if (!(i in nextProps)) {
             if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__util__["c" /* isEvent */])(i, props[i])) { //移除事件
                 dom.removeEventListener(i.slice(2).toLowerCase(), props[i])
             } else { //移除属性
                 dom.removeAttribute(i)
             }
             delete props[i]
         }
     }
 }
 /**
  * 
  * 
  * @param {any} dom 
  * @param {any} newChildren 
  * @param {any} context 
  */
 function diffChildren(dom, newChildren, context) {
     var childNodes = dom.childNodes
     for (var i = 0, n = newChildren.length; i < n; i++) {
         //思路，由易到难，
         var el = newChildren[i]
         if (el == null) {
             el = ''
         }
         var type = typeof el
             //这种情况不用比较，直接移除从数组中移除它
         if (el === '' || type === 'boolean') {
             newChildren.splice(i, 1)
             i--
             n--
             continue
         }
         //处理对应真实DOM不存在的情况，那么不用比较，直接toDOM与append
         var node = childNodes[i]
         if (!node) {
             dom.appendChild(el.dom = toDOM(el))
         }
         //再处理文本虚拟DOM的情况
         if (type === 'string') {
             if (node.nodeType === 3) { //类型一致，只比较nodeValue
                 if (node.nodeValue !== el) {
                     node.nodeValue = el + ''
                 }
             } else {
                 dom.replaceChild(createText(el, texts), node)
                 elements.push(node)
             }

         } else { //type === 'object'
             if (node.nodeType === 3) {
                 dom.replaceChild(el.dom = toDOM(el), node)
             } else {
                 diff(node, el, context, dom)
             }
         }
     }
     while (childNodes[n]) {
         dom.removeChild(childNodes[n])
     }
 }

 /**
  * 
  * @param {any} vnode 
  * @returns 
  */
 function toDOM(vnode) {
     if (vnode == null) {
         vnode = ''
     }
     var type = typeof vnode
     var props = vnode.props
     if (typeof vnode.type === 'function') {
         var instance = new vnode.type(props, {})
         vnode = instance.render()
         instance.vnode = vnode //保存到vnode到实例中
         return vnode.dom = toDOM(vnode) //完美的程序总能递归
     }
     if (/number|string/.test(type)) {
         return document.createTextNode(vnode + '')
     }
     var dom = document.createElement(vnode.type)
     diffProps(dom, dom['__props'] = {}, props)
     props.children.forEach(function(el) {
         dom.appendChild(toDOM(el))
     })
     return dom
 }

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ })
/******/ ]);