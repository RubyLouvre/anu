interface patchComponents {
    [patchName: string]: number | string;
}
interface PlatConfig {
    libName: string;
    styleExt?: string;
    xmlExt?: string;
    jsExt?: string;
    helpers: string;
    patchComponents: patchComponents;
    disabledTitleBarPages: Set<string>;
    patchPages?: any;
}
declare enum Platforms {
    wx = "wx",
    qq = "qq",
    ali = "ali",
    bu = "bu",
    tt = "tt",
    quick = "quick",
    h5 = "h5"
}
export declare type validatePlatforms = 'wx' | 'qq' | 'ali' | 'bu' | 'tt' | 'quick' | 'h5';
export interface GlobalConfigMap {
    buildType: validatePlatforms;
    buildDir: string;
    sourceDir: string;
    huawei: boolean;
    patchComponents: patchComponents;
    pluginTags: any;
    plugins: any;
    compress?: boolean;
    WebViewRules?: any;
    [Platforms.wx]: PlatConfig;
    [Platforms.qq]: PlatConfig;
    [Platforms.ali]: PlatConfig;
    [Platforms.bu]: PlatConfig;
    [Platforms.quick]: PlatConfig;
    [Platforms.tt]: PlatConfig;
    [Platforms.h5]: PlatConfig;
}
declare const config: GlobalConfigMap;
export default config;
