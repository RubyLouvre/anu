const JavascriptParserFactory = require('../nanachi-loader/parsers/jsParser/JavascriptParserFactory');
const path = require('path');
const fs = require('fs');
const prettifyXml = require('prettify-xml');
const config = require('../config/config');

const platform = 'wx';
const ext = 'wxml';

config.buildType = platform;

async function run(relativePath) {
    const basePath = path.resolve(__dirname, './cases', `${relativePath}.js`);
    const expectPath = path.resolve(__dirname, './expects', `${relativePath}.${ext}`);
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

describe('if statement', () => {
    test(`if 简单情况-${platform}`, async () => {
        await run('pages/control-flow/base');
    });
    test(`if-eles ${platform}`, async () => {
        await run('pages/control-flow/if-eles');
    });
});

describe('逻辑表达式-二元', () => {
    test(`二元表达式-简单情况-${platform}`, async () => {
        await run('pages/control-flow/2-base');
    });
    test(`二元表达式-多重1-${platform}`, async () => {
        await run('pages/control-flow/2-multi-1');
    });
    test(`二元表达式-多重2-${platform}`, async () => {
        await run('pages/control-flow/2-multi-2');
    });
});

describe('逻辑表达式-三元', () => {
    test(`三元表达式-简单情况-${platform}`, async () => {
        await run('pages/control-flow/3-base');
    });
    test(`三元表达式-多重-${platform}`, async () => {
        await run('pages/control-flow/3-multi');
    });
});
