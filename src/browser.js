import { recyclables, typeNumber } from "./util";

//用于后端的元素节点
export function DOMElement(type) {
    this.nodeName = type;
    this.style = {};
    this.children = [];
}

export var NAMESPACE = {
    svg: "http://www.w3.org/2000/svg",
    xmlns: "http://www.w3.org/2000/xmlns/",
    xlink: "http://www.w3.org/1999/xlink",
    math: "http://www.w3.org/1998/Math/MathML",
    xhtml: "http://www.w3.org/1999/xhtml",
    html: "https://www.w3.org/TR/html4/"
};

var fn = (DOMElement.prototype = {
    contains: Boolean
});
String(
    "replaceChild,appendChild,removeAttributeNS,setAttributeNS,removeAttribute,setAttribute" +
    ",getAttribute,insertBefore,removeChild,addEventListener,removeEventListener,attachEvent" +
    ",detachEvent"
).replace(/\w+/g, function(name) {
    fn[name] = function() {
    console.log("fire " + name); // eslint-disable-line
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
export function emptyElement(node) {
    var child;
    while ((child = node.firstChild)) {
        emptyElement(child);
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

export function createDOMElement(vnode, vparent) {
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

    var check = vparent || vnode;
    var ns = check.namespaceURI;
    if (type === "svg") {
        ns = NAMESPACE.svg;
    } else if (type === "math") {
        ns = NAMESPACE.math;
    } else if (
        check.type.toLowerCase() === "foreignobject" ||
    !ns ||
    ns === NAMESPACE.html ||
    ns === NAMESPACE.xhtml
    ) {
        return document.createElement(type);
    }
    try {
        vnode.namespaceURI = ns;
        return document.createElementNS(ns, type);
    //eslint-disable-next-line
  } catch (e) {
        return document.createElement(type);
    }
}
