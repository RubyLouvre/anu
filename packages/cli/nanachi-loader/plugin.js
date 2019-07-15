"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Timer = require('../packages/utils/timer');
const { resetNum, timerLog } = require('./logger/index');
const setWebView = require('../packages/utils/setWebVeiw');
const id = 'NanachiWebpackPlugin';
const pageConfig = require('../packages/h5Helpers/pageConfig');
const generate = require('@babel/generator').default;
const t = require('@babel/types');
class NanachiWebpackPlugin {
    constructor({ platform = 'wx', compress = false, beta, betaUi } = {}) {
        this.timer = new Timer();
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
            if (this.nanachiOptions.platform === 'h5') {
                const { code } = generate(t.exportDefaultDeclaration(pageConfig));
                compilation.assets['pageConfig.js'] = {
                    source: function () {
                        return code;
                    },
                    size: function () {
                        return code.length;
                    }
                };
            }
            const reg = new RegExp(compiler.options.output.filename);
            Object.keys(compilation.assets).forEach(key => {
                if (reg.test(key)) {
                    delete compilation.assets[key];
                }
            });
        });
        compiler.hooks.run.tapAsync(id, (compilation, callback) => __awaiter(this, void 0, void 0, function* () {
            this.timer.start();
            resetNum();
            callback();
        }));
        compiler.hooks.watchRun.tapAsync(id, (compilation, callback) => __awaiter(this, void 0, void 0, function* () {
            this.timer.start();
            resetNum();
            callback();
        }));
        compiler.hooks.done.tap(id, () => {
            this.timer.end();
            setWebView(compiler.NANACHI && compiler.NANACHI.webviews);
            timerLog(this.timer);
        });
    }
}
exports.default = NanachiWebpackPlugin;
