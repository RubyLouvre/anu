import { patchStyle } from "./style";
import { addGlobalEvent, getBrowserName, isEventName, eventHooks } from "./event";
import { oneObject, toLowerCase, noop, typeNumber } from "./util";

var boolAttributes = oneObject("autofocus,autoplay,async,allowTransparency,checked,controls,declare,disabled,def" +
    "er,defaultChecked,defaultSelected,isMap,loop,multiple,noHref,noResize,noShade,op" +
    "en,readOnly,selected",
    true);

var builtIdProperties = oneObject("accessKey,bgColor,cellPadding,cellSpacing,codeBase,codeType,colSpan,dateTime,def" +
    "aultValue,contentEditable,frameBorder,maxLength,marginWidth,marginHeight,rowSpan" +
    ",tabIndex,useMap,vSpace,valueType,vAlign," + //驼蜂风格
    "value,id,title,alt,htmlFor,name,type,longDesc,className", 1);

var booleanTag = oneObject("script,iframe,a,map,video,bgsound,form,select,input,textarea,option,keygen,optgr" +
    "oup,label");
var xlink = "http://www.w3.org/1999/xlink";

/**
 *
 * 修改dom的属性与事件
 * @export
 * @param {any} nextProps
 * @param {any} lastProps
 * @param {any} vnode
 * @param {any} lastVnode
 */
export function diffProps(nextProps, lastProps, vnode, lastVnode, dom) {
    /* istanbul ignore if */
    if (vnode.ns === "http://www.w3.org/2000/svg") {
        return diffSVGProps(nextProps, lastProps, vnode, lastVnode, dom);
    }
    //eslint-disable-next-line
    for (let name in nextProps) {
        let val = nextProps[name];
        if (val !== lastProps[name]) {
            var hookName = getHookType(name, val, vnode.type, dom);
            propHooks[hookName](dom, name, val, lastProps);
        }
    }
    //如果旧属性在新属性对象不存在，那么移除DOM eslint-disable-next-line
    for (let name in lastProps) {
        if (!nextProps.hasOwnProperty(name)) {
            var hookName2 = getHookType(name, false, vnode.type, dom);
            propHooks[hookName2](dom, name, builtIdProperties[name]
                ? ""
                : false, lastProps);
        }
    }
}

function diffSVGProps(nextProps, lastProps, vnode, lastVnode, dom) {
    // http://www.w3school.com.cn/xlink/xlink_reference.asp
    // https://facebook.github.io/react/blog/2015/10/07/react-v0.14.html#notable-enh
    // a ncements xlinkActuate, xlinkArcrole, xlinkHref, xlinkRole, xlinkShow,
    // xlinkTitle, xlinkType eslint-disable-next-line
    for (let name in nextProps) {
        let val = nextProps[name];
        if (val !== lastProps[name]) {
            var hookName = getHookTypeSVG(name, val, vnode.type, dom);
            propHooks[hookName](dom, name, val, lastProps);
        }
    }
    //eslint-disable-next-line
    for (let name in lastProps) {
        if (!nextProps.hasOwnProperty(name)) {
            let val = nextProps[name];
            var hookName2 = getHookTypeSVG(name, val, vnode.type, dom);
            propHooks[hookName2](dom, name, false, lastProps);
        }
    }
}
var controlled = {
    value: 1,
    defaultValue: 1
};

var specialProps = {
    children: 1,
    style: 1,
    className: 1,
    dangerouslySetInnerHTML: 1
};

function getHookType(name, val, type, dom) {
    if (specialProps[name])
    { return name; }
    if (boolAttributes[name] && booleanTag[type]) {
        return "boolean";
    }
    if (isEventName(name)) {
        return "__event__";
    }
    if (typeNumber(val) < 3 && !val) {
        return "removeAttribute";
    }
    return name.indexOf("data-") === 0 || dom[name] === void 666
        ? "setAttribute"
        : "property";
}

function getHookTypeSVG(name, val, type, dom) {
    if (name === "className") {
        return "svgClass";
    }

    if (specialProps[name])
    { return name; }

    if (isEventName(name)) {
        return "__event__";
    }
    return "svgAttr";
}
/**
 * 仅匹配 svg 属性名中的第一个驼峰处，如 viewBox 中的 wB，
 * 1 表示驼峰命名 2 表示用 : 隔开的属性 (xlink:href, xlink:title 等)
 * xlink:href 在 React Component 中写作 xlinkHref
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute
 */
