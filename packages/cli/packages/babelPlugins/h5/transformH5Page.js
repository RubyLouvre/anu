
const pageConfig = require('../../h5Helpers/pageConfig');
const path = require('path');

module.exports = function({types: t}){
    return {
        visitor: {
            // ExportDefaultDeclaration(astPath, state) {
            //     // const { cwd, filename } = state;
            //     // const pagePath = '/' + path.relative(path.join(cwd, 'source'), filename).replace(/\.js$/, '');
            //     // const register = t.expressionStatement(
            //     //     t.callExpression(
            //     //         t.memberExpression(
            //     //             t.identifier('React'),
            //     //             t.identifier('registerPage')
            //     //         ),
            //     //         [
            //     //             astPath.get('declaration').node,
            //     //             t.stringLiteral(pagePath)
            //     //         ]
            //     //     )
            //     // );
            //     // astPath.insertBefore(register);
            // },
            ClassProperty(astPath, state) {
                const { cwd, filename } = state;
                if (astPath.get('key').isIdentifier({
                    name: 'config'
                }) && astPath.get('value').isObjectExpression()) {
                    const node = astPath.get('value').node;
                    const pagePath = '/' + path.relative(path.join(cwd, 'source'), filename).replace(/\.js$/, '');
                    // pageConfig[pagePath] = config;
                    // console.log(config)
                    pageConfig.properties.push(t.objectProperty(t.stringLiteral(pagePath), node));
                }
            },
        }
    };
};
    