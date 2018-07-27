var fs = require('fs');
var path = require('path');

var projectDir =  process.cwd();
var anuDir = path.join(projectDir, './dist/React.js');

var anuSource = fs.readFileSync(anuDir, 'utf-8');
fs.writeFileSync(anuDir, anuSource, { encoding: 'utf8' });
fs.writeFileSync( path.join(projectDir, '../antd-test/node_modules/qreact/dist/React.js'), anuSource, { encoding: 'utf8' });
fs.writeFileSync( path.join(projectDir, '../yo-router/node_modules/anujs/dist/React.js'), anuSource, { encoding: 'utf8' });


console.log("复制antd-test目录，可以开始对antd3进行测试"); // eslint-disable-line
