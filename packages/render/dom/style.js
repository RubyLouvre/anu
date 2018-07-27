import { oneObject, camelize } from "react-core/util";
export let rnumber = /^-?\d+(\.\d+)?$/;
/**
 * 为元素样子设置样式
 *
 * @export
 * @param {any} dom
 * @param {any} lastStyle
 * @param {any} nextStyle
 */
export function patchStyle(dom, lastStyle, nextStyle) {
    if (lastStyle === nextStyle) {
        return;
    }

    for (let name in nextStyle) {
        let val = nextStyle[name];
        if (lastStyle[name] !== val) {
            name = cssName(name, dom);
            if (val !== 0 && !val) {
                val = ""; //清除样式
            } else if (rnumber.test(val) && !cssNumber[name]) {
                val = val + "px"; //添加单位
            }
            try {
                //node.style.width = NaN;node.style.width = 'xxxxxxx';
                //node.style.width = undefine 在旧式IE下会抛异常
                dom.style[name] = val; //应用样式
            } catch (e) {
                console.log("dom.style[" + name + "] = " + val + "throw error"); // eslint-disable-line
            }
        }
    }
    // 如果旧样式存在，但新样式已经去掉
    for (let name in lastStyle) {
        if (!(name in nextStyle)) {
            name = cssName(name, dom);
            dom.style[name] = ""; //清除样式
        }
    }
}

export let cssNumber = oneObject(
    "animationIterationCount,columnCount,order,flex,flexGrow,flexShrink,fillOpacity,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom"
);

//let testStyle = document.documentElement.style
let prefixes = ["", "-webkit-", "-o-", "-moz-", "-ms-"];
export let cssMap = oneObject("float", "cssFloat");

/**
 * 转换成当前浏览器可用的样式名
 *
 * @param {any} name
 * @returns
 */
export function cssName(name, dom) {
    if (cssMap[name]) {
        return cssMap[name];
    }
    let host = (dom && dom.style) || {};
    for (let i = 0, n = prefixes.length; i < n; i++) {
        let camelCase = camelize(prefixes[i] + name);
        if (camelCase in host) {
            return (cssMap[name] = camelCase);
        }
    }
    return null;
}
