  import {
      patchStyle
  } from './style'

  import {
      addGlobalEventListener,
      getBrowserName,
      isEventName
  } from './event'
  import {
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

  /**
   * 收集DOM到组件实例的refs中
   * 
   * @param {any} instance 
   * @param {any} ref 
   * @param {any} dom 
   */
  function patchRef(instance, ref, dom, mount) {
      if (typeof ref === 'function') {
          ref(instance)
      } else if (typeof ref === 'string') {
          instance.refs[ref] = dom
          dom.getDOMNode = getDOMNode
      }
  }
  //fix 0.14对此方法的改动，之前refs里面保存的是虚拟DOM
  function getDOMNode() {
      return this
  }
  var xlink = "http://www.w3.org/1999/xlink"
  var stringAttributes = oneObject('id,title,alt,value,className')
  export var builtIdProperties = {} //不规则的属性名映射


  //防止压缩时出错
  'accept-charset,acceptCharset|char,ch|charoff,chOff|class,className|for,htmlFor|http-equiv,httpEquiv'.replace(/[^\|]+/g, function (a) {
      var k = a.split(',')
      builtIdProperties[k[1]] = k[0]
  })
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

  bools.replace(/\w+/g, function (name) {
      builtIdProperties[name] = true
  })

  var anomaly = ['accessKey,bgColor,cellPadding,cellSpacing,codeBase,codeType,colSpan',
      'dateTime,defaultValue,contentEditable,frameBorder,longDesc,maxLength,' +
      'marginWidth,marginHeight,rowSpan,tabIndex,useMap,vSpace,valueType,vAlign,' +
      'value,title,alt'
  ].join(',')

  anomaly.replace(/\w+/g, function (name) {
      builtIdProperties[name] = name
  })
  /**
   * 
   * 修改dom的属性与事件
   * @export
   * @param {any} props 
   * @param {any} prevProps 
   * @param {any} vnode 
   * @param {any} prevVnode 
   */
  export function diffProps(props, prevProps, vnode, prevVnode) {
      /* istanbul ignore if */
      if (props === prevProps) {
          return
      }
      var dom = vnode.dom

      var instance = vnode._owner
      if (prevVnode._wrapperState) {
          vnode._wrapperState = prevVnode._wrapperState
          delete prevVnode._wrapperState
      }
      var isHTML = !vnode.ns
      for (let name in props) {
          if (name === 'children') {
              continue
          }
          var val = props[name]
          if (name === 'ref') {
              if (prevProps[name] !== val) {
                  instance && patchRef(instance, val, dom)
              }
              continue
          }
          if (name === 'style') {
              patchStyle(dom, prevProps.style || {}, val)
              continue
          }
          if (name === 'dangerouslySetInnerHTML') {
              var oldhtml = prevProps[name] && prevProps[name]._html
              vnode._hasSetInnerHTML = true
              if (val && val.__html !== oldhtml) {
                  dom.innerHTML = val.__html
              }
          }
          if (isEventName(name)) {
              if (!prevProps[name]) { //添加全局监听事件
                  var eventName = getBrowserName(name)
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
              continue
          }
          if (val !== prevProps[name]) {
              if (typeof dom[name] === 'boolean') {
                  //布尔属性必须使用el.xxx = true|false方式设值
                  //如果为false, IE全系列下相当于setAttribute(xxx,''),
                  //会影响到样式,需要进一步处理
                  dom[name] = !!val
              }
              if (val === false || val === void 666 || val === null) {
                  operateAttribute(dom, name, '', !isHTML)
                  continue
              }
              if (isHTML && builtIdProperties[name]) {
                  //特殊照顾value, 因为value可以是用户自己输入的，这时再触发onInput，再修改value，但这时它们是一致的
                  //<input value={this.state.value} onInput={(e)=>setState({value: e.target.value})} />
                  if (stringAttributes[name])
                      val = val + ''
                  if (name !== 'value' || dom[name] !== val) {
                      dom[name] = val
                  }
              } else {
                  operateAttribute(dom, name, val, !isHTML)
              }

          }
      }
      //如果旧属性在新属性对象不存在，那么移除DOM
      for (let name in prevProps) {
          if (!(name in props)) {
              if (isEventName(name)) { //移除事件
                  var events = dom.__events || {}
                  delete events[name]
              } else { //移除属性
                  if (isHTML && builtIdProperties[name]) {
                      dom[name] = builtIdProperties[name] === true ? false : ''
                  } else {
                      operateAttribute(dom, name, '', !isHTML)
                  }
              }
          }
      }
  }

  function operateAttribute(dom, name, value, isSVG) {

      var method = value === '' ? 'removeAttribute' : 'setAttribute',
          namespace = null
      //http://www.w3school.com.cn/xlink/xlink_reference.asp xlink:actuate xlink:href xlink:show xlink:type	

      if (isSVG && name.indexOf('xlink:') === 0) {
          name = name.replace(/^xlink\:?/, '')
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