const URLS = {
    "getVersionsUrl": "http://gitlab.corp.qunar.com/qunar_miniprogram/lib_versions/raw/master/modules/{module}.json",
    "moduleGitUrl": "git@gitlab.corp.qunar.com:qunar_miniprogram/{module}.git",
    "packageUrl": "http://cmyum.corp.qunar.com/mobile_app/mp/",
    "prefix": "nnc"
};
function patchOldChaikaDownLoad(name, downLoadGitRepo, downLoadBinaryLib) {
    const [moduleName, versionName] = name.split('@');
    const { moduleGitUrl, packageUrl, prefix } = URLS;
    const patchModuleName = /home_/.test(moduleName)
        ? `${prefix}_${moduleName}`
        : `${prefix}_module_${moduleName}`;
    if (/^#/.test(versionName)) {
        const gitRepo = moduleGitUrl.replace('{module}', `${patchModuleName}`);
        const branchName = versionName.replace(/^#/, '');
        downLoadGitRepo(gitRepo, branchName);
    }
    else {
        const patchModuleUrl = `${packageUrl}${patchModuleName}/${versionName}/${moduleName}-${versionName}.w`;
        downLoadBinaryLib(patchModuleUrl, patchModuleName);
    }
}
module.exports = patchOldChaikaDownLoad;
