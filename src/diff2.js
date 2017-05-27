 import {
     diffProps,

 } from './diffProps'
 import {
     CurrentOwner
 } from './CurrentOwner'
 import {
     applyComponentHook
 } from './lifecycle'
 import {
     getChildContext,
     HTML_KEY,
     options,
     noop,
     extend,
     getNodes
 } from './util'
 import {
     document,
     createDOMElement
 } from './browser'

 export function render(vnode, container, callback) {
     return renderTreeIntoContainer(vnode, container, callback)
 }

 function renderTreeIntoContainer(vnode, container, callback, parentContext) {
     if (!vnode.vtype) {
         throw new Error(`cannot render ${ vnode } to container`)
     }
     if (!container || container.nodeType !== 1) {
         throw new Error(`container ${container} is not a DOM element`)
     }
     var prevVnode = container._component,
         rootNode,
         hostParent = {
             _hostNode: container
         }
     if (!prevVnode) {

         var nodes = getNodes(container)
         for (var i = 0, el; el = nodes[i++];) {
             if (el.getAttribute && el.getAttribute('data-reactroot') !== null) {
                 hostNode = el
                 vnode._prevCached = el //进入节点对齐模块
             } else {
                 el
                     .parentNode
                     .removeChild(el)
             }
         }
         prevVnode = {}
         vnode._hostParent = hostParent
         rootNode = initVnode(vnode, {})
         container.appendChild(rootNode)
     } else {
         rootNode = diffVnode(vnode, prevVnode, container.firstChild, {})
     }
     // 如果存在后端渲染的对象（打包进去），那么在ReactDOM.render这个方法里，它就会判定容器的第一个孩子是否元素节点
     // 并且它有data-reactroot与data-react-checksum，有就根据数据生成字符串，得到比较数

     if (rootNode.setAttribute) {
         rootNode.setAttribute('data-reactroot', '')
     }

     var instance = vnode._instance
     container._component = vnode
     delete vnode._prevCached
     if (instance) { //组件返回组件实例，而普通虚拟DOM 返回元素节点
      //   instance._currentElement._hostParent = hostParent

         return instance

     } else {
         return rootNode
     }

 }

 function diffVnode() {}
 export function initVnode(vnode, parentContext) {
     let {
         vtype
     } = vnode
     let node = null
     if (!vtype) { // init text comment
         node = createDOMElement(vnode)
         vnode._hostNode = node
         return node
     }
     if (vnode.__ref) {
         readyComponents.push(function () {
             console.log('attach ref')
             vnode.__ref(vnode._instance || vnode._hostNode)
         })
     }
     if (vtype === 1) { // init element
         node = initVelem(vnode, parentContext)
    
     } else if (vtype === 2) { // init stateful component
         node = initVcomponent(vnode, parentContext)

     } else if (vtype === 4) { // init stateless component
         node = initVstateless(vnode, parentContext)
     }
     return node
 }

 function initVelem(vnode, parentContext) {
     let {
         type,
         props
     } = vnode
     let node = createDOMElement(vnode)
     vnode._hostNode = node
     initVchildren(vnode, node, parentContext)
     diffProps(props, {}, vnode, {})
     return node
 }
 var readyComponents = []
 //将虚拟DOM转换为真实DOM并插入父元素
 function initVchildren(vnode, node, parentContext) {
     let vchildren = vnode.props.children
     for (let i = 0, n = vchildren.length; i < n; i++) {
         let el = vchildren[i]
         el._hostParent = vnode
  console.log(el)
         node.appendChild(initVnode(el, parentContext))
     }
   
     if (readyComponents.length) {
         fireMount()
     }
 }

 function fireMount() {
     var queue = readyComponents.concat()
     readyComponents.length = 0
     for (var i = 0, cb; cb = queue[i++];) {
         cb()
     }
 }


 var pendingComponents = []
 var instanceMap = new Map()

 function initVcomponent(vcomponent, parentContext) {
     let {
         type,
         props,
         uid
     } = vcomponent

     let instance = new type(props, parentContext)　 //互相持有引用

     vcomponent._instance = instance
     instance._currentElement = vcomponent
     instance.props = instance.props || props
     instance.context = instance.context || parentContext

     if (instance.componentWillMount) {
         instance.componentWillMount()
     }
     //如果一个虚拟DOM vnode的type为函数，那么对type实例化所得的对象instance来说
     // instance._currentElement = vnode
     // instance有一个render方法，它会生成下一级虚拟DOM ，如果是返回false或null，则变成
     // 空虚拟DOM {type: '#comment', text: 'empty'}
     // 这个下一级虚拟DOM，对于instance来说，为其_rendered属性

     let rendered = renderComponent(instance)
     instance._rendered = rendered
     rendered._hostParent = vcomponent._hostParent
     if (instance.componentDidMount) {
         readyComponents.push(function () {
             instance.componentDidMount()
         })
     }
     let dom = initVnode(rendered, getChildContext(instance, parentContext))
     instanceMap.set(instance, dom)
     //vcomponent._instance._rendered._hostNode === node


     return dom
 }

 export function renderComponent(instance, parentContext) {
     CurrentOwner.cur = instance
     let vnode = instance.render()
     CurrentOwner.cur = null
     return checkNull(vnode)

 }

 function checkNull(vnode, type) {
     if (vnode === null || vnode === false) {
         return {
             type: '#comment',
             text: 'empty'
         }
     } else if (!vnode || !vnode.vtype) {
         throw new Error(`@${type.name}#render:You may have returned undefined, an array or some other invalid object`)
     }
     return vnode
 }

 function initVstateless(vnode, parentContext) {
     let rendered = vnode.type(vnode, parentContext)
     rendered = checkNull(rendered)

     let dom = initVnode(rendered, parentContext)
     vnode._rendered = rendered
     rendered._hostParent = vnode._hostParent
     return dom
 }


 function updateVstateless(lastVnode, nextVnode, node, parentContext) {
     let vnode = lastVnode._rendered

     let newVnode = nextVnode.type(nextVnode.props, parentContext)
     newVnode = checkNull(newVnode)

     let dom = compareTwoVnodes(vnode, newVnode, node, parentContext)
     nextVnode._rendered = newVnode

     return dom
 }

 function destroyVstateless(vnode, node) {
     destroyVnode(vnode._rendered, node)
 }


 //将Component中这个东西移动这里
 options.immune.updateComponent = function updateComponentProxy(instance) { //这里触发视图更新

     updateComponent(instance)
     instance._forceUpdate = false
 }



 var updateComponents = []

 function updateComponent(instance) { // instance._currentElement

     var {
         props,
         state,
         context,
         lastProps
     } = instance
     var lastRendered = instance._rendered
     var node = instanceMap.get(instance)


     var hostParent = lastRendered._hostParent
console.log('updateComponent')
     var nextProps = props
     lastProps = lastProps || props
     var nextState = instance._processPendingState(props, context)

     instance.props = lastProps
     delete instance.lastProps
     //生命周期 shouldComponentUpdate(nextProps, nextState, nextContext)
     if (!instance._forceUpdate && applyComponentHook(instance, 4, nextProps, nextState, context) === false) {
         return node //注意
     }
     //生命周期 componentWillUpdate(nextProps, nextState, nextContext)
     if (instance.componentWillUpdate) {
         instance.componentWillUpdate(nextProps, nextState, context)
     }

     instance.props = nextProps
     instance.state = nextState
     delete instance._updateBatchNumber

     var rendered = renderComponent(instance)
     context = getChildContext(instance, context)
     instance._rendered = rendered
     rendered._hostParent = hostParent

     var dom = compareTwoVnodes(lastRendered, rendered, node, context)
     instanceMap.set(instance, dom)
     if (instance.componentDidUpdate) {
         //    updateComponents.push(function () {
         instance.componentDidUpdate(nextProps, nextState, context)
         //    })
     }

     return dom
 }

 export function compareTwoVnodes(vnode, newVnode, node, parentContext) {
     let newNode = node
     if (newVnode == null) {
         // remove
         destroyVnode(vnode, node)
         node.parentNode.removeChild(node)
     } else if (vnode.type !== newVnode.type || vnode.key !== newVnode.key) {
         // replace
         destroyVnode(vnode, node)
         newNode = initVnode(newVnode, parentContext)
         node.parentNode.replaceChild(newNode, node)
     } else if (vnode !== newVnode) {
         console.log('compareTwoVnodes')
         // same type and same key -> update
         newNode = updateVnode(vnode, newVnode, node, parentContext)
     }
     return newNode
 }

 export function destroyVnode(vnode, node) {
     let {
         vtype
     } = vnode
     if (!vtype) {
         //   vnode._hostNode = null
         //   vnode._hostParent = null
     } else if (vtype === 1) { // destroy element
         destroyVelem(vnode, node)
     } else if (vtype === 2) { // destroy state component
         destroyVcomponent(vnode, node)
     } else if (vtype === 4) { // destroy stateless component
         destroyVstateless(vnode, node)
     }
 }

 function destroyVelem(vnode, node) {
     var {
         props
     } = vnode
     var vchildren = props.children
     var childNodes = node.childNodes
     for (let i = 0, len = vchildren.length; i < len; i++) {
         destroyVnode(vchildren[i], childNodes[i])
     }
     vnode.__ref && vnode.__ref(null)
     vnode._hostNode = null
     vnode._hostParent = null
 }



 function destroyVcomponent(vnode, node) {
     var instance = vnode._instance
     if (instance) {
         instanceMap.delete(instance)
         if (instance.componentWillUnmount) {
             instance.componentWillUnmount()
         }
         vnode._instance = instance._currentElement = instance.props = null
         destroyVnode(instance._rendered, node)
     }
 }

 function updateVnode(vnode, newVnode, node, parentContext) {
     console.log('updateVnode')
     let {
         vtype
     } = vnode

     if (vtype === 2) {
         //类型肯定相同的
         return updateVcomponent(vnode, newVnode, node, parentContext)
     }

     if (vtype === 4) {
         return updateVstateless(vnode, newVnode, node, parentContext)
     }

     // ignore VCOMMENT and other vtypes
     if (vtype !== 1) {
         return node
     }

     let oldHtml = vnode.props[HTML_KEY] && vnode.props[HTML_KEY].__html
     if (oldHtml != null) {
         node.innerHTML = ''
         updateVelem(vnode, newVnode, node, parentContext)
         initVchildren(newVnode, node, parentContext)
     } else {

         updateVChildren(vnode, newVnode, node, parentContext)
         updateVelem(vnode, newVnode, node, parentContext)
     }
     return node
 }
 /**
  * 
  * 
  * @param {any} lastVnode 
  * @param {any} nextVnode 
  * @param {any} node 
  * @returns 
  */
 function updateVelem(lastVnode, nextVnode, node) {
     diffProps(nextVnode.props, lastVnode.props, nextVnode, lastVnode)
     if (lastVnode.__ref) {
         lastVnode.__ref(null)
     }
     if (nextVnode.__ref) {
         lastVnode.__ref(node)
     }
     return node
 }

 function updateVcomponent(vcomponent, newVcomponent, node, parentContext) {
     var instance = newVcomponent._instance = vcomponent._instance
     var nextProps = newVcomponent.props


     if (instance.componentWillReceiveProps) {
         instance.componentWillReceiveProps(nextProps, componentContext)
     }
     instance.prevProps = instance.props
     instance.props = nextProps

     if (vcomponent.__ref !== newVcomponent.__ref) {

         vcomponent.__ref && vcomponent.__ref(null)

     }
     if (inst._updateBatchNumber === globalBatchNumber) {
         return updateComponent(instance)
     } else {
         return node
     }
 }

 function updateVChildren(vnode, newVnode, node, parentContext) {
     console.log('updateVChildren', node)
     let patches = {
         removes: [],
         updates: [],
         creates: [],
     }
     diffVchildren(patches, vnode, newVnode, node, parentContext)
     patches.removes.forEach(applyDestroy)
     patches.updates.forEach(applyUpdate)
     patches.creates.forEach(applyCreate)
 }

 function diffVchildren(patches, vnode, newVnode, node, parentContext) {
     console.log('diffVchildren', node)
     let vchildren = vnode.props.children
     let childNodes = node.childNodes
     let newVchildren = newVnode.props.children
     let vchildrenLen = vchildren.length
     let newVchildrenLen = newVchildren.length

     if (vchildrenLen === 0) {
         if (newVchildrenLen > 0) {
             for (let i = 0; i < newVchildrenLen; i++) {
                 patches.creates.push({
                     vnode: newVchildren[i],
                     parentNode: node,
                     parentContext: parentContext,
                     index: i,
                 })
             }
         }
         return
     } else if (newVchildrenLen === 0) {
         for (let i = 0; i < vchildrenLen; i++) {
             patches.removes.push({
                 vnode: vchildren[i],
                 node: childNodes[i],
             })
         }
         return
     }


     let updates = Array(newVchildrenLen)
     let removes = null
     let creates = null
     // isEqual
     for (let i = 0; i < vchildrenLen; i++) {
         let vnode = vchildren[i]
         for (let j = 0; j < newVchildrenLen; j++) {
             if (updates[j]) {
                 continue
             }
             let newVnode = newVchildren[j]
             if (vnode === newVnode) {
                 updates[j] = {
                     shouldIgnore: true,
                     vnode: vnode,
                     newVnode: newVnode,
                     node: childNodes[i],
                     parentContext: parentContext,
                     index: j,
                 }
                 vchildren[i] = null
                 break
             }
         }
     }

     // isSimilar
     for (let i = 0; i < vchildrenLen; i++) {
         let vnode = vchildren[i]
         if (vnode === null) {
             continue
         }
         let shouldRemove = true
         for (let j = 0; j < newVchildrenLen; j++) {
             if (updates[j]) {
                 continue
             }
             let newVnode = newVchildren[j]
             if (
                 newVnode.type === vnode.type &&
                 newVnode.key === vnode.key
             ) {
                 updates[j] = {
                     vnode: vnode,
                     newVnode: newVnode,
                     node: childNodes[i],
                     parentContext: parentContext,
                     index: j,
                 }
                 shouldRemove = false
                 break
             }
         }
         if (shouldRemove) {
             if (!removes) {
                 removes = []
             }
             removes.push({
                 vnode: vnode,
                 node: childNodes[i]
             })
         }
     }

     for (let i = 0; i < newVchildrenLen; i++) {
         let item = updates[i]
         if (!item) {
             if (!creates) {
                 creates = []
             }
             creates.push({
                 vnode: newVchildren[i],
                 parentNode: node,
                 parentContext: parentContext,
                 index: i,
             })
         } else if (item.vnode.vtype === 1) {
             diffVchildren(patches, item.vnode, item.newVnode, item.node, item.parentContext)
         }
     }
     if (removes) {
         __push.apply(patches.removes, removes)
     }
     if (creates) {
         __push.apply(patches.creates, creates)
     }
     __push.apply(patches.updates, updates)
 }
 var __push = Array.prototype.push


 function applyUpdate(data) {
     if (!data) {
         return
     }
     let vnode = data.vnode
     let nextVnode = data.newVnode
     let dom = data.node

     // update

     if (!vnode.vtype) {
         if (vnode.text !== nextVnode.text) {
             console.log('update nodeValue')
             dom.nodeValue = nextVnode.text
         }
     } else if (vnode.vtype === 1) {
         updateVelem(vnode, nextVnode, dom, data.parentContext)
     } else if (vnode.vtype === 4) {
         dom = updateVstateless(vnode, nextVnode, dom, data.parentContext)
     } else if (vnode.vtype === 2) {
         dom = updateVcomponent(vnode, nextVnode, dom, data.parentContext)
     }


     // re-order
     let currentNode = dom.parentNode.childNodes[data.index]
     if (currentNode !== dom) {
         dom.parentNode.insertBefore(dom, currentNode)
     }
     return dom
 }


 function applyDestroy(data) {
     destroyVnode(data.vnode, data.node)
     data.node.parentNode.removeChild(data.node)
 }

 function applyCreate(data) {
     let node = initVnode(data.vnode, data.parentContext, data.parentNode.namespaceURI)
     data.parentNode.insertBefore(node, data.parentNode.childNodes[data.index])
 }