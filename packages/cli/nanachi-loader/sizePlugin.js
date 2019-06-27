const path = require('path');
const fs = require('fs');
const id = 'SizePlugin';
const table =  require('table').table;

//扁平化数组
function flatten(ary){
    var ret = [];
    ary.map(function(el){
        if (Array.isArray(el)) {
            ret = ret.concat(el)
        } else {
            ret.push(el)
        }
    });
    return ret;
}


function getSize(ary){
    let defaultSize = 0;
    ary.forEach(function(el){
        defaultSize += el.size;
    });
    return defaultSize;
}

class SizePlugin {
    apply(compiler){
        compiler.hooks.done.tap(id, (compilation) => {
            var map = {}, tree = {}, pages = [], Identifiers = {};
            var assetsInfo = compilation.toJson().assets;

            compilation.toJson().modules.forEach(function(module){
                
                //过滤 node_modules 模块
                if (/\/node_modules\//.test(module.id)) {
                    return;
                }

                let fileId = module.id.split(/\/source\//)[1];
                // pages 和 app.js 作为业务 size 统计
                if (/(pages|app)\/?/.test( fileId ) && /\.js$/.test(fileId) ) {
                    pages.push(fileId);
                }
                
                // reasons 表示 module.id 依赖宿主（被谁依赖）
                var reasons = module.reasons
                .map(function(el){
                    if (el.moduleId) {
                        return el.moduleId.split(/\/source\//)[1]
                    } else {
                        return '';
                    }
                })
                reasons = Array.from( new Set(reasons) );

                // 标示哪些资源是公用的， 如果 module.id 依赖宿主为多个, 则表示该文件是公用的。
                if (reasons.length > 1) {
                    Identifiers[fileId] = 1;
                } else {
                    Identifiers[fileId] = 0;
                }


                // module.assets 表示当前资源有哪些输出文件，比如 page 页面会输出js, css, *xml
                map[fileId] = {
                    id: fileId,
                    reasons: reasons,
                    assets: module.assets
                }
               
            });

            //获得依赖树
            pages.forEach(function( pagePath ){
                for(let i in map) {
                    if (map[i].reasons.includes(pagePath)) {
                        tree[pagePath] = tree[pagePath] || [];
                        tree[pagePath].push(i);
                        if (!tree[pagePath].includes(pagePath)) {
                            tree[pagePath].push(pagePath);
                        }
                    }
                }
            })

            //dep代表当前平台依赖哪些资源（包括公共资源），common代表该平台用到的公共资源
            let ret = {};
            fs.readdirSync(path.join(process.cwd(), 'source', 'pages'))
            .filter(function(el){
                return /^\w+/.test(el);
            })
            .forEach(function(plat){
                ret[plat] = {
                    plat: plat,
                    dep: [],
                    common: []
                }
            })
            
           
            for( let i in tree ) {
               //获取单个文件打包的xml,样式, js 资源
               let fileDeps = tree[i].map(function(dep){
                    var depAssets = map[dep].assets;
                    return depAssets.map(function(el){
                        let target = assetsInfo.find(function(item){
                            return item.name == el;
                        });
                        return {
                            name: target.name,
                            size: target.size,
                            onwer: dep
                        }
                    });
               });

               fileDeps = flatten(fileDeps);
              
               if (!/app\.js/.test(i)) {
                let plat = i.split('/')[1];
                ret[plat].dep = ret[plat].dep.concat(fileDeps);
               } else {
                // app.js 过滤里面的 pages, react runtime 依赖, 没必要计算进去。
                fileDeps = fileDeps.filter(function(el){
                    return !/^pages\//.test(el.name) && !/React\w+\.js$/.test(el.name)
                });
                ret.app = ret.app || {
                    plat: 'app',
                    dep: [].concat(fileDeps)
                }  
               }
               
            }

            let output = [];
            for(let plat in ret) {
                let dep = ret[plat].dep, tem = [], commonFiles = [], files = [];
                
                dep = dep.filter(function(el){
                    return !/React\w+\.js$/.test(el.name);
                });

                dep.forEach(function(el){
                    //公共资源
                    if (Identifiers[el.name] == 1) {
                        commonFiles.push(el);   
                    }
                    //过滤 React, 防止重复计算 React size
                    if (/React\w+\.js$/.test(el.name)) {
                        if (!tem.length) {
                            tem.push(el);
                        }
                    } else {
                        files.push(el);
                    }
                })

                //一个业务线只算一个 React runtime size
                files = files.concat(tem);

                //配置 table 输出数据
                let tableItem = [];
                let allSize = (getSize(files)/1000).toFixed(2);
                let commonPercent =  (getSize(commonFiles)/1000).toFixed(2) / allSize;
                commonPercent = commonPercent.toFixed(2) * 100;
                
                tableItem.push(
                     plat,
                     Math.round( ( getSize(files)/1000).toFixed(2) )  + ' Kb',
                     commonPercent + ' %'
                );
                
                output.push(tableItem);
            }
            
            var data = [
                ['业务平台', 'size', '公共资源占比']
            ].concat(output)

            // data = [
            //     ['0A', '0B', '0C'],
            //     ['1A', '1B', '1C'],
            //     ['2A', '2B', '2C']
            // ];

            // ╔════╤════╤════╗
            // ║ 0A │ 0B │ 0C ║
            // ╟────┼────┼────╢
            // ║ 1A │ 1B │ 1C ║
            // ╟────┼────┼────╢
            // ║ 2A │ 2B │ 2C ║
            // ╚════╧════╧════╝

            console.log(table(data));
            
        })
    }
}


module.exports = SizePlugin;