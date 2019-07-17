"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
const cwd = process.cwd();
function getCode(name, isPage) {
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
function validateNanachiProject() {
    let pkg = {};
    try {
        pkg = require(path.join(cwd, 'package.json'));
    }
    catch (err) {
    }
    if (!pkg.nanachi_project) {
        console.log(chalk_1.default.red('当前目录不是 nanachi 项目, 创建失败.'));
        process.exit(1);
    }
}
function validatePageName(pageName, isPage) {
    if (/[^\w]/g.test(pageName)) {
        console.log(chalk_1.default.red('目录命名不合法, 创建失败.'));
        process.exit(1);
    }
    if (!isPage && /[^A-Z]/g.test(pageName.charAt(0))) {
        console.log(chalk_1.default.red('组件所在目录名首字母必须大写, 创建失败.'));
        process.exit(1);
    }
}
function validatePageExists(dist, isPage) {
    let exists = fs.existsSync(dist);
    if (exists) {
        console.log(chalk_1.default.red(`${path.relative(cwd, dist)} ${isPage ? '页面' : '组件'}已存在, 创建失败.`));
        process.exit(1);
    }
}
function createPage(data) {
    let { name, dist, isPage } = data;
    let code = getCode(name, isPage);
    fs.ensureFileSync(dist);
    fs.writeFile(dist, code, function (err) {
        if (err) {
            throw err;
        }
        console.log(chalk_1.default.green(`${path.relative(cwd, dist)}  ${isPage ? '页面' : '组件'}创建成功.`));
    });
}
function default_1(data) {
    let { name, isPage } = data;
    let dist = path.join(cwd, 'source', isPage ? 'pages' : 'components', name, 'index.js');
    validateNanachiProject();
    validatePageName(name, isPage);
    validatePageExists(dist, isPage);
    createPage({
        name,
        dist,
        isPage
    });
}
exports.default = default_1;
