import {
    patchStyle
} from './style'

import {
    addGlobalEventListener,
    getBrowserName,
    isEventName
} from './event'
import {
    HTML_KEY,
    oneObject
} from './util'

import {
    document
} from './browser'

var eventNameCache = {
    'onClick': 'click',
    'onChange': 'change'
}

function clickHack() {}
let inMobile = 'ontouchstart' in document
var xlink = "http://www.w3.org/1999/xlink"
var stringAttributes = {}
export var builtIdProperties = {} //不规则的属性名映射

//防止压缩时出错

/*
  contenteditable不是布尔属性
  http://www.zhangxinxu.com/wordpress/2016/01/contenteditable-plaintext-only/
  contenteditable=''
  contenteditable='events'
  contenteditable='caret'
  contenteditable='plaintext-only'
  contenteditable='true'
  contenteditable='false'
   */
var bools = ['autofocus,autoplay,async,allowTransparency,checked,controls',
    'declare,disabled,defer,defaultChecked,defaultSelected,',
    'isMap,loop,multiple,noHref,noResize,noShade',
    'open,readOnly,selected'
].join(',')
var boolAttributes = {}
bools.replace(/\w+/g, function (name) {
    boolAttributes[name] = true
})

var anomaly = [
    'accessKey,bgColor,cellPadding,cellSpacing,codeBase,codeType,colSpan',
    'dateTime,defaultValue,contentEditable,frameBorder,maxLength,marginWidth',
    'marginHeight,rowSpan,tabIndex,useMap,vSpace,valueType,vAlign'
].join(',')

anomaly.replace(/\w+/g, function (name) {
    builtIdProperties[name] = name
})　
String('value,id,title,alt,htmlFor,longDesc,className').replace(/\w+/g, function (name) {
    builtIdProperties[name] = name
    stringAttributes[name] = name
})
/**
 *
 * 修改dom的属性与事件
 * @export
 * @param {any} nextProps
 * @param {any} lastProps
 * @param {any} vnode
 * @param {any} lastVnode
 */
export function diffProps(nextProps, lastProps, vnode, lastVnode) {
    /* istanbul ignore if */
    if (nextProps === lastProps) {
        return
    }
    var dom = vnode._hostNode

    var instance = vnode._owner
    if (lastVnode._wrapperState) {
        vnode._wrapperState = lastVnode._wrapperState
        delete lastVnode._wrapperState
    }

    var isSVG = vnode.ns === 'http://www.w3.org/2000/svg'
    var isHTML = !isSVG
    for (let name in nextProps) {
        let val = nextProps[name]
        switch (name) {
            case 'children':
            case 'key':
            case 'ref':
                break
            case 'style':
                patchStyle(dom, lastProps.style || {}, val)

                break
            case HTML_KEY:
                var oldhtml = lastProps[name] && lastProps[name].__html
                if (val && val.__html !== oldhtml) {
                    dom.innerHTML = val.__html
                }
                break
            default:
                if (isEventName(name)) {
                    if (!lastProps[name]) { //添加全局监听事件
                        var eventName = getBrowserName(name) //带on

                        var curType = typeof val
                        /* istanbul ignore if */
                        if (curType !== 'function')
                            throw 'Expected ' + name + ' listener to be a function, instead got type ' + curType
                        addGlobalEventListener(eventName)
                    }
                    /* istanbul ignore if */
                    if (inMobile && eventName === 'click') {
                        elem.addEventListener('click', clickHack)
                    }
                    var events = (dom.__events || (dom.__events = {}))
                    events[name] = val
                } else if (val !== lastProps[name]) {
                    if (isHTML && boolAttributes[name] && typeof dom[name] === 'boolean') {
                        // 布尔属性必须使用el.xxx = true|false方式设值 如果为false, IE全系列下相当于setAttribute(xxx,''),
                        // 会影响到样式,需要进一步处理
                        dom[name] = !!val
                    }
                    if (val === false || val === void 666 || val === null) {
                        operateAttribute(dom, name, '', isSVG)
                        continue
                    }
                    if (isHTML && builtIdProperties[name]) {
                        // 特殊照顾value, 因为value可以是用户自己输入的，这时再触发onInput，再修改value，但这时它们是一致的 <input
                        // value={this.state.value} onInput={(e)=>setState({value: e.target.value})} />
                        if (stringAttributes[name])
                            val = val + ''
                        if (name !== 'value' || dom[name] !== val) {
                            dom[name] = val
                        }
                    } else {
                        operateAttribute(dom, name, val, isSVG)
                    }
                }
        }
    }
    //如果旧属性在新属性对象不存在，那么移除DOM
    for (let name in lastProps) {
        if (!(name in nextProps)) {
            if (isEventName(name)) { //移除事件
                var events = dom.__events || {}
                delete events[name]
            } else { //移除属性
                if (isHTML && builtIdProperties[name]) {
                    dom[name] = builtIdProperties[name] === true ?
                        false :
                        ''
                } else {
                    operateAttribute(dom, name, '',isSVG)
                }
            }
        }
    }
}
var xlinkProps = /^xlink(.+)/

function operateAttribute(dom, name, value, isSVG) {

    var method = value === '' ?
        'removeAttribute' :
        'setAttribute',
        namespace = null
    // http://www.w3school.com.cn/xlink/xlink_reference.asp
    // https://facebook.github.io/react/blog/2015/10/07/react-v0.14.html#notable-enha
    // ncements xlinkActuate, xlinkArcrole, xlinkHref, xlinkRole, xlinkShow,
    // xlinkTitle, xlinkType
    var match
    if (isSVG && (match = name.match(xlinkProps))) {
        name = 'xlink:' + match[1]
        namespace = xlink
    }
    try {
        if (isSVG) {
            method = method + 'NS'
            dom[method](namespace, name.toLowerCase(), value + '')
        } else {
            dom[method](name, value + '')
        }
    } catch (e) {
        /* istanbul ignore next */
        console.log(e, method, dom.nodeName)
    }
}