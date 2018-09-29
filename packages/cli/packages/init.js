const validateProjectName = require('validate-npm-package-name');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const Handlebars = require('handlebars');
const inquirer = require('inquirer');
const ownRoot = path.join(__dirname, '..');
const exists = fs.existsSync;

const ignore = new Set(['.DS_Store', '.git', '.gitignore']);


const pkgJsonTemplate = {
    license: 'MIT',
    version: '1.0.0',
    name: '{{appName}}',
    mpreact: {
        alias: {
            '@react': 'src/ReactWX.js',
            '@components': 'src/components'
        }
    },
    devDependencies : {
        'babel-plugin-transform-async-to-generator': '^6.24.1',
        'babel-plugin-transform-class-properties': '^6.24.1',
        'babel-plugin-transform-decorators-legacy': '^1.3.5',
        'babel-plugin-transform-es2015-classes': '^6.24.1',
        'babel-plugin-transform-es2015-modules-commonjs': '^6.26.2',
        'babel-plugin-transform-object-rest-spread': '^6.26.0',
        'babel-plugin-transform-es2015-template-literals': '^6.22.0',
        'babel-plugin-transform-node-env-inline': '^0.4.3',
        'babel-plugin-module-resolver': '^3.1.1',
        'babel-plugin-transform-react-jsx': '^6.24.1',
        'babel-preset-react': '^6.24.1'
    },
    dependencies: {}
};
let TEMPLATE = '';
const init = appName => {
    checkNameIsOk(appName)
        .then(()=>{
            return askTemplate();
        })
        .then((res) => {
            TEMPLATE = res.template;
            writeDir(appName);
            
        })
        .catch(err => {
            // eslint-disable-next-line
            console.log(err);
        });
};

const checkNameIsOk = appName => {
    return new Promise(resolve => {
        let absoluteAppNamePath = path.resolve(appName);
        let baseName = path.basename(absoluteAppNamePath);
        const checkNameResult = validateProjectName(baseName);
        if (!checkNameResult.validForNewPackages) {
            // eslint-disable-next-line
            console.log();
            // eslint-disable-next-line
            console.log(
                chalk.bold.red(
                    `命名规范遵循npm package命名规范\nERR_MSG : ${
                        checkNameResult.warnings[0]
                    }`
                )
            );
            // eslint-disable-next-line
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


const askTemplate = ()=>{
    const q = [];
    const list = [
        {
            name: '拼XX',
            value: 'pdd'
        },
        {
            name: '网X云音乐',
            value: 'music'
        },
        {
            name: '去哪儿',
            value: 'qunar'
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

// eslint-disable-next-line
const writePkgJson = appName => {
    let template = Handlebars.compile(JSON.stringify(pkgJsonTemplate));
    let data = {
        appName: path.basename(appName)
    };
    let result = JSON.parse(template(data));
    // if (useYarn){
    //     //yarn add pkg@version --dev
    //     delete result.devDependencies;
    // }
    
    fs.writeFileSync(
        path.join(appName, 'package.json'),
        JSON.stringify(result, null, 4)
    );
};

const writeDir = appName => {
    if (exists(appName)) {
        // eslint-disable-next-line
        console.log();
        // eslint-disable-next-line
        console.log(chalk.bold.red(`目录 ${appName} 已存在,请检查!`));
        // eslint-disable-next-line
        console.log();
        process.exit(1);
    }

    //复制模板
    fs.ensureDirSync(appName);
    const templates = fs.readdirSync(
        path.join(__dirname, '..', 'templates')
    );
    templates.forEach(item => {
        if (ignore.has(item) || item !=  TEMPLATE) return;
        let src = path.join(ownRoot, 'templates', item, 'src');
        let pkg = path.join(ownRoot, 'templates', item, 'package.json');
        let dist = path.join(appName, 'src');
        let distPkg = path.join(appName, 'package.json');
        fs.copySync(src, dist);
        fs.copySync(pkg, distPkg);
    });

    // eslint-disable-next-line
    console.log(
        `\n项目 ${chalk.green(appName)} 创建成功, 路径: ${chalk.green(
            appName
        )}\n`
    );

    /* eslint-disable */
    console.log();
    console.log(chalk.green('mpreact watch'));
    console.log('  启动服务');
    console.log();
    console.log(chalk.green('mpreact build'));
    console.log('  构建服务');
    console.log();
    console.log(chalk.magenta('请敲入下面两行命令，享受您的开发之旅!'));
    console.log();
    console.log(`  cd ${appName} && npm install`);
    console.log('  mpreact watch');
    console.log();
    

   
};


module.exports = init;
