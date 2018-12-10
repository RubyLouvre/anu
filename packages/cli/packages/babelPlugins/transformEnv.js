
let config = require('../config');
module.exports = [
    [
        //配置环境变量
        require('babel-plugin-transform-inline-environment-variables'),
        {
            env: {
                ANU_ENV: config['buildType'],
                BUILD_ENV: process.env.BUILD_ENV
            }
        }
    ],
    require('babel-plugin-minify-dead-code-elimination'), //移除没用的代码
];