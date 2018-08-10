const t = require("babel-types");
const generate = require("babel-generator").default;
const nPath = require("path");
const template = require("babel-template");

const helpers = require("./helpers");
const modules = require("./modules");
const jsx = require("./jsx/jsx");


const fs = require('fs');
const fs_extra = require('fs-extra');
const chalk = require('chalk');





//const Pages = [];
//  miniCreateClass(ctor, superClass, methods, statics)
//参考这里，真想砍人 https://developers.weixin.qq.com/miniprogram/dev/framework/config.html

const isNpm = function(path){
    const _toString = Object.prototype.toString;
    if(_toString.call(path) !== '[object String]' || !path) return false;
    return !/^\/|\./.test(path);

}
const isAbsolute = function(path){
    return nPath.isAbsolute(path);
}
const isBuildInLibs = function(name){
    let libs = new Set(require('repl')._builtinLibs);
    return libs.has(name);
}
const copy_Node_Modules_To_Build_Npm = function(source){


    let node_modules_sources_path = nPath.join(process.cwd(), 'node_modules', source);
    let node_modeles_build_sources_path = nPath.join(process.cwd(), `/dist/npm/${source}`);
    let pkg = nPath.join(node_modules_sources_path, 'package.json');
    let mainFild = require(pkg).main;
    

    /**
     * 定向拷贝
     */

    //拷贝package.json
    let packageDest = nPath.join(node_modeles_build_sources_path, 'package.json');
    fs_extra.ensureFileSync(packageDest);
    fs_extra.copySync(
        pkg,
        packageDest
    )
    //拷贝package.json中main字段指向的模块
    let libSrc = nPath.join( node_modules_sources_path,  mainFild );
    let libDest = nPath.join(node_modeles_build_sources_path, mainFild);
    fs_extra.ensureFileSync(libDest)
    fs_extra.copySync(
        libSrc,
        libDest,
        {
            overwrite: true,
            errorOnExist:true,
        },
        function(err){
            if(err) console.log(err);
        }
    );
    

}


const get_mini_node_module_path = function(fileSourcePath, source){
   let from = nPath.dirname(fileSourcePath.replace('src', 'dist'));
   let to = '/dist/npm/';
   let _relative = nPath.relative(from, to);
   let node_modeles_build_sources_path = nPath.join(process.cwd(), `/dist/npm/${source}`);
   let pkg = nPath.join(node_modeles_build_sources_path, 'package.json');
   let mainFild = require(pkg).main;
   if(!mainFild){
       console.log(`无法读取${source} package, 请检查${source}目录下package.json中main字段是否正确`);
       process.exit(1);
    }
   let ast_value = nPath.join(
        _relative, 
        source, 
        mainFild.replace(/\.(js)/, '')
    )
   return ast_value;
}


