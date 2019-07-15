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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const postcss_1 = __importDefault(require("postcss"));
const fs = __importStar(require("fs"));
const utils = require('../../packages/utils/index');
class StyleParser {
    constructor({ code, map, meta, filepath, platform, type, loaderContext }) {
        this.code = code || fs.readFileSync(filepath, 'utf-8');
        this.map = map;
        this.meta = meta;
        this.filepath = filepath;
        this.type = type;
        this.platform = platform;
        this.relativePath = this.getRelativePath(filepath);
        this._postcssPlugins = [
            require('stylelint')({
                configFile: require.resolve(`../../config/stylelint/.stylelint-${this.platform}.config.js`)
            }),
            require('../../packages/postcssPlugins/postCssPluginReport')
        ];
        this._postcssOptions = {};
        this.parsedCode = '';
        this.extraModules = [];
        this.loaderContext = loaderContext || {};
    }
    getRelativePath(filepath) {
        if (/node_modules[\\\/]schnee-ui/.test(filepath)) {
            return path.join('npm', path.relative(path.resolve(process.cwd(), 'node_modules'), filepath));
        }
        else {
            return path.relative(path.resolve(process.cwd(), 'source'), filepath);
        }
    }
    parse() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield new Promise((resolve, reject) => {
                postcss_1.default(this._postcssPlugins).process(this.code, this._postcssOptions).then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });
            });
            const deps = utils.getDeps(res.messages);
            if (deps) {
                this.extraModules = deps.map((d) => d.file);
            }
            this.parsedCode = res.css;
            return res;
        });
    }
    getExtraFiles() {
        return [{
                type: 'css',
                path: this.relativePath,
                code: this.parsedCode,
            }];
    }
    getExportCode() {
        let res = `module.exports=${JSON.stringify(this.parsedCode)};`;
        if (this.platform !== 'h5') {
            this.extraModules.forEach(module => {
                module = module.replace(/\\/g, '\\\\');
                res = `import '${module}';\n` + res;
            });
        }
        return res;
    }
}
exports.default = StyleParser;
