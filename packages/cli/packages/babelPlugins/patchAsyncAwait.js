"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const resolve_1 = __importDefault(require("resolve"));
const t = __importStar(require("@babel/types"));
const utils_1 = __importDefault(require("../utils"));
const config_1 = __importDefault(require("../../config/config"));
let hackList = ['wx', 'bu', 'tt', 'quick', 'qq'];
let copyFlag = false;
let patchAsync = false;
const pkgName = 'regenerator-runtime';
function needInstall(pkgName) {
    try {
        resolve_1.default.sync(pkgName, {
            basedir: process.cwd(),
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
                        patchAsync = true;
                    }
                }
            },
            post: function () {
                if (patchAsync && !copyFlag) {
                    if (needInstall(pkgName)) {
                        utils_1.default.installer(pkgName + '@0.12.1');
                    }
                    let cwd = process.cwd();
                    let dist = path.join(cwd, utils_1.default.getDistName(config_1.default.buildType), 'npm', `${pkgName}/runtime.js`);
                    let src = path.join(cwd, 'node_modules', `${pkgName}/runtime.js`);
                    copyFlag = true;
                }
            }
        };
    }
];
