(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.React = factory());
}(this, function () {

  /**
   * 复制一个对象的属性到另一个对象
   * 
   * @param {any} obj 
   * @param {any} props 
   * @returns 
   */
  function extend(obj, props) {
      if (props) {
          for (let i in props) {
              obj[i] = props[i]
          }
      }
      return obj
  }
  /**
   * 创建一个对象的浅克隆副本
   * 
   * @param {any} obj 
   * @returns 
   */
  function clone(obj) {
      return extend({}, obj)
  }

  /**
   * 判定否为与事件相关
   * 
   * @param {any} name 
   * @param {any} val 
   * @returns 
   */
  function isEvent(name, val) {
      return /^on\w/.test(name) && typeof val === 'function'
  }

  /**
   * 收集该虚拟DOM的所有组件实例，方便依次执行它们的生命周期钩子
   * 
   * @param {any} instance 
   * @returns 
   */
  function getInstances(instance) {
      var instances = [instance]
      while (instance = instance.parentInstance) {
          instances.push(instance)
      }
      return instances
  }
  /**
   * 寻找适合的实例并返回
   * 
   * @param {any} instance 
   * @param {any} Type 
   * @returns 
   */
  function matchInstance(instance, Type) {
      do {
          if (instance.statelessRender === Type)
              return instance
          if (instance instanceof Type) {
              return instance
          }
      } while (instance = instance.parentInstance)
  }
  /**
   * 
   * 
   * @param {any} type 
   * @returns 
   */
  function isComponent(type) {
      return typeof type === 'function'
  }
  /**
   * 
   * 
   * @export
   * @param {any} type 
   * @returns 
   */
  function isStateless(type) {
      var fn = type.prototype
      return isComponent(type) && (!fn || !fn.render)
  }

  var lifecycle = {
      '-2': 'getDefaultProps',
      '-1': 'getInitialState',
      '0': 'componentWillMount',
      '1': 'render',
      '2': 'componentDidMount',
      '3': 'componentWillReceiveProps',
      '4': 'shouldComponentUpdate',
      '5': 'componentWillUpdate',
      '6': 'componentDidUpdate',
      '7': 'componentWillUnmount'
  }

  /**
   * 
   * 
   * @export
   * @param {Component} instance 
   * @param {number} index 
   * @returns 
   */
  function applyComponentHook(instance, index) {
      if (instance) {
          var method = lifecycle[index]
          if (instance[method]) {
              return instance[method].apply(instance, [].slice.call(arguments, 2))
          }
      }
  }

  /**
    * 
    * 
    * @param {any} props 
    * @param {any} context 
    */
   function Component(props, context) {
       this.context = context
       this.props = props

       if (!this.state)
           this.state = {}
   }


   Component.prototype = {
       /**
        * void setState(
         function|object nextState,
         [function callback]
       )
        * 
        * @param {any} state 
        */
       setState(state) {
           let s = this.state;

           this.prevState = this.prevState || clone(s);
           extend(s, state);
           updateComponent(this)
       },

       forceUpdate() {
           updateComponent(this);
       },

       render() {}

   }

   /**
    * 渲染组件
    * 
    * @param {any} instance 
    */
   function updateComponent(instance) {
       var { props, state, context, vnode, prevProps, prevState } = instance
       prevState = prevState || state
       instance.props = prevProps
       instance.state = prevState
       var nextProps = props
       var nextState = state
       if (applyComponentHook(instance, 4, nextProps, nextState, context) === false) {
           return dom //注意
       }
       applyComponentHook(instance, 5, nextProps, nextState, context)
       instance.props = nextProps
       instance.state = nextState

       if (instance.statelessRender) {
           var rendered = instance.statelessRender(nextProps, context)
       } else {
           var rendered = instance.render() // 1
       }
       //context只能孩子用，因此不要影响原instance.context
       if (instance.getChildContext) {
           context = extend(clone(context), instance.getChildContext());
       }

       var dom = vnode.dom //dom肯定存在

       dom = diff(dom, rendered, context, dom.parentNode, instance.vnode)

       instance.vnode = rendered
       rendered.dom = dom
       delete instance.prevState //方便下次能更新this.prevState
       instance.prevProps = props // 更新prevProps
       applyComponentHook(instance, 6, nextProps, nextState, context)
       return dom //注意
   }
   /**
    * call componentWillUnmount
    * 
    * @param {any} vnode 
    */
   function removeComponent(vnode) {
       var instance = vnode.instance
       applyComponentHook(instance, 7) //7
       if (instance) {
           instance.vnode = instance.props = instance.context = vnode.instance = vnode.dom = void 666
       }

       vnode.props.children.forEach(function(el) {
           if (el.props) {
               removeComponent(el)
           }
       })
   }


   /**
    * 
    * 
    * @param {any} dom 
    * @param {any} vnode 
    * @param {any} context 
    * @param {any} parent 
    * @returns 
    */
   function diff(dom, vnode, context, parentNode, prevVnode) {
       var prevProps = prevVnode.props　 || {}
       var prevChildren = prevProps.children || []
       var Type = vnode.type

       if (prevVnode.type !== Type) {
           //更新组件
           if (typeof Type === 'function') {
               var instance = prevVnode.instance
               if (instance) {
                   instance = matchInstance(instance, Type)
                   if (instance) {
                       //如果类型相同，使用旧的实例进行 render新的虚拟DOM
                       vnode.instance = instance
                       var nextProps = vnode.props
                           //处理非状态组件
                       if (instance.statelessRender) {
                           instance.props = nextProps
                           instance.prevProps = prevProps
                           return updateComponent(instance, context)
                       }

                       var prevProps = instance.prevProps

                       instance.props = prevProps
                       applyComponentHook(instance, 3, nextProps)
                       instance.prevProps = prevProps
                       instance.props = nextProps
                       return updateComponent(instance, context)

                   } else {
                       removeComponent(prevVnode)
                   }
               }
               //这里创建新组件
               return toDOM(vnode, context, parentNode, prevVnode.dom)
           }
           if (prevVnode.instance) {
               removeComponent(prevVnode)
           }

           //更新普通元素节点
           var nextDom = document.createElement(Type)
           if (dom) {
               while (dom.firstChild) {
                   nextDom.appendChild(dom.firstChild)
               }
           }
           if (parentNode) {
               parentNode.replaceChild(nextDom, dom)
           }
           dom = nextDom
       }
       // console.log(prevVnode.type, '222')
       diffProps(dom, prevProps, vnode.props)
       diffChildren(dom, vnode.props.children, context, prevChildren)
       return dom
   }


   /**
    * 修改dom的属性与事件
    * 
    * @param {any} dom 
    * @param {any} props 
    * @param {any} nextProps 
    */
   function diffProps(dom, props, nextProps) {
       for (var i in nextProps) {
           if (i === 'children') {
               continue
           }
           var val = nextProps[i]

           if (isEvent(i, val)) {
               if (!props[i]) { //添加新事件
                   dom.addEventListener(i.slice(2).toLowerCase(), val)
                   props[i] = val
               }
               continue
           }
           if (val !== props[i]) {
               //移除属性
               if (val === false || val === void 666 || val === null) {
                   dom.removeAttribute(i)
                   delete props[i]
               } else { //添加新属性
                   dom.setAttribute(i, val + '')
                   props[i] = val
               }
           }
       }
       for (var i in props) {
           if (!(i in nextProps)) {
               if (isEvent(i, props[i])) { //移除事件
                   dom.removeEventListener(i.slice(2).toLowerCase(), props[i])
               } else { //移除属性
                   dom.removeAttribute(i)
               }
               delete props[i]
           }
       }
   }
   /**
    * 聚类
    * 
    * @param {any} vnode 
    * @param {any} instance 
    * @param {any} pool 
    */
   function poolInstances(vnode, instance, pool) {
       while (instance.parentInstance) {
           instance = nstance.parentInstance
       }
       var ctor = instance.constructor
       var TypeName = ctor.displayName || ctor.name
       var list = pool[TypeName]
       if (list) {
           list.push(vnode)
       } else {
           pool[TypeName] = [vnode]
       }
   }


   /**
    * 
    * 
    * @param {any} parentNode 
    * @param {any} newChildren 
    * @param {any} context 
    * @param {any} oldChildren 
    */
   function diffChildren(parentNode, newChildren, context, oldChildren) {
       //第一步，收集旧children的带组件实例的节点
       var hasInstancePool = {},
           hasInstanceList = [],
           noInstanceList = []

       for (var i = 0, n = oldChildren.length; i < n; i++) {
           var el = oldChildren[i]
           el.index = i //保持它们的位置 
           if (el.instance) {
               poolInstances(el, el.instance, hasInstancePool)
               hasInstanceList.push(el)
           } else {
               noInstanceList.push(el)
           }
       }
       //第二步，遍历新children, 让type为函数的节点进行预先匹配
       for (var i = 0, n = newChildren.length; i < n; i++) {
           var vnode = newChildren[i]
           var Type = vnode.type
           if (typeof Type === 'function') {
               var TypeName = Type.displatName || Type.name
               if (hasInstancePool[TypeName]) {
                   var matchNode = hasInstancePool[TypeName].shift()
                   if (!hasInstancePool[TypeName].length) {
                       delete hasInstancePool[TypeName]
                   }
                   if (matchNode) {
                       var index = hasInstanceList.indexOf(matchNode)
                       hasInstanceList.splice(index, 1)
                       vnode.old = matchNode
                   }
               }
           }
       }
       var list = noInstanceList.concat(hasInstanceList)
       list.sort(function(a, b) {
           return b.index - a.index
       })

       //第三，逐一比较
       var childNodes = parentNode.childNodes
       for (var i = 0, n = newChildren.length; i < n; i++) {
           var vnode = newChildren[i]
           if (vnode.old) {
               old = vnode.old
               delete vnode.old
           } else {
               old = list.shift()
           }
           if (vnode && old) { //假设两者都存在
               if (vnode.type === old.type) {
                   if (vnode.type === '#text') { //#text === #text
                       if (vnode.text !== old.text) {
                           vnode.dom = old.dom
                           vnode.dom.nodeValue = vnode.text
                       }
                   } else {
                       if (childNodes[i] !== old.dom)
                           parentNode.appendChild(old.dom)

                       vnode.dom = diff(old.dom, vnode, context, parentNode, old)
                   }
               } else if (vnode.type === '#text') { //#text === p
                   var dom = document.createTextNode(vnode.text)
                   vnode.dom = dom
                   parentNode.replaceChild(dom, old.dom)
                   removeComponent(old)
               } else {
                   if (childNodes[i] !== old.dom)
                       parentNode.appendChild(old.dom)
                   vnode.dom = diff(old.dom, vnode, context, parentNode, old)
               }
               delete old.dom //clear reference
           } else if (!old) {
               vnode.dom = toDOM(vnode, context, parentNode)
           }
       }

       if (list.length) {
           for (var i = list.length; i < n; i++) {
               var el = list[i]
               parentNode.removeChild(el.dom)
               el.props && removeComponent(el)
           }
       }
   }

   /**
    * 
    * 
    * @param {any} vnode 
    * @param {any} context 
    * @returns 
    */
   function toVnode(vnode, context) {
       var Type = vnode.type
       if (isComponent(Type)) {
           var props = vnode.props

           if (!isStateless(Type)) {
               var defaultProps = Type.defaultProps || applyComponentHook(Type, -2) || {}
               props = clone(props) //注意，上面传下来的props已经被冻结，无法修改，需要先复制一份
               for (var i in defaultProps) {
                   if (props[i] === void 666) {
                       props[i] = defaultProps[i]
                   }
               }
               var instance = new Type(props, context)
               Component.call(instance, props, context) //重点！！
               applyComponentHook(instance, 0) //willMount

               var rendered = instance.render()
           } else { //添加无状态组件的分支
               rendered = Type(props, context)
               instance = {
                   statelessRender: Type,
                   context: context
               }
           }
           if (vnode.instance) {
               instance.parentInstance = vnode.instance
               vnode.instance.childInstance = instance
           }


           instance.prevProps = vnode.props //实例化时prevProps
           instance.vnode = vnode
               //压扁组件Vnode为普通Vnode
           if (rendered == null) {
               rendered = ''
           }
           if (/number|string/.test(typeof rendered)) {
               rendered = {
                   type: '#text',
                   text: rendered
               }
           }

           extend(vnode, rendered)
           vnode.instance = instance

           return toVnode(vnode, context)
       } else {
           return vnode
       }
   }

   /**
    * 
    * 
    * @export
    * @param {VNode} vnode 
    * @param {DOM} context 
    * @param {DOM} parentNode ?
    * @param {DOM} replaced ?
    * @returns 
    */
   function toDOM(vnode, context, parentNode, replaced) {
       vnode = toVnode(vnode, context)
       var dom
       if (vnode.type === '#text') {
           dom = document.createTextNode(vnode.text)
       } else {
           dom = document.createElement(vnode.type)
           dom.__type = vnode.type
           diffProps(dom, {}, vnode.props)

           diffChildren(dom, vnode.props.children, context, []) //添加第4参数
       }
       var instance = vnode.instance
       var canComponentDidMount = instance && !vnode.dom
       vnode.dom = dom
       if (parentNode) {
           var instances, instance, childInstance
           if (canComponentDidMount) { //判定能否调用componentDidMount方法
               instances = getInstances(instance)
           }
           if (replaced) {
               parentNode.replaceChild(dom, replaced)
           } else {
               parentNode.appendChild(dom)
           }
           if (instances) {
               while (instance = instances.shift()) {
                   applyComponentHook(instance, 2)
               }
           }
       }
       return dom
   }

  var hasOwnProperty = Object.prototype.hasOwnProperty;

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  function is(x, y) {
      // SameValue algorithm
      if (x === y) {
          // Steps 1-5, 7-10
          // Steps 6.b-6.e: +0 != -0
          // Added the nonzero y check to make Flow happy, but it is redundant
          return x !== 0 || y !== 0 || 1 / x === 1 / y;
      } else {
          // Step 6.a: NaN == NaN
          return x !== x && y !== y;
      }
  }

  /**
   * Performs equality by iterating through keys on an object and returning false
   * when any key has values which are not strictly equal between the arguments.
   * Returns true when the values of all keys are strictly equal.
   */
  function shallowEqual(objA, objB) {
      if (is(objA, objB)) {
          return true;
      }

      if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
          return false;
      }

      var keysA = Object.keys(objA);
      var keysB = Object.keys(objB);
      if (keysA.length !== keysB.length) {
          return false;
      }

      // Test for A's keys different from B.
      for (var i = 0; i < keysA.length; i++) {
          if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
              return false;
          }
      }

      return true;
  }

  function PureComponent(props, context) {
      this.props = props
      this.context = context
  }

  function Bridge() {}
  Bridge.prototype = Component.prototype

  let fn = PureComponent.prototype = new Bridge()

  // 避免原型链拉长导致方法查找的性能开销
  extend(fn, Component.prototype)
  fn.shouldComponentUpdate = function shallowCompare(nextProps, nextState) {
      var a = shallowEqual(this.props, nextProps)
      var b = shallowEqual(this.state, nextState)
      return !a || !b
  }
  fn.constructor = PureComponent
  fn.isPureComponent = true

  var React = {
      render,
      createElement,
      PureComponent,
      Component
  }
  var shallowEqualHack = Object.freeze([]) //用于绕过shallowEqual
      /**
       * 创建虚拟DOM
       * 
       * @param {string} type 
       * @param {object} props 
       * @param {array} children 
       * @returns 
       */
  function createElement(type, configs = {}, children) {
      var props = {}
      extend(props, configs)
      var c = [].slice.call(arguments, 2)
      var useEmpty = true
      if (!c.length) {
          if (props.children) {
              c = props.children
              useEmpty = false
          }
      } else {
          useEmpty = false
      }
      if (useEmpty) {
          c = shallowEqualHack
      } else {
          c = flatChildren(c)
          Object.freeze(c)
          delete c.merge
      }
      props.children = c
      Object.freeze(props)
      return {
          type: type,
          props: props
      }
  }
  /**
   * 遍平化children，并合并相邻的简单数据类型
   * 
   * @param {array} children 
   * @param {any} [ret=[]] 
   * @returns 
   */

  function flatChildren(children, ret) {
      ret = ret || []
      for (var i = children.length; i--;) { //从后向前添加
          var el = children[i]
          if (el == null) {
              el = ''
          }
          var type = typeof el
          if (el === '' || type === 'boolean') {
              continue
          }
          if (/number|string/.test(type) || el.type === '#text') {
              if (el === '' || el.text == '') {
                  continue
              }
              if (ret.merge) {
                  ret[0].text = (el.type ? el.text : el) + ret[0].text
              } else {
                  ret.unshift(el.type ? el : { type: '#text', text: String(el) })
                  ret.merge = true
              }
          } else if (Array.isArray(el)) {
              flatChildren(el, ret)
          } else {
              ret.unshift(el)
              ret.merge = false
          }

      }
      return ret
  }
  /**
   * 
   * @param {any} vnode 
   * @param {any} container 
   */
  function render(vnode, container) {
      container.textContent = ''
      while (container.firstChild) {
          container.removeChild(container.firstChild)
      }
      var context = {}
      toDOM(vnode, context, container)
  }



  window.ReactDOM = React

  return React;

}));