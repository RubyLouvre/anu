var modules = {
    current: "",
    componentName: "",
    walkingMethod: "",
    componentType: "",
    compiledMethods: [],
    reset() {
        modules.componentName = "";
        modules.walkingMethod = "";
        modules.componentType = "";
        modules.compiledMethods.length = 0;
    },
    setType(type) {
        var obj = modules[modules.current];
        
        if (obj) {
            obj.type = type;
        }else{
            console.log(modules.current, "XXXXXX")
        }
        modules.componentType = type;
    }

}
module.exports = modules;