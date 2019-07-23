interface patchComponents {
    [patchName: string]: number;
}
interface PlatConfig {
    libName: string;
    styleExt?: string;
    xmlExt?: string;
    jsExt?: string;
    helpers: string;
    patchComponents: patchComponents;
    disabledTitleBarPages: Set<string>;
}
declare enum Platforms {
    wx = "wx",
    qq = "qq",
    ali = "ali",
    bu = "bu",
    tt = "tt",
    quick = "quick"
}
interface GlobalConfigMap {
    buildType: string;
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
}
declare const config: GlobalConfigMap;
export default config;
