const config = require('../config');
const traverse = require('babel-traverse').default;
const path = require('path');
const cwd = process.cwd();

module.exports = ()=>{
    return {
        visitor: {
            ClassDeclaration(astPath, state){
                if (config['buildType'] !== 'quick') return;
                let fileId = state.file.opts.filename;
               
                traverse(
                    astPath.node, 
                    {
                        ObjectProperty(astPath){
                            let node = astPath.node;
                            if (node.key.name !== 'webview') return;
                            let properties = node.value.properties;
                            if (!properties) return;
                            for (let i = 0; i < properties.length; i++) {
                                if ( properties[i].key.name === config['buildType'] ) {
                                   
                                    let value = properties[i].value;
                                   
                                    /**
                                     * webview: {
                                     *    quick: ['pages/a/b']
                                     * }
                                     */
                                    
                                    if (value.type === 'ArrayExpression') {
                                        let elements = value.elements;
                                       
                                        let routes = elements.map((el)=>{
                                            return path.join(
                                                cwd, 
                                                config.sourceDir,
                                                /\.js$/.test(el.value) ? el.value : el.value + '.js'
                                            );
                                        });

                                        config['webview'] = config['webview'] || [];
                                        config['webview'] = config['webview'].concat(routes);
                                        break;
                                    }

                                    /**
                                     * webview: {
                                     *    quick: true
                                     * }
                                     */
                                    if ( value.type === 'BooleanLiteral' && value.value ) {
                                        let fileDir = path.dirname(fileId);
                                        let parentPath = path.join(fileDir, '..');
                                        let reg = new RegExp('^' + parentPath );
                                        config['webview'] = config['webview'] || [];
                                        config['webview'].push(reg);
                                        break;
                                    }
                                
                                }
                               
                              
                            }
                        },
                    },
                    astPath.scope
                );
            }
        }
    };
};