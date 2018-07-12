var modules = {
  current: "",
  componentName: "",
  walkingMethod: "",
  componentType: "",
  thisMethods: [],
  staticMethods: [],
  thisProperties: [],
  importComponents: {},
  usedComponents: {},
  uuid: 1,
  reset() {
    modules.componentName = "";
    modules.walkingMethod = "";
    modules.componentType = "";
    modules.className = "";
    modules.ctorFn = null;
    modules.parentNode = "";
    modules.thisMethods.length = 0;
    modules.staticMethods.length = 0;
    modules.thisProperties.length = 0;
    modules.importComponents = {}
    modules.usedComponents = {}
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
