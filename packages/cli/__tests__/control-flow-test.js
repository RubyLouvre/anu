const JavascriptParserFactory = require('../nanachi-loader/parsers/jsParser/JavascriptParserFactory');
const path = require('path');
const fs = require('fs');
const prettifyXml = require('prettify-xml');
const config = require('../config/config');

describe('if statement', () => {
    test('if 简单情况-ali', async () => {
        config.buildType = 'ali';
        const parser = JavascriptParserFactory.create({
            platform: 'ali',
            filepath: path.resolve(__dirname, './cases/pages/control-flow.js')
        });
        await parser.parse();
        const expect = fs.readFileSync(path.resolve(__dirname, './expects/pages/control-flow.axml'), 'utf-8');
        const result = parser.getExtraFiles().find(file => {
            if (file.type === 'html') {
                return true;
            }
            return false;
        });
        expect(prettifyXml(result)).toMatch(
            prettifyXml(expect)
        );
    });
});
