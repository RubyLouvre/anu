import { typeNumber, getWindow, noop } from 'react-core/util';
//用于后端的元素节点
export function DOMElement(type) {
    this.nodeName = type;
    this.style = {};
    this.children = [];
}

export const NAMESPACE = {
    svg: 'http://www.w3.org/2000/svg',
    xmlns: 'http://www.w3.org/2000/xmlns/',
    xlink: 'http://www.w3.org/1999/xlink',
    xhtml: 'http://www.w3.org/1999/xhtml',
    math: 'http://www.w3.org/1998/Math/MathML'
};

let fn = (DOMElement.prototype = {
    contains: Boolean
});

String(
    'replaceChild,appendChild,removeAttributeNS,setAttributeNS,removeAttribute,setAttribute' +
        ',getAttribute,insertBefore,removeChild,addEventListener,removeEventListener,attachEvent' +
        ',detachEvent'
).replace(/\w+/g, function(name) {
    fn[name] = noop;
});

//用于后端的document
export let fakeDoc = new DOMElement();
fakeDoc.createElement = fakeDoc.createElementNS = fakeDoc.createDocumentFragment = function(
    type
) {
    return new DOMElement(type);
};
fakeDoc.createTextNode = fakeDoc.createComment = Boolean;
fakeDoc.documentElement = new DOMElement('html');
fakeDoc.body = new DOMElement('body');
fakeDoc.nodeName = '#document';
fakeDoc.textContent = '';

let win = getWindow();
export let inBrowser = !!win.alert;

if (!inBrowser) {
    win.document = fakeDoc;
}

export let document = win.document;

const versions = {
    88: 7, //IE7-8 objectobject
    80: 6, //IE6 objectundefined
    '00': NaN, // other modern browsers
    '08': NaN
};
/* istanbul ignore next  */
export let msie =
    document.documentMode ||
    versions[typeNumber(document.all) + '' + typeNumber(win.XMLHttpRequest)];

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
