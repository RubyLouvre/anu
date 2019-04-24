const path = require('path');
const nodeResolve = require('resolve');
const babel = require('@babel/core');

const isReact = function(sourcePath){
    return /React\w+\.js$/.test(path.basename(sourcePath));
};

module.exports = async function(code, map, meta) {
    const callback = this.async();
    const that = this;
    let relativePath = '';
    let queues;
    // 如果不是业务目录下的资源，直接返回空
    if (!this.resourcePath.startsWith(process.cwd())) {
        queues = [];
        callback(null, {
            queues,
            exportCode: code
        }, map, meta);
        return;
    }
    if (isReact(this.resourcePath)) {
        relativePath = this.resourcePath.match(/React\w+\.js$/)[0];
        queues = [{
            code,
            path: relativePath
        }];
        callback(null, {
            queues,
            exportCode: ''
        }, map, meta);
        return;
    }

    relativePath = path.join('npm', this.resourcePath.replace(/^.+?[\\\/]node_modules[\\\/]/, ''));
    // 解析node_modules中的npm包路径， 如： require('abc') => require('../../abc');
    const result = babel.transformSync(code, {
        configFile: false,
        babelrc: false,
        comments: false,
        ast: true,
        plugins: [
            [
                require('babel-plugin-module-resolver'),        //计算别名配置以及处理npm路径计算
                {
                    resolvePath(moduleName) {
                        if (/^\./.test(moduleName)) {
                            return moduleName;
                        }
                        try {
                            const targetPath = nodeResolve.sync(moduleName, {
                                basedir: process.cwd(),
                                moduleDirectory: ''
                            });
                            return path.relative(path.dirname(that.resourcePath), targetPath);
                        } catch (err) {
                            return moduleName;
                        }
                    }
                }
            ]
        ]
    });
    
    code = result.code || code;
    queues = [{
        code,
        path: relativePath
    }];
    callback(null, {
        queues,
        exportCode: code
    }, map, meta);
};