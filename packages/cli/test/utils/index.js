const JavascriptParserFactory = require('../../nanachi-loader/parsers/jsParser/JavascriptParserFactory');
const path = require('path');
const fs = require('fs');
const prettifyXml = require('prettify-xml');

async function run(relativePath, platform, ext) {
    const basePath = path.resolve(__dirname, '../cases', `${relativePath}.js`);
    const expectPath = path.resolve(__dirname, `../expects/${platform}`, `${relativePath}.${ext}`);
    const parser = JavascriptParserFactory.create({
        platform,
        filepath: basePath
    });
    await parser.parse();
    const expectCode = fs.readFileSync(expectPath, 'utf-8');
    const result = parser.getExtraFiles().find(file => {
        if (file.type === 'html') {
            return true;
        }
        return false;
    });
    expect(prettifyXml(result.code)).toMatch(
        prettifyXml(expectCode)
    );
}

module.exports = {
    run
};