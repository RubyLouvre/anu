const t = require('babel-types');
const generate = require('babel-generator').default;
const path = require('path');
const helpers = require('./helpers');
const queue = require('./queue');
const utils = require('./utils');
const deps = require('./deps');
//const prettifyXml = require('prettify-xml');
const template = require('babel-template');

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
                astPath.node.body.body.unshift(template( helpers.functionNameAliasConfig.h.init )());
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

            if ( astPath.parentPath.type === 'ExportDefaultDeclaration'
                && modules.componentType === 'Component'
            ){
                astPath.node.body.body.unshift(template(helpers.functionNameAliasConfig.h.init )());
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
                modules['appRoute'].push( source.replace(/^\.\//, ''));
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
        //小程序在定义
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
                        .replace(
                            new RegExp(
                                `${utils.sepForRegex}src${utils.sepForRegex}`
                            ),
                            `${utils.sepForRegex}dist${utils.sepForRegex}`
                        )
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
            helpers.defaultProps(astPath.node.right.properties, modules);
            astPath.remove();
        }
    },
    CallExpression(astPath, state) {
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
        if (
            (t.isJSXExpressionContainer(astPath.parentPath) ||
                t.isConditionalExpression(astPath.parentPath)) &&
            callee.type == 'MemberExpression' &&
            callee.property.name === 'map' 
           
        ) {
            if ( !args[1] &&
                args[0].type === 'FunctionExpression'){
                args[1] = t.identifier('this');
            }
            if (args[0].params[1]){
                modules.indexName = args[0].params[1].name;
            }
          
        }
    },

    //＝＝＝＝＝＝＝＝＝＝＝＝＝＝处理JSX＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    JSXOpeningElement: {
        enter: function(astPath, state) {
            let modules = utils.getAnu(state);
            let nodeName = astPath.node.name.name;
            if (modules.importComponents[nodeName]) {
                var set = deps[nodeName] || (deps[nodeName] = new Set());
                modules.usedComponents[nodeName] = true;
                astPath.node.name.name = 'React.template';
                var children = astPath.parentPath.node.children;
                var isEmpty = true;
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
                    astPath.fragmentUid =
                        'f' + astPath.node.start + astPath.node.end;
                    set.add(astPath.fragmentUid);
                    attributes.push(
                        utils.createAttribute('classUid', modules.classUid),
                        utils.createAttribute(
                            'instanceUid',
                            t.jSXExpressionContainer(
                                t.identifier('this.props.instanceUid')
                            )
                        ),
                        utils.createAttribute(
                            'fragmentUid',
                            astPath.fragmentUid
                        )
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
                astPath.node.name.name = n == 2 ? 'onTap': 'catchTap';
                eventName = 'tap';
            }
            var name = `data-${eventName}-uid`;
            attrs.push(
                utils.createAttribute(
                    name,
                    'e' + astPath.node.start + astPath.node.end
                )
            );
            if (!attrs.setClassCode) {
                attrs.setClassCode = true;
                var keyValue;
                for (var i = 0, el; (el = attrs[i++]); ) {
                    if (el.name.name == 'key') {
                        if (t.isLiteral(el.value)) {
                            keyValue = el.value;
                        } else if (t.isJSXExpressionContainer(el.value)) {
                            keyValue = el.value;
                        }
                    }
                }
                attrs.push(
                    utils.createAttribute('data-class-uid', modules.classUid),
                    t.JSXAttribute(
                        t.JSXIdentifier('data-instance-uid'),
                        t.jSXExpressionContainer(
                            t.identifier('this.props.instanceUid')
                        )
                    )
                );
                if (keyValue != undefined) {
                    attrs.push(
                        t.JSXAttribute(t.JSXIdentifier('data-key'), keyValue)
                    );
                }
            }
        } else if (
            attrName === 'style' &&
            t.isJSXExpressionContainer(attrValue)
        ) {
            var expr = attrValue.expression;
            var styleType = expr.type;
            var styleRandName = `"style${(astPath.node.start+astPath.node.end)}"` +(modules.indexName ? ' +'+ modules.indexName:'');
            if (styleType === 'Identifier') {
                // 处理形如 <div style={formItemStyle}></div> 的style结构
                var styleName = expr.name;
                attrs.push(
                    t.JSXAttribute(
                        t.JSXIdentifier('style'),
                        t.jSXExpressionContainer(
                            t.identifier(
                                `React.collectStyle(${styleName}, this.props, ${styleRandName})`
                            )
                        )
                    )
                );
                astPath.remove();
            } else if (styleType === 'ObjectExpression') {
                // 处理形如 style={{ width: 200, borderWidth: '1px' }} 的style结构
                var styleValue = generate(expr).code;
                attrs.push(
                    t.JSXAttribute(
                        t.JSXIdentifier('style'),
                        t.jSXExpressionContainer(
                            t.identifier(
                                `React.collectStyle(${styleValue}, this.props, ${styleRandName})`
                            )
                        )
                    )
                );
                astPath.remove();
            }
        }
    },

    JSXClosingElement: function(astPath, state) {
        let modules = utils.getAnu(state);
        let nodeName = astPath.node.name.name;
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
