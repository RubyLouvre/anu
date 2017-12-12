import { rnumber, cssNumber } from "../src/style";
import { encodeEntities } from "./util";

const skipAttributes = {
    ref: 1,
    key: 1,
    children: 1
};
const cssCached = {
    styleFloat: "float",
    cssFloat: "float"
};
const rXlink = /^xlink:?(.+)/;

function cssName(name) {
    if (cssCached[name]) {
        return cssCached[name];
    }
    return (cssCached[name] = name.replace(/([A-Z])/g, "-$1").toLowerCase());
}

function stringifyClassName(obj) {
    var arr = [];
    for (var i in obj) {
        if (obj[i]) {
            arr.push(i);
        }
    }
    return arr.join(" ");
}

var attrCached = {};
function encodeAttributes(value) {
    if (attrCached[value]) {
        return attrCached[value];
    }
    return (attrCached[value] = "\"" + encodeEntities(value) + "\"");
}

function skipFalseAndFunction(a) {
    return a !== false && Object(a) !== a;
}

function stringifyStyleObject(obj) {
    var arr = [];
    for (var i in obj) {
        var val = obj[i];
        if (obj != null) {
            var unit = "";
            if (rnumber.test(val) && !cssNumber[name]) {
                unit = "px";
            }
            arr.push(cssName(name) + ": " + val + unit);
        }
    }
    return arr.join("; ");
}

export function stringifyAttributes(props){
    var attrs = [];
    for (let name in props) {
        var v = props[name];
        if (skipAttributes[name] || (/^on[A-Z]/.test(name) && (skipAttributes[name] = true))) {
            continue;
        }

        if (name === "className" || name === "class") {
            name = "class";
            if (v && typeof v === "object") {
                v = stringifyClassName(v);
            }
        } else if (name.match(rXlink)) {
            name = name.toLowerCase().replace(rXlink, "xlink:$1");
        } else if (name === "style" && v && typeof v === "object") {
            v = stringifyStyleObject(v);
        }
        if (skipFalseAndFunction(v)) {
            attrs.push(name + "=" + encodeAttributes(v + ""));
        }
    }
    return attrs.length ? " " + attrs.join(" ") : "";
}