const t = require('babel-types');
const generate = require('babel-generator').default;
const template = require('babel-template');
const path = require('path');
const queue = require('./queue');
const utils = require('./utils');
const deps = [];
const config = require('./config');
const buildType = config['buildType'];
const quickFiles = require('./quickFiles');
const quickConfig = require('./quickHelpers/config');

const helpers = require(`./${config[buildType].helpers}`);
//微信的文本节点，需要处理换行符
const inlineElement = {
    text: 1,
    span: 1,
    b: 1,
    strong: 1,
    s: 1,
    em: 1,
    bdo: 1,
    q: 1
};
function registerPageOrComponent(name, path, modules) {
    if (name == modules.className) {
        path.insertBefore(modules.createPage);
    }
}
/**
 * JS文件转译器
 */
module.exports = {
    ClassDeclaration: helpers.classDeclaration,
    //babel 6 没有ClassDeclaration，只有ClassExpression
    ClassExpression: helpers.classDeclaration,
    ClassMethod: {
        enter(astPath, state) {
            let modules = utils.getAnu(state);
            let methodName = astPath.node.key.name;
            modules.walkingMethod = methodName;
            if (methodName !== 'constructor') {
                //快应用要转换onLaunch为onCreate
                if (config.buildType == 'quick' && modules.componentType === 'App' ){
                    if (methodName === 'onLaunch'){
                        methodName = 'onCreate';
                    }
                }
                let fn = utils.createMethod(astPath, methodName);
                modules.thisMethods.push(fn);
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
        
            helpers.render.enter(
                astPath,
                '有状态组件',
                modules.className,
                modules
            );
        },
        exit(astPath, state) {
            var modules = utils.getAnu(state);
            const methodName = astPath.node.key.name;
            if (methodName === 'render') {
                //当render域里有赋值时, BlockStatement下面有的不是returnStatement,
                //而是VariableDeclaration
                helpers.render.exit(
                    astPath,
                    '有状态组件',
                    modules.className,
                    modules
                );
                astPath.node.body.body.unshift(
                    template(utils.shortcutOfCreateElement())()
                );
            }
        }
    },
    FunctionDeclaration: {
        //enter里面会转换jsx中的JSXExpressionContainer
        exit(astPath, state) {
            //函数声明转换为无状态组件
            let modules = utils.getAnu(state);
            let name = astPath.node.id.name;
            if (
                /^[A-Z]/.test(name) &&
                modules.componentType === 'Component' &&
                !modules.parentName
            ) {
                //需要想办法处理无状态组件
                helpers.render.exit(astPath, '无状态组件', name, modules);
                modules.createPage = utils.createRegisterStatement(name, name);
            }

            if (
                astPath.parentPath.type === 'ExportDefaultDeclaration' &&
                modules.componentType === 'Component'
            ) {
                astPath.node.body.body.unshift(
                    template(utils.shortcutOfCreateElement())()
                );
            }

            if (name === '_asyncToGenerator' && config.buildType == 'wx') {
                astPath.insertBefore(
                    t.variableDeclaration('var', [
                        t.variableDeclarator(
                            t.identifier('regeneratorRuntime'),
                            t.callExpression(t.identifier('require'), [
                                t.stringLiteral('regenerator-runtime/runtime')
                            ])
                        )
                    ])
                );
            }
        }
    },
    ImportDeclaration(astPath, state) {
        let node = astPath.node;
        let modules = utils.getAnu(state);
        let source = node.source.value;
        let specifiers = node.specifiers;
        if (modules.componentType === 'App') {
            if (/\/pages\//.test(source)) {
                modules['appRoute'] = modules['appRoute'] || [];
                modules['appRoute'].push(source.replace(/^\.\//, ''));
                astPath.remove(); //移除分析依赖用的引用
            }
        }

        if (/\.(less|scss|sass|css)$/.test(path.extname(source))) {
            astPath.remove();
        }

        specifiers.forEach(item => {
            //重点，保持所有引入的组件名及它们的路径，用于<import />
            if (/\.js$/.test(source)) {
                source = source.replace(/\.js$/, '');
            }
            modules.importComponents[item.local.name] = {
                astPath: astPath,
                source: source
            };
        });
    },
    ExportDefaultDeclaration: {
        exit(astPath, state) {
            var modules = utils.getAnu(state);
            if (/Page|Component/.test(modules.componentType)) {
                let declaration = astPath.node.declaration;
                //延后插入createPage语句在其同名的export语句前
                registerPageOrComponent(declaration.name, astPath, modules);
            }

            //将配置对象生成JSON文件
            if (!/App|Page|Component/.test(modules.componentType)) {
                return;
            }
            var json = modules.config;
            //将app.js中的import语句变成pages数组
            if (modules.componentType === 'App') {
                json.pages = modules['appRoute'];
                delete modules['appRoute'];
            }
           
            if (buildType == 'ali') {
                helpers.configName(json, modules.componentType);
            }
            var keys = Object.keys(modules.usedComponents),
                usings;
            if (keys.length) {
                usings = json.usingComponents || (json.usingComponents = {});
                keys.forEach(function(name) {
                    usings[name] = modules.usedComponents[name];
                });
            }
            if (usings) {
                //将页面配置对象中的usingComponents对象中的组件名放进modules.customComponents
                //数组中，并将对应的文件复制到dist目录中
                utils.copyCustomComponents(usings, modules);
            }
            if (config.buildType == 'quick'){
                var obj = quickFiles[modules.sourcePath];
                if (obj){
                    obj.config = Object.assign({},json);
                    quickConfig(modules,config, queue, utils );
                }
                var a = template('0,'+JSON.stringify(json, null, 4))();
                var keyValue = t.ObjectProperty(
                    t.identifier('config'),
                    a.expression.expressions[1]
                );
                modules.thisMethods.push(keyValue);

                return;
            } else {
                if (modules.componentType === 'Component') {
                    json.component = true;
                }
            }
            queue.push({
                path: modules.sourcePath
                    .replace(/\/src\//, '/dist/')
                    .replace(/\.js$/, '.json'),
                code: JSON.stringify(json, null, 4)
            });
            utils.emit('build');
        }
    },

    ExportNamedDeclaration: {
        exit(astPath) {
            //生成 module.exports.default = ${name};
            let declaration = astPath.node.declaration || { type: '{}' };
            switch (declaration.type) {
                case 'Identifier':
                    astPath.replaceWith(utils.exportExpr(declaration.name));
                    break;
                case 'VariableDeclaration':
                    var id = declaration.declarations[0].id.name;
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
                        astPath.node.specifiers.map(function(el) {
                            return utils.exportExpr(el.local.name);
                        })
                    );
                    break;
            }
        }
    },
    ClassProperty: {
        exit(astPath, state) {
            let key = astPath.node.key.name;
            let modules = utils.getAnu(state);
            if (key === 'config') {
                //将配置对象生成JSON文件
                if (!/App|Page|Component/.test(modules.componentType)) {
                    return;
                }
                try {
                    var json = eval('0,' + generate(astPath.node.value).code);
                    Object.assign(modules.config, json);
                } catch (e) {
                    /**/
                }
               

            } else if (astPath.node.static) {
                var keyValue = t.ObjectProperty(
                    t.identifier(key),
                    astPath.node.value
                );
                modules.staticMethods.push(keyValue);
              
            } else {
                if (key == 'globalData' && modules.componentType === 'App') {
                    //globalData中插入平台buildType
                    astPath.node.value.properties.push(
                        t.objectProperty(
                            t.identifier('buildType'),
                            t.stringLiteral(config.buildType)
                        )
                    );
                    var thisMember = t.assignmentExpression(
                        '=',
                        t.memberExpression(
                            t.identifier('this'),
                            t.identifier(key)
                        ),
                        astPath.node.value
                    );
                    modules.thisProperties.push(thisMember);
                }
            }
            astPath.remove();
        }
    },
    MemberExpression() {},
    AssignmentExpression() {},
    CallExpression: {
        enter(astPath, state) {
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
            //app.js export default App(new Demo())改成
            //     export default React.App(new Demo())       
            if (modules.componentType == 'App' && 
             callee.type === 'Identifier' && callee.name === 'App' ){
                callee.name = 'React.App';
                return;
            }

            if (callee.property && callee.property.name == 'render') {
                var p = astPath,
                    checkIndex = 4,
                    d;
                while (p.type != 'JSXElement') {
                    if (p.type === 'JSXExpressionContainer') {
                        d = p;
                    }
                    p = p.parentPath;

                    if (checkIndex-- == 0) {
                        break;
                    }
                }
                if (p.type === 'JSXElement' && d) {
                    //<React.renderProps />
                    var renderProps = utils.createElement(
                        'React.toRenderProps',
                        [],
                        []
                    );
                    var arr = p.node.children;
                    var json = modules.config;
                    if (!json.usingComponents) {
                        json.usingComponents = {
                            'anu-render': '/components/RenderProps/index'
                        };
                    } else {
                        json.usingComponents['anu-render'] =
                            '/components/RenderProps/index';
                    }
                    var index = arr.indexOf(d.node);
                    if (index !== -1) {
                        //插入React.toRenderProps标签
                        arr.splice(index, 0, renderProps);
                    }
                }
            }
            //处理循环语
            if (utils.isLoopMap(astPath)) {
                //添加上第二参数
                if (!args[1] && args[0].type === 'FunctionExpression') {
                    args[1] = t.identifier('this');
                }
                //为callback添加参数
                let params = args[0].params;
                if (!params[0]) {
                    params[0] = t.identifier('j' + astPath.node.start);
                }
                if (!params[1]) {
                    params[1] = t.identifier('i' + astPath.node.start);
                }
                var indexName = args[0].params[1].name;
                if (modules.indexArr) {
                    modules.indexArr.push(indexName);
                } else {
                    modules.indexArr = [indexName];
                }
                modules.indexName = indexName;
            }
        },
        exit(astPath, state) {
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

    JSXOpeningElement: {
        enter: function(astPath, state) {
            let modules = utils.getAnu(state);
            let nodeName = astPath.node.name.name;
            let bag = modules.importComponents[nodeName];
            if (bag) {
                deps[nodeName] ||
                    (deps[nodeName] = {
                        set: new Set()
                    });
                astPath.componentName = nodeName;

                if (bag.astPath) {
                    bag.astPath.remove();
                    bag.astPath = null;
                }
                modules.usedComponents['anu-' + nodeName.toLowerCase()] =
                    '/components/' + nodeName + '/index';
                astPath.node.name.name = 'React.useComponent';

                // eslint-disable-next-line
                var attributes = astPath.node.attributes;
                modules.is && modules.is.push(nodeName);
                attributes.push(
                    t.JSXAttribute(
                        t.JSXIdentifier('is'),
                        t.jSXExpressionContainer(t.stringLiteral(nodeName))
                    )
                );

                if (modules.indexArr) {
                    //  console.log(nodeName, modules.indexArr+'' );
                    attributes.push(
                        utils.createAttribute(
                            '$$index',
                            t.jSXExpressionContainer(
                                t.identifier(modules.indexArr.join('+\'-\'+'))
                            )
                        )
                    );
                }
            } else {
                if (nodeName != 'React.useComponent') {
                    helpers.nodeName(astPath, modules);
                }
            }
        }
    },
    JSXAttribute: {
        enter: function(astPath, state) {
            let attrName = astPath.node.name.name;
            let attrValue = astPath.node.value;
            let parentPath = astPath.parentPath;
            let modules = utils.getAnu(state);

            let srcValue = attrValue && attrValue.value;
            //处理静态资源@assets/xxx.png别名
            if (attrName === 'src' && srcValue && /^(@assets)/.test(srcValue)) {
                let realAssetsPath = path.join(
                    process.cwd(),
                    srcValue.replace(/@/, '')
                );
                let relativePath = path.relative(
                    path.dirname(modules.sourcePath),
                    realAssetsPath
                );
                astPath.node.value.value = relativePath;
            }

            if (t.isJSXExpressionContainer(attrValue)) {
                let modules = utils.getAnu(state);
                let attrs = parentPath.node.attributes;
                let expr = attrValue.expression;
                let nodeName = parentPath.node.name.name;
                if (/^(?:on|catch)[A-Z]/.test(attrName)) {
                    var prefix = attrName.charAt(0) == 'o' ? 'on' : 'catch';
                    var eventName = attrName.replace(prefix, '');
                    var otherEventName = utils.getEventName(
                        eventName,
                        nodeName,
                        buildType
                    );
                    if (otherEventName !== eventName) {
                        astPath.node.name.name = prefix + otherEventName;
                    }

                    //事件存在的标签，必须添加上data-eventName-uid, data-class-uid, data-instance-uid
                    var name = `data-${eventName.toLowerCase()}-uid`;
                    attrs.push(
                        utils.createAttribute(
                            name,
                            'e' + utils.createUUID(astPath)
                        )
                    );
                    if (!attrs.setClassCode) {
                        attrs.setClassCode = true;
                        attrs.push(
                            utils.createAttribute(
                                'data-class-uid',
                                modules.classUid
                            )
                        );

                        //如果是位于循环里，还必须加上data-key，防止事件回调乱窜
                        if (modules.indexArr) {
                            attrs.push(
                                utils.createAttribute(
                                    'data-key',
                                    t.jSXExpressionContainer(
                                        t.identifier(
                                            modules.indexArr.join('+\'-\'+')
                                        )
                                    )
                                )
                            );
                        }
                    }
                } else if (attrName === 'style') {
                    //将动态样式封装到React.toStyle中
                    var styleType = expr.type;
                    var MemberExpression = styleType === 'MemberExpression';
                    var isIdentifier = styleType === 'Identifier';
                    if (
                        isIdentifier ||
                        MemberExpression ||
                        styleType === 'ObjectExpression'
                    ) {
                        var ii = modules.indexArr
                            ? modules.indexArr.join('+\'-\'+')
                            : '';
                        var styleRandName =
                            `'style${utils.createUUID(astPath)}'` +
                            (ii ? ' +' + ii : '');
                        //Identifier 处理形如 <div style={formItemStyle}></div> 的style结构
                        //MemberExpression 处理形如 <div style={this.state.styles.a}></div> 的style结构
                        //ObjectExpression 处理形如 style={{ width: 200, borderWidth: '1px' }} 的style结构
                        var styleName = isIdentifier
                            ? expr.name
                            : generate(expr).code;
                        attrs.push(
                            utils.createAttribute(
                                'style',
                                t.jSXExpressionContainer(
                                    t.identifier(
                                        `React.toStyle(${styleName}, this.props, ${styleRandName})`
                                    )
                                )
                            )
                        );
                        astPath.remove();
                    }
                } else if (attrName == 'render') {
                    var type = expr.type;
                    if (
                        type === 'FunctionExpression' ||
                        type == 'ArrowFunctionExpression'
                    ) {
                        var uuid = 'render' + utils.createUUID(astPath);
                        attrs.push(utils.createAttribute('renderUid', uuid));
                        parentPath.renderProps = attrValue;
                        parentPath.renderUid = uuid;
                        // astPath.parentPath.host =
                        modules.is = [];
                        // console.log(generate(attrValue).code);
                    }
                }
            }
        },
        exit(astPath, state) {
            let attrName = astPath.node.name.name;
            if (attrName == 'render' && astPath.parentPath.renderProps) {
                let attrValue = astPath.parentPath.renderProps;
                let fragmentUid = astPath.parentPath.renderUid;
                delete astPath.parentPath.renderProps;
                let modules = utils.getAnu(state);
                let subComponents = {};
                modules.is.forEach(function(a) {
                    subComponents[a] = path.join('..', a, 'index');
                });

                // console.log(subComponents, modules.usedComponents);
                helpers.render.exit(
                    {
                        node: attrValue.expression
                    },

                    'RenderProps',
                    fragmentUid,
                    {
                        sourcePath: path.join(
                            process.cwd(),
                            'src',
                            'components',
                            'RenderProps',
                            'index.js'
                        ),
                        componentType: 'Component',
                        importComponents: subComponents,
                        usedComponents: modules.usedComponents
                    }
                );
            }
        }
    },

    JSXText(astPath) {
        //去掉内联元素内部的所有换行符
        if (astPath.parentPath.node.type == 'JSXElement') {
            var open = astPath.parentPath.node.openingElement;
            if (config.buildType === 'wx' && inlineElement[open.name.name]) {
                astPath.node.value = astPath.node.value.replace(/\r?\n/g, '');
            }
        }
    },
    JSXExpressionContainer(astPath) {
        var expr = astPath.node.expression; //充许在JSX这样使用注释 ｛/** comment **/｝
        if (expr && expr.type == 'JSXEmptyExpression') {
            if (expr.innerComments && expr.innerComments.length) {
                astPath.remove();
            }
        }
    },
    JSXClosingElement: function(astPath, state) {
        let modules = utils.getAnu(state);
        let nodeName = astPath.node.name.name;
        //将组件标签转换成React.toComponent标签，html标签转换成view/text标签
        if (
            !modules.importComponents[nodeName] &&
            nodeName !== 'React.useComponent'
        ) {
            helpers.nodeName(astPath, modules);
        } else {
            astPath.node.name.name = 'React.useComponent';
        }
    }
};
