const path = require('path');
const validateStyle = require('../validateStyle');
const fs = require('fs');
const queue = require('../queue');
const config = require('../config');
const utils = require('../utils');
const exitName = config[config['buildType']].styleExt;

//获取dist路径
let getDist = (filePath) =>{
    let dist = utils.updatePath(filePath, config.sourceDir, 'dist');
    let { name, dir} =  path.parse(dist);
    return path.join(dir, `${name}.${exitName || 'scss'}`);
};


//过滤mixins, variables, functions
const nodeSassFilterImporter = ()=>{
    const cssNodeExtract = require('css-node-extract');
    const postcssSyntax = require('postcss-scss');
    const filterFeature = ['variables', 'mixins', 'functions'];
    return function importer(importerPath, prevPath){
        if ( !(importerPath.endsWith('.scss') || importerPath.endsWith('.sass')) ) {
            importerPath = importerPath + '.scss';
        }
        //处理alias
        let relPath = utils.resolveStyleAlias(importerPath, path.dirname(prevPath));
        //获取@import依赖的绝对路径
        let abPath = path.resolve( path.dirname(prevPath), relPath);

        let contents = cssNodeExtract.processSync({
            filters: filterFeature,
            css: fs.readFileSync(abPath).toString(),
            postcssSyntax: postcssSyntax
        });
        
        return {
            file: importerPath,
            contents: contents
        };
    };
};

let cache = {};
const compileSass = (filePath) =>{
    const sass = require( path.join(process.cwd(), 'node_modules', 'node-sass') );
    cache[filePath] = true;
    return new Promise((resolve, reject)=>{
        sass.render(
            {
                file: filePath,
                importer: [
                    nodeSassFilterImporter()
                ]
            },
            (err, result)=>{
                if (err) {
                    reject(err);
                    return;
                }

                let code = validateStyle(result.css.toString());
                //includedFiles第一项为entry
                let deps = result.stats.includedFiles.slice(1);

                
                
                deps = deps.map((importerPath)=>{
                    return utils.resolveStyleAlias(importerPath, path.dirname(filePath));
                });
                
                

                //合并@import依赖语句
                let importCode = deps.map((importer)=>{
                    return `@import '${importer.replace(/\.s[ca]ss$/, `.${exitName || 'scss' }`)}';`;
                });
                code = importCode.join('\n') + '\n' + code;

                resolve({
                    code: code
                });
                

                

                //编译@import依赖资源
                deps.forEach((dep)=>{
                    let importer = dep;
                    let abPath = path.resolve(path.dirname(filePath), importer);
                    if (cache[abPath]) return;
                    // 补丁 queue的占位符, 防止同步代码执行时间过长产生的多次构建结束的问题
                    const placeholder = {
                        path:  getDist(abPath),
                        code: ''
                    };
                    queue.push(placeholder);
                    // 补丁 END
                    compileSass(abPath)
                        .then((res)=>{
                            queue.push({
                                path:  getDist(abPath),
                                code: res.code
                            });
                        })
                        .catch((err)=>{
                            // eslint-disable-next-line
                            console.log(err);
                            process.exit(1);
                        });
                });
                
               
            }
        );
    });
};

module.exports = compileSass;