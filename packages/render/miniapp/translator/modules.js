var modules = {
  current: "",
  componentName: "",
  walkingMethod: "",
  componentType: "",
  compiledMethods: [],
  importComponents: {},
  uuid: 1,
  reset() {
    modules.componentName = "";
    modules.walkingMethod = "";
    modules.componentType = "";
    modules.compiledMethods.length = 0;
    modules.importComponents = {}
  },
  set(key, value) {
    var obj = modules[modules.current];
    if (obj) {
      obj[key] = value;
    }
  },
  setType(type) {
    modules.set("type", type);
    modules.componentType = type;
  }
};
module.exports = modules;
