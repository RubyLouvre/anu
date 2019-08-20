"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const miniappVisitor_1 = __importDefault(require("./miniappVisitor"));
const config_1 = __importDefault(require("../../config/config"));
const utils_1 = __importDefault(require("../utils"));
let quickFiles = require('../quickHelpers/quickFiles');
let reg = utils_1.default.getComponentOrAppOrPageReg();
let miniAppPlugin = function () {
    return {
        visitor: miniappVisitor_1.default,
        manipulateOptions(opts) {
            var modules = (opts.anu = {
                thisMethods: [],
                staticMethods: [],
                thisProperties: [],
                config: {},
                importComponents: {},
                usedComponents: {},
                customComponents: [],
                extraModules: [],
                queue: []
            });
            let filePath = opts.filename.replace(/\\/g, '/');
            modules.sourcePath = filePath;
            modules.current = filePath.replace(process.cwd().replace(/\\/g, '/'), '');
            if (/\/components\//.test(filePath)) {
                modules.componentType = 'Component';
            }
            else if (/\/pages\//.test(filePath)) {
                modules.componentType = 'Page';
            }
            else if (/app\.js$/.test(filePath)) {
                modules.componentType = 'App';
            }
            if (config_1.default.buildType === 'quick' && modules.componentType) {
                var obj = quickFiles[modules.sourcePath];
                if (!obj) {
                    obj = quickFiles[modules.sourcePath] = {};
                }
                obj.type = modules.componentType;
            }
        }
    };
};
module.exports = (filePath) => {
    return reg.test(filePath) ? [miniAppPlugin] : [];
};
