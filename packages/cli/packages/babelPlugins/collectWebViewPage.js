const globalConfig = require('../config');
const traverse = require('@babel/traverse').default;
const g = require('@babel/generator').default;
const json5 = require('json5');
const path = require('path');
const buildType = process.env.ANU_ENV;

module.exports = ()=>{
    return {
        visitor: {
            ClassDeclaration(astPath, state){
                if (buildType !== 'quick') return;
                let fileId = state.file.opts.filename;
                
                traverse(
                    astPath.node, 
                    {
                        AssignmentExpression(astPath) {
                            let node = astPath.node;
                            if (g(node.left).code !== 'this.config') return;
                            if (node.right.type !== 'ObjectExpression') return;
                            let webViewConfig = (json5.parse(g(node.right).code) || {})['webview'];
                            if ( !( webViewConfig  && webViewConfig[buildType]) ) return;
                            webViewConfig = webViewConfig[buildType];
                            

                            globalConfig.webview =  globalConfig.webview || {
                                pages: [],
                                allowthirdpartycookies: false,
                                trustedurl: [],
                                showTitleBar:  true
                            }
                            
                            Object.assign(globalConfig.webview, {
                                pages:  webViewConfig.pages,
                                allowthirdpartycookies: webViewConfig.allowthirdpartycookies,
                                trustedurl: webViewConfig.trustedurl,
                                showTitleBar: webViewConfig.showTitleBar
                            })

                            
                            
                            /**
                             * webview: {
                             *    quick: {
                             *       pages: ['pages/a/b']
                             *    }
                             * }
                             */
                            if (Array.isArray(webViewConfig.pages)) {
                                globalConfig.webview.pages = webViewConfig.pages.map((el)=>{
                                    return path.join(
                                        cwd,
                                        'source',
                                        /\.js$/.test(el) ? el : el.value + '.js'
                                    )
                                });
                                
                                return;
                            }
                            

                            /**
                             * webview: {
                             *    quick: {
                             *       pages: true
                             *    }
                             * }
                             */
                            if (
                                Object.prototype.toString.call(webViewConfig.pages) === '[object Boolean]'
                                && webViewConfig.pages
                            ) {
                                let startPath = path.join(path.dirname(fileId), '..');
                                let reg = new RegExp('^' + startPath );
                                globalConfig.webview.pages = [ reg ];
                               
                            }
                            
                        }
                    },
                    astPath.scope
                );
            }
        }
    };
};