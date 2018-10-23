const t = require('@babel/types');
const template = require('@babel/template').default;
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
            modules.ctorFn = template('function X(){B}')({
                X: t.identifier(modules.className),
                B: modules.thisProperties
            });
        }
        astPath.insertBefore(modules.ctorFn);
        //用于绑定事件
        modules.thisMethods.push(
            t.objectProperty(
                t.identifier('classUid'),
                t.stringLiteral(modules.classUid)
            )
        );
        
        const call = t.callExpression(t.identifier('React.toClass'), [
            t.identifier(modules.className),
            t.identifier(modules.parentName),
            t.objectExpression(modules.thisMethods),
            t.objectExpression(modules.staticMethods)
        ]);
        const assign = template('P = C')({
            P: t.identifier(modules.className),
            C: call
        });

        astPath.replaceWith(assign);
        if (astPath.type == 'CallExpression') {
            if (astPath.parentPath.type === 'VariableDeclarator') {
                if (parent.type == 'VariableDeclaration') {
                    parent.node.kind = '';
                }
            }
        }
        if (modules.componentType === 'Page') {
            modules.registerStatement = utils.createRegisterStatement(
                modules.className,
                modules.current
                    .replace(/.+pages/, 'pages')
                    .replace(/\.js$/, ''),
                true
            );
        } else if (modules.componentType === 'Component') {
            modules.registerStatement = utils.createRegisterStatement(
                modules.className,
                modules.className
            );
        }
    }
};
