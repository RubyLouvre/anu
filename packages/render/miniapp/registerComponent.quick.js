import { registeredComponents, usingComponents, refreshComponent, disposeComponent } from './utils'
import { dispatchEvent } from './eventSystem.quick'

export function registerComponent (type, name) {
  type.wxInstances = {}
  registeredComponents[name] = type
  let reactInstances = type.reactInstances = []
  return {
    data() {
      return {
        props: {},
        state: {},
        context: {}
      }
    },
    onReady() {
      usingComponents[name] = type
      let uuid = this.dataInstanceUid || null
      refreshComponent(reactInstances, this, uuid)
    },
    onDestroy: disposeComponent,
    dispatchEvent: dispatchEvent
  }
}
