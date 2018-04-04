export const updateQueue = [];
export const componentStack = [];
export const effects = [];
export const topFibers = [];
export const topNodes = [];
export const emptyArray = [];
export const emptyObject = {};
export const containerStack = [];
export const contextStack = [emptyObject];
export function resetStack() {
    containerStack.length = 0;
    contextStack.length = 0;
    contextStack.push(emptyObject);
}
export function hasContextChanged() {
    return contextStack[0] != emptyObject;
}