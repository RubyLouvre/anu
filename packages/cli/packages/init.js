/*!
输出命令行提示与选择模板
*/

/* eslint no-console: 0 */

const validateProjectName = require('validate-npm-package-name');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const ownRoot = path.join(__dirname, '..');
const config = require('./config');
const exists = fs.existsSync;

const ignore = new Set(['.DS_Store', '.git', '.gitignore']);
let TEMPLATE = '';
const init = appName => {
    checkNameIsOk(appName)
        .then(() => {
            return askTemplate();
        })
        .then(res => {
            TEMPLATE = res.template;
            writeDir(appName);
        })
        .catch(err => {
            console.log(err);
        });
};

const projectConfigJson = {
    'appid': 'touristappid',
    'setting': {
        'urlCheck': true,
        'es6': true,
        'postcss': true,
        'minified': true,
        'newFeature': true
    }
};

const checkNameIsOk = appName => {
    return new Promise(resolve => {
        let absoluteAppNamePath = path.resolve(appName);
        let baseName = path.basename(absoluteAppNamePath);
        const checkNameResult = validateProjectName(baseName);
        if (!checkNameResult.validForNewPackages) {
            console.log();
            console.log(
                chalk.bold.red(
                    `命名规范遵循npm package命名规范\nERR_MSG : ${
                        checkNameResult.warnings[0]
                    }`
                )
            );
            console.log();
            process.exit(1);
        } else {
            resolve({
                ok: true,
                appName: absoluteAppNamePath
            });
        }
    });
};

const askTemplate = () => {
    const q = [];
    const list = [
        {
            name: '去哪儿',
            value: 'qunar'
        },
        {
            name: '网易云音乐',
            value: 'music'
        },

        {
            name: '拼多多',
            value: 'pdd'
        }
    ];
    q.push({
        type: 'list',
        name: 'template',
        message: '请选择模板',
        choices: list
    });
    return inquirer.prompt(q);
};

const writeDir = appName => {
    if (exists(appName)) {
        console.log();
        console.log(chalk.bold.red(`目录 ${appName} 已存在,请检查!`));
        console.log();
        process.exit(1);
    }

    // 复制模板
    fs.ensureDirSync(appName);
    const templates = fs.readdirSync(path.join(__dirname, '..', 'templates'));
    templates.forEach(item => {
        if (ignore.has(item) || item != TEMPLATE) return;
        let src = path.join(ownRoot, 'templates', item, 'src');
        let pkg = path.join(ownRoot, 'templates', item, 'package.json');
        let dist = path.join(appName,  config.sourceDir );
        let distPkg = path.join(appName, 'package.json');
        fs.copySync(src, dist);
        fs.copySync(pkg, distPkg);
    });

    //写入project.config.json
    let pathLevel = appName.split(path.sep);
    let projectname = pathLevel[pathLevel.length-1];
    projectConfigJson['projectname'] = projectname;
    let projectConfigJsonDist = path.join( appName, config.sourceDir , 'project.config.json');
    fs.ensureFileSync( projectConfigJsonDist );
    fs.writeFile(projectConfigJsonDist, JSON.stringify(projectConfigJson, null, 4), (err)=>{
        if (err) {
            console.log(err);
        }
    });

    console.log(
        `\n项目 ${chalk.green(appName)} 创建成功, 路径: ${chalk.green(
            appName
        )}\n`
    );

    console.log(chalk.green('nanachi watch'));
    console.log(`  实时构建项目, \n
                   \t或使用nanachi watch:ali 构建支付宝小程序\n
                   \t或使用nanachi watch:bu 构建百度智能小程序`);
    console.log();
    console.log(chalk.green('nanachi build'));
    console.log(`  构建项目(构建出错的情况下，修复后需要强制全量构建), \n
                   \t或使用nanachi build:ali 构建支付宝小程序\n
                   \t或使用nanachi build:bu 构建百度智能小程序`);
    console.log();
    console.log(
        chalk.magenta(
            '请敲入下面两行命令，享受您的开发之旅' +
                chalk.magenta.bold('(npm i可改成yarn)')
        )
    );
    console.log();
    console.log(`  cd ${appName} && npm i `);
    console.log('  nanachi watch');
    console.log();
};

module.exports = init;
