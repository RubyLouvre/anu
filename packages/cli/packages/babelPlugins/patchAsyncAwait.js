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
const resolve_1 = __importDefault(require("resolve"));
const t = __importStar(require("@babel/types"));
const utils_1 = __importDefault(require("../utils"));
const config_1 = __importDefault(require("../../config/config"));
let hackList = ['wx', 'bu', 'tt', 'quick', 'qq'];
let needPatch = false;
let installFlag = false;
const pkgName = 'regenerator-runtime@0.12.1';
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
module.exports = [
    require('@babel/plugin-transform-async-to-generator'),
    function () {
        return {
            visitor: {
                FunctionDeclaration: {
                    exit(astPath) {
                        let name = astPath.node.id.name;
                        if (!(name === '_asyncToGenerator' && hackList.includes(config_1.default.buildType))) {
                            return;
                        }
                        let root = astPath.findParent(t.isProgram);
                        root.node.body.unshift(t.importDeclaration([
                            t.importDefaultSpecifier(t.identifier('regeneratorRuntime'))
                        ], t.stringLiteral('regenerator-runtime/runtime')));
                        needPatch = true;
                    }
                }
            },
            post: function () {
                if (needPatch && needInstall(pkgName.split('@')[0]) && !installFlag) {
                    utils_1.default.installer(pkgName);
                    installFlag = true;
                }
            }
        };
    }
];
