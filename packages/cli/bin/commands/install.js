"use strict";
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
const shelljs_1 = __importDefault(require("shelljs"));
const chalk_1 = __importDefault(require("chalk"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
const axios_1 = __importDefault(require("axios"));
const glob_1 = __importDefault(require("glob"));
const cwd = process.cwd();
function unPack(src, dist) {
    dist = path.join(dist, 'source');
    fs.ensureDirSync(dist);
    fs.emptyDirSync(dist);
    const unzipExec = shelljs_1.default.exec(`tar -zxvf ${src} -C ${dist}`, {
        silent: true
    });
    if (unzipExec.code) {
        console.log(chalk_1.default.bold.red(unzipExec.stderr));
    }
    try {
        let files = glob_1.default.sync(dist + '/**', { nodir: true, dot: true });
        files.forEach(function (el) {
            let fileName = path.basename(el);
            if (/\/package\.json$/.test(el)
                || /\/\.\w+$/.test(el)) {
                fs.moveSync(el, path.join(dist, '..', fileName));
            }
        });
    }
    catch (err) {
    }
}
function downLoadGitRepo(target, branch) {
    let cmd = `git clone ${target} -b ${branch}`;
    let distDir = path.join(cwd, '.CACHE', 'download');
    let gitRepoName = target.split('/').pop().replace(/\.git$/, '');
    fs.removeSync(path.join(distDir, gitRepoName));
    fs.ensureDirSync(distDir);
    let std = shelljs_1.default.exec(cmd, {
        cwd: distDir,
        silent: true
    });
    if (/fatal:/.test(std.stderr)) {
        console.log(chalk_1.default.bold.red(std.stderr));
        process.exit(1);
    }
    console.log(chalk_1.default.green(`安装依赖包 ${gitRepoName} 成功.`));
}
function downLoadBinaryLib(lib) {
    return __awaiter(this, void 0, void 0, function* () {
        let [tarName, version] = lib.split('@');
        let tarUrl = '';
        let nanachiUserConfig = {};
        try {
            nanachiUserConfig = require(path.join(cwd, 'nanachi.config'));
        }
        catch (err) {
            if (/SyntaxError/.test(err)) {
                console.log(err);
            }
        }
        let onInstallTarball = nanachiUserConfig.chaikaConfig && nanachiUserConfig.chaikaConfig.onInstallTarball || function () { return ''; };
        tarUrl = onInstallTarball(tarName, version);
        if (tarUrl) {
            let axiosConfig = {
                url: tarUrl,
                type: 'GET',
                responseType: 'arraybuffer'
            };
            let { data } = yield axios_1.default(axiosConfig);
            let libDist = path.join(cwd, `.CACHE/lib/${path.basename(tarUrl)}`);
            fs.ensureFileSync(libDist);
            fs.writeFile(libDist, data, function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(chalk_1.default.green(`安装依赖包 ${tarName}@${version} 成功.`));
                unPack(libDist, path.join(cwd, `.CACHE/download/${tarName}`));
            });
        }
    });
}
function downLoadConfigDepModule() {
    var pkg = require(path.join(cwd, 'package.json'));
    var depModules = pkg.modules || {};
    let depKey = Object.keys(depModules);
    if (!depKey.length) {
        console.log(chalk_1.default.bold.red('未在package.json中发现拆库依赖包, 安装失败.'));
        process.exit(1);
    }
    depKey.forEach(function (key) {
        if (/\.git$/.test(key)) {
            downLoadGitRepo(key, depModules[key]);
        }
        else {
            downLoadBinaryLib(key + '@' + depModules[key]);
        }
    });
}
function default_1(name, opts) {
    if (process.env.NANACHI_CHAIK_MODE != 'CHAIK_MODE') {
        console.log(chalk_1.default.bold.red('需在package.json中配置{"nanachi": {"chaika_mode": true }}, 拆库开发功能请查阅文档: https://rubylouvre.github.io/nanachi/documents/chaika.html'));
        process.exit(1);
    }
    let downloadInfo = {
        type: '',
        lib: ''
    };
    if (!name && !opts.branch) {
        downloadInfo = {
            type: 'all',
            lib: ''
        };
    }
    if (name && !/\.git$/.test(name)) {
        downloadInfo = {
            type: 'binary',
            lib: name
        };
    }
    if (/\.git$/.test(name) && opts.branch && typeof opts.branch === 'string') {
        downloadInfo = {
            type: 'git',
            lib: name,
            version: opts.branch
        };
    }
    let { type, lib, version } = downloadInfo;
    if (type === 'git') {
        downLoadGitRepo(lib, version);
    }
    if (type === 'binary') {
        downLoadBinaryLib(lib);
    }
    if (type === 'all') {
        downLoadConfigDepModule();
    }
}
exports.default = default_1;
;
