import * as babel from '@babel/core';
const buildType = process.env.ANU_ENV;

module.exports = async function(code: string, map: any, meta: any) {
    const callback = this.async();
    if (buildType === 'quick') {
        try {
            let result = babel.transformSync(
                code, 
                {
                    configFile: false,
                    babelrc: false,
                    plugins: [
                        ...require('../../packages/babelPlugins/transformEnv'),
                    ]
                }
            );
            code = result.code;
        } catch (err) {
            console.log(err);
            process.exit(1);
        }        
    }
    
    callback(null, code, map, meta);
};