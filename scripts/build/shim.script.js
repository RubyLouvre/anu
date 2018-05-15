var fs = require("fs");
var path = require("path");

var projectDir =  process.cwd();
var anuDir = path.join(projectDir, "./dist/React.js");

var anuSource = fs.readFileSync(anuDir, "utf-8");
var anuRefactor = anuSource.replace(/Object\.freeze/g, "extend").replace(/\/\/freeze_start([\s\S]+?)freeze_end/, "");
fs.writeFileSync(anuDir, anuRefactor, { encoding: "utf8" });
fs.writeFileSync( path.join(projectDir, "../antd-test/node_modules/anujs/dist/React.js"), anuRefactor, { encoding: "utf8" });


console.log("对React瘦身完毕"); // eslint-disable-line
