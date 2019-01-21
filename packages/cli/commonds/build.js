const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const cwd = process.cwd();
const config = require('../packages/config');
const utils = require('../packages/utils');
const entry = path.join(cwd, config.sourceDir, 'app.js');
const parser = require('../packages/index')(entry);
function cleanDist(){
    let distPath = path.join(cwd, config.buildDir);
    try {
        fs.removeSync(distPath);
    } catch (err) {
        // eslint-disable-next-line
        console.log(err);
    }
}
function injectQuickAppConfig(){
    if (config['buildType'] === 'quick'){
        utils.initQuickAppConfig();
    }
}

async function beforeParseTask(args){
    cleanDist();
    injectQuickAppConfig();
    await utils.asyncReact(args['beta']);
}

module.exports = async function(args){
    await beforeParseTask(args);
    let spinner = utils.spinner(chalk.green('正在分析依赖...\n')).start();
    await parser.parse();
    spinner.succeed(chalk.green('依赖分析成功'));
    if (args['watch']) {
        parser.watching();
    }
};

