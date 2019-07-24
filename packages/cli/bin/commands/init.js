"use strict";
/*!
输出命令行提示与选择模板
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const validate_npm_package_name_1 = __importDefault(require("validate-npm-package-name"));
const chalk_1 = __importDefault(require("chalk"));
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const templates_1 = __importDefault(require("../../consts/templates"));
const cwd = process.cwd();
function checkAppName(appName) {
    let appPath = path.join(cwd, appName);
    let { validForNewPackages, warnings } = validate_npm_package_name_1.default(path.parse(appName).base);
    if (!validForNewPackages) {
        console.log(chalk_1.default.red('Error: 项目名称不能包含大写字母'));
        process.exit(1);
    }
    return appPath;
}
const askTemplate = () => {
    return inquirer_1.default.prompt({
        type: 'list',
        name: 'appTplName',
        message: '请选择模板',
        choices: templates_1.default
    });
};
function copyTemplate(data) {
    let { appTplName, appPath } = data;
    let tplSrc = path.join(__dirname, '../..', 'templates', appTplName);
    let appName = path.basename(appPath);
    if (fs.existsSync(appPath)) {
        console.log(chalk_1.default.red(`目录 ${appName} 已存在\n`));
        process.exit(1);
    }
    fs.ensureDirSync(appPath);
    fs.copySync(tplSrc, appPath);
}
function outputLog({ appName, appPath }) {
    console.log(`\n项目 ${chalk_1.default.green(appName)} 创建成功, 路径: ${chalk_1.default.green(appPath)}\n`);
    console.log(chalk_1.default.green('nanachi watch'));
    console.log(`  实时构建项目, 
                   \t或使用nanachi watch:ali 构建支付宝小程序
                   \t或使用nanachi watch:tt 构建头条小程序
                   \t或使用nanachi watch:quick 构建快应用
                   \t或使用nanachi watch:quick --huawei 构建快应用
                   \t或使用nanachi watch:bu 构建百度智能小程序
                   \t或使用nanachi watch:qq 构建QQ小程序
                   \t或使用nanachi watch:h5 构建h5`);
    console.log();
    console.log(chalk_1.default.green('nanachi build'));
    console.log(`  构建项目(构建出错的情况下，修复后需要强制全量构建), 
                   \t或使用nanachi build:ali 构建支付宝小程序
                   \t或使用nanachi build:tt 构建头条小程序
                   \t或使用nanachi build:quick 构建快应用
                   \t或使用nanachi build:quick --huawei 构建快应用
                   \t或使用nanachi build:bu 构建百度智能小程序
                   \t或使用nanachi build:qq 构建QQ小程序
                   \t或使用nanachi build:h5 构建h5`);
    console.log();
    console.log(chalk_1.default.magenta('请敲入下面两行命令，享受您的开发之旅' +
        chalk_1.default.magenta.bold('(npm i可改成yarn)')));
    console.log();
    console.log(`  cd ${path.relative(cwd, appPath)} && npm i `);
    console.log('  nanachi watch');
    console.log();
}
function init(appName) {
    return __awaiter(this, void 0, void 0, function* () {
        const appPath = checkAppName(appName);
        const { appTplName } = yield askTemplate();
        copyTemplate({ appPath, appTplName });
        outputLog({ appName, appPath });
    });
}
exports.default = init;
