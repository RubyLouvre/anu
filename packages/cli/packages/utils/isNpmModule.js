module.exports = function isNpmModule(name) {
    var c = name.charAt(0);
    return c !== '.' && c !== '/' && c !== '@';
};
