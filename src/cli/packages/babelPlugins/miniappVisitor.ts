import { NodePath } from '@babel/core';
import * as t from '@babel/types';
import generate from '@babel/generator';
import template from '@babel/template';
import * as path from 'path';
import fs from 'fs-extra';
import utils from '../utils';
import calculateComponentsPath from '../utils/calculateComponentsPath';
import config from '../../config/config';
import transformConfig from './transformConfig';
const buildType = config['buildType'];
const quickhuaweiStyle = require('../quickHelpers/huaweiStyle');
const ignoreAttri = require('../quickHelpers/ignoreAttri');
const ignorePrevAttri = require('../quickHelpers/ignorePrevAttri');
const cwd = process.cwd();

const quickFiles = require('../quickHelpers/quickFiles');
const quickConfig = require('../quickHelpers/config');
/* eslint no-console: 0 */
const helpers = require(`../${config[buildType].helpers}/index`);
//const deps = [];
//微信的文本节点，需要处理换行符
const inlineElement: {
    [props: string]: number;
} = {
    text: 1,
    span: 1,
    b: 1,
    strong: 1,
    s: 1,
    em: 1,
    bdo: 1,
    q: 1
};

let needRegisterApp: boolean = false;

let cache: {
    [props: string]: boolean;
} = {};
if (buildType == 'quick') {
    //快应用不需要放到Component/Page方法中
    utils.createRegisterStatement = function (className, path, isPage) {
        /**
         * placeholderPattern
         * Type: RegExp | false Default: /^[_$A-Z0-9]+$/
         * 
         * A pattern to search for when looking for Identifier and StringLiteral nodes
         * that should be considered placeholders. 'false' will disable placeholder searching
         * entirely, leaving only the 'placeholderWhitelist' value to find placeholders.
         * 
         * isPage: false 时 templateString = console.log(nanachi)
         * 此时如果传入后面的 {CLASSNAME: t.identifier(className)} 
         * 会抛出异常信息 Error: Unknown substitution "CLASSNAME" given
         */
        var templateString = isPage ?
            'CLASSNAME = React.registerPage(CLASSNAME,ASTPATH)' :
            'console.log(nanachi)';
        return isPage ? template(templateString)({
            CLASSNAME: t.identifier(className),
            ASTPATH: t.stringLiteral(path)
        }) : template(templateString)();
    };
}

function registerPageOrComponent(name: string, path: NodePath<t.ExportDefaultDeclaration>, modules: any) {
    if (name == modules.className) {
        path.insertBefore(modules.registerStatement);
    }
}

