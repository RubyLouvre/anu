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

/**
 * https://segmentfault.com/a/1190000008402834
1. CreateClass, unless you really don't know anything about the grammar of the ES6,
 otherwise don't use this way to define the component.
2. Stateless Functional Component, for don't need internal state, 
 and in less than life cycle function components, we can use this way to define components,
 such as display a list of components, the list items can be defined as 
 a Stateless Functional Component.
3. PureComponent/Component with internal state, the use function of the life cycle of the Component,
  we can use one of the two, but in most cases, I recommend using PureComponent more, 
  because it provides better performance, forcing you to use immutable object at the same time,
  keep good programming habits.
 */