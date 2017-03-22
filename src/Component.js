import { transaction } from './transaction'
import { updateComponent } from './diff'
import { clone, extend } from './util'

/**
 * 
 * 
 * @param {any} props 
 * @param {any} context 
 */
export function Component(props, context) {
    this.context = context
    this.props = props
    this.uuid = Math.random()

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
        transaction.enqueue({
            component: this,
            state: state,
            init: initSetState,
            exec: execSetState
        })
    },

    forceUpdate() {
        updateComponent(this);
    },

    render() {}

}

function initSetState() { //这里只处理参数
    var component = this.component
    var s = component.state
    var state = this.state
    component.prevState = component.prevState || clone(s)
    extend(s, state)

}

function execSetState() { //这里触发视图更新
    updateComponent(this.component)
}