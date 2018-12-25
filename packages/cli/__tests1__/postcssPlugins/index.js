const fs = require('fs');
const postCss = require('postcss');
const path = require('path');
const exec = require('child_process').exec;

const lessDir = './less';

const index = process.argv.indexOf('--file');
if (index !== -1) {
    readFile(path.join(__dirname, './less', process.argv[index + 1]));
    return;
}
readDir(path.join(__dirname, lessDir));

async function readDir(dir) {
    try {
        fs.mkdirSync(dir.replace(/\/less(\/?)/, '/postcss$1'));
    } catch(e) {
    }
    const files = fs.readdirSync(dir);
    for (var i = 0, length = files.length; i < length; i++) {
        const childPath = path.join(dir, files[i])
        const info = fs.statSync(childPath);
        if (info.isDirectory()) {
            readDir(childPath);
        } else {
            const code = fs.readFileSync(childPath, 'utf-8');
            output(code, 'origin');
            exec(`lessc ${childPath}`, function(err, stdout) {
                output(stdout, 'less');
                fs.writeFileSync(childPath.replace(/\/less(\/?)/, '/css$1').replace(/\.less$/, '.css'), stdout, 'utf-8');
            });
            const compiledCode = await compileLess(code, childPath);
            if (compiledCode && compiledCode.css) {
                output(compiledCode.css, 'postcss');
                fs.writeFileSync(childPath.replace(/\/less(\/?)/, '/postcss$1').replace(/\.less$/, '.css'), compiledCode.css, 'utf-8');
            }
        }
    }
}

async function readFile(filepath) {
    const code = fs.readFileSync(filepath, 'utf-8');
    output(code, 'origin');
    exec(`lessc ${filepath}`, function(err, stdout) {
        output(stdout, 'less');
        fs.writeFileSync(filepath.replace(/\/less(\/?)/, '/css$1').replace(/\.less$/, '.css'), stdout, 'utf-8');
    });
    const compiledCode = await compileLess(code, filepath);
    if (compiledCode && compiledCode.css) {
        output(compiledCode.css, 'postcss');
        fs.writeFileSync(filepath.replace(/\/less(\/?)/, '/postcss$1').replace(/\.less$/, '.css'), compiledCode.css, 'utf-8');
    }
}

function compileLess(code, dir) {
    return postCss([
        require('../postcssPlugins/postCssPluginLessMixins'),
        require('../postcssPlugins/postCssPluginLessVar'),
        require('postcss-import')({
            resolve(importer, baseDir){
                //如果@import的值没有文件后缀
                if (!/\.less$/.test(importer)) {
                    importer = importer + '.less';
                }
                //处理alias路径
                return utils.resolveStyleAlias(importer, baseDir);
            }
        }),
        require('postcss-nested'), // 嵌套
        require('../postcssPlugins/postCssPluginLessFunction'),
        require('../postcssPlugins/postCssPluginLessMerge'),
        require('postcss-automath'),      //5px + 2 => 7px
        // require('postcss-nested-props'),   //属性嵌套
        require('../postcssPlugins/postCssPluginLessExtend'),
        require('../postcssPlugins/postCssPluginRemoveCommentsAndEmptyRule'),
    ]).process(
        code,
        {
            from: dir,
            syntax: require('postcss-less')
        }
    ).catch((e) => {
        console.log(e);
    })
}

function output(str, mode) {
    console.log('--------------------------------');
    console.log(`${mode}::::::::::`);
    console.log(str);
    console.log('--------------------------------')
}

