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
         instance._currentElement._hostParent = hostParent

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
     var node = createDOMElement(vnode)
     vnode._hostNode = node
     initVchildren(vnode, node, parentContext)
     diffProps(props, {}, vnode, {})
     return node
 }
 var readyComponents = []
 //将虚拟DOM转换为真实DOM并插入父元素
 function initVchildren(vnode, node, parentContext) {
     let vchildren = vnode.props.children
     for (let i = 0, len = vchildren.length; i < len; i++) {
         node.appendChild(initVnode(vchildren[i], parentContext))

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

     let vnode = renderComponent(instance)
     instance._rendered = vnode
     if (instance.componentDidMount) {
         readyComponents.push(function () {
             instance.componentDidMount()
         })
     }
     let node = initVnode(vnode, getChildContext(instance, parentContext), instance)
     instanceMap.set(instance, node)
     //vcomponent._instance._rendered._hostNode === node


     return node
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

 function initVstateless(vstateless, parentContext) {
     let vnode = vstateless.type(vstateless, parentContext)
     vnode = checkNull(vnode)

     let node = initVnode(vnode, parentContext)
     stateless._rendered = vnode

     return node
 }


 function updateVstateless(vstateless, newVstateless, node, parentContext) {
     let vnode = vstateless._rendered

     let newVnode = vstateless.type(vstateless, parentContext)
     newVnode = checkNull(newVnode)

     let newNode = compareTwoVnodes(vnode, newVnode, node, parentContext)
     newVstateless._rendered = newVnode

     return newNode
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
     console.log('更新组件')
     var lastRendered = instance._rendered
     var node = instanceMap.get(instance)

     var baseVnode = instance.getBaseVnode()
     var hostParent = baseVnode._hostParent //|| lastRendered._hostParent

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
     console.log(lastRendered, rendered, node, context)
     var newNode = compareTwoVnodes(lastRendered, rendered, node, context)
     if (instance.componentDidUpdate) {
         //    updateComponents.push(function () {
         instance.componentDidUpdate(nextProps, nextState, context)
         //    })
     }

     return newNode
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
         console.log('updateVnode')
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
         vnode._hostNode = null
         vnode._hostParent = null
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
         console.log('update 元素节点')
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
console.log(vchildrenLen,newVchildrenLen)
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
    console.log(patches)
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
     if (!data.shouldIgnore) {
         if (!vnode.vtype) {
            if(vnode.text !== nextVnode.text){
                dom.nodeValue = nextVnode.text
            }
         } else if (vnode.vtype === 1) {
             updateVelem(vnode, nextVnode, dom, data.parentContext)
         } else if (vnode.vtype === 4) {
             dom = updateVstateless(vnode, nextVnode, dom, data.parentContext)
         } else if (vnode.vtype === 2) {
             dom = updateVcomponent(vnode, nextVnode, dom, data.parentContext)
         }
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