import { oneObject, camelize } from "./util";
export var rnumber = /^-?\d+(\.\d+)?$/;
/**
     * 为元素样子设置样式
     * 
     * @export
     * @param {any} dom 
     * @param {any} oldStyle 
     * @param {any} newStyle 
     */
export function patchStyle(dom, oldStyle, newStyle) {
  if (oldStyle === newStyle) {
    return;
  }

  for (let name in newStyle) {
    let val = newStyle[name];
    if (oldStyle[name] !== val) {
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
        console.log("dom.style[" + name + "] = " + val + "throw error");
      }
    }
  }
  // 如果旧样式存在，但新样式已经去掉
  for (let name in oldStyle) {
    if (!(name in newStyle)) {
      dom.style[name] = ""; //清除样式
    }
  }
}

export var cssNumber = oneObject(
  "animationIterationCount,columnCount,order,flex,flexGrow,flexShrink,fillOpacity,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom"
);

//var testStyle = document.documentElement.style
var prefixes = ["", "-webkit-", "-o-", "-moz-", "-ms-"];
export var cssMap = oneObject("float", "cssFloat");

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
  var host = (dom && dom.style) || {};
  for (var i = 0, n = prefixes.length; i < n; i++) {
    var camelCase = camelize(prefixes[i] + name);
    if (camelCase in host) {
      return (cssMap[name] = camelCase);
    }
  }
  return null;
}
