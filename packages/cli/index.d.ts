import webpack from 'webpack';
import { validatePlatforms } from './config/config';
export interface NanachiOptions {
    watch?: boolean;
    platform?: validatePlatforms;
    beta?: boolean;
    betaUi?: boolean;
    compress?: boolean;
    compressOption?: any;
    huawei?: boolean;
    rules?: Array<webpack.Rule>;
    prevLoaders?: Array<string>;
    postLoaders?: Array<string>;
    plugins?: Array<webpack.Plugin>;
    analysis?: boolean;
    silent?: boolean;
    complete?: Function;
}
declare function nanachi({ watch, platform, beta, betaUi, compress, compressOption, huawei, rules, prevLoaders, postLoaders, plugins, analysis, silent, complete }?: NanachiOptions): Promise<void>;
export default nanachi;
