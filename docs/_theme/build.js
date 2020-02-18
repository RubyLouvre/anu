const path = require('path')
const sass = require('node-sass')
const fs = require('fs')
const chokidar = require('chokidar')
const styleInDir = path.resolve(__dirname, 'styles');
const styleInPath = path.resolve(__dirname, 'styles/index.scss');
const styleOutPath = path.resolve(__dirname, './style.css')

/**
 * command: 
 * node build.js #build style.css
 * node build.js watch # build style.css with watch file changes
 */

// 编译 scss 文件至 docs 目录中
function build(){
  sass.render({
    file: styleInPath,
    outFile: styleOutPath,
    outputStyle: 'expanded'
  }, function (err, result) {
    if (!err) {
      fs.writeFile(styleOutPath, result.css, function (err) {
        if (err) {
          throw err;
        }
        console.log('Generate style.css success!')
      })
    } else {
      throw err;
    }
  })
}

build();

if (process.argv[2] === 'watch') {
  chokidar.watch(styleInDir, {
    ignoreInitial: true
  }).on('all', build);
}

