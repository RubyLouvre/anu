const t = require('babel-types');
const generate = require('babel-generator').default;
const path = require('path');
const helpers = require('./helpers');
const queue = require('./queue');
const utils = require('./utils');
const deps = require('./deps');
const template = require('babel-template');
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
                var fn = helpers.method(astPath, methodName);
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
                    template(helpers.functionNameAliasConfig.h.init)()
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
                    template(helpers.functionNameAliasConfig.h.init)()
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

        if (/\.(less|scss)$/.test(path.extname(source))) {
            astPath.remove();
        }

        specifiers.forEach(item => {
            //重点，保持所有引入的组件名及它们的路径，用于<import />
            modules.importComponents[item.local.name] = source;

            //process alias for package.json alias field;
            helpers.resolveAlias(astPath, modules, item.local.name);
        });
        helpers.copyNpmModules(modules.current, source, node);
    },

    ExportNamedDeclaration: {
        enter() {},
        exit(astPath) {
            let declaration = astPath.node.declaration;
            if (!declaration) {
                var map = astPath.node.specifiers.map(function(el) {
                    return helpers.exportExpr(el.local.name);
                });
                astPath.replaceWithMultiple(map);
            } else if (declaration.type === 'Identifier') {
                astPath.replaceWith(
                    helpers.exportExpr(declaration.name, declaration.name)
                );
            } else if (declaration.type === 'VariableDeclaration') {
                var id = declaration.declarations[0].id.name;
                declaration.kind = 'var'; //转换const,let为var
                astPath.replaceWithMultiple([
                    declaration,
                    helpers.exportExpr(id)
                ]);
            } else if (declaration.type === 'FunctionDeclaration') {
                astPath.replaceWithMultiple([
                    declaration,
                    helpers.exportExpr(id)
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

                queue.pageConfig.push({
                    type: 'json',
                    sourcePath: modules.sourcePath,
                    path: modules.sourcePath
                        .replace(/\/src\//, '/dist/')
                        .replace(/\.js$/, '.json'),
                    code: jsonStr
                });
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
    AssignmentExpression(astPath, state) {
        let modules = utils.getAnu(state);
        // 转换微信小程序component的properties对象为defaultProps
        let left = astPath.node.left;
        if (
            modules.className &&
            t.isMemberExpression(left) &&
            left.object.name === modules.className &&
            left.property.name === 'defaultProps'
        ) {
            //helpers.defaultProps(astPath.node.right.properties, modules);
            astPath.remove();
        }
    },
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
            //处理循环语
            if (
                (t.isJSXExpressionContainer(astPath.parentPath) ||
                    t.isConditionalExpression(astPath.parentPath)) &&
                callee.type == 'MemberExpression' &&
                callee.property.name === 'map'
            ) {
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

            if (callee.name === 'require') {
                helpers.copyNpmModules(
                    modules.current,
                    node.arguments[0].value,
                    node
                );
            }
        },
        exit(astPath, state) {
            let modules = utils.getAnu(state);
            if (modules.indexName) {
                modules.indexName = null;
                modules.indexArr.pop();
                if (!modules.indexArr.length) {
                    delete modules.indexArr;
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
                modules.usedComponents[nodeName] = true;
                astPath.node.name.name = 'React.template';
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
                attributes.push(
                    utils.createAttribute(
                        'templatedata',
                        'data' + utils.createUUID()
                    ),
                    t.JSXAttribute(
                        t.JSXIdentifier('is'),
                        t.jSXExpressionContainer(t.identifier(nodeName))
                    )
                );
                if (!isEmpty) {
                    //处理slot
                    var fragmentUid =
                        'f' + astPath.node.start + astPath.node.end;
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
                if (nodeName != 'React.template') {
                    helpers.nodeName(astPath, modules);
                }
            }
        }
    },
    JSXAttribute: function(astPath, state) {
        let modules = utils.getAnu(state);
        let attrName = astPath.node.name.name;
        let attrValue = astPath.node.value;
        var attrs = astPath.parentPath.node.attributes;
        if (/^(?:on|catch)[A-Z]/.test(attrName)) {
            var n = attrName.charAt(0) == 'o' ? 2 : 5;
            var eventName = attrName.slice(n).toLowerCase();
            if (eventName == 'click') {
                //onClick映射为onTap, catchClick映射为catchTap
                astPath.node.name.name = n == 2 ? 'onTap' : 'catchTap';
                eventName = 'tap';
            }
            //事件存在的标签，必须添加上data-eventName-uid, data-class-uid, data-instance-uid
            var name = `data-${eventName}-uid`;
            attrs.push(
                utils.createAttribute(
                    name,
                    'e' + astPath.node.start + astPath.node.end
                )
            );
            if (!attrs.setClassCode) {
                attrs.setClassCode = true;
                attrs.push(
                    utils.createAttribute('data-class-uid', modules.classUid),
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
                                t.identifier(modules.indexArr.join('+\'-\'+'))
                            )
                        )
                    );
                }
            }
        } else if (
            attrName === 'style' &&
            t.isJSXExpressionContainer(attrValue)
        ) {
            //将动态样式封装到React.collectStyle中
            var expr = attrValue.expression;
            var styleType = expr.type;
            var isIdentifier = styleType === 'Identifier';
            if (isIdentifier || styleType === 'ObjectExpression') {
                var styleRandName =
                    `"style${astPath.node.start + astPath.node.end}"` +
                    (modules.indexName ? ' +' + modules.indexName : '');
                //Identifier 处理形如 <div style={formItemStyle}></div> 的style结构
                //ObjectExpression 处理形如 style={{ width: 200, borderWidth: '1px' }} 的style结构
                var styleName = isIdentifier ? expr.name : generate(expr).code;
                attrs.push(
                    utils.createAttribute(
                        'style',
                        t.jSXExpressionContainer(
                            t.identifier(
                                `React.collectStyle(${styleName}, this.props, ${styleRandName})`
                            )
                        )
                    )
                );
                astPath.remove();
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
        //将组件标签转换成React.template标签，html标签转换成view/text标签
        if (
            !modules.importComponents[nodeName] &&
            nodeName !== 'React.template'
        ) {
            helpers.nodeName(astPath, modules);
        } else {
            astPath.node.name.name = 'React.template';
        }
    }
};
