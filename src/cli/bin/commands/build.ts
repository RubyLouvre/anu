
import { NANACHI_CONFIG_PATH } from '../../consts/index';
import * as fs from 'fs-extra';
import nanachi from '../../index';
const { deepMerge } = require('../../packages/utils/index');

interface BulidOptions {
    watch: boolean;
    buildType: string;
    [props: string]: any;
}

export default async function(args: BulidOptions){
    try {
        const { buildType, beta, betaUi, watch, compress, huawei, analysis, silent, typescript} = args;
        const nanachiConfig = {};
        const baseConfig = {
            platform: buildType,
            beta,
            betaUi,
            compress,
            watch,
            huawei,
            analysis,
            silent,
            typescript
        };
        // 合并nanachi.config.js中的用户自定义配置
        if (fs.existsSync(NANACHI_CONFIG_PATH)) {
            const userConfig = require(NANACHI_CONFIG_PATH);
            deepMerge(nanachiConfig, userConfig);
        }
        deepMerge(nanachiConfig, baseConfig);
        
        nanachi(nanachiConfig);

    } catch (e) {
        // eslint-disable-next-line
        console.log(e);
        process.exit(1);
    }
};

