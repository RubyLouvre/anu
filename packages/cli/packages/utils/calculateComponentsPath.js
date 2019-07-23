"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const cwd = process.cwd();
const getDistPath = require('./getDistPath');
const calculateAlias = require('./calculateAlias');
let cachedUsingComponents = {};
function fixWinPath(p) {
    return p.replace(/\\/g, '/');
}
module.exports = function calculateComponentsPath(bag) {
    if (!path.isAbsolute(bag.sourcePath)) {
        console.error('bag.sourcePath 必须为绝对路径.');
        process.exit(1);
    }
    if (cachedUsingComponents[bag.source]) {
        return cachedUsingComponents[bag.source];
    }
    let realPath = path.join(path.dirname(bag.sourcePath), calculateAlias(bag.sourcePath, bag.source));
    realPath = fixWinPath(realPath).replace(/\.js$/, '');
    let usingPath = getDistPath(realPath)
        .replace(fixWinPath(path.join(cwd, 'dist')), '');
    cachedUsingComponents[bag.source] = usingPath;
    return usingPath;
};
