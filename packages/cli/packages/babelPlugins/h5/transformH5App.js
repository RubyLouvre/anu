const template = require('@babel/template').default;
const utils = require('../../utils/index');

// const importedPagesTemplatePrefixCode = template(`
// import Loadable from 'react-loadable';
// import QunarDefaultLoading from '@qunar-default-loading';
// `)();
const importedPagesTemplatePrefixCode = template(`
import ReactDOM from 'react-dom';
import PageWrapper from '@internalComponents/PageWrapper';
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

const domRender = template(`
window.onload = function (){
    ReactDOM.render( <CLASS_NAME />, document.querySelector("#app" ))
};`,
{
    plugins: ['jsx']
});

const pageWrapper = template('return <PageWrapper app={this} path={this.state.path}  query={this.state.query} />', {
    plugins: ['jsx']
});

const registerApp = template(`
React.registerApp(this);
this.onLaunch();
React.api.redirectTo(CLASS_NAME.config.pages[0]);`);

const CLASS_NAME = 'Global';

module.exports = function ({ types: t }) {
    const importedPages = t.arrayExpression();
    return {
        visitor: {
            Program: {
                exit(astPath) {
                    astPath.node.body.unshift(...importedPagesTemplatePrefixCode);
                    astPath.node.body.push(domRender({
                        CLASS_NAME: t.jsxIdentifier(CLASS_NAME)
                    }));
                }
            },
            ImportDeclaration(astPath, state) {
                const node = astPath.node;
                const importPath = node.source.value;
                if (!/pages/.test(importPath)) {
                    return;
                }
                
                const pageItem = t.stringLiteral(importPath);
                
                importedPages.elements.push(pageItem);
            },
            ClassProperty(astPath) {
                if (astPath.get('key').isIdentifier({
                    name: 'config'
                }) && astPath.get('value').isObjectExpression()) {
                    astPath.get('value').node.properties.push(t.objectProperty(t.identifier('pages'), importedPages));
                }
            },
            ClassBody(astPath) {
                let find = false;
                astPath.get('body').forEach(p => {
                    if (p.type === 'ClassMethod' && p.node.key.name === 'componentWillMount') {
                        find = true;
                        p.node.body.body.push(...registerApp({
                            CLASS_NAME
                        }));
                    }
                });
                if (!find) {
                    astPath.node.body.push(
                        t.classMethod('method', t.identifier('componentWillMount'),
                            [], 
                            t.blockStatement(
                                registerApp({
                                    CLASS_NAME
                                })
                            )
                        )
                    );
                }
                astPath.node.body.push(
                    t.classMethod('method', t.identifier('render'),
                        [], 
                        t.blockStatement(
                            [
                                pageWrapper()
                            ]
                        )
                    )
                );
            },
            ExportDefaultDeclaration(astPath) {
                astPath.remove();
            }
        }
    };
};
