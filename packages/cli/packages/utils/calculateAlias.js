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
const nodeResolve = require('resolve');
const getDistPath = require('./getDistPath');
function fixPath(p) {
    p = p.replace(/\\/g, '/');
    return /^\w/.test(p) ? './' + p : p;
}
function calculateAlias(srcPath, importerSource, ignoredPaths) {
    const aliasMap = require('./calculateAliasConfig')();
    if (ignoredPaths && ignoredPaths.find((p) => importerSource === p)) {
        return '';
    }
    if (!path.isAbsolute(srcPath)) {
        console.error(`计算alias中的 ${srcPath} 必须为绝对路径.`);
        process.exit(1);
    }
    if (path.isAbsolute(importerSource)) {
        let from = path.dirname(srcPath);
        let to = importerSource.replace(/\.js$/, '');
        from = getDistPath(from);
        to = getDistPath(to);
        return fixPath(path.relative(from, to));
    }
    let rsegments = importerSource.split('/');
    if (/^\./.test(rsegments[0])) {
        return importerSource;
    }
    if (aliasMap[rsegments[0]]) {
        let from = path.dirname(getDistPath(srcPath));
        let to = importerSource.replace(new RegExp(rsegments[0]), aliasMap[rsegments[0]]);
        to = getDistPath(to);
        return fixPath(path.relative(from, to));
    }
    try {
        let from = path.dirname(getDistPath(srcPath));
        let to = nodeResolve.sync(importerSource, {
            basedir: cwd
        });
        to = getDistPath(to);
        return fixPath(path.relative(from, to));
    }
    catch (e) {
        console.log(e);
        return;
    }
}
module.exports = calculateAlias;
exports.default = calculateAlias;
