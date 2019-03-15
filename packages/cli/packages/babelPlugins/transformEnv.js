
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
    // 移除没用的代码
    [require('babel-plugin-minify-dead-code-elimination'), {
        // 可能是插件bug，会删除一些已使用参数，所以开启keepFnArgs【防止插件删除函数参数】
        keepFnArgs: true
    }]
];