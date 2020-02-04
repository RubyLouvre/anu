"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const buildType = process.env.ANU_ENV;
function getNativeComponents() {
    let nativeComponents = [];
    try {
        let userConfig = require(path_1.default.join(process.cwd(), 'source', `${buildType}Config.json`));
        nativeComponents = userConfig.nativeComponents || [];
    }
    catch (err) {
    }
    return nativeComponents;
}
exports.default = getNativeComponents;
