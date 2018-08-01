var fs = require('fs-extra');
var mkdirp = require('mkdirp');
var path = require('path');
var chalk = require('chalk');


var glob = require('glob');

var log = console.log;
var templatePath = path.join(process.cwd(), 'scripts', 'miniapp', 'template');
var destPath = path.join(process.cwd(), 'src', 'mi');


log(templatePath);
log(destPath);


//简版， 临时用






function createMiniAppSrc(){
    return new Promise((resolve, reject)=>{
        mkdirp(
            path.join(process.cwd(), 'src', 'mi'),
            function(err){
                if(err) reject(err);
                resolve(true);
            }
        )
    })
    
}

function isFile(path){
    return fs.statSync(path).isFile() ? true : false;
}
 
function copyDir(){
    glob(
        path.join(templatePath, '**'),
        (err, files)=>{
           copyAllFiles(files)
        }
    )
}


function copyAllFiles(files){
    files.forEach((src)=>{
       if(!isFile(src)){
          mkdirp(src, (err)=>{
              if(err) console.log(err);
              
          })
       }else{
          var fileContent = fs.readFileSync(src, 'utf-8');
          var destFile = src.replace('/scripts/miniapp/template', '/src/mi');
          fs.ensureFileSync(destFile);
          fs.writeFileSync(
             destFile,
             fileContent
          );
         
       }

       //console.log(chalk.green(`created: ${destFile}`));
       
      
    })
}


createMiniAppSrc()
.then((isSucess)=>{
    copyDir();
})
.catch((err)=>{
    console.log(err);
});

