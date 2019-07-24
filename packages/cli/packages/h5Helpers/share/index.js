import mergeWith from 'lodash.mergewith';

function customizer(objValue,srcValue) {
    if (Array.isArray(objValue)){
        return objValue.concat(srcValue);
    }
}
export function deepMerge(...args) {
    return mergeWith(...args, customizer);
}