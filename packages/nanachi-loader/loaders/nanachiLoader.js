const path = require('path');
const cwd = process.cwd();
const JavascriptParserFactory = require('../parsers/jsParser/JavascriptParserFactory');

const isReact = function(sourcePath){
    return /React\w+\.js$/.test(path.basename(sourcePath));
};

module.exports = async function(code, map, meta) {
    const relativePath = path.relative(path.resolve(cwd, 'source'), this.resourcePath);
    const callback = this.async();
    try {
        // TODO 抽离路径，纯净plugin
        if (isReact(this.resourcePath)) {
            callback(null, [{
                isDefault: true,
                type: 'js',
                path: relativePath,
                code: code
            }], map, meta);
            return;
        }
        const parser = JavascriptParserFactory.create({
            platform: 'wx',
            filepath: this.resourcePath,
            code,
            map,
            meta
        });
        const res = await parser.parse();
        res.options.anu = res.options.anu || {};
        res.options.anu.queue = res.options.anu.queue || [];
        res.options.anu.queue.push({
            isDefault: true,
            type: 'js',
            path: relativePath,
            code: res.code,
            extraModules: res.options.anu.extraModules
        });

        callback(null, res.options.anu.queue, map, meta);
        return;
    } catch (e) {
        console.log(e);
        callback(e, '', map, meta);
        return;
    }
};