const utils = require('./utils/index');
const validateProjectName = require('validate-npm-package-name');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const spawn = require('cross-spawn');
const Handlebars = require('handlebars');
const inquirer = require('inquirer');
const ownRoot = path.join(__dirname, '..');
const exists = fs.existsSync;

const ignore = new Set(['.DS_Store', '.git', '.gitignore']);

const useYarn = utils.useYarn();
const useCnpm = utils.useCnpm();

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

const writePkgJson = appName => {
    let template = Handlebars.compile(JSON.stringify(pkgJsonTemplate));
    let data = {
        appName: path.basename(appName)
    };
    let result = JSON.parse(template(data));
    if (useYarn){
        //yarn add pkg@version --dev
        delete result.devDependencies;
    }
    
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
        path.join(ownRoot, 'packages', 'template')
    );
    templates.forEach(item => {
        if (ignore.has(item) || item !=  TEMPLATE) return;
        let src = path.join(ownRoot, 'packages', 'template', item, 'src');
        let dest = path.join(appName, 'src');
        fs.copySync(src, dest);
    });

    // eslint-disable-next-line
    console.log(
        `\n项目 ${chalk.green(appName)} 创建成功, 路径: ${chalk.green(
            appName
        )}\n`
    );

    //写入package.json
    writePkgJson(appName);
    // console.log();
    

    // eslint-disable-next-line
    console.log(chalk.green('\n开始安装依赖,请稍候...\n'));
    // console.log();
    //安装依赖
    install(appName);
};


const getDevDeps = ()=>{
    let deps = pkgJsonTemplate.devDependencies;
    let result = [];
    Object.keys(deps).forEach((name)=>{
        result.push(
            `${name}@${deps[name]}`
        );
    });
    return result;
};


const removeLockFile = (dir)=>{
    let lockFile = [
        'package-lock.json',
        'yarn.lock'
    ];
    lockFile.forEach((file)=>{
        fs.remove( path.join(dir, file), (err)=>{
            if (err){
                // eslint-disable-next-line
                console.log(err);
            }
        } );
    });
};

const install = projectRoot => {
    let bin = '';
    let option = [];
    process.chdir(projectRoot);
    if (useYarn) {
        bin = 'yarnpkg';
        option.push('add', '--exact');
        option = option.concat(getDevDeps());
        option.push('--dev');
    } else if (useCnpm) {
        bin = 'cnpm';
        option.push('install');
    } else {
        bin = 'npm';
        option.push('install');
    }

    
    var result = spawn.sync(bin, option, { stdio: 'inherit' });
    if (!result.error) {
        removeLockFile(process.cwd());
        /* eslint-disable */
        console.log(chalk.green('依赖安装完毕!🍺'));
        console.log();
        console.log(chalk.green('mpreact start'));
        console.log('  启动服务');
        console.log();
        console.log(chalk.green('mpreact build'));
        console.log('  构建服务');
        console.log();
        console.log(chalk.magenta('请敲入下面两行命令，享受您的开发之旅!'));
        console.log();
        console.log(`  cd ${projectRoot}`);
        console.log('  mpreact start');
        console.log();
    } else {
        console.log(chalk.red('依赖安装出错，请自行安装!'));
        console.log();
    }
    /* eslint-enable */
};

module.exports = init;
