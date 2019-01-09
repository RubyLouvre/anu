const exec = require('child_process').exec;
const fs = require('fs-extra');
const path = require('path');

var valid = 0, invalid = 0;

async function diffCss(postCssDir, cssDir) {
    
    const cli = "css-ast-diff --absolute-paths " + [postCssDir, cssDir].join(' ');
    const diffCode = 'code --diff ' + [postCssDir, cssDir].join(' ');

    function diff() {
        return new Promise((resolve, reject) => {
            if (/\/others\/(import|import-reference-issues)\//.test(postCssDir)) {
                return;
            }
            exec(cli, {encode: 'utf-8'}, function(err, stdout, stderr) {
                if (err) {
                    fs.ensureFileSync(postCssDir);
                    fs.ensureFileSync(cssDir);
                    const postcssCode = fs.readFileSync(postCssDir, 'utf-8');
                    const cssCode = fs.readFileSync(cssDir, 'utf-8');
                    if (postcssCode || cssCode) {
                        console.error("异常文件：");
                        console.log(diffCode);
                        invalid++;
                        return;
                    }
                    
                }
                // console.log('正常文件：', postCssDir);
                if (stdout.match('@')) {
                    console.log(stdout);
                }
                valid++;
                console.log("valid: ", valid, 'invalid: ', invalid);  
                resolve();  
            });
        });
    }

    await diff();
}

async function readDir(dir) {
    const files = fs.readdirSync(dir);
    for (var i = 0, length = files.length; i < length; i++) {
        const childPath = path.join(dir, files[i])
        const info = fs.statSync(childPath);
        if (info.isDirectory()) {
            readDir(childPath);
        } else {
            diffCss(childPath.replace(/\/(less|postcss|css)\//, '/postcss/').replace(/\.(less|postcss|css)$/, '.css'), childPath.replace(/\/(less|postcss|css)\//, '/css/').replace(/\.(less|postcss|css)$/, '.css'));
        }
    }
    
}
if (process.argv.indexOf('--file') !== -1) {
    const dir = path.join(__dirname, process.argv[process.argv.indexOf('--file')+1]);
    diffCss(
        dir.replace(/\/(less|postcss|css)\//, '/postcss/').replace(/\.(less|postcss|css)$/, '.css')
    , dir.replace(/\/(less|postcss|css)\//, '/css/').replace(/\.(less|postcss|css)$/, '.css'))
} else {
    readDir(path.join(__dirname, './less'));
}