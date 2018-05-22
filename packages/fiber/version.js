
export function addVersion(a) {
    var map = a.parent.__map__;
    var list = [], b = a;
    while (a) {
        list.unshift(a.index);
        if (a.return && a.return.tag < 3) {
            a = a.return;
        } else {
            break;
        }
    }
    map[list.join(".")] = b;
}
export function toList(obj){
    var list = [];
    for(var i in obj){
        list.push(obj[i]);
    }
    return list.sort(versionCompare);
}
export function removeVersion(a) {
    var map = a.parent.__map__;
    for (var i in map) {
        if (map[i] === a) {
            delete map[i];
            break;
        }
    }
 
}
export function versionCompare(stra, strb) {
    var straArr = stra.split(".");
    var strbArr = strb.split(".");
    var maxLen = Math.max(straArr.length, strbArr.length);
    var result, sa, sb;
    for (var i = 0; i < maxLen; i++) {
        sa = ~~straArr[i];
        sb = ~~strbArr[i];
        if (sa > sb) {
            result = 1;
        } else if (sa < sb) {
            result = -1;
        } else {
            result = 0;
        }
        if (result !== 0) {
            return result;
        }
    }
    return result;
}



