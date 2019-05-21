
module.exports = function({types: t}){

    return {
        visitor: {
            Program: {
                exit(astPath) {
                    astPath.node.body.unshift(
                        t.importDeclaration(
                            [t.importDefaultSpecifier(t.identifier('DynamicPageLoader'))],
                            t.stringLiteral('@dynamic-page-loader')
                        )
                    );
                }
            },
            ExportDefaultDeclaration(astPath) {
                const page = astPath.get('declaration');
                page.replaceWith(
                    t.callExpression(t.identifier('DynamicPageLoader'), [
                        page.node
                    ])
                );
            }
        }
    };
};
    