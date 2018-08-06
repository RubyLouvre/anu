const template = require("babel-template");

module.exports = function xxx(name, isDefault) {
    if (isDefault == true) {
        return template(`module.exports.default = ${name};`)();
    } else {
        return template(`module.exports["${name}"] = ${name};`)();
    }
};
