const t = require('@babel/types');
const template = require('@babel/template').default;
const generate = require('@babel/generator').default;
const utils = require('../utils');

module.exports = {
    enter(astPath, state) {
        //重置数据
        let modules = utils.getAnu(state);
        modules.className = astPath.node.id.name;
        modules.parentName = generate(astPath.node.superClass).code || 'Object';
        modules.classUid = 'c' + utils.createUUID(astPath);
    },
    exit(astPath, state) {
        // 将类表式变成函数调用
        let modules = utils.getAnu(state);
        if (!modules.ctorFn) {
            /**
             * 占位符要大写
             * placeholderPattern
             * Type: RegExp | false Default: /^[_$A-Z0-9]+$/
             * 
             * A pattern to search for when looking for Identifier and StringLiteral nodes
             * that should be considered placeholders. 'false' will disable placeholder searching
             * entirely, leaving only the 'placeholderWhitelist' value to find placeholders.
             */
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
