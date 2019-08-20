module.exports = function decodeChinese(code) {
    return code.replace(/\\?(?:\\u)([\da-f]{4})/gi, function (a, b) {
        return unescape(`%u${b}`);
    });
};
