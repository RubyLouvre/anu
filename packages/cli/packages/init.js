const utils = require('./utils/index');
const validateProjectName = require('validate-npm-package-name');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const child_process = require('child_process');
const spawn = require('cross-spawn');
const Handlebars = require('handlebars');
const inquirer = require('inquirer') 
const root = path.resolve('./');
const ownRoot = path.join(__dirname, '..');
const exists = fs.existsSync;


const ignore = new Set([
    '.DS_Store'
]);

const pkgJsonTemplate = {
    "license": "MIT",
    "version": "1.0.0",
    "name": "{{appName}}",
    "devDependencies": {
      "babel-plugin-transform-class-properties": "^6.24.1",
      "babel-plugin-transform-decorators-legacy": "^1.3.5",
      "babel-plugin-transform-es2015-modules-commonjs": "^6.26.2",
      "babel-plugin-transform-object-rest-spread": "^6.26.0",
      "babel-plugin-transform-react-jsx": "^6.24.1",
      "babel-plugin-transform-react-jsx-source": "^6.22.0",
      "babel-preset-react": "^6.24.1"
    }
}

const init = (appName)=>{
    checkNameIsOk(appName)
    .then((res)=>{
        if(res.ok){
            writeDir(res.appName);
        }
        // if(ok){
        //     return handleUserSelectedParams();
        // }
    })
}


const checkNameIsOk = (appName)=>{
    return new Promise((resolve, reject)=>{
        
        let absoluteAppNamePath = path.resolve(appName);
        let baseName = path.basename(absoluteAppNamePath);

        const checkNameResult = validateProjectName(baseName);

        if(!checkNameResult.validForNewPackages){
            console.log();
            chalk.bold.red(`创建${absoluteAppNamePath}失败，请检查命名规范!`)
            console.log();
            process.exit(1);
        }else{
            resolve({
                ok: true,
                appName: absoluteAppNamePath
            });
        }
    })  

}



const ask = ()=>{
    const q = [

    ];
    const css = [
        {
            name: 'Less',
            value: 'less'
        },
        {
            name: 'Sass',
            value: 'scss'
        }
    ]

    q.push({
        type: 'list',
        name: 'css',
        message: '请选择 CSS 预处理器 (Less/Sass)',
        choices: css
    });

    return inquirer.prompt(q)
}


const handleUserSelectedParams = ()=>{
    return  ask()
            .then((answers)=>{
                return new Promise((resolve, reject)=>{
                    let choice = answers['css'];
                    resolve({
                        isOk: true,
                        data: {
                            style: choice
                        }
                    })

                })

            });
}

const writePkgJson = (appName)=>{
    let template = Handlebars.compile(JSON.stringify(pkgJsonTemplate));
    let data = {
        appName: path.basename(appName)
    };
    let result =JSON.parse(template(data));
    fs.writeFileSync(
        path.join(appName, 'package.json'),
        JSON.stringify(result, null, 4)
    )
}


const writeDir = (appName)=>{
    if(exists(appName)){
        console.log();
        console.log(chalk.bold.red(`目录${appName}已存在,请检查!`));
        console.log();
        process.exit(1);
    }

    //复制模板
    fs.ensureDirSync(appName);
    const templates = fs.readdirSync(path.join(ownRoot, 'packages', 'template'));
    templates.forEach((item)=>{
        if(ignore.has(item)) return;
        let src = path.join(ownRoot, 'packages', 'template', item);
        let dest = path.join(appName);
        fs.copySync(src,dest)
    });

    

    // let styleSrc =  path.join(process.cwd(), appName, 'src', 'pages', 'index', 'index.style');
    // let styleDest =  path.join(process.cwd(), appName, 'src', 'pages', 'index', `index.${meta.style}`);
    // child_process.exec(
    //     `mv ${styleSrc} ${styleDest}`,
    //     (err)=>{
    //         if(err){
    //             console.error(` ${err}`);
    //             return;
    //         }
    //     }
    // );

    

    console.log();
    console.log(`项目 ${chalk.green(appName)} 创建成功, 路径: ${chalk.green(appName)}`);
   
    //写入package.json
    writePkgJson(appName);
    console.log();
    console.log(chalk.green('开始安装依赖,请稍候...'));
    console.log();
    //安装依赖
    install(appName);
}

const install = (projectRoot, useYarn)=>{
   //to do: yarn 安装
   process.chdir(projectRoot);
   var result =  spawn.sync(
        'yarn',
        ['install'],
        { stdio: 'inherit' }
    )
    if(!result.error){
        console.log();
        console.log(chalk.green('依赖安装完毕!🍺'));
    }

}

module.exports = init;