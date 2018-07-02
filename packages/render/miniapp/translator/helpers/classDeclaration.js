const t = require("babel-types");
const template = require("babel-template");
const modules = require("../modules");


module.exports = {
    enter(path) {
      //重置数据
      let className = path.node.superClass ? path.node.superClass.name : "";
      let match = className.match(/\.?(App|Page|Component)/);
      if (match) {
        //获取类的组件类型与名字
        var componentType = match[1];
        if (componentType === "Component") {
          modules.componentName = path.node.id.name;
        } else {
          modules.componentName = "";
        }
        modules.setType(componentType);
      }
    },
    exit(path) {
      // 将类表式变成函数调用
      const call = t.expressionStatement(
        t.callExpression(t.identifier(modules.componentType), [
          t.callExpression(t.identifier("onInit"), [
            t.objectExpression(modules.compiledMethods)
          ])
        ])
      );
      //onInit也是一个函数声明，但它不会跑到visitor的FunctionDeclaration里面，因为它上面已经有
      //modules.componentType进行隔离
      var onInit = template(`function onInit(config){
        if(config.hasOwnProperty("constructor")){
          config.constructor.call(config);
        }
        config.data = config.state;
        delete config.state;
        return config;
      }`)({});
      //插入到最前面
      path.parentPath.parentPath.insertBefore(onInit);
      //可以通过`console.log(generate(call).code)`验证
      path.replaceWith(call);
    }
  };
  