const path = require('path');

module.exports = function({types: t}){

    return {
        visitor: {
            ExportDefaultDeclaration(astPath, state) {
                // const { cwd, filename } = state;
                // const pagePath = '/' + path.relative(path.join(cwd, 'source'), filename).replace(/\.js$/, '');
                // const register = t.expressionStatement(
                //     t.callExpression(
                //         t.memberExpression(
                //             t.identifier('React'),
                //             t.identifier('registerPage')
                //         ),
                //         [
                //             astPath.get('declaration').node,
                //             t.stringLiteral(pagePath)
                //         ]
                //     )
                // );
                // astPath.insertBefore(register);
            }
        }
    };
};
    