const fs = require('fs-extra');
const postCss = require('postcss');
const path = require('path');
const exec = require('child_process').exec;
const postCssLessEngine = require('postcss-less-engine');
const less = require('less');

const lessDir = './less';

const index = process.argv.indexOf('--file');
if (index !== -1) {
    readFile(path.join(__dirname, process.argv[index + 1]));
    return;
}
readDir(path.join(__dirname, lessDir));

async function readDir(dir) {
    try {
        fs.mkdirpSync(dir.replace(/\/less(\/?)/, '/postcss$1'));
        fs.mkdirpSync(dir.replace(/\/less(\/?)/, '/css$1'));
    } catch(e) {
    }
    const files = fs.readdirSync(dir);
    for (var i = 0, length = files.length; i < length; i++) {
        const childPath = path.join(dir, files[i])
        const info = fs.statSync(childPath);
        if (info.isDirectory()) {
            readDir(childPath);
        } else {
            await readFile(childPath);
        }
    }
}

async function readFile(filepath) {
    if (/\/others\/(import|import-reference-issues)\//.test(filepath)) {
        return;
    }
    const code = fs.readFileSync(filepath, 'utf-8');
    output(code, 'origin');
    // exec(`lessc ${filepath}`, function(err, stdout) {
    //     output(stdout, 'less');
    //     fs.writeFileSync(filepath.replace(/\/less(\/?)/, '/css$1').replace(/\.less$/, '.css'), stdout, 'utf-8');
    // });
    less.render(code, function(e, output) {
        fs.writeFileSync(filepath.replace(/\/less(\/?)/, '/css$1').replace(/\.less$/, '.css'), output.css, 'utf-8');
    })
    const compiledCode = await compileLess(code, filepath);
    if (compiledCode && compiledCode.css) {
        output(compiledCode.css, 'postcss');
        fs.writeFileSync(filepath.replace(/\/less(\/?)/, '/postcss$1').replace(/\.less$/, '.css'), compiledCode.css, 'utf-8');
    }
}

function compileLess(code, dir) {
    return postCss([
        postCssLessEngine(),
        // require('postcss-automath'),      //5px + 2 => 7px
        require('../../packages/postcssPlugins/postCssPluginValidateStyle'),
        // require('postcss-import')({
        //     resolve(importer, baseDir){
        //         //如果@import的值没有文件后缀
        //         if (!/\.s[ca]ss$/.test(importer)) {
        //             importer = importer + '.scss';
        //         }
        //         //处理alias路径
        //         return utils.resolveStyleAlias(importer, baseDir);
        //     }
        // })
    ]).process(
        code,
        {
            from: dir,
            parser: postCssLessEngine.parser
        }
    ).catch((e) => {
        // console.log(dir);
        console.log(e + '\n');
    })
}

function output(str, mode) {
    // console.log('--------------------------------');
    // console.log(`${mode}::::::::::`);
    // console.log(str);
    // console.log('--------------------------------')
}

