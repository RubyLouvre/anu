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
        if(child === Refs.focusNode){
            Refs.focusNode = false;
        }
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
    if(node === Refs.focusNode){
        Refs.focusNode = false;
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
                if (p.tag === 5) {
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
    var elem = document.createElement(type);
    var inputType = vnode.props && vnode.props.type;//IE6-8下立即设置type属性
    if(inputType){
        elem.type = inputType;
    }
    return elem;
}
export function contains(a, b) {
    if (b) {
        while ((b = b.parentNode)) {
            if (b === a) {
                return true;
            }
        }
    }
    return false;
}
export function insertElement(fiber, insertPoint) {
    if (fiber._disposed) {
        return;
    }
    //找到可用的父节点
    console.log(fiber);
    var p = fiber.return,
        parentNode;
    while (p) {
        if (p.tag === 5) {
            parentNode = p.stateNode;
            break;
        }
        p = p.portalReturn || p.return;
    }

    var dom = fiber.stateNode;
    console.log(dom);
    var after = insertPoint ? insertPoint.nextSibling: parentNode.firstChild;

    if (after === dom) {
        return;
    }
    if(after === null && dom === parentNode.lastChild){
        return;
    }
    if(after && !contains(parentNode,after)){
        return;
    }
    var isElement = fiber.tag === 5;
    var prevFocus = isElement && document.activeElement;
    parentNode.insertBefore(dom, after);
    if(isElement &&  prevFocus !== document.activeElement && contains(document.body, prevFocus)){
        try{
            Refs.focusNode = prevFocus;
            prevFocus.__inner__ = true;
            prevFocus.focus();
        }catch(e){
            prevFocus.__inner__ = false;
        }
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
