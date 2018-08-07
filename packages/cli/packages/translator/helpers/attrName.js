module.exports = function mapPropName(path) {
    var orig = path.node.name.name;
    if(/^catch[A-Z]/.test(orig)){
        path.node.name.name = "catch" + orig.slice(5).toLowerCase();
        console.log( path.node.name.name, "!!!!")
    }else if (/^on[A-Z]/.test(orig)) {
        path.node.name.name = "bind" + orig.slice(2).toLowerCase();
    } else {
        if (orig === "className") {
            path.node.name.name = "class";
        }
    }
};
