const path = require('path');
const cwd = process.cwd();
module.exports = (nPath, modules)=>{
    let aliasField = require( path.join(cwd, 'package.json') ).mpreact.alias;
    if(!aliasField) return;
    for(let key in aliasField){
        let aliasPath = aliasField[key];  
        let from = path.dirname(path.join(cwd, modules.current)); 
        let to = path.dirname(path.join(cwd, aliasPath));

        //get relative path;
        let relativePath = path.relative(from, to); 
        let value = path.join(relativePath, key);
        
        relativePath = value;
      
        //set relative path to ast value;
        nPath.node.source.value = relativePath;
    }
}