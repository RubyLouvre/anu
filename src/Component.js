 import {
     clone,
     extend,
     isEvent,
     isSameType,
     isComponent,
     getInstances,
     matchInstance
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
     var rendered = instance.render() // 1

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
     var prevProps = prevVnode.props
     var prevChildren = prevProps.children
     var Type = vnode.type
     if (!dom || !isSameType(dom, vnode)) {
         //更新组件
         if (typeof Type === 'function') {
             var instance = prevVnode.instance
             if (instance) {
                 instance = matchInstance(instance, Type)
                 if (instance) {
                     //如果类型相同，使用旧的实例进行 render新的虚拟DOM
                     vnode.instance = instance
                     var prevProps = instance.prevProps
                     var nextProps = vnode.props
                     instance.props = prevProps
                     applyComponentHook(instance, 3, nextProps)
                     instance.prevProps = prevProps
                     instance.props = nextProps
                     return updateComponent(instance, context)

                 } else {
                     removeComponent(oldVnode)
                 }
             }
             //这里创建新组件
             return toDOM(vnode, context, parentNode, oldVnode.dom)
         }
         //更新普通元素节点
         var nextDom = createElement(type)
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
  * 
  * 
  * @param {any} parentNode 
  * @param {any} newChildren 
  * @param {any} context 
  * @param {any} oldChildren 
  */
 function diffChildren(parentNode, newChildren, context, oldChildren) {
     var childNodes = parentNode.childNodes
     for (var i = 0, n = newChildren.length; i < n; i++) {
         var vnode = newChildren[i]
         var old = oldChildren[i]
         if (vnode && old) { //假设两者都存在
             if (vnode.type === old.type) {
                 if (vnode.type === '#text') { //#text === #text
                     if (vnode.text !== old.text) {
                         vnode.dom = old.dom
                         vnode.dom.nodeValue = vnode.text
                     }
                 } else {
                     vnode.dom = diff(old.dom, vnode, context, parentNode, old)
                 }
             } else if (vnode.type === '#text') { //#text === p
                 var dom = document.createTextNode(vnode.text)
                 vnode.dom = dom
                 parentNode.replaceChild(dom, old.dom)
                 removeComponent(old)
             } else {
                 vnode.dom = diff(old.dom, vnode, context, parentNode, old)
             }
             delete old.dom //clear reference
         } else if (!old) {
             vnode.dom = toDOM(vnode, context, parentNode)
         }
     }
     if (oldChildren.length > newChildren.length) {
         for (var i = newChildren.length, n = oldChildren.length; i < n; i++) {
             var el = oldChildren[i]
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
         if (vnode.instance) {
             instance.parentInstance = vnode.instance
             vnode.instance.childInstance = instance
         }


         instance.prevProps = vnode.props //实例化时prevProps
         instance.vnode = vnode
             //压扁组件Vnode为普通Vnode
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