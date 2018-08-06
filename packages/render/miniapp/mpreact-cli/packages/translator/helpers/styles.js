const path = require("path");
const fs = require("fs-extra");
const postcss = require("postcss");
const pxtorem = require("postcss-pxtransform");
const sharedState = require("../sharedState");

function loadCSSFromFile(filePath) {
    const content = fs.readFileSync(filePath, "utf8");
    return content;
}

module.exports = function(source) {
    const content = loadCSSFromFile(
        path.resolve(sharedState.sourcePath, "..", source)
    );
    const targetConf = Object.assign(
        {
            platform: "weapp",
            designWidth: 750,
            replace: true
        },
        sharedState.projectConf.styleConf
    );
    const compiledStyle = postcss(pxtorem(targetConf)).process(content).css;
    sharedState.output.wxss += compiledStyle;
};
