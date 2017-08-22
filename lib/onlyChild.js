function onlyChild(children) {
    var el = (children && children[0]) || null;
    if (el && el.vtype) {
        return el
    }
    return el
}

module.exports = onlyChild;