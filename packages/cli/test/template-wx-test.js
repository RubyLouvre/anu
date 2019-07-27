const { run } = require('./utils/index.js');
const config = require('../config/config');

const platform = 'wx';
const ext = 'wxml';

config.buildType = platform;

describe('属性模版测试', () => {
    test(`className1 -${platform}`, async () => {
        await run('pages/template/className1', platform, ext);
    });
    test(`className2 -${platform}`, async () => {
        await run('pages/template/className2', platform, ext);
    });
    test(`canvas id-${platform}`, async () => {
        await run('pages/template/canvas', platform, ext);
    });
    test(`点击事件1 -${platform}`, async () => {
        await run('pages/template/onclick1', platform, ext);
    });
    test(`点击事件2 -${platform}`, async () => {
        await run('pages/template/onclick2', platform, ext);
    });
    test(`input change 事件 -${platform}`, async () => {
        await run('pages/template/input-change', platform, ext);
    });
    test(`slot 测试-${platform}`, async () => {
        await run('pages/template/slot', platform, ext);
    });
    test(`字符实体 -${platform}`, async () => {
        await run('pages/template/font', platform, ext);
    });
});
