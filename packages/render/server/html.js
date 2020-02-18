import { createMarkupForStyles } from './style';
import { encodeEntities } from './encode';

const STYLE = 'style';
const RESERVED_PROPS = {
    children: null,
    key: null,
    ref: null,
    dangerouslySetInnerHTML: null,
    innerHTML: null
};

function skipFalseAndFunction(a) {
    return a !== false && Object(a) !== a;
}
const rXlink = /^xlink:?(.+)/;
var attrCached = {};
function encodeAttributes(value) {
    if (attrCached[value]) {
        return attrCached[value];
    }
    return (attrCached[value] = '"' + encodeEntities(value) + '"');
}
function stringifyClassName(obj) {
    var arr = [];
    for (var i in obj) {
        if (obj[i]) {
            arr.push(i);
        }
    }
    return arr.join(' ');
}
export function createOpenTagMarkup(
    tagVerbatim,
    tagLowercase,
    props,
    namespace,
    makeStaticMarkup,
    isRootElement
) {
    let ret = '<' + tagVerbatim;

    for (let name in props) {
        if (!props.hasOwnProperty(name)) {
            continue;
        }
        if (RESERVED_PROPS[name]) {
            continue;
        }
        let v = props[name],
            checkType = false;

        if (name === 'class' || name === 'className') {
            name = 'class';
            if (v && typeof v === 'object') {
                v = stringifyClassName(v);
                checkType = true;
            }
        } else if (name === STYLE) {
            v = createMarkupForStyles(v);
            checkType = true;
        }
        if (name.match(rXlink)) {
            name = name.toLowerCase().replace(rXlink, 'xlink:$1');
        }
        if (checkType || skipFalseAndFunction(v)) {
            ret += ' ' + name + '=' + encodeAttributes(v + '');
        }
    }

    // For static pages, no need to put React ID and checksum. Saves lots of
    // bytes.
    if (makeStaticMarkup) {
        return ret;
    }

    if (isRootElement) {
        ret += ' ' + createMarkupForRoot();
    }
    return ret;
}
export const ID_ATTRIBUTE_NAME = 'data-reactid';
export const ROOT_ATTRIBUTE_NAME = 'data-reactroot';
function createMarkupForRoot() {
    return ROOT_ATTRIBUTE_NAME + '=""';
}
