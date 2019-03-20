const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const cwd = process.cwd();
const config = require('../packages/config');
const utils = require('../packages/utils');
const entry = path.join(cwd, config.sourceDir, 'app.js');
const parser = require('../packages/index')(entry);
const spawn = require('cross-spawn');
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
    utils.initQuickAppConfig();
}

function asyncUI(betaUi){
    if (!betaUi) return;
    // eslint-disable-next-line
    console.log(chalk.green('正在同步最新版schnee-ui, 请稍候...'));
    let dir = path.join(process.cwd(), 'node_modules');
    let currentCwd = process.cwd();
    fs.removeSync(path.join(dir, 'schnee-ui'));
    process.chdir(dir);
    let result = spawn.sync('git', ['clone',  '-b', 'dev', 'https://github.com/qunarcorp/schnee-ui.git'], { stdio: 'inherit' });
    if (result.error) {
        // eslint-disable-next-line
        console.log(result.error, 11);
        process.exit(1);
    }
    process.chdir(currentCwd);
}

async function beforeParseTask({ buildType, beta, betaUi }){
    cleanDist();
    if (buildType === 'quick') { injectQuickAppConfig(); }
    await utils.asyncReact(buildType, beta);
    asyncUI(betaUi);
}

module.exports = async function(args){
    await beforeParseTask(args);
    await parser.parse();
    if (args['watch']) {
        parser.watching();
    }
};

