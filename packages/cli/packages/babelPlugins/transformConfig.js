"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const platforms_1 = __importDefault(require("../../consts/platforms"));
const generator_1 = __importDefault(require("@babel/generator"));
function transformConfig(modules, astPath, buildType) {
    if (/App|Page|Component/.test(modules.componentType)) {
        try {
            var json = eval('0,' + generator_1.default(astPath.node.right).code);
            Object.assign(modules.config, json);
            var tabBar = modules.config.tabBar;
            if (tabBar && tabBar[buildType + 'List']) {
                tabBar.list = tabBar[buildType + 'List'];
                platforms_1.default.forEach(function (el) {
                    delete tabBar[el.buildType + 'List'];
                });
            }
            modules.configIsReady = true;
        }
        catch (e) {
            console.log('eval json error', e);
        }
    }
}
module.exports = transformConfig;
exports.default = transformConfig;
