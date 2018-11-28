const path = require('path');
const validateStyle = require('../validateStyle');
const fs = require('fs');
const queue = require('../queue');
const config = require('../config');
const utils = require('../utils');
const exitName = config[config['buildType']].styleExt;


//获取dist路径
let getDist = (filePath) =>{
    filePath = utils.resolvePatchComponentPath(filePath);
    let dist = utils.updatePath(filePath, config.sourceDir, 'dist');
    let { name, dir} =  path.parse(dist);
    return path.join(dir, `${name}.${exitName}`);
};

let cache = {};
const compileSass = (filePath) =>{
    const sass = require( path.join(process.cwd(), 'node_modules', 'node-sass') );
    const cssNodeExtract = require('css-node-extract');
    const importerDep = [];
    return new Promise((resolve, reject)=>{
        sass.render(
            {
                file: filePath,
                importer: [
                   
                    (importerPath, prevPath)=>{

                        if ( !(importerPath.endsWith('.scss') || importerPath.endsWith('.sass')) ) {
                            importerPath = importerPath + '.scss';
                        }

                        
                        importerPath = utils.resolveStyleAlias(importerPath, path.dirname(filePath));
                        //收集依赖关系
                        if (!importerDep.includes(importerPath)) {
                            importerDep.push(importerPath);
                        }
                        let resolvePath = path.resolve(path.dirname(prevPath), importerPath);
                       
                        //提取mixins, variables, functions
                        let contents = cssNodeExtract.processSync({
                            filters: ['variables', 'mixins', 'functions'],
                            css: fs.readFileSync(resolvePath).toString(),
                            postcssSyntax: require('postcss-scss')
                        });

                        return {
                            file: importerPath,
                            contents: contents || ''
                        };
                        
                    },
                    
                    
                ]
            },
            (err, result)=>{
                if (err) {
                    reject(err);
                } else {
                    cache[filePath] = true;
                    let code = validateStyle(result.css.toString());
                    
                    //合并@import依赖语句
                    let importCode = importerDep.map((file)=>{
                        return `@import '${file.replace(/\.s[ca]ss$/, `.${exitName}`)}';`;
                    });
                    code = importCode.join('\n') + '\n' + code;

                    resolve({
                        code: code
                    });
                }

                
                
                //编译@import依赖资源
                let deps = result.stats.includedFiles;
                if (deps.length > 1) {
                    deps = deps.slice(1);
                    while (deps.length) {
                        let p = deps.shift();
                        if (cache[p]) return;
                        p = path.resolve(path.dirname(filePath), p);
                        
                        compileSass(p)
                            .then((res)=>{
                                queue.push({
                                    path:  getDist(p),
                                    code: res.code
                                });
                            });
                      
                    }
                }


               
            }
        );
    });
};

module.exports = compileSass;