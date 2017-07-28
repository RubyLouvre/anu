import { oneObject, recyclables, toLowerCase, typeNumber } from "./util";

//用于后端的元素节点
export function DOMElement(type) {
  this.nodeName = type;
  this.style = {};
  this.children = [];
}
var fn = (DOMElement.prototype = {
  contains: Boolean
});
String(
  "replaceChild,appendChild,removeAttributeNS,setAttributeNS,removeAttribute,setAttribute" +
    ",getAttribute,insertBefore,removeChild,addEventListener,removeEventListener,attachEvent" +
    ",detachEvent"
).replace(/\w+/g, function(name) {
  fn[name] = function() {
    console.log("fire " + name);
  };
});

//用于后端的document
export var fakeDoc = new DOMElement();
fakeDoc.createElement = fakeDoc.createElementNS = fakeDoc.createDocumentFragment = function(
  type
) {
  return new DOMElement(type);
};
fakeDoc.createTextNode = fakeDoc.createComment = Boolean;
fakeDoc.documentElement = new DOMElement("html");
fakeDoc.nodeName = "#document";
fakeDoc.textContent = "";
try {
  var w = window;
  var b = !!w.alert;
} catch (e) {
  b = false;
  w = {
    document: fakeDoc
  };
}

export var inBrowser = b;
export var win = w;

export var document = w.document || fakeDoc;
var isStandard = "textContent" in document;
var fragment = document.createDocumentFragment();
function emptyElement(node) {
  var child;
  while ((child = node.firstChild)) {
    if (child.nodeType === 1) {
      emptyElement(child);
    }
    node.removeChild(child);
  }
}

export function removeDOMElement(node) {
  if (node.nodeType === 1) {
    if (isStandard) {
      node.textContent = "";
    } else {
      emptyElement(node);
    }
    node.__events = null;
  } else if (node.nodeType === 3) {
    //只回收文本节点
    recyclables["#text"].push(node);
  }
  fragment.appendChild(node);
  fragment.removeChild(node);
}

var versions = {
  88: 7, //IE7-8 objectobject
  80: 6, //IE6 objectundefined
  "00": NaN, // other modern browsers
  "08": NaN
};
/* istanbul ignore next  */
export var msie =
  document.documentMode ||
  versions[typeNumber(document.all) + "" + typeNumber(XMLHttpRequest)];

export var modern = /NaN|undefined/.test(msie) || msie > 8;

export function createDOMElement(vnode) {
  var type = vnode.type;
  if (type === "#text") {
    //只重复利用文本节点
    var node = recyclables[type].pop();
    if (node) {
      node.nodeValue = vnode.text;
      return node;
    }
    return document.createTextNode(vnode.text);
  }

  if (type === "#comment") {
    return document.createComment(vnode.text);
  }

  try {
    if (vnode.ns) {
      return document.createElementNS(vnode.ns, type);
    }
    //eslint-disable-next-line
  } catch (e) {}
  return document.createElement(type);
}
// https://developer.mozilla.org/en-US/docs/Web/MathML/Element/math
// http://demo.yanue.net/HTML5element/
var mhtml = {
  meter: 1,
  menu: 1,
  map: 1,
  meta: 1,
  mark: 1
};
var svgTags = oneObject(
  "" +
    // structure
    "svg,g,defs,desc,metadata,symbol,use," +
    // image & shape
    "image,path,rect,circle,line,ellipse,polyline,polygon," +
    // text
    "text,tspan,tref,textpath," +
    // other
    "marker,pattern,clippath,mask,filter,cursor,view,animate," +
    // font
    "font,font-face,glyph,missing-glyph",
  svgNs
);

var rmathTags = /^m/;
var mathNs = "http://www.w3.org/1998/Math/MathML";
var svgNs = "http://www.w3.org/2000/svg";
var mathTags = {
  semantics: mathNs
};

export function getNs(type) {
  if (svgTags[type]) {
    return svgNs;
  } else if (mathTags[type]) {
    return mathNs;
  } else {
    if (!mhtml[type] && rmathTags.test(type)) {
      //eslint-disable-next-line
      return (mathTags[type] = mathNs);
    }
  }
}