const visitor:babel.Visitor = {
    ClassDeclaration: helpers.classDeclaration,
    //babel 6 没有ClassDeclaration，只有ClassExpression
    ClassExpression: helpers.classDeclaration,
    ClassMethod: {
        enter(astPath: NodePath<t.ClassMethod>, state: any) {
            if (!astPath.node) {
                return;
            }
            let modules = utils.getAnu(state);
            let methodName = (astPath.node.key as t.Identifier).name;
            modules.walkingMethod = methodName;
            if (methodName !== 'constructor') {
                //快应用要转换onLaunch为onCreate
                if (buildType == 'quick' && modules.componentType === 'App') {
                    if (methodName === 'onLaunch') {
                        methodName = 'onCreate';
                    } else if (methodName === 'onHide') {
                        methodName = 'onDestroy';
                    }
                    let dist = path.join(
                        'components',
                        'PageWrapper',
                        'index.ux'
                    );
                    if (!cache[dist]) {
                        modules.queue.push({
                            code: fs.readFileSync(
                                path.resolve(
                                    __dirname,
                                    '../quickHelpers/PageWrapper.ux'
                                )
                            ),
                            path: dist,
                            type: 'ux'
                        });
                        cache[dist] = true;
                    }
                }
                let fn = utils.createMethod(astPath, methodName);
                let isStaticMethod = astPath.node.static;
                if (methodName === 'render') {
                    helpers.render.enter(
                        astPath,
                        '有状态组件',
                        modules.className,
                        modules
                    );
                } else {
                    astPath.remove();
                }
                if (isStaticMethod) {
                    // 处理静态方法
                    modules.staticMethods.push(fn);
                } else {
                    modules.thisMethods.push(fn);
                }
            } else {
                let node = astPath.node;
                modules.ctorFn = t.functionDeclaration(
                    t.identifier(modules.className),
                    node.params,
                    node.body,
                    node.generator,
                    false
                );
            }

        },
        exit(astPath: NodePath<t.ClassMethod>, state: any) {
            // tsc: 需确定astPath.node.key.name有没有问题
            let methodName = (astPath.node.key as t.Identifier).name;
            if (methodName === 'render') {
                let modules = utils.getAnu(state);
                if (modules.componentType === 'App') {
                    needRegisterApp = true;
                }
                
                //当render域里有赋值时, BlockStatement下面有的不是returnStatement,
                //而是VariableDeclaration
                helpers.render.exit(
                    astPath,
                    '有状态组件',
                    modules.className,
                    modules
                );
                //在render的前面加入var h = React.createElement;
                astPath.node.body.body.unshift(
                    template(utils.shortcutOfCreateElement())() as any
                );
            }
        }
    },
    VariableDeclaration: {
        /**
         * typescript装饰器补丁
         * typescript不支持关闭自带装饰器编译，参考:https://github.com/microsoft/TypeScript/issues/16882。
         * 使用装饰器时class P {}会编译成let P = class P {}，与原先编译器逻辑冲突，此处去掉let P =
         *  */ 
        enter(astPath) {
            const decl = astPath.get('declarations')[0];
            if (
                config.typescript && 
                astPath.parent.type === 'Program' && 
                decl.type === 'VariableDeclarator' && 
                decl.get('init').type === 'ClassExpression'
            ) {
                const body = (decl.get('init').get('body') as any).node;
                const id = (decl.get('init').get('id') as any).node;
                const superClass =  (decl.get('init').get('superClass') as any).node;
                astPath.replaceWith(t.classDeclaration(id, superClass, body));
            }
        }
    },
    FunctionDeclaration: {
        //enter里面会转换jsx中的JSXExpressionContainer
        exit(astPath: NodePath<t.FunctionDeclaration>, state: any) {
            //函数声明转换为无状态组件
            let modules = utils.getAnu(state);
            let name = astPath.node.id.name;
            if (
                /^[A-Z]/.test(name) && //组件肯定是大写开头
                modules.componentType === 'Component' &&
                !modules.parentName &&
                !modules.registerStatement //防止重复进入
            ) {
                //需要想办法处理无状态组件
                modules.className = name;
                helpers.render.exit(astPath, '无状态组件', name, modules);
                modules.registerStatement = utils.createRegisterStatement(
                    name,
                    name
                );
            }

            if (
                astPath.parentPath.type === 'ExportDefaultDeclaration' &&
                modules.componentType === 'Component'
            ) {
                astPath.node.body.body.unshift(
                    template(utils.shortcutOfCreateElement())() as any
                );
            }
        }
    },
    ImportDeclaration(astPath: NodePath<t.ImportDeclaration>, state: any) {
        let node = astPath.node;
        let modules = utils.getAnu(state);
        let source = node.source.value;
        let specifiers = node.specifiers;
        var extraModules = modules.extraModules;

        if (/\.(less|scss|sass|css)$/.test(path.extname(source))) {
            if (modules.componentType === 'Component') {
                if (/\/pages\//.test(source)) {
                    throw '"' + modules.className + '"组件越级不能引用pages下面的样式\n\t' + source
                }
            }
            extraModules.push(source);
            astPath.remove();
        }
        if (modules.componentType === 'App') {
            //收集页面上的依赖，构成app.json的pages数组或manifest.json中routes数组
            if (/\/pages\//.test(source)) {
                // 如果是工具函数或组件则不放到app.json数组中
                if (/\/(common|components)\//.test(source)) {
                    return;
                }
                var pages = modules.pages || (modules.pages = []);
                pages.push(source.replace(/^\.\//, ''));
                // 存下删除的依赖路径
                extraModules.push(source);

                astPath.remove(); //移除分析依赖用的引用
            }
        } else {
            // 如果当前页面依赖于某些JS文件，将它的.js后缀去掉
            if (/\.js$/.test(source)) {
                source = source.replace(/\.js$/, '');
            }
            // 如果当前页面就是一个组件，它必须在components目录中
            if (/\/components\//.test(modules.current)) {
                //这时还没有解析到函数体或类结构，不知道当前组件叫什么名字
                if (!modules.className) {
                    var segments = modules.current.match(/[\w\.-]+/g)
                    modules.className = segments[segments.length - 2]
                }
            }

        }
        if (modules.componentType !== 'App') {
            specifiers.forEach(item => {
                //重点，保持所有引入的组件名及它们的路径，用于<import />
    
                modules.importComponents[item.local.name] = {
                    astPath: astPath,
                    source: source,
                    sourcePath: modules.sourcePath
                };
            });
        }
    },

    Program: {
        exit(astPath: NodePath<t.Program>, state: any) {
            var modules = utils.getAnu(state);
            //支付宝的自定义组件机制实现有问题，必须要在json.usingComponents引入了这个类
            //这个类所在的JS 文件才会加入Component全局函数，否则会报Component不存在的BUG
            //一般来说，我们在页面引入了某个组件，它肯定在json.usingComponents中，只有少数间接引入的父类没有引入
            //因此在子类的json.usingComponents添加父类名
            //好像支付宝小程序(0.25.1-beta.0)已经不需要添加父类了
            // 下面代码是从wxHelper/render中挪过来的
            const parentClass = modules.parentName;
            if (
                config.buildType === 'ali' &&
                modules.componentType === 'Component' &&
                parentClass !== 'Object'
            ) {
                for (var i in modules.importComponents) {
                    var value = modules.importComponents[i];
                    if(value.astPath && i === parentClass){
                        modules.usedComponents['anu-' +i.toLowerCase()] = 
                            // calculateComponentsPath(value, i); tsc todo 参数一个还是两个？
                            calculateComponentsPath(value); 
                        value.astPath = null;     
                    }
                }
            }
            /**
             * 将生成 JSON 文件的逻辑从 ExportDefaultDeclaration 移除
             * 放入 Program，确保在 babel 的 ast 树解析的最后才执行生成 JSON 文件的逻辑
             */
            if (!/App|Page|Component/.test(modules.componentType)) {
                return;
            }
            var json = modules.config;
        
            //将app.js中的import语句变成pages数组
            if (modules.componentType === 'App') {
                json.pages = modules.pages;
                delete modules.pages;
            }
            //支付宝在这里会做属性名转换
            helpers.configName(json, modules.componentType);
            
            
            var keys = Object.keys(modules.usedComponents),
                usings: {
                    [props: string]: string;
                };
            if (keys.length) {
                usings = json.usingComponents || (json.usingComponents = {});
                keys.forEach(function (name) {
                    usings[name] = modules.usedComponents[name];
                });
            }
            if (buildType == 'quick') {
                var obj = quickFiles[modules.sourcePath];
                if (obj) {
                    quickConfig(json, modules, modules.queue, utils);
                    obj.config = Object.assign({}, json);
                }
                // delete json.usingComponents;
                return;
            } else {
                if (modules.componentType === 'Component') {
                    json.component = true;
                }
            }

            //只有非空才生成json文件
            if (Object.keys(json).length) {
                //配置分包
                json = require('../utils/setSubPackage')(modules, json);

                //merge ${buildType}Config.json
                json = require('../utils/mergeConfigJson')(modules, json);
                
                let relPath = '';
               
                if (/\/node_modules\//.test(modules.sourcePath.replace(/\\/g, '/'))) {
                    relPath = 'npm/' + path.relative( path.join(cwd, 'node_modules'), modules.sourcePath);
                } else {
                    relPath =  path.relative(path.resolve(cwd, 'source'), modules.sourcePath);
                }
             
                modules.queue.push({
                    path: relPath,
                    code: JSON.stringify(json, null, 4),
                    type: 'json'
                });
            }
        }
    },
    ExportDefaultDeclaration: {
        exit(astPath: NodePath<t.ExportDefaultDeclaration>, state: any) {
            var modules = utils.getAnu(state);

            if (/Page|Component/.test(modules.componentType)) {
                let declaration = astPath.node.declaration;
                let name = (declaration as t.Identifier).name
                if (declaration.type == 'FunctionDeclaration') {
                    //将export default function AAA(){}的方法提到前面
                    astPath.insertBefore(declaration);
                    astPath.node.declaration = declaration.id;
                    name = declaration.id.name
                }
                //延后插入createPage语句在其同名的export语句前
                registerPageOrComponent(name, astPath, modules);
            }

            // 非快应用在export default 添加React.registerApp方法
            if (modules.componentType === 'App' && buildType !== 'quick' && needRegisterApp) {
                const args = (astPath.get('declaration').node as any).arguments;
                (astPath.get('declaration').node as any).arguments = [
                    t.callExpression(
                        t.memberExpression(
                            t.identifier('React'), t.identifier('registerApp')
                        ),
                        args
                    )
                ];
            }
        }
    },

    ExportNamedDeclaration: {
        exit(astPath: NodePath<t.ExportNamedDeclaration>) {
            //生成 module.exports.default = ${name};
            let declaration: any = astPath.node.declaration || { // tsc: 暂时any
                type: '{}'
            };
            switch (declaration.type) {
                // tsc: 待验证是否存在Identifier类型
                case 'Identifier':
                    astPath.replaceWith(utils.exportExpr((declaration as t.Identifier).name));
                    break;
                case 'VariableDeclaration':
                    var id = ((declaration as t.VariableDeclaration).declarations[0].id as any).name;
                    declaration.kind = 'var'; //转换const,let为var
                    astPath.replaceWithMultiple([
                        declaration,
                        utils.exportExpr(id)
                    ]);
                    break;
                case 'FunctionDeclaration':
                    astPath.replaceWithMultiple([
                        declaration,
                        utils.exportExpr(declaration.id.name)
                    ]);
                    break;
                case '{}':
                    astPath.replaceWithMultiple(
                        // tsc: 待验证bug
                        astPath.node.specifiers.map(function (el: any) {
                            return utils.exportExpr(el.local.name);
                        })
                    );
                    break;
            }
        }
    },
    ThisExpression: {
        exit(astPath: NodePath<t.ThisExpression>, state: any) {
            let modules = utils.getAnu(state);
            if (modules.walkingMethod == 'constructor') {
                var expression = astPath.parentPath.parentPath;
                if (expression.type === 'AssignmentExpression') {
                    var right = (expression.node as t.AssignmentExpression).right;
                    if (!t.isObjectExpression(right)) {
                        return;
                    }
                    //将  this.config 变成 static config
                    var propertyName = (astPath.container as any).property.name; // tsc todo
                    if (propertyName === 'config' && !modules.configIsReady) {
                        //对配置项进行映射                 
                        transformConfig(modules, expression, buildType);
                        var staticConfig = template(`${modules.className}.config = %%CONFIGS%%;`, {
                            syntacticPlaceholders: true // tsc todo 参数是否正确？
                        } as any)({
                            CONFIGS: right
                        });
                        var classAstPath = expression.findParent(function (parent) {
                            return parent.type === 'ClassDeclaration';
                        });
                        classAstPath.insertAfter(staticConfig);
                        expression.remove();
                    }
                    // 为this.globalData添加buildType
                    if (propertyName === 'globalData') {
                        if (modules.componentType === 'App') {
                            var properties = right.properties;
                            var hasBuildType = properties.some(function (el: any) {
                                return el.key.name === 'buildType';
                            });
                            if (!hasBuildType) {
                                properties.push(t.objectProperty(
                                    t.identifier('buildType'),
                                    t.stringLiteral(buildType)
                                ));
                                if (buildType === 'quick') {
                                    properties.push(t.objectProperty(
                                        t.identifier('__quickQuery'),
                                        t.objectExpression([])
                                    ));
                                }
                            }
                        }
                    }
                }

            }

        }
    },
    MemberExpression(astPath: NodePath<t.MemberExpression>, state: any) {
        //处理 static config = {}
        if (astPath.parentPath.type === 'AssignmentExpression') {
            let modules = utils.getAnu(state);
            if (!modules.configIsReady &&
                (astPath.node.object as any).name === modules.className &&
                astPath.node.property.name === 'config'
            ) {
                transformConfig(modules, astPath.parentPath, buildType);
            }
        }
    },

    CallExpression: {
        enter(astPath: NodePath<t.CallExpression>, state: any) {
            let node = astPath.node;
            let args = node.arguments;
            let callee = node.callee;
            let modules = utils.getAnu(state);
            //移除super()语句
            if (modules.walkingMethod == 'constructor') {
                if (callee.type === 'Super') {
                    astPath.remove();
                    return;
                }
            }
            //     app.js export default App(new Demo())转换成
            //     export default React.registerApp(new Demo())
            if (
                modules.componentType == 'App' &&
                buildType == 'quick' &&
                callee.type === 'Identifier' &&
                callee.name === 'App'
            ) {
                callee.name = 'React.registerApp';
                // 有app Provider的情况下传registerApp方法第二个参数，表明要全局存下App类
                if (needRegisterApp) {
                    node.arguments.push(t.booleanLiteral(true));
                }
                return;
            }
            //处理循环语
            if (utils.isLoopMap(astPath)) {
                //添加上第二参数
                if (!args[1] && args[0].type === 'FunctionExpression') {
                    args[1] = t.identifier('this');
                }
                //为callback添加参数
                let params = (args[0] as any).params; // tsc todo
                if (!params[0]) {
                    params[0] = t.identifier('j' + astPath.node.start);
                }
                if (!params[1]) {
                    params[1] = t.identifier('i' + astPath.node.start);
                }
                var indexName = (args[0] as any).params[1].name;
                if (modules.indexArr) {
                    modules.indexArr.push(indexName);
                } else {
                    modules.indexArr = [indexName];
                }
                modules.indexName = indexName;
            }
        },
        exit(astPath: NodePath<t.CallExpression>, state: any) {
            let modules = utils.getAnu(state);
            if (utils.isLoopMap(astPath)) {
                var indexArr = modules.indexArr;
                if (indexArr) {
                    indexArr.pop();
                    if (!indexArr.length) {
                        delete modules.indexArr;
                        modules.indexName = null;
                    } else {
                        modules.indexName = indexArr[indexArr.length - 1];
                    }
                }
            }
        }
    },

    //＝＝＝＝＝＝＝＝＝＝＝＝＝＝处理JSX＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    JSXElement(astPath: NodePath<t.JSXElement>) {
        let node = astPath.node;
        let nodeName = utils.getNodeName(node);
        if (buildType == 'quick' && !node.closingElement) {
            node.openingElement.selfClosing = false;
            node.closingElement = t.jsxClosingElement(
                // [babel 6 to 7] The case has been changed: jsx and ts are now in lowercase.
                t.jsxIdentifier(nodeName)
            );
        }
    },
    JSXOpeningElement: {
        enter: function (astPath: NodePath<t.JSXOpeningElement>, state: any) {
            let nodeName = (astPath.node.name as t.JSXIdentifier).name;
            if (buildType === 'quick') {
                ignorePrevAttri(astPath, nodeName);
            }
            
            if (nodeName === 'span' && buildType === 'quick') {
                //如果是快应用，<text><span></span></text>不变， <div><span></span></div>变<div><text></text></div>
                let p = astPath.parentPath.findParent(function (parent) {
                    return parent.type === 'JSXElement';
                });

                let parentTagName = p && utils.getNodeName(p.node);
                if (parentTagName === 'text' || parentTagName === 'a') {
                    return;
                }
            }

            if (buildType !== 'quick' && nodeName === 'text') {
                //  iconfont 各小程序匹配 去掉小程序下 <text>&#xf1f3;</text>
                var children = (astPath.parentPath.node as any).children;
                if (children.length === 1) {
                    let iconValue = t.isJSXText(children[0]) ? children[0].extra.raw : '';
                    let iconReg = /\s*&#x/i;
                    if (iconReg.test(iconValue)) {
                        children.length = 0;
                    }
                }
            }

            let modules = utils.getAnu(state);
            nodeName = helpers.nodeName(astPath, modules) || nodeName;
            // https://mp.weixin.qq.com/wxopen/plugindevdoc?appid=wx56c8f077de74b07c&token=1011820682&lang=zh_CN#-
            if (buildType === 'wx' && config.pluginTags && config.pluginTags[nodeName]) { // 暂时只有wx支持
                modules.usedComponents[nodeName] =  config.pluginTags[nodeName];
                return;
            }
            let bag = modules.importComponents[nodeName];
            if (!bag) {
                var oldName = nodeName;
                //button --> Button
                nodeName = helpers.nodeName(astPath, modules) || oldName;
                if (oldName !== oldName) {
                    bag = modules.importComponents[nodeName];
                }
            }
            if (buildType === 'quick') {
                ignoreAttri(astPath, nodeName);
            }


            if (bag) {
                try {
                    // 存下删除的依赖路径
                    if (bag.source !== 'schnee-ui') modules.extraModules.push(bag.source);
                    bag.astPath.remove();
                    bag.astPath = null;
                } catch (err) {
                    // eslint-disable-next-line
                }

                // let useComponentsPath = calculateComponentsPath(bag, nodeName); // tsc: 原来有两个参数 第二个参数有用吗？
                let useComponentsPath = calculateComponentsPath(bag);
                modules.usedComponents['anu-' + nodeName.toLowerCase()] = useComponentsPath;
                (astPath.node.name as t.JSXIdentifier).name = 'React.useComponent';

                // eslint-disable-next-line
                var attrs = astPath.node.attributes;
                // ?？？这个还有用吗
                modules.is && modules.is.push(nodeName);
                attrs.push(
                    t.jsxAttribute(
                        // [babel 6 to 7] The case has been changed: jsx and ts are now in lowercase.
                        t.jsxIdentifier('is'),
                        t.jsxExpressionContainer(t.stringLiteral(nodeName))
                    )
                );

                attrs.push(
                    utils.createAttribute(
                        'data-instance-uid',
                        utils.createDynamicAttributeValue(
                            'i',
                            astPath,
                            modules.indexArr || ['0']
                        )
                    )
                );
            } else {
                if (nodeName != 'React.useComponent') {
                    helpers.nodeName(astPath, modules);
                }
            }
        }
    },
    JSXClosingElement: function (astPath: NodePath<t.JSXClosingElement>) {
        var tagName = utils.getNodeName(astPath.parentPath.node);
        (astPath.node.name as t.JSXIdentifier).name = tagName;
    },
    JSXAttribute: {
        enter: function (astPath: NodePath<t.JSXAttribute>, state: any) {
            let attrName = astPath.node.name.name;
            let attrValue = astPath.node.value;
            let parentPath = astPath.parentPath;
            let modules = utils.getAnu(state);


            //处理静态资源@assets/xxx.png别名
            if (t.isStringLiteral(attrValue)) {
                let srcValue = attrValue && attrValue.value;
                if (attrName === 'src' && /^(@assets)/.test(srcValue)) {
                    let realAssetsPath = path.join(
                        process.cwd(),
                        'source',
                        srcValue.replace(/@/, '')
                    );
                    let relativePath = path.relative(
                        path.dirname(modules.sourcePath),
                        realAssetsPath
                    );
                    (astPath.node.value as any).value = relativePath; // tsc todo
                }
                if (attrName === 'open-type' && srcValue === 'getUserInfo' && buildType == 'ali' ) {
                    (astPath.node.value as any).value = "getAuthorize"; // tsc todo
                    let attrs = (parentPath.node as any).attributes;
                    attrs.push(
                        utils.createAttribute(
                            'scope',
                            t.stringLiteral('userInfo')
                        )
                    );
                }
                // 快应用下 string类型的行内样式 rpx 会换算成px
                if (attrName === 'style' && buildType == 'quick') {
                    let value = quickhuaweiStyle(attrValue, true);
                    astPath.node.value = t.stringLiteral(value.slice(1, -1));
                }
            } else if (t.isJSXExpressionContainer(attrValue)) {
                let attrs = (parentPath.node as any).attributes;
                let expr: any = (attrValue as t.JSXExpressionContainer).expression;
                let nodeName = (parentPath.node as any).name.name;

                if (attrName === 'style') {
                    //将动态样式封装到React.toStyle中
                    var styleType = expr.type;
                    var MemberExpression = styleType === 'MemberExpression';
                    var isIdentifier = styleType === 'Identifier';
                    // 华为编辑器行内样式特殊处理

                    // if (config.huawei) {
                    //     if (styleType === 'ObjectExpression') {
                    //         let code = quickhuaweiStyle(expr);
                    //         astPath.node.value = t.stringLiteral(code);
                    //         return;
                    //     }
                    // }
                    if (
                        isIdentifier ||
                        MemberExpression ||
                        styleType === 'ObjectExpression'
                    ) {
                        var ii = modules.indexArr ?
                            modules.indexArr.join('+\'-\'+') :
                            '';
                        var styleRandName =
                            `'style${utils.createUUID(astPath)}'` +
                            (ii ? ' +' + ii : '');
                        //Identifier 处理形如 <div style={formItemStyle}></div> 的style结构
                        //MemberExpression 处理形如 <div style={this.state.styles.a}></div> 的style结构
                        //ObjectExpression 处理形如 style={{ width: 200, borderWidth: '1px' }} 的style结构


                        var styleName = isIdentifier ?
                            expr.name :
                            generate(expr).code;
                        attrs.push(
                            utils.createAttribute(
                                'style',
                                t.jsxExpressionContainer(
                                    t.identifier(
                                        `React.toStyle(${styleName}, this.props, ${styleRandName})`
                                    )
                                )
                            )
                        );
                        astPath.remove();
                    }
                } else if (attrName == 'hidden') {
                    if (buildType === 'quick') {
                        //在快应用下hidden={a}变成show={!a}
                        astPath.node.name.name = 'show';
                        attrValue.expression = t.unaryExpression(
                            '!',
                            expr,
                            true
                        );
                    }
                } else if (
                    /^(?:on|catch)[A-Z]/.test(attrName as string) && // tsc TODO
                    !/[A-Z]/.test(nodeName)
                ) {
                    //如果这是普通标签上的事件名
                    var prefix = (attrName as string).charAt(0) == 'o' ? 'on' : 'catch';
                    var eventName = (attrName as string).replace(prefix, '');
                    var otherEventName = utils.getEventName(
                        eventName,
                        nodeName,
                        buildType
                    );
                    //改事件名， onTap与onClick, onChange与onInput
                    if (otherEventName !== eventName) {
                        astPath.node.name.name = prefix + otherEventName;
                        eventName = otherEventName;
                    }

                    //事件存在的标签，必须添加上data-eventName-uid, data-beacon-uid
                    var name = `data-${eventName.toLowerCase()}-uid`;
                    attrs.push(
                        utils.createAttribute(
                            name,
                            utils.createDynamicAttributeValue(
                                'e',
                                astPath,
                                modules.indexArr
                            )
                        )
                    );
                    //data-beacon-uid是用于实现日志自动上传, 并用于ReactWX的updateAttribute 
                    if (
                        !attrs.setClassCode &&
                        !attrs.some(function (el: any) {
                            return el.name.name == 'data-beacon-uid';
                        })
                    ) {
                        //自动添加
                        attrs.push(
                            utils.createAttribute('data-beacon-uid', 'default')
                        );
                    }
                    attrs.setClassCode = true;

                }
            }
        }
    },

    JSXText(astPath: NodePath<t.JSXText>) {
        //去掉内联元素内部的所有换行符
        if (astPath.parentPath.type == 'JSXElement') {
            var textNode: any = astPath.node; // tsc todo
            var value = textNode.extra.raw = textNode.extra.rawValue.trim();
            if (value === '') {
                astPath.remove();
                return;
            }
            var parentTagName = utils.getNodeName(astPath.parentPath.node);
            if (
                /quick|wx/.test(config.buildType) &&
                inlineElement[parentTagName]
            ) {
                textNode.value = value;
            }
        }
    },
    JSXExpressionContainer(astPath: NodePath<t.JSXExpressionContainer>) {
        var expr = astPath.node.expression; //充许在JSX这样使用注释 ｛/** comment **/｝
        if (expr && expr.type == 'JSXEmptyExpression') {
            if (expr.innerComments && expr.innerComments.length) {
                astPath.remove();
            }
        }
    }
};
/**
 * JS文件转译器
 */
export default visitor;
module.exports = visitor;
