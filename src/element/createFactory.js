/**
 * Return a function that produces ReactElements of a given type.
 * See https://facebook.github.io/react/docs/top-level-api.html#react.createfactory
 */
import { createElement } from './createElement'
export default function createFactory(type, props) {
    var factory = createElement.bind(null, type, props)
    factory.type = type
    return factory
}