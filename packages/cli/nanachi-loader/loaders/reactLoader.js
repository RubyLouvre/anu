const babel = require('@babel/core');
const buildType = process.env.ANU_ENV;

module.exports = async function(code, map, meta) {
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
            process.exit(1);
            console.log(err);
        }        
    }
    
    callback(null, code, map, meta);
};