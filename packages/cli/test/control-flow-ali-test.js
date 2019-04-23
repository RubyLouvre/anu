const { run } = require('./utils/index.js');
const config = require('../config/config');

const platform = 'ali';
const ext = 'axml';

config.buildType = platform;

describe('if statement', () => {
    test(`if 简单情况-${platform}`, async () => {
        await run('pages/control-flow/base', platform, ext);
    });
    test(`if-eles ${platform}`, async () => {
        await run('pages/control-flow/if-eles', platform, ext);
    });
});

describe('逻辑表达式-二元', () => {
    test(`二元表达式-简单情况-${platform}`, async () => {
        await run('pages/control-flow/2-base', platform, ext);
    });
    test(`二元表达式-多重1-${platform}`, async () => {
        await run('pages/control-flow/2-multi-1', platform, ext);
    });
    test(`二元表达式-多重2-${platform}`, async () => {
        await run('pages/control-flow/2-multi-2', platform, ext);
    });
});

describe('逻辑表达式-三元', () => {
    test(`三元表达式-简单情况-${platform}`, async () => {
        await run('pages/control-flow/3-base', platform, ext);
    });
    test(`三元表达式-多重-${platform}`, async () => {
        await run('pages/control-flow/3-multi', platform, ext);
    });
});
