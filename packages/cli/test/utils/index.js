const JavascriptParserFactory = require('../../parsers/jsParser/JavascriptParserFactory');
const StyleParserFactory = require('../../parsers/styleParser/StyleParserFactory');
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
        let type = 'html';
        if (platform === 'quick') {
            type = 'ux';
        }
        if (file.type === type) {
            return true;
        }
        return false;
    });
    expect(prettifyXml(result.code)).toMatch(
        prettifyXml(expectCode)
    );
}

async function runStyle(relativePath, platform, type) {
    const basePath = path.resolve(__dirname, '../cases', `${relativePath}.${type}`);
    const expectPath = path.resolve(__dirname, `../expects/${platform}`, `${relativePath}.css`);
    const parser = StyleParserFactory.create({
        platform,
        type,
        filepath: basePath
    });
    await parser.parse();
    const expectCode = fs.readFileSync(expectPath, 'utf-8');
    const result = parser.getExtraFiles().find(file => {
        if (file.type === 'css') {
            return true;
        }
        return false;
    });
    expect(prettifyXml(result.code)).toMatch(
        prettifyXml(expectCode)
    );
}

module.exports = {
    run,
    runStyle
};