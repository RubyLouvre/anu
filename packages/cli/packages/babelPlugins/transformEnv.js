"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config/config"));
let defaultConfig = [
    [
        require('babel-plugin-transform-inline-environment-variables'),
        {
            env: {
                ANU_ENV: config_1.default['buildType'],
                ANU_WEBVIEW: process.env.ANU_WEBVIEW,
                BUILD_ENV: process.env.BUILD_ENV,
            }
        }
    ],
    [require('babel-plugin-minify-dead-code-elimination'), {
            keepFnArgs: true
        }]
];
if (['prod', 'production'].includes(process.env.BUILD_ENV)) {
    defaultConfig.push([require('babel-plugin-transform-remove-console'), { 'exclude': ['error', 'warn'] }]);
}
module.exports = defaultConfig;
