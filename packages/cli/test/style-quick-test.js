const { runStyle } = require('./utils/index.js');
const config = require('../config/config');

const platform = 'quick';
const type = 'scss';

config.buildType = platform;

describe('快应用特殊样式', () => {
    test(`keyframes -${platform}`, async () => {
        await runStyle('pages/style/keyframes', platform, type);
    });
});
