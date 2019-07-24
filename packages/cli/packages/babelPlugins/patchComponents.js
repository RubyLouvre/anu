"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config/config"));
const path = __importStar(require("path"));
const index_1 = __importDefault(require("../utils/index"));
const resolve_1 = __importDefault(require("resolve"));
const cwd = process.cwd();
const pkgName = 'schnee-ui';
let installFlag = false;
let patchSchneeUi = false;
function needInstall(pkgName) {
    try {
        resolve_1.default.sync(pkgName, {
            basedir: process.cwd(),
            moduleDirectory: ''
        });
        return false;
    }
    catch (err) {
        return true;
    }
}
function getPatchComponentPath(name) {
    return path.join(cwd, `./node_modules/schnee-ui/components/${name}/index.js`);
}
module.exports = () => {
    return {
        visitor: {
            JSXOpeningElement: function (astPath, state) {
                let pagePath = index_1.default.fixWinPath(state.filename);
                let nodeName = astPath.node.name.name;
                let platConfig = config_1.default[config_1.default.buildType];
                let patchComponents = platConfig.patchComponents;
                if (!patchComponents[nodeName]) {
                    return;
                }
                patchSchneeUi = true;
                const modules = index_1.default.getAnu(state);
                const patchComponentPath = getPatchComponentPath(index_1.default.parseCamel('x-' + nodeName));
                modules.extraModules.push(patchComponentPath);
                modules.importComponents[index_1.default.parseCamel('x-' + nodeName)] = {
                    source: patchComponentPath,
                    sourcePath: pagePath
                };
                config_1.default.patchComponents[nodeName] = config_1.default.patchComponents[nodeName] || patchComponentPath;
                var pagesNeedPatchComponents = platConfig.patchPages || (platConfig.patchPages = {});
                var currentPage = pagesNeedPatchComponents[pagePath] || (pagesNeedPatchComponents[pagePath] = {});
                currentPage[nodeName] = true;
            }
        },
        post: function () {
            if (patchSchneeUi && !installFlag && needInstall(pkgName)) {
                index_1.default.installer(pkgName);
                installFlag = true;
            }
        }
    };
};
