 import {
     clone,
     extend,
     isEvent,
     isSameType,
     isComponent,
     getInstances,
     matchInstance,
     isStateless
 } from './util'
 import { applyComponentHook } from './lifecycle'

 /**
  * 
  * 
  * @param {any} props 
  * @param {any} context 
  */
 export function Component(props, context) {
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
         // vnode.instance = void 666
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
 function diff(dom, vnode, context, parentNode, prevVnode) { //updateComponent
     var prevProps = prevVnode.props　 || {}
     var prevChildren = prevProps.children || []
     var Type = vnode.type

     //更新组件
     var isComponent = typeof Type === 'function'
     var instance = prevVnode.instance

     if (instance) {
         instance = isComponent && matchInstance(instance, Type)
         if (instance) { //如果类型相同，使用旧的实例进行 render新的虚拟DOM
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
             if (prevVnode.type !== Type) {
                 removeComponent(prevVnode)
             }
         }
     }
     if (isComponent)
         return toDOM(vnode, context, parentNode, prevVnode.dom)
     if (prevVnode.type !== Type) { //这里只能是element 与#text
         var nextDom = document.createElement(Type)
         if (dom) {
             while (dom.firstChild) {
                 nextDom.appendChild(dom.firstChild)
             }
             if (parentNode) {
                 parentNode.replaceChild(nextDom, dom)
             }
         }
         dom = nextDom
     }
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
 export function diffProps(dom, props, nextProps) {
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
  * 获取虚拟DOM对应的顶层组件实例的类型
  * 
  * @param {any} vnode 
  * @param {any} instance 
  * @param {any} pool 
  */
 function getTopComponentName(vnode, instance) {
     while (instance.parentInstance) {
         instance = nstance.parentInstance
     }
     var ctor = instance.statelessRender || instance.constructor
     return (ctor.displayName || ctor.name)
 }

 /**
  * 
  * 
  * @param {any} type 
  * @param {any} vnode 
  * @returns 
  */
 function computeUUID(type, vnode) {
     if (type === '#text') {
         return type + '/' + vnode.deep + '/' + vnode.text
     }
     return type + ':' + vnode.deep + (vnode.key !== null ? '/' + vnode.key : '')
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
     //第一步，根据实例的类型，nodeName, nodeValue, key与数组深度 构建hash
     var mapping = {}
     for (let i = 0, n = oldChildren.length; i < n; i++) {
         let vnode = oldChildren[i]
         let tag = vnode.instance ? getTopComponentName(vnode, vnode.instance) : vnode.type
         let uuid = computeUUID(tag, vnode)
         if (mapping[uuid]) {
             mapping[uuid].push(vnode)
         } else {
             mapping[uuid] = [vnode]
         }
     }

     //第二步，遍历新children, 从hash中取出旧节点
     var removedChildren = oldChildren.concat()
     for (let i = 0, n = newChildren.length; i < n; i++) {
         let vnode = newChildren[i];
         let Type = vnode.type
         let tag = typeof Type === 'function' ? (vnode._hasInstance = 1, Type.displatName || Type.name) : Type
         let uuid = computeUUID(tag, vnode)

         if (mapping[uuid]) {
             var matchNode = mapping[uuid].shift()
             if (!mapping[uuid].length) {
                 delete mapping[uuid]
             }
             if (matchNode) {
                 let index = removedChildren.indexOf(matchNode)
                 removedChildren.splice(index, 1)
                 vnode.old = matchNode
                 matchNode.use = true
             }
         }
     };


     //第三，逐一比较
     for (let i = 0, n = newChildren.length; i < n; i++) {
         let vnode = newChildren[i]
         let old = null
         if (vnode.old) {
             old = vnode.old
         } else {
             var k
             loop:
                 while (k = removedChildren.shift()) {
                     if (!k.use) {
                         old = k
                         break loop
                     }
                 }
         }
         if (vnode && old) { //假设两者都存在
             if (vnode.old && vnode._hasInstance) {
                 delete vnode.old
                 delete vnode._hasInstance
                 vnode.action = '重复利用旧的实例更新组件' //action只是调试用
                 vnode.dom = diff(old.dom, vnode, context, parentNode, old)
             } else if (vnode.type === old.type) {
                 if (vnode.type === '#text') {
                     vnode.dom = old.dom

                     if (vnode.text !== old.text) {
                         vnode.action = '改文本'
                         vnode.dom.nodeValue = vnode.text
                     } else {
                         vnode.action = '不改文本'
                     }
                 } else { //元素节点的比较
                     vnode.action = '更新元素'
                     vnode.dom = diff(old.dom, vnode, context, parentNode, old)
                 }
             } else if (vnode.type === '#text') { //#text === p
                 var dom = document.createTextNode(vnode.text)
                 vnode.dom = dom
                 parentNode.removeChild(old.dom)
                 vnode.action = '替换为文本'
                 removeComponent(old) //移除元素节点或组件
             } else {
                 vnode.action = '替换为元素'
                 vnode.dom = diff(old.dom, vnode, context, parentNode, old)
             }
             //当这个孩子是上级祖先传下来的，那么它是相等的
             if (vnode !== old) {
                 delete old.dom //clear reference
             }
         } else if (!old) { //添加新组件或元素节点
             vnode.action = '添加新' + (vnode.type === '#text' ? '文本' : '元素')
             if (!vnode.dom) {
                 vnode.dom = toDOM(vnode, context, parentNode, oldChildren[i] && oldChildren[i].dom || null)
             }
         }
         if (!parentNode.contains(vnode.dom)) {
             parentNode.insertBefore(vnode.dom, newChildren[i].dom.nextSibling)
         }
     }

     //第4步，移除无用节点
     if (removedChildren.length) {
         for (let i = 0, n = removedChildren.length; i < n; i++) {
             let vnode = removedChildren[i]
             parentNode.removeChild(vnode.dom)
             vnode.props && removeComponent(vnode)
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
         var key = vnode.key
         extend(vnode, rendered)
         vnode.key = key
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
 export function toDOM(vnode, context, parentNode, replaced) {
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

 var reg = /[^01689]/

 function get(min, max) {
     var minArray = (min + "").split('') // 1 2 3
     var maxArray = (max + "").split('') //   4 4
     var index = {}
     for (var i = 0; i < maxArray.lenght; i++) {
         var c = maxArray[i]
         var d = minArray[i]
         if (c && d) {
             index[i] = inner(d + 0, 9)
         } else {
             index[i] = [d + 0]
         }
     }
     console.log(index)
 }
 var factor = [0, 1, 6, 8, 9]

 function inner(start, end) {
     var ret = []
     for (var i = 0, n = factor.length; i < n; i++) {
         if (start > factor[i]) {
             ret.push(factor[i])
         }
     }
     return ret
 }