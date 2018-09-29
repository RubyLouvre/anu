const t = require('babel-types');
const generate = require('babel-generator').default;
const template = require('babel-template');
const path = require('path');
const queue = require('./queue');
const utils = require('./utils');
const deps = require('./deps');
const config = require('./config');
const buildType = config['buildType'];
const helpers = require(`./${config[buildType].helpers}`);
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
function addCreatePage(name, path, modules) {
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
            var modules = utils.getAnu(state);
            var methodName = astPath.node.key.name;
            modules.walkingMethod = methodName;
            if (methodName !== 'constructor') {
                var fn = utils.createMethod(astPath, methodName);
                modules.thisMethods.push(fn);
            } else {
                var node = astPath.node;
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
            }

            if (
                astPath.parentPath.type === 'ExportDefaultDeclaration' &&
                modules.componentType === 'Component'
            ) {
                astPath.node.body.body.unshift(
                    template(utils.shortcutOfCreateElement())()
                );
            }

            //需要引入weapp-async-await
            if (name === '_asyncToGenerator') {
                astPath.insertBefore(
                    template(
                        `var weAsync = require('weapp-async-await');
                         var Promise = weAsync.Promise;
                         var regeneratorRuntime = weAsync.regeneratorRuntime;
                        `
                    )()
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
            if (/\.js$/.test(source)){
                source = source.replace(/\.js$/, '');
            }
            modules.importComponents[item.local.name] = source;
        });
    },
    ExportDefaultDeclaration: {
        exit(astPath, state) {
            var modules = utils.getAnu(state);
            if (modules.componentType == 'Page') {
                let declaration = astPath.node.declaration;
                //延后插入createPage语句在其同名的export语句前
                addCreatePage(declaration.name, astPath, modules);
            }
        }
    },

    ExportNamedDeclaration: {
        exit(astPath) {
            let declaration = astPath.node.declaration;
            if (!declaration) {
                var map = astPath.node.specifiers.map(function(el) {
                    return utils.exportExpr(el.local.name);
                });
                astPath.replaceWithMultiple(map);
            } else if (declaration.type === 'Identifier') {
                astPath.replaceWith(
                    utils.exportExpr(declaration.name, declaration.name)
                );
            } else if (declaration.type === 'VariableDeclaration') {
                var id = declaration.declarations[0].id.name;
                declaration.kind = 'var'; //转换const,let为var
                astPath.replaceWithMultiple([
                    declaration,
                    utils.exportExpr(id)
                ]);
            } else if (declaration.type === 'FunctionDeclaration') {
                astPath.replaceWithMultiple([
                    declaration,
                    utils.exportExpr(id)
                ]);
            }
        }
    },

    ClassProperty: {
        exit(astPath, state) {
            let key = astPath.node.key.name;
            let modules = utils.getAnu(state);
            if (key === 'config') {
                //format json
                let code = generate(astPath.node.value).code;
                let config = null;
                let jsonStr = '';
                try {
                    config = JSON.parse(code);
                } catch (err) {
                    config = eval('(' + code + ')');
                }

                //assign the page routes in app.js
                if (modules.componentType === 'App') {
                    config = Object.assign(config, {
                        pages: modules['appRoute']
                    });
                    delete modules['appRoute'];
                }
                if (config.usingComponents) {
                    //将页面配置对象中的usingComponents对象中的组件名放进modules.customComponents
                    //数组中，并将对应的文件复制到dist目录中
                    utils.copyCustomComponents(config.usingComponents, modules);
                }
                jsonStr = JSON.stringify(config, null, 4);

                queue.push({
                    type: 'json',
                    path: modules.sourcePath
                        .replace(/\/src\//, '/dist/')
                        .replace(/\.js$/, '.json'),
                    code: jsonStr
                });
                utils.emit('build');
            }
            if (astPath.node.static) {
                var keyValue = t.ObjectProperty(
                    t.identifier(key),
                    astPath.node.value
                );
                modules.staticMethods.push(keyValue);
            } else {
                if (key == 'globalData' && modules.componentType === 'App') {
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
                    //<React.renderProps renderUid={this.props.renderUid} data={[this.state]} />
                    var renderProps = utils.createElement(
                        'React.toRenderProps',
                        [
                            utils.createAttribute(
                                'instanceUid',
                                t.jSXExpressionContainer(
                                    t.identifier('this.props.instanceUid')
                                )
                            ),
                            utils.createAttribute('classUid', modules.classUid)
                        ],
                        []
                    );
                    var arr = p.node.children;
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
            if (modules.importComponents[nodeName]) {
                let dep =
                    deps[nodeName] ||
                    (deps[nodeName] = {
                        set: new Set()
                    });
                astPath.componentName = nodeName;
                modules.usedComponents[nodeName] = true;
                astPath.node.name.name = 'React.toComponent';
                let children = astPath.parentPath.node.children;
                let isEmpty = true;
                // eslint-disable-next-line
                for (var i = 0, el; (el = children[i++]); ) {
                    if (el.type === 'JSXText' && !el.value.trim().length) {
                        isEmpty = false;
                        break;
                    } else {
                        isEmpty = false;
                        break;
                    }
                }

                var attributes = astPath.node.attributes;
                modules.is && modules.is.push(nodeName);
                attributes.push(
                    utils.createAttribute(
                        '$$loop',
                        'data' + utils.createUUID(astPath)
                    ),
                    t.JSXAttribute(
                        t.JSXIdentifier('is'),
                        t.jSXExpressionContainer(t.identifier(nodeName))
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

                if (!isEmpty) {
                    //处理slot
                    var fragmentUid = 'f' + utils.createUUID(astPath);
                    if (dep.addImportTag) {
                        dep.addImportTag(fragmentUid);
                    } else {
                        dep.set.add(fragmentUid);
                    }
                    attributes.push(
                        utils.createAttribute('classUid', modules.classUid),
                        utils.createAttribute(
                            'instanceUid',
                            t.jSXExpressionContainer(
                                t.identifier('this.props.instanceUid')
                            )
                        ),
                        utils.createAttribute('fragmentUid', fragmentUid)
                    );
                }
            } else {
                if (nodeName != 'React.toComponent') {
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
                            ),
                            utils.createAttribute(
                                'data-instance-uid',
                                t.jSXExpressionContainer(
                                    t.identifier('this.props.instanceUid')
                                )
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
                    if (isIdentifier || MemberExpression || styleType === 'ObjectExpression') {
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
            // let attrValue = astPath.node.value;
            if (attrName == 'render' && astPath.parentPath.renderProps) {
                let attrValue = astPath.parentPath.renderProps;
                let fragmentUid = astPath.parentPath.renderUid;
                delete astPath.parentPath.renderProps;
                let modules = utils.getAnu(state);
                let subComponents = {};
                modules.is.forEach(function(a) {
                    subComponents[a] = path.join('..', a, 'index');
                });
                var componentName = astPath.parentPath.componentName;
                var dep = deps[componentName];

                if (dep.addImportTag) {
                    dep.addImportTag(fragmentUid);
                } else {
                    dep.set.add(fragmentUid);
                }

                // console.log(subComponents, modules.usedComponents);
                helpers.render.exit(
                    {
                        node: attrValue.expression
                    },
                    'renderProps',
                    fragmentUid,
                    {
                        sourcePath: path.join(
                            process.cwd(),
                            'src',
                            'components',
                            'Fragments',
                            fragmentUid + '.js'
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
            if (inlineElement[open.name.name]) {
                astPath.node.value = astPath.node.value.replace(/\r?\n/g, '');
            }
        }
    },
    JSXClosingElement: function(astPath, state) {
        let modules = utils.getAnu(state);
        let nodeName = astPath.node.name.name;
        //将组件标签转换成React.toComponent标签，html标签转换成view/text标签
        if (
            !modules.importComponents[nodeName] &&
            nodeName !== 'React.toComponent'
        ) {
            helpers.nodeName(astPath, modules);
        } else {
            astPath.node.name.name = 'React.toComponent';
        }
    }
};
