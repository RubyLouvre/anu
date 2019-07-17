"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const babel = __importStar(require("@babel/core"));
const isReact = function (sourcePath) {
    return /React\w+\.js$/.test(path.basename(sourcePath));
};
module.exports = function (code, map, meta) {
    return __awaiter(this, void 0, void 0, function* () {
        const callback = this.async();
        let relativePath = '';
        let queues;
        if (/\/webpack\//.test(this.resourcePath.replace(/\\/g, ''))) {
            queues = [];
            callback(null, {
                queues,
                exportCode: code
            }, map, meta);
            return;
        }
        code = babel.transformSync(code, {
            configFile: false,
            babelrc: false,
            plugins: [
                ...require('../../packages/babelPlugins/transformEnv')
            ]
        }).code;
        if (isReact(this.resourcePath)) {
            relativePath = this.resourcePath.match(/React\w+\.js$/)[0];
            queues = [{
                    code,
                    path: relativePath,
                    type: 'js'
                }];
            callback(null, {
                queues,
                exportCode: ''
            }, map, meta);
            return;
        }
        relativePath = path.join('npm', this.resourcePath.replace(/^.+?[\\\/]node_modules[\\\/]/, ''));
        queues = [{
                code,
                path: relativePath,
                type: 'js'
            }];
        callback(null, {
            queues,
            exportCode: code
        }, map, meta);
    });
};
