import { typeNumber, getWindow, toWarnDev } from "react-core/util";
//用于后端的元素节点
export function DOMElement(type) {
    this.nodeName = type;
    this.style = {};
    this.children = [];
}

export const NAMESPACE = {
    svg: "http://www.w3.org/2000/svg",
    xmlns: "http://www.w3.org/2000/xmlns/",
    xlink: "http://www.w3.org/1999/xlink",
    math: "http://www.w3.org/1998/Math/MathML"
};

let fn = (DOMElement.prototype = {
    contains: Boolean
});
String(
    "replaceChild,appendChild,removeAttributeNS,setAttributeNS,removeAttribute,setAttribute" +
		",getAttribute,insertBefore,removeChild,addEventListener,removeEventListener,attachEvent" +
		",detachEvent"
).replace(/\w+/g, function(name) {
    fn[name] = function() {
		toWarnDev('need implement ' + name); // eslint-disable-line
    };
});

//用于后端的document
export let fakeDoc = new DOMElement();
fakeDoc.createElement = fakeDoc.createElementNS = fakeDoc.createDocumentFragment = function(type) {
    return new DOMElement(type);
};
fakeDoc.createTextNode = fakeDoc.createComment = Boolean;
fakeDoc.documentElement = new DOMElement("html");
fakeDoc.body = new DOMElement("body");
fakeDoc.nodeName = "#document";
fakeDoc.textContent = "";

var win = getWindow();
export var inBrowser = !!win.alert;

if (!inBrowser) {
    win.document = fakeDoc;
}

export let document = win.document;

export let duplexMap = {
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


const versions = {
    88: 7, //IE7-8 objectobject
    80: 6, //IE6 objectundefined
    "00": NaN, // other modern browsers
    "08": NaN
};
/* istanbul ignore next  */
export let msie = document.documentMode || versions[typeNumber(document.all) + "" + typeNumber(win.XMLHttpRequest)];

export let modern = /NaN|undefined/.test(msie) || msie > 8;

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
