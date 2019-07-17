import * as path from 'path';
import StyleParserFactory from '../../parsers/styleParser/StyleParserFactory';

module.exports = async function(code: string, map: any, meta: any) {
    const callback = this.async();
    const parser = StyleParserFactory.create({
        type: path.extname(this.resourcePath).replace(/^\./, ''), // sass less css
        platform: this.nanachiOptions.platform,
        code,
        map,
        meta,
        filepath: this.resourcePath,
        loaderContext: this
    });
    try {
        await parser.parse();
        const result = {
            queues: parser.getExtraFiles(),
            exportCode: parser.getExportCode()
        };

        callback(null, result, map, meta);
    } catch (e) {
        callback(e);
    }
};
