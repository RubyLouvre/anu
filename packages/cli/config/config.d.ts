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
interface GlobalConfigMap {
    buildType: string;
    buildDir: string;
    sourceDir: string;
    huawei: boolean;
    patchComponents: patchComponents;
    pluginTags: any;
    plugins: any;
    [platName: string]: PlatConfig | string | boolean | patchComponents;
}
declare const config: GlobalConfigMap;
export default config;
