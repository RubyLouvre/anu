const fs = require('fs-extra');
const path = require('path');
const babel = require("babel-core");
const cwd = process.cwd();
const src = path.join(cwd, 'dist/ReactWX.js');
const dest = path.join(cwd, 'packages/cli/packages/template/src/ReactWX.js');
fs.copyFileSync(
    src,
    dest
);

// babel.transformFile(
//     dest,
//     {
//         babelrc: false,
//         plugins: [
//             "transform-es2015-modules-commonjs"
//         ]
//     },
//     (err, result)=>{
//         if(err) console.log(err);
//         console.log(result.code);
//     }
// );








