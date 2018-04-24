export const gSBU = "getSnapshotBeforeUpdate";
export const gDSFP = "getDerivedStateFromProps";

export let effects = [];
export function resetStack(info) {
    keepLast(info.containerStack);
    keepLast(info.containerStack);
}
function keepLast(list) {
    var n = list.length;
    list.splice(0, n - 1);
}
