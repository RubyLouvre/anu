"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postcss_1 = __importDefault(require("postcss"));
const less_1 = __importDefault(require("less"));
const postCssPluginLessParser = postcss_1.default.plugin('postcss-plugin-less-parser', function () {
    return function (root, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { css } = yield less_1.default.render(root.toString());
            res.root = postcss_1.default.parse(css);
        });
    };
});
module.exports = postCssPluginLessParser;
