const t = require('babel-types');
const template = require('babel-template');
const generate = require('babel-generator').default;
const utils = require('../utils');

module.exports = {
    enter(astPath, state) {
        //重置数据
        var modules = utils.getAnu(state);
        modules.className = astPath.node.id.name;
        modules.parentName = generate(astPath.node.superClass).code || 'Object';
        modules.classUid = 'c' + utils.createUUID(astPath);
    },
    exit(astPath, state) {
        // 将类表式变成函数调用
        var modules = utils.getAnu(state);
        if (!modules.ctorFn) {
            modules.ctorFn = template('function x(){b}')({
                x: t.identifier(modules.className),
                b: modules.thisProperties
            });
        }
        var parent = astPath.parentPath.parentPath;
        parent.insertBefore(modules.ctorFn);
        //用于绑定事件
        modules.thisMethods.push(
            t.objectProperty(
                t.identifier('classUid'),
                t.stringLiteral(modules.classUid)
            )
        );
        const call = t.expressionStatement(
            t.callExpression(t.identifier('React.toClass'), [
                t.identifier(modules.className),
                t.identifier(modules.parentName),
                t.objectExpression(modules.thisMethods),
                t.objectExpression(modules.staticMethods)
            ])
        );
        //插入到最前面
        //  astPath.parentPath.parentPath.insertBefore(onInit);
        //  可以通过`console.log(generate(call).code)`验证
        astPath.replaceWith(call);
        if (astPath.type == 'CallExpression') {
            if (astPath.parentPath.type === 'VariableDeclarator') {
                if (parent.type == 'VariableDeclaration') {
                    parent.node.kind = '';
                }
            }
        }
        if (modules.componentType === 'Page') {
            // 动态生成Page组件的Page(React.toPage(className,astPath))调用
            // Page(React.toPage(PPP, "pages/demo/stateless/aaa"));
            var createPage = template('Page(React.toPage(className,astPath))')(
                {
                    className: t.identifier(modules.className),
                    astPath: t.stringLiteral(
                        modules.current
                            .replace(/.+pages/, 'pages')
                            .replace(/\.js$/, '')
                    )
                }
            );
            modules.createPage = createPage;
            /*  var p = astPath;
            //好像不能上升到根节点Program，只能上升到VariableDeclaration
            while (p.type != 'VariableDeclaration') {
                p = p.parentPath;
            }
            p.insertAfter(createPage);
            */
        }
    }
};
