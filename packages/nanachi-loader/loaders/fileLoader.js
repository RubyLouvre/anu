const chalk = require('chalk');
const extMap = new Map([
    ['css', 'wxss'],
    ['html', 'wxml']
]);

module.exports = function(queues, map, meta) {
    if (queues) {
        queues.forEach(({ code, path: filePath, type, isDefault, extraModules }) => {
            const relativePath = filePath.replace(/\.\w+$/, `.${extMap.get(type) || type}`);
            this.emitFile(relativePath, code, map);
            console.log(chalk`{green webpack生成：${relativePath}}`);
        });
        const defaultFile = queues.find(({ isDefault }) => isDefault);
        if (defaultFile) {
            defaultFile.extraModules && defaultFile.extraModules.forEach(m => {
                // TODO: windows?
                defaultFile.code = `import '${m}';\n` + defaultFile.code;
            });
            // loader需要返回带有isDefault字段的数据，才会根据code继续向下解析依赖
            this.callback(null, defaultFile.code, map, meta);
            return;
        }
    }
    this.callback(null, '', map, meta);
    return;
};