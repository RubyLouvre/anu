"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const template_1 = __importDefault(require("@babel/template"));
const t = __importStar(require("@babel/types"));
const importedPagesTemplatePrefixCode = template_1.default(`
import ReactDOM from 'react-dom';
import PageWrapper from '@internalComponents/PageWrapper';
import calculateRem from '@internalComponents/HOC/calculateRem';
import Loadable from 'react-loadable';
import QunarDefaultLoading from '@qunar-default-loading';
`)();
const domRender = template_1.default(`
window.onload = function (){
    const Wrapper = calculateRem(CLASS_NAME);
    ReactDOM.render( <Wrapper />, document.querySelector("#app" ))
};`, {
    plugins: ['jsx']
});
const pageWrapper = template_1.default(`
    <PageWrapper app={this} path={this.state.path}  query={this.state.query} config={this.state.config} showBackAnimation={this.state.showBackAnimation}/>
`, {
    plugins: ['jsx']
})();
let CLASS_NAME = 'Global';
const temp = `window.addEventListener('popstate', function ({
    state
  }) {
    const pages = React.getCurrentPages();
    const pathname = state.url.split('?')[0];
    const index = pages.findIndex(page => page.props.path === pathname );
    if (!CLASS_NAME.config.pages.includes(pathname)) {
        React.api.navigateBack({
          delta: 1
        });
        return;
    }
    if (index > -1) {
        React.api.navigateBack({
            delta: pages.length - 1 - index
        })
    } else {
        if (React.__isTab(pathname)) {
            React.api.switchTab({
                url: state.url
            });
        } else {
            React.api.navigateTo({
                url: state.url
            });
        }
    }
});
React.registerApp(this);
this.onLaunch();
Global.config.pages.forEach((path) => {
    React.registerPage(
        Loadable({
            loader: () => import("." + path),
            loading: QunarDefaultLoading,
            delay: 300
        }),
        path
    );
});
`;
let registerTemplate = temp;
let renderDeclared = false;
module.exports = function () {
    const importedPages = t.arrayExpression();
    let pageIndex = 0;
    return {
        visitor: {
            Program: {
                enter(astPath) {
                    const exportDefaultNode = astPath.node.body.find((node) => {
                        return node.type === 'ExportDefaultDeclaration';
                    });
                    CLASS_NAME = exportDefaultNode.declaration.arguments[0].callee.name;
                },
                exit(astPath) {
                    astPath.node.body.unshift(...importedPagesTemplatePrefixCode);
                    astPath.node.body.push(domRender({
                        CLASS_NAME: t.identifier(CLASS_NAME)
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
                astPath.remove();
            },
            ClassProperty(astPath) {
            },
            ClassBody: {
                exit(astPath) {
                    registerTemplate += `const pathname = location.pathname.replace(/^\\/web/, '');
                    const search = location.search;
                    if (React.__isTab(pathname)) {
                      React.api.redirectTo({
                        url: pathname + search
                      });
                    } else {
                      React.api.redirectTo({
                        url: CLASS_NAME.config.pages[0]
                      });
                  
                      if (CLASS_NAME.config.pages.some(page => page === pathname)) {
                        if (pathname !== CLASS_NAME.config.pages[0]) {
                          React.api.navigateTo({
                            url: pathname + search
                          });
                        }
                      }
                    }`;
                    const registerApp = template_1.default(registerTemplate, {
                        placeholderPattern: /^CLASS_NAME$/,
                        plugins: ['dynamicImport']
                    })({
                        CLASS_NAME: t.identifier(CLASS_NAME)
                    });
                    let find = false;
                    astPath.get('body').forEach((p) => {
                        if (p.type === 'ClassMethod' && p.node.key.name === 'componentWillMount') {
                            find = true;
                            p.node.body.body.push(...registerApp);
                        }
                    });
                    if (!find) {
                        astPath.node.body.push(t.classMethod('method', t.identifier('componentWillMount'), [], t.blockStatement(registerApp)));
                    }
                    if (!renderDeclared) {
                        astPath.node.body.push(t.classMethod('method', t.identifier('render'), [], t.blockStatement([
                            t.returnStatement(pageWrapper.expression)
                        ])));
                    }
                }
            },
            ExportDefaultDeclaration(astPath) {
                astPath.remove();
            },
            ClassMethod(astPath) {
                if (astPath.get('key').node.name === 'render') {
                    renderDeclared = true;
                    astPath.traverse({
                        ReturnStatement(returnPath) {
                            returnPath.get('argument').node.children = [pageWrapper.expression];
                        }
                    });
                }
            },
            MemberExpression(astPath) {
                if (astPath.get('object').node.name === CLASS_NAME &&
                    astPath.get('property').node.name === 'config' &&
                    astPath.parent.right.type === 'ObjectExpression') {
                    astPath.parentPath.traverse({
                        ObjectProperty: (property) => {
                            const { key, value } = property.node;
                            let name;
                            if (t.isIdentifier(key))
                                name = key.name;
                            if (t.isStringLiteral(key))
                                name = key.value;
                            if (name === 'iconPath' || name === 'selectedIconPath') {
                                if (t.isStringLiteral(value)) {
                                    property
                                        .get('value')
                                        .replaceWith(t.callExpression(t.identifier('require'), [
                                        t.stringLiteral(`@${value.value.replace(/^(\.?\/)/, '')}`)
                                    ]));
                                }
                            }
                        }
                    });
                    astPath.parentPath.get('right').node.properties.push(t.objectProperty(t.identifier('pages'), importedPages));
                }
            }
        },
        post: function () {
            pageIndex = 0;
            registerTemplate = temp;
        }
    };
};
