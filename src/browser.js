 import {
     oneObject
 } from './util'
 export var win = typeof window === 'object' ? window : typeof global === 'object' ? global : {};

 export var inBrowser = !!win.location && win.navigator
 /* istanbul ignore if  */
 function DOMElement() {
     this.outerHTML = 'x'
     this.style = {}
     this.children = []
 }
 var fn = DOMElement.prototype = {
     contains: Boolean
 }
 String('replaceChild,appendChild,removeAttributeNs,setAttributeNs,removeAttribute,setAttribute,insertBefore,removeChild,addEventListener,removeEventListener,attachEvent,detachEvent').replace(/\w+/g, function (name) {
     fn[name] = function () {
         console.log('fire ' + name)
     }
 })


 export var document = inBrowser ? win.document : (function () {
     //document是DOMElement的实例，加上专有的方法与属性
     var d = new DOMElement
     d.createElement = d.createElementNS = function () {
         return new DOMElement
     }
     d.createTextNode = d.createComment = Boolean
     d.documentElement = new DOMElement
     return d
 })()

 export var root = document.documentElement

 var versions = {
     objectobject: 7, //IE7-8
     objectundefined: 6, //IE6
     undefinedfunction: NaN, // other modern browsers
     undefinedobject: NaN
 };
 /* istanbul ignore next  */
 export var msie = document.documentMode || versions[typeof document.all + typeof XMLHttpRequest];

 export var modern = /NaN|undefined/.test(msie) || msie > 8

 export function createDOMElement(vnode) {
     try {
         if (vnode.ns) {
             return document.createElementNS(vnode.type, vnode.ns)
         }
     } catch (e) {}
     return document.createElement(vnode.type)
 }
 //https://developer.mozilla.org/en-US/docs/Web/MathML/Element/math
 //http://demo.yanue.net/HTML5element/
 var mhtml = {
     meter: 1,
     menu: 1,
     map: 1,
     meta: 1,
     mark: 1
 }
 var svgTags = oneObject('circle,defs,ellipse,image,line,' + 'path,polygon,polyline,rect,symbol,text,use,g,svg', svgNs);
 var mathTags = {
     semantics: mathNs
 }
 var rmathTags = /^m/
 var mathNs = 'http://www.w3.org/1998/Math/MathML'
 var svgNs = 'http://www.w3.org/2000/svg'
 export function getNs(type) {
     if (svgTags[type]) {
         return svgNs
     } else if (mathTags[type]) {
         return mathNs
     } else {
         if (!mhtml[type] && rmathTags.test(type)) {
             return mathTags[type] = mathNs
         }
     }
 }