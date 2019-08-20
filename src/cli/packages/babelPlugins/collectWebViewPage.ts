import { NodePath, PluginObj } from '@babel/core';
import * as t from '@babel/types';
import globalConfig from '../../config/config';
import traverse from '@babel/traverse';
import g from '@babel/generator';
import json5 from 'json5';
import * as path from 'path';
const buildType = process.env.ANU_ENV;
const cwd = process.cwd();

let WebViewRules: any = {
    pages: [],
    allowthirdpartycookies: false,
    trustedurl: [],
    showTitleBar:  true
}

module.exports = (): PluginObj => {
    return {
        visitor: {
            ClassDeclaration(astPath: NodePath<t.ClassDeclaration>, state: any){
               
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
                            
                            Object.assign(WebViewRules, {
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
                                
                                WebViewRules.pages = WebViewRules.pages.concat(
                                    webViewConfig.pages.map((el: any)=>{
                                        return path.join(
                                            cwd,
                                            'source',
                                            /\.js$/.test(el) ? el : el + '.js'
                                        )
                                    })
                                )
                               
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
                                WebViewRules.pages.push(reg);
                            }
                        }

                    },
                    astPath.scope
                );
            }
        },
        post: function(){
           globalConfig.WebViewRules = WebViewRules;
        }
    };
};