const template = require('@babel/template').default;
const utils = require('../utils/index');

const importedPagesTemplatePrefixCode = template(`
import Loadable from 'react-loadable';
import QunarDefaultLoading from '@qunar-default-loading';
`)();

const buildAsyncImport = template(
    `
  const PAGE_NAME = Loadable({
    loader: () => import('IMPORT_PATH'),
    loading: QunarDefaultLoading,
    delay: 300
  });`,
    {
        plugins: ['dynamicImport']
    }
);


module.exports = function({types: t}){
    const exportedPages = t.arrayExpression();
    return {
        visitor: {
            Program: {
                exit(astPath) {
                    astPath.node.body.unshift(...importedPagesTemplatePrefixCode);
                    astPath.node.body.push(
                        t.exportNamedDeclaration(
                            t.variableDeclaration('const', [
                                t.variableDeclarator(t.identifier('Pages'), exportedPages)
                            ]),
                            []
                        )
                    );
                }
            },
            ImportDeclaration(astPath, state) {
                const node = astPath.node;
                const importPath = node.source.value;
                if (!/pages/.test(importPath)) {
                    return;
                }
                const modules = utils.getAnu(state);
                const pageName = `Page_${utils.getAnu(state).pageIndex++}`;
                const pageItem = t.objectExpression([
                    t.objectProperty(
                        t.identifier('url'),
                        t.stringLiteral(importPath.slice(1))
                    ),
                    t.objectProperty(t.identifier('Comp'), t.identifier(pageName))
                ]);
                astPath.insertBefore(buildAsyncImport({
                    IMPORT_PATH: importPath,
                    PAGE_NAME: pageName
                }));
                modules.extraModules.push(importPath);
                exportedPages.elements.push(pageItem);
                astPath.remove();
            },
            ClassDeclaration(astPath) {
                // 移除app父类
                astPath.get('superClass').remove();
            },
            ClassProperty(astPath) {
                // console.log('ClassProperty')
            },
            ExportDefaultDeclaration(astPath) {
                const newAppNode = astPath.get('declaration').get('arguments')[0].node;
                astPath.get('declaration').replaceWith(newAppNode);
            }
        }
    };
};
    