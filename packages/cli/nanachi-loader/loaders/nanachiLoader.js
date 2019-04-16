const JavascriptParserFactory = require('../parsers/jsParser/JavascriptParserFactory');

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

        await parser.parse();

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