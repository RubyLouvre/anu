import chalk from 'chalk';
import * as path from 'path';
import * as fs from 'fs-extra';

const cwd = process.cwd();

function getCode(name: string, isPage: boolean){
    let clsName = isPage ? 'P' : name;
    let code = `
import React from '@react';
class ${clsName} extends React.Component {
    constructor(){
        super();
        this.state = {
            text: 'hello, nanachi'
        };
    }
    componentDidMount() {
        // eslint-disable-next-line
        console.log('page did mount!');
    }
    componentWillMount() {
        // eslint-disable-next-line
        console.log('page will mount!');
    }
    render() {
        return (
            <div>
                {this.state.text}
            </div>
        );
    }
}     
export default ${clsName};
`;
    return code.trim();
}


//校验当前目录是否是 nanachi 工程
function validateNanachiProject(){
    let pkg: {
        [propsName: string]: any
    } = {};
    try {
        pkg = require(path.join(cwd, 'package.json'));
    } catch (err) {
        // eslint-disable-next-line
    }

    if (!pkg.nanachi_project) {
        //非nanachi project
        // eslint-disable-next-line
        console.log(chalk.red('当前目录不是 nanachi 项目, 创建失败.'));
        process.exit(1);
    }
}

//校验 page 名是否合法
function validatePageName(pageName: string, isPage: boolean){
    if (/[^\w]/g.test(pageName)) {
        // eslint-disable-next-line
        console.log(chalk.red('目录命名不合法, 创建失败.'));
        process.exit(1);
    }
   
    if (!isPage &&  /[^A-Z]/g.test(pageName.charAt(0)) ) {
        // eslint-disable-next-line
        console.log(chalk.red('组件所在目录名首字母必须大写, 创建失败.'));
        process.exit(1);
    }
    
}


//校验 page 是否存在
function validatePageExists(dist: string, isPage: boolean){
    let exists = fs.existsSync(dist);
    if (exists) {
        // eslint-disable-next-line
        console.log(chalk.red(`${path.relative(cwd, dist)} ${ isPage ? '页面' : '组件'}已存在, 创建失败.`));
        process.exit(1);
    }
}

function createPage(data: {
    name: string,
    dist: string,
    isPage: boolean
}){
    let {name, dist, isPage} = data;
    let code = getCode(name, isPage);
    fs.ensureFileSync(dist);
    fs.writeFile(dist, code, function(err){
        if (err) {
            throw err;
        }
        // eslint-disable-next-line
        console.log(chalk.green(`${path.relative(cwd, dist)}  ${ isPage ? '页面' : '组件'}创建成功.`));
    });
}

export default function( data: {
    name: string,
    isPage: boolean
} ){
    let { name, isPage } = data;
    let dist = path.join(
        cwd, 
        'source', 
        isPage ? 'pages' : 'components',
        name, 
        'index.js'
    );
    validateNanachiProject();
    validatePageName(name, isPage);
    validatePageExists(dist, isPage);
    createPage({
        name,
        dist, 
        isPage
    });
}