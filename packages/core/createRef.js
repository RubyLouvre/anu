export function createRef() {
    return {
        current: null,
    };
}


export function forwardRef(fn) {
    return function ForwardRefComponent(props){
        return fn(props, this.ref)   // createElement(type, props)
    }
}