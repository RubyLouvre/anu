const template = require('@babel/template').default;
const utils = require('../../utils/index');

// const importedPagesTemplatePrefixCode = template(`
// import Loadable from 'react-loadable';
// import QunarDefaultLoading from '@qunar-default-loading';
// `)();
const importedPagesTemplatePrefixCode = template(`
import ReactDOM from 'react-dom';
import PageWrapper from '@internalComponents/PageWrapper';
import calculateRem from '@internalComponents/HOC/calculateRem';
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

const calculateRem = template('const Wrapper = calculateRem(PageWrapper);');
const pageWrapper = template(`
    return <Wrapper app={this} path={this.state.path}  query={this.state.query} />
`, {
    plugins: ['jsx']
});
const CLASS_NAME = 'Global';

const registerTemplate = `
window.addEventListener('popstate', function({ state }) {
    React.api.redirectTo({
      url: state.url
    });
});
React.registerApp(this);
this.onLaunch();
React.api.redirectTo({
    url: ${CLASS_NAME}.config.pages[0]
});
`;


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
            ImportDeclaration(astPath) {
                if (astPath.get('specifiers').length !== 0) {
                    return;
                }
                const node = astPath.node;
                const importPath = node.source.value;
                if (!/pages/.test(importPath)) {
                    return;
                }
                const pageItem = t.stringLiteral(importPath.replace(/^\./, ''));
                
                importedPages.elements.push(pageItem);
            },
            ClassProperty(astPath) {
                if (
                    astPath.get('key').isIdentifier({
                        name: 'config'
                    })
                    && astPath.get('value').isObjectExpression()
                ) {
                    astPath.traverse({
                        ObjectProperty: property => {
                            const { key, value } = property.node;
                            let name;

                            if (t.isIdentifier(key)) name = key.name;
                            if (t.isStringLiteral(key)) name = key.value;

                            if (name === 'iconPath' || name === 'selectedIconPath') {
                                if (t.isStringLiteral(value)) {
                                    property
                                        .get('value')
                                        .replaceWith(
                                            t.callExpression(t.identifier('require'), [
                                                t.stringLiteral(
                                                    `@${value.value.replace(/^(\.?\/)/, '')}`
                                                )
                                            ])
                                        );
                                }
                            }
                        }
                    });

                    // 注入pages属性
                    astPath.get('value').node.properties.push(t.objectProperty(t.identifier('pages'), importedPages));
                }
            },
            ClassBody(astPath) {
                const registerApp = template(registerTemplate, {
                    placeholderPattern: false
                });
                let find = false;
                astPath.get('body').forEach(p => {
                    if (p.type === 'ClassMethod' && p.node.key.name === 'componentWillMount') {
                        find = true;
                        p.node.body.body.push(...registerApp());
                    }
                });
                if (!find) {
                    astPath.node.body.push(
                        t.classMethod('method', t.identifier('componentWillMount'),
                            [], 
                            t.blockStatement(
                                registerApp()
                            )
                        )
                    );
                }
                astPath.node.body.push(
                    t.classMethod('method', t.identifier('render'),
                        [], 
                        t.blockStatement(
                            [
                                calculateRem(),
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
