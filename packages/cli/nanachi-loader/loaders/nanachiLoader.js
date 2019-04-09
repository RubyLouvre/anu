const path = require('path');
const cwd = process.cwd();
const JavascriptParserFactory = require('../parsers/jsParser/JavascriptParserFactory');
const errorStack = require('../logger/queue');


const isReact = function(sourcePath){
    return /React\w+\.js$/.test(path.basename(sourcePath));
};

const isBrokenFile = function(fildId, cb){
    return errorStack.error.some(function(error){
        return error.id === fildId;
    });
}

module.exports = async function(code, map, meta) {
    const relativePath = path.relative(path.resolve(cwd, 'source'), this.resourcePath);
    const callback = this.async();
    try {
        // TODO 抽离路径，纯净plugin
        if (isReact(this.resourcePath)) {
            callback(null, {
                queues: [{
                    type: 'js',
                    path: relativePath,
                    code
                }],
                exportCode: code
            }, map, meta);
            return;
        }
        const parser = JavascriptParserFactory.create({
            platform: this.nanachiOptions.platform,
            filepath: this.resourcePath,
            code,
            map,
            meta
        });

        await parser.parse();

        let result = {
            queues: parser.getExtraFiles(),
            exportCode: parser.getExportCode()
        }

        //不符合规范的文件不打包。
        if ( isBrokenFile(this.resourcePath) ) {
            result = { queues: [], exportCode: '' };
        }

        callback(null, result, map, meta);
        return;
    } catch (e) {
       
        callback(e, { queues: [], exportCode: '' }, map, meta);
        return;
    }
};