var fs = require("fs");
var path = require("path");

var dir1 = path.join(__dirname, "../dist/ReactShim.js");
var str = fs.readFileSync(dir1, "utf-8");
var text = str
    .replace(/Object\.freeze/g, "extend")
    .replace(/\/\/freeze_start[\s\S]+?freeze_end/, "");


fs.writeFileSync(dir1, text, { encoding: "utf8" });
console.log("对ReactShim瘦身完毕"); // eslint-disable-line

var dir2 = path.join(__dirname, "../dist/React.js");
var str2 = fs.readFileSync(dir2, "utf-8");
var text2 = str2
    .replace(/Object\.freeze/g, "extend")
    .replace(/\/\/freeze_start([\s\S]+?)freeze_end/, "");

fs.writeFileSync(dir2, text2, { encoding: "utf8" });
//fs.writeFileSync( path.join(__dirname, "../../animate/node_modules/anujs/dist/React.js"), text2, { encoding: "utf8" });
//fs.writeFileSync( path.join(__dirname, "../../antd-test/node_modules/anujs/dist/React.js"), text2, { encoding: "utf8" });

//fs.writeFileSync( path.join(__dirname, "../../yo-demo/node_modules/anujs/dist/React.js"), text2, { encoding: "utf8" });
//fs.writeFileSync( path.join(__dirname, "../../yo-router/node_modules/anujs/dist/React.js"), text2, { encoding: "utf8" });

console.log("对React瘦身完毕"); // eslint-disable-line

var dir3 = path.join(__dirname, "../dist/ReactIE.js");
var str3 = fs.readFileSync(dir3, "utf-8");
var text3 = str3
    .replace(/Object\.freeze/g, "extend")
    .replace(/\/\/freeze_start([\s\S]+?)freeze_end/, "");

fs.writeFileSync(dir3, text3, { encoding: "utf8" });
console.log("对ReactIE瘦身完毕"); // eslint-disable-line


var dir4 = path.join(__dirname, "../dist/ReactSelection.js");
var str4 = fs.readFileSync(dir3, "utf-8");
var text4 = str4
    .replace(/Object\.freeze/g, "extend")
    .replace(/\/\/freeze_start([\s\S]+?)freeze_end/, "");

fs.writeFileSync(dir4, text4, { encoding: "utf8" });
// fs.writeFileSync( path.join(__dirname, "../../antd-test/node_modules/anujs/dist/ReactSelection.js"), text2, { encoding: "utf8" });

console.log("对ReactSelection瘦身完毕"); // eslint-disable-line

