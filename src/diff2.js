 function render(vnode, container, callback) {
     return renderTreeIntoContainer(vnode, container, callback)
 }

 function renderTreeIntoContainer(vnode, container, callback, parentContext) {
     if (!vnode.vtype) {
         throw new Error(`cannot render ${ vnode } to container`)
     }
     if (!container || container.nodeType !== 1) {
         throw new Error(`container ${container} is not a DOM element`)
     }
     prevVnode = container._component, rootNode
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

 export function initVnode(vnode, parentContext) {
     let {
         vtype
     } = vnode
     let node = null
     if (!vtype) { // init text comment
         node = createDOMElement(vnode)
         vnode._hostNode = node
     } else if (vtype === 1) { // init element
         node = initVelem(vnode, parentContext)
     } else if (vtype === 2) { // init stateful component
         node = initVcomponent(vnode, parentContext)
     } else if (vtype === 4) { // init stateless component
         node = initVstateless(vnode, parentContext)
     }
     return node
 }

 function initVelem(velem, parentContext) {
     let {
         type,
         props
     } = velem
     var node = createDOMElement(vnode)
     vnode._hostNode = node
     initVchildren(velem, node, parentContext)
     diffProps(props, {}, velem, {})
     return node
 }

 //将虚拟DOM转换为真实DOM并插入父元素
 function initVchildren(velem, node, parentContext) {
     let vchildren = vnode.props.children
     for (let i = 0, len = vchildren.length; i < len; i++) {
         node.appendChild(initVnode(vchildren[i], parentContext))
     }
 }


 function initVstateless(vstateless, parentContext) {
     let vnode = renderVstateless(vstateless, parentContext)
     vnode = checkNull(vnode)
     let node = initVnode(vnode, parentContext)

     return node
 }


 var pendingComponents = []

 function initVcomponent(vcomponent, parentContext) {
     let {
         type,
         props,
         uid
     } = vcomponent

     let instance = new Component(props, componentContext)
     instance._currentElement = vcomponent

     instance.props = instance.props || props
     vcomponent._instance = instance
     //vcomponent._instance._rendered._hostNode === node
     instance.context = instance.context || parentContext

     if (instance.componentWillMount) {
         instance.componentWillMount()
     }

     let vnode = renderComponent(instance)
     instance._rendered = vnode

     let node = initVnode(vnode, getChildContext(instance, parentContext))


     //   node.cache = node.cache || {}
     //   node.cache[uid] = instance

     //   cache.vnode = vnode
     //   cache.node = node
     //   cache.isMounted = true
     pendingComponents.push(instance)

     return node
 }

 export function renderComponent(instance, parentContext) {
     let vnode = instance.render()
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
 export function getChildContext(instance, parentContext) {
     if (instance.getChildContext) {
         let curContext = instance.getChildContext()
         if (curContext) {
             parentContext = Object.assign({}, parentContext, curContext)
         }
     }
     return parentContext
 }

  function updateVstateless(vstateless, newVstateless, node, parentContext) {
     let uid = vstateless.uid
     let vnode = node.cache[uid]
     delete node.cache[uid]
     let newVnode = renderVstateless(newVstateless, parentContext)
     let newNode = compareTwoVnodes(vnode, newVnode, node, parentContext)
     newNode.cache = newNode.cache || {}
     newNode.cache[newVstateless.uid] = newVnode
     if (newNode !== node) {
         syncCache(newNode.cache, node.cache, newNode)
     }
     return newNode
 }


export function syncCache(cache, oldCache, node) {
    for (let key in oldCache) {
        if (!oldCache.hasOwnProperty(key)) {
            continue
        }
        let value = oldCache[key]
        cache[key] = value

        // is component, update component.$cache.node
        if (value.forceUpdate) {
            value.$cache.node = node
        }
    }
}