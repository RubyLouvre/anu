import * as path from 'path';
import * as fs from 'fs';
import * as babel from '@babel/core';
import * as t from '@babel/types';
import { parserOptions } from './JavascriptParserFactory';
import { NanachiQueue } from '../../nanachi-loader/loaders/nanachiLoader';

const removeAst = (ast: any) => { 
    if (ast.node.type === 'JSXElement') {
        ast.replaceWith(t.nullLiteral());
    } else {
        ast.remove(); 
    }
};

export interface BabelRes extends babel.BabelFileResult {
    options?: {
        anu?: any
    }
}

class JavascriptParser{
    public map: any;
    public meta: any;
    public ast: any;
    public filepath: string;
    public code: string;
    public parsedCode: string;
    public platform: string;
    public componentType: string;
    public relativePath: string;
    public queues: Array<NanachiQueue>; 
    public extraModules: Array<string>;
    public filterCommonFile: Array<any>;
    protected _babelPlugin: babel.TransformOptions;
    constructor({
        code,
        map,
        meta,
        filepath,
        platform
    }: parserOptions) {
        this.map = map;
        this.meta = meta;
        this.filepath = filepath;
        this.code = code || fs.readFileSync(this.filepath, 'utf-8');
        this.platform = platform;
        this.relativePath = path.relative(path.resolve(process.cwd(), 'source'), filepath);
        if (/node_modules/.test(filepath)) {
            this.relativePath = path.join('npm', path.relative(path.resolve(process.cwd(), 'node_modules'), filepath));
        } else {
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
        if (
            /\/components\//.test(this.filepath)                
        ) {
            this.componentType = 'Component';
        } else if (/\/pages\//.test(this.filepath) && !/\/common\//.test(this.filepath)) {
            this.componentType = 'Page';
        } else if (/app\.js$/.test(this.filepath)) {
            this.componentType = 'App';
        }
    }
    
    async parse():Promise<BabelRes> {
        const res: BabelRes = await babel.transformFileAsync(this.filepath, this._babelPlugin);
        this.extraModules = res.options.anu && res.options.anu.extraModules || this.extraModules;
        this.parsedCode = res.code;
        this.ast = res.ast;
        return res;
    }
    getCodeForWebpack() {
        const res = babel.transformFromAstSync(this.ast, null, {
            configFile: false,
            babelrc: false,
            comments: false,
            ast: true,
            plugins: [
                function() {
                    return {
                        visitor: {
                            // 移除所有jsx，对webpack解析无用
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
        // modules去重
        this.extraModules = this.extraModules.filter((m, i, self) => {
            return self.indexOf(m) === i;
        });
        this.extraModules.forEach(module => {
            // windows 补丁
            module = module.replace(/\\/g, '\\\\');
            res = `import '${module}';\n` + res;
        });
        return res;
    }
}

export default JavascriptParser;