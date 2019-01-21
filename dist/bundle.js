(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"main": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./bbb/index.js","vendors"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./bbb/index.js":
/*!**********************!*\
  !*** ./bbb/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var a = __webpack_require__(/*! ../dist/React/server */ \"./dist/React/server.js\");\nconsole.log(a);\n\n//# sourceURL=webpack:///./bbb/index.js?");

/***/ }),

/***/ "./dist/React/server.js":
/*!******************************!*\
  !*** ./dist/React/server.js ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! babel-runtime/regenerator */ \"./node_modules/babel-runtime/regenerator/index.js\");\n/* harmony import */ var babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);\n\n\nvar _typeof2 = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\n(function (global, factory) {\n    (typeof exports === 'undefined' ? 'undefined' : _typeof2(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory(__webpack_require__(/*! stream */ \"./node_modules/stream-browserify/index.js\")) : typeof define === 'function' && __webpack_require__(/*! !webpack amd options */ \"./node_modules/webpack/buildin/amd-options.js\") ? define(['stream'], factory) : global.ReactDOMServer = factory(global.stream);\n})(undefined, function (stream) {\n\n    var hasSymbol = typeof Symbol === 'function' && Symbol['for'];\n\n    var hasOwnProperty = Object.prototype.hasOwnProperty;\n    var REACT_ELEMENT_TYPE = hasSymbol ? Symbol['for']('react.element') : 0xeac7;\n    function Fragment(props) {\n        return props.children;\n    }\n\n    function extend(obj, props) {\n        for (var i in props) {\n            if (hasOwnProperty.call(props, i)) {\n                obj[i] = props[i];\n            }\n        }\n        return obj;\n    }\n\n    var __type = Object.prototype.toString;\n    function noop() {}\n\n    var rword = /[^, ]+/g;\n    function oneObject(array, val) {\n        if (array + '' === array) {\n            array = array.match(rword) || [];\n        }\n        var result = {},\n            value = val !== void 666 ? val : 1;\n        for (var i = 0, n = array.length; i < n; i++) {\n            result[array[i]] = value;\n        }\n        return result;\n    }\n\n    var options = oneObject(['beforeProps', 'afterCreate', 'beforeInsert', 'beforeDelete', 'beforeUpdate', 'afterUpdate', 'beforePatch', 'afterPatch', 'beforeUnmount', 'afterMount'], noop);\n    var numberMap = {\n        '[object Boolean]': 2,\n        '[object Number]': 3,\n        '[object String]': 4,\n        '[object Function]': 5,\n        '[object Symbol]': 6,\n        '[object Array]': 7\n    };\n    function typeNumber(data) {\n        if (data === null) {\n            return 1;\n        }\n        if (data === void 666) {\n            return 0;\n        }\n        var a = numberMap[__type.call(data)];\n        return a || 8;\n    }\n\n    function getDOMNode() {\n        return this;\n    }\n    var pendingRefs = [];\n    var Refs = {\n        mountOrder: 1,\n        currentOwner: null,\n        controlledCbs: [],\n        fireRef: function fireRef(fiber, dom, vnode) {\n            if (fiber._disposed || fiber._isStateless) {\n                dom = null;\n            }\n            var ref = vnode.ref;\n            if (typeof ref === 'function') {\n                return ref(dom);\n            }\n            if (ref && Object.prototype.hasOwnProperty.call(ref, 'current')) {\n                ref.current = dom;\n                return;\n            }\n            if (!ref) {\n                return;\n            }\n            var owner = vnode._owner;\n            if (!owner) {\n                throw 'Element ref was specified as a string (' + ref + ') but no owner was set';\n            }\n            if (dom) {\n                if (dom.nodeType) {\n                    dom.getDOMNode = getDOMNode;\n                }\n                owner.refs[ref] = dom;\n            } else {\n                delete owner.refs[ref];\n            }\n        }\n    };\n\n    function Vnode(type, tag, props, key, ref) {\n        this.type = type;\n        this.tag = tag;\n        if (tag !== 6) {\n            this.props = props;\n            this._owner = Refs.currentOwner;\n            if (key) {\n                this.key = key;\n            }\n            var refType = typeNumber(ref);\n            if (refType === 3 || refType === 4 || refType === 5 || refType === 8) {\n                this._hasRef = true;\n                this.ref = ref;\n            }\n        }\n        options.afterCreate(this);\n    }\n    Vnode.prototype = {\n        getDOMNode: function getDOMNode() {\n            return this.stateNode || null;\n        },\n        $$typeof: REACT_ELEMENT_TYPE\n    };\n\n    function createVText(type, text) {\n        var vnode = new Vnode(type, 6);\n        vnode.text = text;\n        return vnode;\n    }\n\n    var lastText = void 0;\n    var flattenIndex = void 0;\n    var flattenObject = void 0;\n    function flattenCb(child, key) {\n        var childType = typeNumber(child);\n        if (childType < 3) {\n            lastText = null;\n            return;\n        } else if (childType < 5) {\n            if (lastText) {\n                lastText.text += child;\n                return;\n            }\n            lastText = child = createVText('#text', child + '');\n        } else {\n            lastText = null;\n        }\n        if (!flattenObject['.' + key]) {\n            flattenObject['.' + key] = child;\n        } else {\n            key = '.' + flattenIndex;\n            flattenObject[key] = child;\n        }\n        child.index = flattenIndex++;\n    }\n    function fiberizeChildren(c, fiber) {\n        flattenObject = {};\n        flattenIndex = 0;\n        if (c !== void 666) {\n            lastText = null;\n            operateChildren(c, '', flattenCb, isIterable(c), true);\n        }\n        flattenIndex = 0;\n        return fiber._children = flattenObject;\n    }\n    function computeName(el, i, prefix, isTop) {\n        var k = i + '';\n        if (el) {\n            if (el.type == Fragment) {\n                k = el.key ? '' : k;\n            } else {\n                k = el.key ? '$' + el.key : k;\n            }\n        }\n        if (!isTop && prefix) {\n            return prefix + ':' + k;\n        }\n        return k;\n    }\n    function isIterable(el) {\n        if (el instanceof Object) {\n            if (el.forEach) {\n                return 1;\n            }\n            if (el.type === Fragment) {\n                return 2;\n            }\n            var t = getIteractor(el);\n            if (t) {\n                return t;\n            }\n        }\n        return 0;\n    }\n    function operateChildren(children, prefix, callback, iterableType, isTop) {\n        var key = void 0,\n            el = void 0,\n            t = void 0,\n            iterator = void 0;\n        switch (iterableType) {\n            case 0:\n                if (Object(children) === children && !children.call && !children.type) {\n                    throw 'children中存在非法的对象';\n                }\n                key = prefix || (children && children.key ? '$' + children.key : '0');\n                callback(children, key);\n                break;\n            case 1:\n                children.forEach(function (el, i) {\n                    operateChildren(el, computeName(el, i, prefix, isTop), callback, isIterable(el), false);\n                });\n                break;\n            case 2:\n                key = children && children.key ? '$' + children.key : '';\n                key = isTop ? key : prefix ? prefix + ':0' : key || '0';\n                el = children.props.children;\n                t = isIterable(el);\n                if (!t) {\n                    el = [el];\n                    t = 1;\n                }\n                operateChildren(el, key, callback, t, false);\n                break;\n            default:\n                iterator = iterableType.call(children);\n                var ii = 0,\n                    step;\n                while (!(step = iterator.next()).done) {\n                    el = step.value;\n                    operateChildren(el, computeName(el, ii, prefix, isTop), callback, isIterable(el), false);\n                    ii++;\n                }\n                break;\n        }\n    }\n    var REAL_SYMBOL = hasSymbol && Symbol.iterator;\n    var FAKE_SYMBOL = '@@iterator';\n    function getIteractor(a) {\n        var iteratorFn = REAL_SYMBOL && a[REAL_SYMBOL] || a[FAKE_SYMBOL];\n        if (iteratorFn && iteratorFn.call) {\n            return iteratorFn;\n        }\n    }\n\n    function DOMElement(type) {\n        this.nodeName = type;\n        this.style = {};\n        this.children = [];\n    }\n\n    var fn = DOMElement.prototype = {\n        contains: Boolean\n    };\n    String('replaceChild,appendChild,removeAttributeNS,setAttributeNS,removeAttribute,setAttribute' + ',getAttribute,insertBefore,removeChild,addEventListener,removeEventListener,attachEvent' + ',detachEvent').replace(/\\w+/g, function (name) {\n        fn[name] = function () {\n            console.log('fire ' + name);\n        };\n    });\n    var fakeDoc = new DOMElement();\n    fakeDoc.createElement = fakeDoc.createElementNS = fakeDoc.createDocumentFragment = function (type) {\n        return new DOMElement(type);\n    };\n    fakeDoc.createTextNode = fakeDoc.createComment = Boolean;\n    fakeDoc.documentElement = new DOMElement('html');\n    fakeDoc.body = new DOMElement('body');\n    fakeDoc.nodeName = '#document';\n    fakeDoc.textContent = '';\n    try {\n        var w = window;\n        var b = !!w.alert;\n    } catch (e) {\n        b = false;\n        w = {\n            document: fakeDoc\n        };\n    }\n\n    var win = w;\n    var document = w.document || fakeDoc;\n\n    var fragment = document.createDocumentFragment();\n\n    var versions = {\n        88: 7,\n        80: 6,\n        '00': NaN,\n        '08': NaN\n    };\n    var msie = document.documentMode || versions[typeNumber(document.all) + '' + typeNumber(win.XMLHttpRequest)];\n    var modern = /NaN|undefined/.test(msie) || msie > 8;\n\n    function getMaskedContext(curContext, contextTypes) {\n        var context = {};\n        if (!contextTypes || !curContext) {\n            return context;\n        }\n        for (var key in contextTypes) {\n            if (contextTypes.hasOwnProperty(key)) {\n                context[key] = curContext[key];\n            }\n        }\n        return context;\n    }\n    function getUnmaskedContext(instance, parentContext) {\n        var context = instance.getChildContext();\n        if (context) {\n            parentContext = extend(extend({}, parentContext), context);\n        }\n        return parentContext;\n    }\n    function getContextProvider(fiber) {\n        do {\n            var c = fiber._unmaskedContext;\n            if (c) {\n                return c;\n            }\n        } while (fiber = fiber.return);\n    }\n\n    var matchHtmlRegExp = /[\"'&<>]/;\n    function escapeHtml(string) {\n        var str = '' + string;\n        var match = matchHtmlRegExp.exec(str);\n        if (!match) {\n            return str;\n        }\n        var escape;\n        var html = '';\n        var index = 0;\n        var lastIndex = 0;\n        for (index = match.index; index < str.length; index++) {\n            switch (str.charCodeAt(index)) {\n                case 34:\n                    escape = '&quot;';\n                    break;\n                case 38:\n                    escape = '&amp;';\n                    break;\n                case 39:\n                    escape = '&#x27;';\n                    break;\n                case 60:\n                    escape = '&lt;';\n                    break;\n                case 62:\n                    escape = '&gt;';\n                    break;\n                default:\n                    continue;\n            }\n            if (lastIndex !== index) {\n                html += str.substring(lastIndex, index);\n            }\n            lastIndex = index + 1;\n            html += escape;\n        }\n        return lastIndex !== index ? html + str.substring(lastIndex, index) : html;\n    }\n    function encodeEntities(text) {\n        if (typeof text === 'boolean' || typeof text === 'number') {\n            return '' + text;\n        }\n        return escapeHtml(text);\n    }\n\n    var rnumber = /^-?\\d+(\\.\\d+)?$/;\n\n    var cssNumber = oneObject('animationIterationCount,columnCount,order,flex,flexGrow,flexShrink,fillOpacity,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom');\n    var cssMap = oneObject('float', 'cssFloat');\n\n    var _typeof = typeof Symbol === 'function' && _typeof2(Symbol.iterator) === 'symbol' ? function (obj) {\n        return typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);\n    } : function (obj) {\n        return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);\n    };\n    var skipAttributes = {\n        ref: 1,\n        key: 1,\n        children: 1,\n        dangerouslySetInnerHTML: 1,\n        innerHTML: 1\n    };\n    var cssCached = {\n        styleFloat: 'float',\n        cssFloat: 'float'\n    };\n    var rXlink = /^xlink:?(.+)/;\n    function cssName$$1(name) {\n        if (cssCached[name]) {\n            return cssCached[name];\n        }\n        return cssCached[name] = name.replace(/([A-Z])/g, '-$1').toLowerCase();\n    }\n    function stringifyClassName(obj) {\n        var arr = [];\n        for (var i in obj) {\n            if (obj[i]) {\n                arr.push(i);\n            }\n        }\n        return arr.join(' ');\n    }\n    var attrCached = {};\n    function encodeAttributes(value) {\n        if (attrCached[value]) {\n            return attrCached[value];\n        }\n        return attrCached[value] = '\"' + encodeEntities(value) + '\"';\n    }\n    function skipFalseAndFunction(a) {\n        return a !== false && Object(a) !== a;\n    }\n    function stringifyStyleObject(obj) {\n        var arr = [];\n        for (var i in obj) {\n            var val = obj[i];\n            if (obj != null) {\n                var unit = '';\n                if (rnumber.test(val) && !cssNumber[i]) {\n                    unit = 'px';\n                }\n                arr.push(cssName$$1(i) + ': ' + val + unit);\n            }\n        }\n        return arr.join('; ');\n    }\n    var forElement = {\n        select: 1,\n        input: 1,\n        textarea: 1\n    };\n    function stringifyAttributes(props, type) {\n        var attrs = [];\n        for (var _name in props) {\n            var v = props[_name];\n            if (skipAttributes[_name]) {\n                continue;\n            }\n            var checkType = false;\n            if (_name === 'className' || _name === 'class') {\n                _name = 'class';\n                if (v && (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object') {\n                    v = stringifyClassName(v);\n                    checkType = true;\n                }\n            } else if (_name === 'style') {\n                if (Object(v) == v) {\n                    v = stringifyStyleObject(v);\n                    checkType = true;\n                } else {\n                    continue;\n                }\n            } else if (_name === 'defaultValue') {\n                if (forElement[type]) {\n                    _name = 'value';\n                }\n            } else if (_name === 'defaultChecked') {\n                if (forElement[type]) {\n                    _name = 'checked';\n                    v = '';\n                    checkType = true;\n                }\n            } else if (_name.match(rXlink)) {\n                _name = _name.toLowerCase().replace(rXlink, 'xlink:$1');\n            }\n            if (checkType || skipFalseAndFunction(v)) {\n                attrs.push(_name + '=' + encodeAttributes(v + ''));\n            }\n        }\n        return attrs.length ? ' ' + attrs.join(' ') : '';\n    }\n    var regeneratorRuntime = {\n        mark: function mark() {}\n    };\n    var _marked = babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(renderVNodeGen);\n    function renderVNode(vnode, context) {\n        var _vnode = vnode,\n            tag = _vnode.tag,\n            type = _vnode.type,\n            props = _vnode.props;\n        switch (type) {\n            case '#text':\n                return encodeEntities(vnode.text);\n            case '#comment':\n                return '<!--' + vnode.text + '-->';\n            default:\n                var innerHTML$$1 = props && props.dangerouslySetInnerHTML;\n                innerHTML$$1 = innerHTML$$1 && innerHTML$$1.__html;\n                if (tag === 5) {\n                    if (type === 'option') {\n                        for (var p = vnode.return; p && p.type !== 'select'; p = p.return) {}\n                        if (p && p.valuesSet) {\n                            var curValue = getOptionValue(vnode);\n                            if (p.valuesSet['&' + curValue]) {\n                                props = Object.assign({ selected: '' }, props);\n                            }\n                        }\n                    } else if (type === 'select') {\n                        var selectValue = vnode.props.value || vnode.props.defaultValue;\n                        if (selectValue != null) {\n                            var values = [].concat(selectValue),\n                                valuesSet = {};\n                            values.forEach(function (el) {\n                                valuesSet['&' + el] = true;\n                            });\n                            vnode.valuesSet = valuesSet;\n                        }\n                    }\n                    var str = '<' + type + stringifyAttributes(props, type);\n                    if (voidTags[type]) {\n                        return str + '/>\\n';\n                    }\n                    str += '>';\n                    if (innerHTML$$1) {\n\n                        str += innerHTML$$1;\n                    } else {\n                        var cstr = '';\n                        var fakeUpdater = {\n                            _reactInternalFiber: vnode\n                        };\n                        var children = fiberizeChildren(props.children, fakeUpdater);\n                        for (var i in children) {\n                            var child = children[i];\n                            child.return = vnode;\n                            cstr += renderVNode(child, context);\n                        }\n                        vnode.updater = fakeUpdater;\n                    }\n                    if (vnode.type === 'textarea' && !cstr) {\n                        str += vnode.props.value || vnode.props.defaultValue || '';\n                    } else {\n                        str += cstr;\n                    }\n                    return str + '</' + type + '>\\n';\n                } else if (tag < 3) {\n                    var data = {\n                        context: context\n                    };\n                    vnode = toVnode(vnode, data);\n                    context = data.context;\n                    return renderVNode(vnode, context);\n                } else if (Array.isArray(vnode)) {\n                    var multiChild = '';\n                    vnode.forEach(function (el) {\n                        multiChild += renderVNode(el, context);\n                    });\n                    return multiChild;\n                } else {\n                    throw '数据不合法';\n                }\n        }\n    }\n    function renderVNodeGen(vnode, context) {\n        var _vnode2, tag, type, props, innerHTML$$1, p, curValue, selectValue, values, valuesSet, str, fakeUpdater, children, i, child, data, multiChild;\n        return babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function renderVNodeGen$(_context) {\n            while (1) {\n                switch (_context.prev = _context.next) {\n                    case 0:\n                        _vnode2 = vnode, tag = _vnode2.tag, type = _vnode2.type, props = _vnode2.props;\n                        _context.t0 = type;\n                        _context.next = _context.t0 === '#text' ? 4 : _context.t0 === '#comment' ? 7 : 10;\n                        break;\n                    case 4:\n                        _context.next = 6;\n                        return encodeEntities(vnode.text);\n                    case 6:\n                        return _context.abrupt('break', 40);\n                    case 7:\n                        _context.next = 9;\n                        return '<!--' + vnode.text + '-->';\n                    case 9:\n                        return _context.abrupt('break', 40);\n                    case 10:\n                        innerHTML$$1 = props && props.dangerouslySetInnerHTML;\n                        innerHTML$$1 = innerHTML$$1 && innerHTML$$1.__html;\n                        if (!(tag === 5)) {\n                            _context.next = 24;\n                            break;\n                        }\n                        if (type === 'option') {\n                            for (p = vnode.return; p && p.type !== 'select'; p = p.return) {}\n                            if (p && p.valuesSet) {\n                                curValue = getOptionValue(vnode);\n                                if (p.valuesSet['&' + curValue]) {\n                                    props = Object.assign({ selected: '' }, props);\n                                }\n                            }\n                        } else if (type === 'select') {\n                            selectValue = vnode.props.value || vnode.props.defaultValue;\n                            if (selectValue != null) {\n                                values = [].concat(selectValue), valuesSet = {};\n                                values.forEach(function (el) {\n                                    valuesSet['&' + el] = true;\n                                });\n                                vnode.valuesSet = valuesSet;\n                            }\n                        }\n                        str = '<' + type + stringifyAttributes(props, type);\n                        if (!voidTags[type]) {\n                            _context.next = 18;\n                            break;\n                        }\n                        _context.next = 18;\n                        return str + '/>\\n';\n                    case 18:\n                        str += '>';\n                        if (innerHTML$$1) {\n                            str += innerHTML$$1;\n                        } else {\n                            fakeUpdater = {\n                                vnode: vnode\n                            };\n                            children = fiberizeChildren(props.children, fakeUpdater);\n                            for (i in children) {\n                                child = children[i];\n                                child.return = vnode;\n                                str += renderVNode(child, context);\n                            }\n                            vnode.updater = fakeUpdater;\n                        }\n                        _context.next = 22;\n                        return str + '</' + type + '>\\n';\n                    case 22:\n                        _context.next = 40;\n                        break;\n                    case 24:\n                        if (!(tag < 3)) {\n                            _context.next = 32;\n                            break;\n                        }\n                        data = {\n                            context: context\n                        };\n                        vnode = toVnode(vnode, data);\n                        context = data.context;\n                        _context.next = 30;\n                        return renderVNode(vnode, context);\n                    case 30:\n                        _context.next = 40;\n                        break;\n                    case 32:\n                        if (!Array.isArray(vnode)) {\n                            _context.next = 39;\n                            break;\n                        }\n                        multiChild = '';\n                        vnode.forEach(function (el) {\n                            multiChild += renderVNode(el, context);\n                        });\n                        _context.next = 37;\n                        return multiChild;\n                    case 37:\n                        _context.next = 40;\n                        break;\n                    case 39:\n                        throw '数据不合法';\n                    case 40:\n                    case 'end':\n                        return _context.stop();\n                }\n            }\n        }, _marked, this);\n    }\n    function getOptionValue(option) {\n        if ('value' in option.props) {\n            return option.props.value;\n        } else {\n            var a = option.props.children;\n            if (a + '' === 'a') {\n                return a;\n            } else {\n                return a.text;\n            }\n        }\n    }\n    var voidTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];\n    function toVnode(vnode, data) {\n        var parentContext = data.context,\n            Type = vnode.type,\n            instance,\n            rendered;\n        if (vnode.tag < 3) {\n            var props = vnode.props;\n            var instanceContext = getMaskedContext(parentContext, Type.contextTypes);\n            if (vnode.tag === 1) {\n                rendered = Type(props, instanceContext);\n                if (rendered && rendered.render) {\n                    rendered = rendered.render();\n                }\n                instance = {};\n            } else {\n                instance = new Type(props, instanceContext);\n                instance.props = instance.props || props;\n                instance.context = instance.context || instanceContext;\n                if (instance.componentWillMount) {\n                    try {\n                        instance.componentWillMount();\n                    } catch (e) {}\n                }\n                rendered = instance.render();\n            }\n            rendered = fixVnode(rendered);\n            if (instance.componentWillMount) {\n                instance.componentWillMount();\n            }\n            if (instance.getChildContext) {\n                data.context = getUnmaskedContext(instance, parentContext);\n            }\n            if (Array.isArray(rendered)) {\n                return rendered.map(function (el) {\n                    return toVnode(el, data, instance);\n                });\n            } else {\n                return toVnode(rendered, data, instance);\n            }\n        } else {\n            return vnode;\n        }\n    }\n    function fixVnode(vnode) {\n        var number = typeNumber(vnode);\n        if (number < 3) {\n            return {\n                tag: 6,\n                text: '',\n                type: '#text'\n            };\n        } else if (number < 5) {\n            return {\n                tag: 6,\n                text: vnode + '',\n                type: '#text'\n            };\n        } else {\n            return vnode;\n        }\n    }\n    function renderToString(vnode, context) {\n        return renderVNode(fixVnode(vnode), context || {});\n    }\n    function renderToNodeStream(vnode, context) {\n        var rs = new stream.Readable();\n        var it = renderVNodeGen(vnode, context || {});\n        rs._read = function () {\n            var v = it.next();\n            if (!v.done) {\n                rs.push(v.value.toString());\n            } else {\n                rs.push(null);\n            }\n        };\n        return rs;\n    }\n    var index = {\n        renderToString: renderToString,\n        renderToStaticMarkup: renderToString,\n        renderToNodeStream: renderToNodeStream,\n        renderToStaticNodeStream: renderToNodeStream\n    };\n\n    return index;\n});\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack:///./dist/React/server.js?");

/***/ }),

/***/ 0:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* (ignored) */\n\n//# sourceURL=webpack:///util_(ignored)?");

/***/ }),

/***/ 1:
/*!**********************!*\
  !*** util (ignored) ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/* (ignored) */\n\n//# sourceURL=webpack:///util_(ignored)?");

/***/ })

/******/ });
});