const { run } = require('./utils/index.js');
const config = require('../config/config');

const platform = 'wx';
const ext = 'wxml';

config.buildType = platform;

describe('loop 简单情况', () => {
    test(`loop 简单情况-${platform}`, async () => {
        await run('pages/loop/base', platform, ext);
    });
    test(`loop 简单情况，有key值1 ${platform}`, async () => {
        await run('pages/loop/base-key-1', platform, ext);
    });
    test(`loop 简单情况，有key值2 ${platform}`, async () => {
        await run('pages/loop/base-key-2', platform, ext);
    });
    test(`loop 二重循环 ${platform}`, async () => {
        await run('pages/loop/base-2', platform, ext);
    });
    test(`calee 之前可以使用逻辑表达式 -${platform}`, async () => {
        await run('pages/loop/base-calee-1', platform, ext);
    });
    test(`calee 之前可以使用逻辑表达式2 -${platform}`, async () => {
        await run('pages/loop/base-calee-2', platform, ext);
    });
    test(`loop 二重循环并支持条件表达式-${platform}`, async () => {
        await run('pages/loop/base-2-logic', platform, ext);
    });
});