var appValidKeys = {
    pages: 1,
    window: 1,
    tabBar: 1,
    networkTimeout: 1,
    debug: 1
};
var pageValidKeys = {
    navigationBarBackgroundColor: 1,
    navigationBarTextStyle: 1,
    navigationBarTitleText: 1,
    backgroundColor: 1,
    backgroundTextStyle: 1,
    enablePullDownRefresh: 1,
    disableScroll: 1,
    onReachBottomDistance: 1,
    component: 1,
    usingComponents: 1
};
module.exports = {
    ClassDeclaration: helpers.classDeclaration,
    //babel 6 没有ClassDeclaration，只有ClassExpression
    ClassExpression: helpers.classDeclaration,
    ClassMethod: {
        enter(path) {
            var methodName = path.node.key.name;
            modules.walkingMethod = methodName;
            if (methodName !== "constructor") {
                var fn = helpers.method(path, methodName);
                modules.thisMethods.push(fn);
            } else {
                var node = path.node;
                modules.ctorFn = t.functionDeclaration(
                    t.identifier(modules.className),
                    node.params,
                    node.body,
                    node.generator,
                    false
                );
            }
        },
        exit(path) {
            const methodName = path.node.key.name;
            if (methodName === "render") {
               // console.log("生成组件", modules.className, !! modules.className)
                //当render域里有赋值时, BlockStatement下面有的不是returnStatement,而是VariableDeclaration
                helpers.render(
                    path,
                    "有状态组件",
                    modules.className,
                    modules
                );
            }
        }
    },
    FunctionDeclaration: {
        //enter里面会转换jsx中的JSXExpressionContainer
        exit(path) {
            //函数声明转换为无状态组件
            var name = path.node.id.name;
            if (modules.componentType === "Component") {
                //需要想办法处理无状态组件
            }
        }
    },
    ImportDeclaration(path){
        let node = path.node;
        let source = node.source.value; 
        let specifiers = node.specifiers;
        if(modules.componentType === "App") {
            if(/\/pages\//.test(source)){
                path.remove();//移除分析依赖用的引用
            }
        }
        if(/\.(less|scss)$/.test( nPath.extname(source) )){
           path.remove(); 
        }

        specifiers.forEach((item)=>{
            //重点，保持所有引入的组件名及它们的路径，用于<import />
            modules.importComponents[item.local.name] = source
            if(item.local.name === 'React'){
               let from = nPath.dirname(modules.current.replace('src', 'dist'));
               let to = '/dist/';
               let relativePath = nPath.relative(from, to);
               let pathStart = '';
               if(relativePath === ''){
                 pathStart = './';
               }
   
               node.source.value =  `${pathStart}${nPath.join(relativePath, nPath.basename(node.source.value))}`
            }
        });


        //是否是绝对路径，小程序不支持绝对路径
        //是否是nodejs内置模块
        //是否是npm 模块
        //是否是本地模块

        //to do: 抛错提示
        if(isAbsolute(source) || isBuildInLibs(source) || !isNpm(source)) return;
        //复制到build npm目录
        copy_Node_Modules_To_Build_Npm(source); 

       
        //修改ast中 import(path)声明中的path路径
        node.source.value = get_mini_node_module_path(modules.current, source);

    },

    ExportNamedDeclaration: {
        //小程序在定义
        enter() {},
        exit(path) {
            var declaration = path.node.declaration;
            if (!declaration) {
                var map = path.node.specifiers.map(function(el) {
                    return helpers.exportExpr(el.local.name);
                });
                path.replaceWithMultiple(map);
            } else if (declaration.type === "Identifier") {
                path.replaceWith(
                    helpers.exportExpr(declaration.name, declaration.name)
                );
            } else if (declaration.type === "VariableDeclaration") {
                var id = declaration.declarations[0].id.name;
                declaration.kind = "var"; //转换const,let为var
                path.replaceWithMultiple([declaration, helpers.exportExpr(id)]);
            } else if (declaration.type === "FunctionDeclaration") {
                var id = declaration.id.name;
                path.replaceWithMultiple([declaration, helpers.exportExpr(id)]);
            }
        }
    },

    ClassProperty(path) {
        var key = path.node.key.name;
        if(key === 'config'){
            //写入page config json
            let curPath = modules.current;
            let dest = nPath.dirname(curPath).replace('src', 'dist');
            let baseName = nPath.basename(curPath).replace(/\.(js)$/, '');
            let destJSON = nPath.join(process.cwd(), dest,  `${baseName}.json`);
            const code = generate(path.node.value).code;
            let jsonStr = '';

            try{
                jsonStr = JSON.stringify(JSON.parse(code), null ,4);
            }catch(err){
                jsonStr = JSON.stringify(eval('(' + code + ')'), null , 4)  
            }

            fs_extra.ensureFileSync(destJSON)
            fs.writeFileSync(
                destJSON,
                jsonStr,
                (err)=>{
                    if(err) throw `生成${baseName}.json配置文件出错`;
                }
            );
        }
        if (path.node.static) {
            var keyValue = t.ObjectProperty(t.identifier(key), path.node.value);
            modules.staticMethods.push(keyValue);
        } 
        else {
            if (key == "globalData" && modules.componentType === "App") {
                var thisMember = t.assignmentExpression(
                    "=",
                    t.memberExpression(t.identifier("this"), t.identifier(key)),
                    path.node.value
                );
                modules.thisProperties.push(thisMember);
            }
        }
        path.remove();
    },
    MemberExpression(path) {},
    AssignmentExpression(path) {
        // 转换微信小程序component的properties对象为defaultProps
        if (modules.className) {
            const left = path.node.left;
            if (
                left.object.name === modules.className &&
                left.property.name === "defaultProps"
            ) {
                helpers.defaultProps(path.node.right.properties, modules);
                path.remove();
            }
        }
    },
    CallExpression(path) {
        var callee = path.node.callee || Object;
        if (modules.walkingMethod == "constructor") {
            //构造器里面不能执行setState，因此无需转换setData
            if (callee.type === "Super") {
                //移除super()语句
                path.remove();
            }
        } else if (
            modules.componentType === "Page" ||
            modules.componentType === "Component"
        ) {
            var property = callee.property;
            if (property && property.name === "setState") {
                // property.name = "setData";
            }
        }

        //to do: 解析 require(mode_modules)
        // if(callee.name === 'require') {
        //     if(isAbsolute(source) || isBuildInLibs(source) || !isNpm(source)) return;
        //     copy_Node_Modules_To_Build_Npm(source); 
        //     node.arguments[0].value = nPath.join(get_mini_node_module_path(modules.current), source);
        // }

    },

    //＝＝＝＝＝＝＝＝＝＝＝＝＝＝处理JSX＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    JSXOpeningElement: {
        //  enter: function(path) {},
        enter: function(path) {
            var nodeName = path.node.name.name;
            if (modules.importComponents[nodeName]) {
                modules.usedComponents[nodeName] = true;
                path.node.name.name = "React.template";
                var attributes = path.node.attributes;
                attributes.push(
                    jsx.createAttribute("templatedata", "data"+ jsx.createUUID()),
                    t.JSXAttribute(
                        t.JSXIdentifier("is"),
                        t.jSXExpressionContainer(t.identifier(nodeName))
                    )
                );
            } else {
                if (nodeName != "React.template") {
                    helpers.nodeName(path);
                }
            }
        }
    },
    JSXAttribute: function(path) {
        var attrName = path.node.name.name;
        if (/^(?:on|catch)[A-Z]/.test(attrName)) {
            var n = attrName.charAt(0) == "o" ? 2 : 5;
            var value = jsx.createUUID();
            var name = `data-${attrName.slice(n).toLowerCase()}-fn`;
            var attrs = path.parentPath.node.attributes
            attrs.push(
                jsx.createAttribute(name, value)
            );
            if(!attrs.setClassCode){
                attrs.setClassCode = true;
                attrs.push(
                    jsx.createAttribute("data-class-code", modules.classCode),
                    t.JSXAttribute(
                        t.JSXIdentifier("data-instance-code"),
                        t.jSXExpressionContainer(t.identifier("this.props.instanceCode"))
                    )
                );
                
            }
        }
    },
    JSXClosingElement: function(path) {
        var nodeName = path.node.name.name;
        if (
            !modules.importComponents[nodeName] &&
            nodeName !== "React.template"
        ) {
            helpers.nodeName(path);
        } else {
            path.node.name.name = "React.template";
        }
    }
};
