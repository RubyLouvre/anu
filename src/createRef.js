export function createRef() {
    return {
        current: null,
    };
}
/*
早期的refs是严重依赖于 虚拟DOM的_owner属性，每次实例化组件时，
要改写Refs.currentOwner，然后普通虚拟DOM（type为字符串的），
要将自己的_owner指向 Refs.currentOwner。显然，现在React想简化createElement与实例化的流程，
必须要搞掉Refs.currentOwner与_owner，于是就有了createRef与React.forwardedRef
*/