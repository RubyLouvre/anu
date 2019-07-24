/*!
输出命令行提示与选择模板
*/
/* eslint-disable */
import validateProjectName from 'validate-npm-package-name';
import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';
import inquirer from 'inquirer';
import templates from '../../consts/templates';
const cwd = process.cwd();

function checkAppName(appName: string){
    let appPath = path.join(cwd, appName);
    let {validForNewPackages, warnings} = validateProjectName( path.parse(appName).base );
    if (!validForNewPackages) {
        console.log(chalk.red('Error: 项目名称不能包含大写字母'));
        process.exit(1);
    }
    return appPath;
}

const askTemplate = ():any => {
    return inquirer.prompt({
        type: 'list',
        name: 'appTplName',
        message: '请选择模板',
        choices: templates
    });
};

function copyTemplate(data: {
    appPath: string,
    appTplName: string
}){
    let { appTplName, appPath} = data;
    let tplSrc = path.join( __dirname, '../..', 'templates',  appTplName);
    let appName = path.basename(appPath);
    if (fs.existsSync(appPath)) {
        console.log(chalk.red(`目录 ${appName} 已存在\n`));
        process.exit(1);
    }

    fs.ensureDirSync(appPath);
    fs.copySync(tplSrc, appPath);
}

function outputLog({ appName, appPath }: {
    appName: string,
    appPath: string
}) {
    console.log(
        `\n项目 ${chalk.green(appName)} 创建成功, 路径: ${chalk.green(
            appPath
        )}\n`
    );

    console.log(chalk.green('nanachi watch'));
    console.log(`  实时构建项目, 
                   \t或使用nanachi watch:ali 构建支付宝小程序
                   \t或使用nanachi watch:tt 构建头条小程序
                   \t或使用nanachi watch:quick 构建快应用
                   \t或使用nanachi watch:quick --huawei 构建快应用
                   \t或使用nanachi watch:bu 构建百度智能小程序
                   \t或使用nanachi watch:qq 构建QQ小程序
                   \t或使用nanachi watch:h5 构建h5`);
    console.log();
    console.log(chalk.green('nanachi build'));
    console.log(`  构建项目(构建出错的情况下，修复后需要强制全量构建), 
                   \t或使用nanachi build:ali 构建支付宝小程序
                   \t或使用nanachi build:tt 构建头条小程序
                   \t或使用nanachi build:quick 构建快应用
                   \t或使用nanachi build:quick --huawei 构建快应用
                   \t或使用nanachi build:bu 构建百度智能小程序
                   \t或使用nanachi build:qq 构建QQ小程序
                   \t或使用nanachi build:h5 构建h5`);
    console.log();
    console.log(
        chalk.magenta(
            '请敲入下面两行命令，享受您的开发之旅' +
                chalk.magenta.bold('(npm i可改成yarn)')
        )
    );
    console.log();
    console.log(`  cd ${ path.relative(cwd, appPath) } && npm i `);
    console.log('  nanachi watch');
    console.log();
}

async function init(appName: string){
    const appPath: string = checkAppName(appName);
    const { appTplName } = await askTemplate();
    copyTemplate({ appPath, appTplName});
    outputLog({ appName, appPath });
}

export default init;
