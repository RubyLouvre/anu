import webpack from 'webpack';
import { validatePlatforms } from './config/config';
export interface NanachiOptions {
    watch?: boolean;
    platform?: validatePlatforms;
    beta?: boolean;
    betaUi?: boolean;
    compress?: boolean;
    compressOption?: any;
    typescript?: boolean;
    huawei?: boolean;
    rules?: Array<webpack.Rule>;
    prevLoaders?: Array<string>;
    prevJsLoaders?: Array<string>;
    postJsLoaders?: Array<string>;
    prevCssLoaders?: Array<string>;
    postCssLoaders?: Array<string>;
    postLoaders?: Array<string>;
    plugins?: Array<webpack.Plugin>;
    analysis?: boolean;
    silent?: boolean;
    complete?: Function;
}
declare function nanachi(options?: NanachiOptions): Promise<void>;
export default nanachi;