var svgCamelCase = {
    c: { M: 1 },
    d: { D: 1, E: 1, F: 1, M: 1 },
    e: { A: 1, C: 1, F: 1, M: 1, N: 1, P: 1, S: 1, T: 1, U: 1, V: 1 },
    f: { X: 1, Y: 1 },
    g: { C: 1 },
    h: { A: 1, L: 1, R: 1, T: 1 },
    k: { A: 2, C: 1, H: 2, R: 2, S: 2, T: 2, U: 1 },
    l: { B: 2, L: 2, M: 1, R: 1, S: 2, U: 1 },
    m: { A: 1, L: 1, O: 1 },
    n: { C: 1, T: 1, U: 1 },
    o: { R: 1 },
    p: { P: 1 },
    r: { C: 1, E: 1, H: 1, R: 1, U: 1, W: 1 },
    s: { A: 1, X: 2 },
    t: { C: 1, D: 1, L: 1, O: 1, S: 1, T: 1, U: 1, X: 1, Y: 1 },
    w: { B: 1, R: 1, T: 1 },
    x: { C: 1 },
    y: { C: 1, P: 1, S: 1, T: 1 }
};

function getSvgAttributeType(key) {
    var prefix = key.slice(0, 1);
    var postfix = key.slice(1);
    var res = {
        camelCase: false, // 表示是否驼峰命名
        special: false // 表示是否用 : 分隔的属性
    };
    var ifSpecial = false;

    if (!svgCamelCase[prefix]) {
        return res;
    } else if (!svgCamelCase[prefix][postfix]) {
        return res;
    } else if (svgCamelCase[prefix][postfix] === 2) {
        ifSpecial = true;
    }

    return {
        camelCase: true,
        special: ifSpecial
    };
}

// XML 的命名空间对应的 URI
var NAMESPACE_MAP = {
    svg: "http://www.w3.org/2000/svg",
    xmlns: "http://www.w3.org/2000/xmlns/",
    xml: "http://www.w3.org/XML/1998/namespace",
    xlink: "http://www.w3.org/1999/xlink",
    xhtml: "http://www.w3.org/1999/xhtml"
};

var emptyStyle = {};
export var propHooks = {
    boolean: function (dom, name, val) {
        // 布尔属性必须使用el.xxx = true|false方式设值 如果为false, IE全系列下相当于setAttribute(xxx,''),
        // 会影响到样式,需要进一步处理 eslint-disable-next-line
        dom[name] = !!val;
        if (!val) {
            dom.removeAttribute(name);
        }
    },
    removeAttribute: function (dom, name) {
        dom.removeAttribute(name);
    },
    setAttribute: function (dom, name, val) {
        try {
            dom.setAttribute(name, val);
        } catch (e) {
            console.log("setAttribute error", name, val);
        }
    },
    svgClass: function (dom, name, val) {
        if (!val) {
            dom.removeAttribute("class");
        } else {
            dom.setAttribute("class", val);
        }
    },
    svgAttr: function (dom, name, val) {
        var method = typeNumber(val) < 3 && !val ? "removeAttribute" : "setAttribute";
        var key = name.match(/[a-z][A-Z]/);
        if (key) {
            var res = getSvgAttributeType(key[0]);
            // svg 元素属性区分大小写，如 stroke-width、viewBox
            if (!res.camelCase) {
                name = name.replace(/[a-z][A-Z]/g, function (match) {
                    return match.slice(0, 1) + "-" + match.slice(1).toLowerCase();
                });
            } else {
                // svg 元素有几个特殊属性，如 xlink:href(deprecated)、xlink:title
                if (res.special) {
                    // 将xlinkHref 转换为 xlink:href
                    name = name.replace(/[a-z][A-Z]/g, function (match) {
                        return match.slice(0, 1) + ":" + match.slice(1).toLowerCase();
                    });
                    var prefix = name.split(":")[0];
                    dom[method + "NS"](NAMESPACE_MAP[prefix], name, val || "");
                    return;
                }
            }
        }
        dom[method](name, val || "");
    },
    property: function (dom, name, val) {
        if (name !== "value" || dom[name] !== val) {
            // 尝试直接赋值，部分情况下会失败，如给 input 元素的 size 属性赋值 0 或字符串
            // 这时如果用 setAttribute 则会静默失败
            try {
                dom[name] = val;
            } catch (e) {
                dom.setAttribute(name, val);
            }
            if (controlled[name]) {
                dom._lastValue = val;
            }
        }
    },
    children: noop,
    className: function (dom, _, val) {
        dom.className = val;
    },
    style: function (dom, _, val, lastProps) {
        patchStyle(dom, lastProps.style || emptyStyle, val || emptyStyle);
    },
    __event__: function (dom, name, val, lastProps) {
        let events = dom.__events || (dom.__events = {});

        if (val === false) {
            delete events[toLowerCase(name.slice(2))];
        } else {
            if (!lastProps[name]) {
                //添加全局监听事件
                var _name = getBrowserName(name);
                addGlobalEvent(_name);
                var hook = eventHooks[_name];
                if (hook) {
                    hook(dom, _name);
                }
            }
            //onClick --> click, onClickCapture --> clickcapture
            events[toLowerCase(name.slice(2))] = val;
        }
    },

    dangerouslySetInnerHTML: function (dom, name, val, lastProps) {
        var oldhtml = lastProps[name] && lastProps[name].__html;
        var html = val && val.__html;
        if (html !== oldhtml) {
            dom.innerHTML = html;
        }
    }
};
