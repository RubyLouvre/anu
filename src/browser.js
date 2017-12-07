import { typeNumber } from "./util";

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

var recyclables = {
    "#text": []
};

export function removeElement(node) {
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

export function createElement(vnode, vparent) {
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
    } else if (!ns || check.type.toLowerCase() === "foreignobject") {
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

export function insertElement(vnode, insertQueue) {
    if(vnode._disposed) {
        return;
    }
    //找到可用的父节点
    var p = vnode.return, parentNode;
    while (p) {
        if (p.vtype === 1) {
            parentNode = p.stateNode;
            break;
        }
        p = p.return;
    }
    
    var dom = vnode.stateNode, insertPoint = insertQueue[0];
    if (!insertPoint) {
        //如果没有插入点，则插入到当前父节点的第一个节点之前
        if(parentNode.firstChild === dom){
            return;
        }
        parentNode.insertBefore(dom, parentNode.firstChild);
    } else {
        if(insertPoint.nextSibling === dom){
            return;
        }
        parentNode.insertBefore(dom, insertPoint.nextSibling); 
    }
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
