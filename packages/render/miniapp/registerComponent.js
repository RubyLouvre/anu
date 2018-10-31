import { createElement } from 'react-core/createElement';
export var registeredComponents = {};
export function useComponent(props) {
    var is = props.is;
    var clazz = registeredComponents[is];
    delete props.is;
    var args = [].slice.call(arguments, 2);
    args.unshift(clazz, props);
    return createElement.apply(null, args);
}