import { typeNumber } from "./util";
import { Refs } from "./Refs";
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
    math: "http://www.w3.org/1998/Math/MathML"
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
fakeDoc.createElement = fakeDoc.createElementNS = fakeDoc.createDocumentFragment = function(type) {
    return new DOMElement(type);
};
fakeDoc.createTextNode = fakeDoc.createComment = Boolean;
fakeDoc.documentElement = new DOMElement("html");
fakeDoc.body = new DOMElement("body");
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

export var duplexMap = {
    color: 1,
    date: 1,
    datetime: 1,
    "datetime-local": 1,
    email: 1,
    month: 1,
    number: 1,
    password: 1,
    range: 1,
    search: 1,
    tel: 1,
    text: 1,
    time: 1,
    url: 1,
    week: 1,
    textarea: 1,
    checkbox: 2,
    radio: 2,
    "select-one": 3,
    "select-multiple": 3
};
var isStandard = "textContent" in document;
var fragment = document.createDocumentFragment();
export function emptyElement(node) {
    var child;
    while ((child = node.firstChild)) {
        emptyElement(child);
        node.removeChild(child);
    }
}

var recyclables = {
    "#text": []
};
export function removeElement(node) {
    if (!node) {
        return;
    }
    Refs.nodeOperate = true;
    if (node.nodeType === 1) {
        if (isStandard) {
            node.textContent = "";
        } else {
            emptyElement(node);
        }
        node.__events = null;
    } else if (node.nodeType === 3) {
        //只回收文本节点
        if (recyclables["#text"].length < 100) {
            recyclables["#text"].push(node);
        }
    }
    fragment.appendChild(node);
    fragment.removeChild(node);
    Refs.nodeOperate = false;
}

var versions = {
    88: 7, //IE7-8 objectobject
    80: 6, //IE6 objectundefined
    "00": NaN, // other modern browsers
    "08": NaN
};
/* istanbul ignore next  */
export var msie = document.documentMode || versions[typeNumber(document.all) + "" + typeNumber(win.XMLHttpRequest)];

export var modern = /NaN|undefined/.test(msie) || msie > 8;

export function createElement(vnode, p) {
    var type = vnode.type,
        ns;
    switch (type) {
    case "#text":
        //只重复利用文本节点
        var node = recyclables[type].pop();
        if (node) {
            node.nodeValue = vnode.text;
            return node;
        }
        return document.createTextNode(vnode.text);
    case "#comment":
        return document.createComment(vnode.text);
    case "svg":
        ns = NAMESPACE.svg;
        break;
    case "math":
        ns = NAMESPACE.math;
        break;
    case "div":
    case "span":
    case "p":
    case "tr":
    case "td":
    case "li":
        ns = "";
        break;
    default:
        ns = vnode.namespaceURI;
        if (!ns) {
            do {
                if (p.vtype === 1) {
                    ns = p.namespaceURI;
                    if (p.type === "foreignObject") {
                        ns = "";
                    }
                    break;
                }
            } while ((p = p.return));
        }
        break;
    }
    try {
        if (ns) {
            vnode.namespaceURI = ns;
            return document.createElementNS(ns, type);
        }
        //eslint-disable-next-line
    } catch (e) {}
    return document.createElement(type);
}

export function insertElement(vnode, insertPoint) {
    if (vnode._disposed) {
        return;
    }
    //找到可用的父节点
    var p = vnode.return,
        parentNode;
    while (p) {
        if (p.vtype === 1) {
            parentNode = p.stateNode;
            break;
        }
        p = p.superReturn || p.return;
    }

    var dom = vnode.stateNode,
        //如果没有插入点，则插入到当前父节点的第一个节点之前
        after = insertPoint ? insertPoint.nextSibling: parentNode.firstChild;
    if (after === dom) {
        return;
    }
    Refs.nodeOperate = true;
    parentNode.insertBefore(dom, after);
    Refs.nodeOperate = false;
}

export function getComponentNodes(children, resolve, debug) {
    var ret = [];
    for (var i in children) {
        var child = children[i];
        var inner = child.stateNode;
        if (child._disposed) {
            continue;
        }
        if (child.vtype < 2) {
            ret.push(inner);
        } else {
            var updater = inner.updater;
            if (child.child) {
                var args = getComponentNodes(updater.children, resolve, debug);
                ret.push.apply(ret, args);
            }
        }
    }
    return ret;
}
