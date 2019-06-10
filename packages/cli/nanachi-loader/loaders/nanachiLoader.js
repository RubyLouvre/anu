const JavascriptParserFactory = require('../parsers/jsParser/JavascriptParserFactory');
const utils = require('../../packages/utils/index');

module.exports = async function(code, map, meta) {
    const callback = this.async();
    
    try {
        const parser = JavascriptParserFactory.create({
            platform: this.nanachiOptions.platform,
            filepath: this.resourcePath,
            code,
            map,
            meta
        });

        try {
            await parser.parse();
        } catch (err) {
            //生产环境中构建时候如果构建错误，立马退出，抛错。
            if ( utils.isMportalEnv() ) {
                console.log(err);
                process.exit(1);
            }
            console.log(this.resourcePath, '\n', err);
        }
       
        let result = {
            queues: parser.getExtraFiles(),
            exportCode: parser.getExportCode()
        };
        callback(null, result, map, meta);
        return;
    } catch (e) {
        callback(e, { queues: [], exportCode: '' }, map, meta);
        return;
    }
};