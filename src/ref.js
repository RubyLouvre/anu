
  //fix 0.14对此方法的改动，之前refs里面保存的是虚拟DOM
  function getDOMNode() {
      return this
  }

/**
 * 收集DOM到组件实例的refs中
 * 
 * @param {any} instance 
 * @param {any} ref 
 * @param {any} dom 
 */
export function patchRef(instance, ref, dom) {
    if (typeof ref === 'function') {
        ref(dom)
    } else if (instance && typeof ref === 'string') {
        instance.refs[ref] = dom
        dom.getDOMNode = getDOMNode
    }
}

export function removeRef(instance, ref) {
    if (typeof ref === 'function') {
        ref(null)
    }else if (instance && typeof ref === 'string') {
        delete instance.refs[ref]
    }
}