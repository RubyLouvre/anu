
const { NANACHI_CONFIG_PATH } = require('../consts/index');
const fs = require('fs-extra');
const { deepMerge } = require('../packages/utils/index');

module.exports = async function(args){
    try {
        const { buildType, beta, betaUi, watch, compress, huawei,  analysis, silent} = args;
        const nanachiConfig = {};
        const baseConfig = {
            platform: buildType,
            beta,
            betaUi,
            compress,
            watch,
            huawei,
            analysis,
            silent
        };
        // 合并nanachi.config.js中的用户自定义配置
        if (fs.existsSync(NANACHI_CONFIG_PATH)) {
            const userConfig = require(NANACHI_CONFIG_PATH);
            deepMerge(nanachiConfig, userConfig);
        }
        deepMerge(nanachiConfig, baseConfig);
        
        require('../index')(nanachiConfig);

    } catch (e) {
        // eslint-disable-next-line
        console.log(e);
        process.exit(1);
    }
};

