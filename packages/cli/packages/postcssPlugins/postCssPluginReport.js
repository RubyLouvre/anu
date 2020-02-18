"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postcss_1 = __importDefault(require("postcss"));
const queue_1 = require("../utils/logger/queue");
const postCssPluginReport = postcss_1.default.plugin('postcss-plugin-report', () => {
    return (root, result) => {
        const from = result.opts.from;
        result.messages.filter(m => {
            return m.plugin === 'stylelint';
        }).forEach(m => {
            queue_1.warning.push({
                id: from,
                msg: m.text,
                loc: {
                    line: m.line,
                    column: m.column
                }
            });
        });
    };
});
module.exports = postCssPluginReport;
