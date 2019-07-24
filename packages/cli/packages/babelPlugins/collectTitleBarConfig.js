"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config/config"));
module.exports = function () {
    return {
        visitor: {
            ObjectProperty(astPath, state) {
                if (config_1.default['buildType'] !== 'quick' || astPath.node.key.name !== 'navigationBarTitleText')
                    return;
                let fileId = state.file.opts.filename;
                let node = astPath.node;
                if (node.value.value === '') {
                    config_1.default['quick']['disabledTitleBarPages'].add(fileId);
                }
            }
        }
    };
};
