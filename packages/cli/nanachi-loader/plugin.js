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
const timer_1 = __importDefault(require("../packages/utils/timer"));
const index_1 = require("../packages/utils/logger/index");
const setWebView = require('../packages/utils/setWebVeiw');
const id = 'NanachiWebpackPlugin';
class NanachiWebpackPlugin {
    constructor({ platform = 'wx', compress = false, beta = false, betaUi = false } = {}) {
        this.timer = new timer_1.default();
        this.nanachiOptions = {
            platform,
            compress,
            beta,
            betaUi
        };
    }
    apply(compiler) {
        compiler.hooks.compilation.tap(id, (compilation) => {
            compilation.hooks.normalModuleLoader.tap(id, (loaderContext) => {
                loaderContext.nanachiOptions = this.nanachiOptions;
            });
        });
        compiler.hooks.emit.tap(id, (compilation) => {
            const reg = new RegExp(compiler.options.output.filename);
            Object.keys(compilation.assets).forEach(key => {
                if (reg.test(key)) {
                    delete compilation.assets[key];
                }
            });
        });
        compiler.hooks.run.tapAsync(id, (compilation, callback) => __awaiter(this, void 0, void 0, function* () {
            this.timer.start();
            index_1.resetNum();
            callback();
        }));
        compiler.hooks.watchRun.tapAsync(id, (compilation, callback) => __awaiter(this, void 0, void 0, function* () {
            this.timer.start();
            index_1.resetNum();
            callback();
        }));
        compiler.hooks.done.tap(id, () => {
            this.timer.end();
            setWebView(compiler.NANACHI && compiler.NANACHI.webviews);
            index_1.timerLog(this.timer);
        });
    }
}
exports.default = NanachiWebpackPlugin;
