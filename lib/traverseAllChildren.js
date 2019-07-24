//by 司徒正美

var ReactChildren = require("./ReactChildren");

function traverseAllChildren(children, callback, traverseContext) {
    if (children == null) {
        return 0;
    }
    var arr = ReactChildren.toArray(children);
    arr.forEach(callback, traverseContext);
    return arr.length;
}

module.exports = traverseAllChildren;