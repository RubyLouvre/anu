const nanachi = require('../index');
const { NANACHI_CONFIG_PATH } = require('../consts/index');
const fs = require('fs-extra');


module.exports = async function(args){
    try {
        const { buildType, beta, betaUi, watch, compress, huawei } = args;
        const nanachiConfig = {};
        const baseConfig = {
            platform: buildType,
            beta,
            betaUi,
            compress,
            watch,
            huawei
        };
        // 合并nanachi.config.js中的用户自定义配置
        if (fs.existsSync(NANACHI_CONFIG_PATH)) {
            const userConfig = require(NANACHI_CONFIG_PATH);
            Object.assign(nanachiConfig, userConfig);
        }
        Object.assign(nanachiConfig, baseConfig);
        
        nanachi(nanachiConfig);

    } catch (e) {
        // eslint-disable-next-line
        console.log(e);
        process.exit(1);
    }
};

