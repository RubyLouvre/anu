import { emptyObject } from "react-core/util";

export const componentStack = [];
export const effects = [];

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
