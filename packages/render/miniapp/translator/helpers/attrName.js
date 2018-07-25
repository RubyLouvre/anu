
module.exports = function mapPropName(path) {
  var orig = path.node.name.name;
  if (/^on[A-Z]/.test(orig)) {
    path.node.name.name = "bind"+ orig.slice(2).toLowerCase();
  }else {
    if (orig === "className") {
      path.node.name.name = "class";
    }
  }
};
