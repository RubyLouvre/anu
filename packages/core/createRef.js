export function createRef() {
    return {
        current: null,
    };
}

export function forwardRef(fn){
    createRef.render = fn;
    return createRef;
}