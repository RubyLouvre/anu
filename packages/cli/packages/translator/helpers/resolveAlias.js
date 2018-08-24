const path = require('path');
const cwd = process.cwd();


const log = console.log;
module.exports = (nPath, modules)=>{
    let aliasField = require( path.join(cwd, 'package.json') ).mpreact.alias;
    if(!aliasField) return;
    for(let key in aliasField){
        
        let dir = path.parse(nPath.node.source.value).dir;
        if(dir){
            return;
        }
        

        let aliasPath = aliasField[key];  
        let from = path.dirname(path.join(cwd, modules.current));
        let to = path.dirname(path.join(cwd, aliasPath));

        let {name} = path.parse(aliasPath);

        //get relative path;
        let relativePath = path.relative(from, to); 
        let value = path.join(relativePath, name);

        relativePath = value;

        //set relative path to ast value;
        nPath.node.source.value = relativePath;
    }
}