const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

const lessDir = './less';

function readDir(dir) {
    try {
        fs.mkdirSync(dir.replace(/\/less(\/?)/, '/css$1'));
    } catch(e) {
    }
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const childPath = path.join(dir, file)
        const info = fs.statSync(childPath);
        if (info.isDirectory()) {
            readDir(childPath);
        } else {
            exec(`lessc ${childPath}`, function(err, stdout) {
                fs.writeFileSync(childPath.replace(/\/less(\/?)/, '/css$1').replace(/\.less$/, '.css'), stdout, 'utf-8');
            })
        }
    });
}

readDir(path.join(__dirname, lessDir));