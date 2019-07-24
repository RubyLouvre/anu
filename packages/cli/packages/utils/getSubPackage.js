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
module.exports = function (buildType) {
    let subPackages = [];
    try {
        let appRootConfig = require(path.join(process.cwd(), 'source', `${buildType}Config.json`));
        subPackages = appRootConfig.subpackages || appRootConfig.subPackages || [];
    }
    catch (err) {
    }
    return subPackages;
};
