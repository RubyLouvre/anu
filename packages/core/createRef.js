export function createRef() {
    return {
        current: null,
    };
}

function RefComponent(fn){
    function RefProvider(props, ref){
        return fn(props, ref);
    }
    RefProvider.isRef = true;
    return RefProvider;
}
export function forwardRef(fn){
    return RefComponent(fn);
}