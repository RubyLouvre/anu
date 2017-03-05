import Component from './Component'

export default function PureComponent(props, context) {
    Component.call(this, props, context)
}

function ComponentDummy() {}
var dummy = ComponentDummy.prototype = Component.prototype;
var pure = PureComponent.prototype = new ComponentDummy()
for (var i in dummy) {
    pure[i] = dummy[i]
}

pure.constructor = PureComponent
pure.isPureReactComponent = true
pure.shouldComponentUpdate = shallowCompare

function shallowCompare(nextProps, nextState) {
    return !shallowEqual(this.props, nextProps) ||
        !shallowEqual(this.state, nextState)
}

export function shallowEqual(objA, objB) {
    if (objA === objB) {
        return true
    }

    if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
        return false
    }

    var keysA = Object.keys(objA)
    var keysB = Object.keys(objB)

    if (keysA.length !== keysB.length) {
        return false
    }

    // Test for A's keys different from B.
    for (var i = 0; i < keysA.length; i++) {
        if (!objB.hasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
            return false
        }
    }

    return true
}