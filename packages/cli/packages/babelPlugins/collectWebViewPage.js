const config = require('../config');
const traverse = require('babel-traverse').default;

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
                            
                            for (let i = 0; i < properties.length; i++) {
                                if ( properties[i].key.name === config['buildType'] ) {
                                    let value = properties[i].value;
                                    if (value.type === 'ArrayExpression') {
                                        /**
                                         * webview: {
                                         *    quick: ['pages/a/b]
                                         * }
                                         */
                                        // let routes = value.elements.map((el)=>{
                                        //     return el.
                                        // })

                                    }
                                
                                }
                                if (
                                    properties[i].key.name === config['buildType']
                                    && properties[i].value.value
                                ) {
                                    config['webview'] = config['webview'] || [];
                                    config['webview'].push(fileId);
                                    break;
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