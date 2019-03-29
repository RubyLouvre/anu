const path = require('path');
const utils = require('../../cli/packages/utils/index');
const StyleParserFactory = require('../parsers/styleParser/StyleParserFactory');

module.exports = async function(code, map, meta) {
    const relativePath = path.relative(path.resolve(this.rootContext, 'source'), this.resourcePath);
    const callback = this.async();
    const parser = StyleParserFactory.create({
        type: path.extname(this.resourcePath).replace(/^\./, ''), // sass less css
        platform: 'wx',
        code,
        map,
        meta,
        filepath: this.resourcePath
    });
    try {
        const res = await parser.parse();
        callback(null, [{
            isDefault: true,
            type: 'css',
            code: res.css,
            path: relativePath,
            extraModules: utils.getDeps(res.messages).map(item=>item.file)
        }], map, meta);
    } catch (e) {
        callback(e);
    }
};
