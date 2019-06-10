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
            console.log(err);
            process.exit(1);
        }        
    }
    
    callback(null, code, map, meta);
};