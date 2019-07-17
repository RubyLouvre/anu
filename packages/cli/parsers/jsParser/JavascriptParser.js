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
const fs = __importStar(require("fs"));
const babel = __importStar(require("@babel/core"));
const t = __importStar(require("@babel/types"));
const removeAst = (ast) => {
    if (ast.node.type === 'JSXElement') {
        ast.replaceWith(t.nullLiteral());
    }
    else {
        ast.remove();
    }
};
class JavascriptParser {
    constructor({ code, map, meta, filepath, platform }) {
        this.map = map;
        this.meta = meta;
        this.filepath = filepath;
        this.code = code || fs.readFileSync(this.filepath, 'utf-8');
        this.platform = platform;
        this.relativePath = path.relative(path.resolve(process.cwd(), 'source'), filepath);
        if (/node_modules/.test(filepath)) {
            this.relativePath = path.join('npm', path.relative(path.resolve(process.cwd(), 'node_modules'), filepath));
        }
        else {
            this.relativePath = path.relative(path.resolve(process.cwd(), 'source'), filepath);
        }
        this._babelPlugin = {};
        this.queues = [];
        this.extraModules = [];
        this.parsedCode = '';
        this.ast = null;
        this.componentType = null;
        this.setComponentType();
    }
    setComponentType() {
        if (/\/components\//.test(this.filepath)) {
            this.componentType = 'Component';
        }
        else if (/\/pages\//.test(this.filepath) && !/\/common\//.test(this.filepath)) {
            this.componentType = 'Page';
        }
        else if (/app\.js$/.test(this.filepath)) {
            this.componentType = 'App';
        }
    }
    parse() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield babel.transformFileAsync(this.filepath, this._babelPlugin);
            this.extraModules = res.options.anu && res.options.anu.extraModules || this.extraModules;
            this.parsedCode = res.code;
            this.ast = res.ast;
            return res;
        });
    }
    getCodeForWebpack() {
        const res = babel.transformFromAstSync(this.ast, null, {
            configFile: false,
            babelrc: false,
            comments: false,
            ast: true,
            plugins: [
                function () {
                    return {
                        visitor: {
                            JSXElement: removeAst,
                            ClassProperty: removeAst
                        }
                    };
                }
            ]
        });
        return res.code;
    }
    getExtraFiles() {
        return this.queues;
    }
    getExportCode() {
        let res = this.parsedCode;
        this.extraModules = this.extraModules.filter((m, i, self) => {
            return self.indexOf(m) === i;
        });
        this.extraModules.forEach(module => {
            module = module.replace(/\\/g, '\\\\');
            res = `import '${module}';\n` + res;
        });
        return res;
    }
}
exports.default = JavascriptParser;
