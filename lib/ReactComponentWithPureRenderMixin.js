//by 司徒正美

let shallowEqual = require('../src/shallowEqual')

function shallowCompare(instance, nextProps, nextState) {
  return !shallowEqual(instance.props, nextProps) || !shallowEqual(instance.state, nextState)
}

module.exports = shallowCompare
