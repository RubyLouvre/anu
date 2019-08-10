const fs = require("fs-extra");
const path = require("path");
const ora = require("ora");

const anuPath = path.join(__dirname, "../");
const qreactPath = path.join(__dirname, "../../qreact");
const dirs = ["build", "lib", "src", "ssr"];
const spinner = ora("开始同步").start();

function empty(dir) {
    return new Promise((resolve, reject) => {
        fs.emptyDir(path.join(qreactPath, dir), err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
  
function copy(dir) {
    return new Promise((resolve, reject) => {
        fs.copy(path.join(anuPath, dir), path.join(qreactPath, dir), err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
  
function emptyDirs(dirs) {
    return Promise.all(dirs.map(dir => empty(dir)));
}
  
function copyDirs(dirs) {
    return Promise.all(dirs.map(dir => copy(dir)));
}
  
function start() {
    const emptyPromise = emptyDirs(dirs);
    emptyPromise
        .then(() => {
            spinner.succeed("已清除 QReact 下目录");
            return copyDirs(dirs);
        })
        .then(() => {
            spinner.succeed("已复制 anujs 至 QReact");
        })
 
        .catch(e => {
        console.error(e); // eslint-disable-line
            spinner.fail("同步失败");
        });
}
  
start();
