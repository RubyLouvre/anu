import { patchStyle } from "./style";
import { addGlobalEvent, getBrowserName, isEventName, eventHooks } from "./event";
import { oneObject, toLowerCase, noop, typeNumber } from "./util";

var boolAttributes = oneObject("autofocus,autoplay,async,allowTransparency,checked,controls,declare,disabled,def" +
    "er,defaultChecked,defaultSelected,isMap,loop,multiple,noHref,noResize,noShade,op" +
    "en,readOnly,selected", true);

var builtIdProperties = oneObject("accessKey,bgColor,cellPadding,cellSpacing,codeBase,codeType,colSpan,dateTime,def" +
    "aultValue,contentEditable,frameBorder,maxLength,marginWidth,marginHeight,rowSpan" +
    ",tabIndex,useMap,vSpace,valueType,vAlign," + //驼蜂风格
    "value,id,title,alt,htmlFor,name,type,longDesc,className", 1);

var booleanTag = oneObject("script,iframe,a,map,video,bgsound,form,select,input,textarea,option,keygen,optgr" +
    "oup,label");

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
    if (specialProps[name]) {
        return name;
    }
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

function getHookTypeSVG(name) {
    if (name === "className") {
        return "svgClass";
    }

    if (specialProps[name]) {
        return name;
    }

    if (isEventName(name)) {
        return "__event__";
    }
    return "svgAttr";
}
/**
 * 仅匹配 svg 属性名中的第一个驼峰处，如 viewBox 中的 wB，
 * 数字表示该特征在属性列表中重复的次数
 * -1 表示用 ':' 隔开的属性 (xlink:href, xlink:title 等)
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute
 */
var svgCamelCase = {
    w: { r: 1, b: 1, t: 1 },
    e: { n: 1, t: 1, f: 1, p: 1, c: 1, m: 1, a: 2, u: 1, s: 1, v: 1 },
    o: { r: 1 },
    c: { m: 1 },
    p: { p: 1 },
    t: { s: 2, t: 1, u: 1, c: 1, d: 1, o: 1, x: 1, y: 1, l: 1 },
    l: { r: 1, m: 1, u: 1, b: -1, l: -1, s: -1 },
    r: { r: 1, u: 2, h: 1, w: 1, c: 1, e: 1 },
    h: { r: 1, a: 1, l: 1, t: 1 },
    y: { p: 1, s: 1, t: 1, c: 1 },
    g: { c: 1 },
    k: { a: -1, h: -1, r: -1, s: -1, t: -1, c: 1, u: 1 },
    m: { o: 1, l: 1, a: 1 },
    n: { c: 1, t: 1, u: 1 },
    s: { a: 3 },
    f: { x: 1, y: 1 },
    d: { e: 1, f: 1, m: 1, d: 1 },
    x: { c: 1 }
};

// SVG 属性列表中驼峰命名和短横线分隔命名特征值有重复
// 列出了重复特征中的短横线命名的属性名
var specialSVGPropertyName = {
    "overline-thickness": 2,
    "underline-thickness": 2,
    "overline-position": 2,
    "underline-position": 2,
    "stroke-miterlimit": 2,
    "baseline-shift": 2,
    "clip-path": 2,
    "font-size": 2,
    "font-size-adjust": 2,
    "font-stretch": 2,
    "font-style": 2,
    "text-decoration": 2,
    "vert-origin-x": 2,
    "vert-origin-y": 2,
    "paint-order": 2,
    "fill-rule": 2,
    "color-rendering": 2,
    "marker-end": 2,
    "pointer-events": 2,
    "units-per-em": 2,
    "strikethrough-thickness": 2,
    "lighting-color": 2
};

// 重复属性名的特征值列表
var repeatedKey = [
    "et",
    "ep",
    "em",
    "es",
    "pp",
    "ts",
    "td",
    "to",
    "lr",
    "rr",
    "re",
    "ht",
    "gc"
];

function genReplaceValue(split) {
    return function (match) {
        return match.slice(0, 1) + split + match.slice(1).toLowerCase();
    };
}
const svgCache = {}
function getSVGAttributeName(name) {
    if(svgCache[name]){
        return svgCache[name]
    }
    const key = name.match(/[a-z][A-Z]/);
    if (!key) {
        return svgCache[name] = name
    }
    const [prefix, postfix] = [...key[0].toLowerCase()];
    let orig = name
    if (svgCamelCase[prefix] && svgCamelCase[prefix][postfix]) {
        const count = svgCamelCase[prefix][postfix];

        if (count === -1) {
            return svgCache[orig] = {
                name: name.replace(/[a-z][A-Z]/, genReplaceValue(":")),
                ifSpecial: true
            };
        }

        if (~repeatedKey.indexOf(prefix + postfix)) {
            const dashName = name.replace(/[a-z][A-Z]/, genReplaceValue("-"));
            if (specialSVGPropertyName[dashName]) {
                name = dashName;
            }
        }
    } else {
        name = name.replace(/[a-z][A-Z]/, genReplaceValue("-"));
    }

    return svgCache[orig] = name
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
            console.log("setAttribute error", name, val); // eslint-disable-line
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
        var nameRes = getSVGAttributeName(name);
        if (nameRes.ifSpecial) {
            var prefix = nameRes.name.split(":")[0];
            dom[method + "NS"](NAMESPACE_MAP[prefix], nameRes.name, val || "");
            return;
        } else {
            dom[method](nameRes, val || "");
        }
        // var method = typeNumber(val) < 3 && !val ? "removeAttribute" : "setAttribute";
        // var key = name.match(/[a-z][A-Z]/);
        // if (key) {
        //     var res = getSvgAttributeType(key[0]);
        //     // svg 元素属性区分大小写，如 stroke-width、viewBox
        //     if (!res.camelCase) {
        //         name = name.replace(/[a-z][A-Z]/g, function (match) {
        //             return match.slice(0, 1) + "-" + match.slice(1).toLowerCase();
        //         });
        //     } else {
        //         // svg 元素有几个特殊属性，如 xlink:href(deprecated)、xlink:title
        //         if (res.special) {
        //             // 将xlinkHref 转换为 xlink:href
        //             name = name.replace(/[a-z][A-Z]/g, function (match) {
        //                 return match.slice(0, 1) + ":" + match.slice(1).toLowerCase();
        //             });
        //             var prefix = name.split(":")[0];
        //             dom[method + "NS"](NAMESPACE_MAP[prefix], name, val || "");
        //             return;
        //         }
        //     }
        // }
        // dom[method](name, val || "");
    },
    property: function (dom, name, val) {
        if (name !== "value" || dom[name] !== val) {
            // 尝试直接赋值，部分情况下会失败，如给 input 元素的 size 属性赋值 0 或字符串
            // 这时如果用 setAttribute 则会静默失败
            try {
                // svg 元素不能直接对属性赋值，因为很多 svg 元素的属性不是字符串
                // 比如 circle 的 cx 属性就是 SVGAnimatedLength
                if (typeof dom[name] !== "string") {
                    dom.setAttribute(name, val);
                } else {
                    dom[name] = val;
                }
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
