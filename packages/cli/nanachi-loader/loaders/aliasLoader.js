const { MAP } = require('../../consts/index');
const babel = require('@babel/core');
const path = require('path');
const cwd = process.cwd();
const nodeResolve = require('resolve');

const getRelativePath = (from, to) => {
    return path.relative(from, to).replace(/^(?=[^.])/, './').replace(/\\/g, '/'); // ReactQuick -> ./ReactQuick
};
//提取package.json中的别名配置
function resolveAlias(code, aliasMap, relativePath, ast) {
    const babelConfig = {
        configFile: false,
        babelrc: false,
        plugins: [
            [
                require('babel-plugin-module-resolver'),        //计算别名配置以及处理npm路径计算
                {
                    resolvePath(moduleName) {
                        if (/^\./.test(moduleName)) {
                            return moduleName;
                        }
                        // 替换别名
                        moduleName = moduleName.replace(/^[@-\w]+/, function(alias) {
                            return aliasMap[alias] || alias;
                        });
                        // 如果是 import babel from '@babel' 这种node_modules引入，处理路径 node_modules -> npm
                        if (/^(?=[^./\\])/.test(moduleName)) {
                            try {
                                const nodePath = nodeResolve.sync(moduleName, {
                                    basedir: cwd
                                });
                                moduleName = path.resolve(cwd, 'source/npm', path.relative(path.resolve(cwd, 'node_modules'), nodePath));
                            } catch (e) {
                                // eslint-disable-next-line
                                console.log(e);
                                return;
                            }
                        } else {
                            moduleName = path.resolve(cwd, moduleName);
                        }
                        const from = path.join(cwd, 'source', relativePath);
                        return getRelativePath(path.dirname(from), moduleName);
                    }
                }
            ]
        ]
    };
    let result;
    if (ast) {
        result = babel.transformFromAstSync(ast, null, babelConfig);
    } else {
        result = babel.transformSync(code, babelConfig);
    }
    return result.code;
}

/**
 * 别名解析loader，将queue中代码的别名解析成相对路径
 */

module.exports = async function({ queues = [], exportCode = '' }, map, meta) {
    const aliasMap = require('../../consts/alias')(this.nanachiOptions.platform);

    const callback = this.async();
    queues = queues.map(({ code = '', path: filePath, type, ast }) => {
        const relativePath = type ? filePath.replace(/\.\w+$/, `.${MAP[this.nanachiOptions.platform]['EXT_NAME'][type] || type}`) : filePath;
        if (type === 'js') {
            code = resolveAlias(code, aliasMap, relativePath, ast);
        }
        if (type === 'ux') {
            code = code.toString().replace(/<script>([\s\S]*?)<\/script>/mg, function(match, jsCode) {
                jsCode = resolveAlias(jsCode, aliasMap, relativePath, ast);
                return `<script>${jsCode}</script>`;
            });
        }
        return {
            code,
            path: relativePath,
            type,
            ast
        };
    });
    
    callback(null, { queues, exportCode }, map, meta);
};