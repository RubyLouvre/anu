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

        try{
            await parser.parse();
        } catch (err) {
            //生产环境中构建时候如果构建错误，立马退出，抛错。
            if ( ['prod', 'rc', 'beta'].includes((process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase())) ) {
                process.exit(1);
                console.log(err);
            }
            console.log(err);
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