const JavascriptParserFactory = require('../parsers/jsParser/JavascriptParserFactory');
const errorStack = require('../logger/queue');

const isBrokenFile = function(fildId, cb){
    return errorStack.error.some(function(error){
        return error.id === fildId;
    });
};

module.exports = async function(code, map, meta) {
    // const relativePath = path.relative(path.resolve(cwd, 'source'), this.resourcePath);
    const callback = this.async();
    try {
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
        };

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