module.exports = function decodeChinese(code: string) {
    return code.replace(/\\?(?:\\u)([\da-f]{4})/gi, function (a, b) {
        return unescape(`%u${b}`);
    });
}