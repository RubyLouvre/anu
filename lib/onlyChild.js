function onlyChild(children) {
    var el = children && children.slice && children.slice(0,1) || null;
    if (el && el.vtype) {
        return el
    }
    return el
}

module.exports = onlyChild;