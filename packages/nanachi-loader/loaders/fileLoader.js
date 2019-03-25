const chalk = require('chalk');
const extMap = new Map([
    ['css', 'wxss'],
    ['html', 'wxml'],
    ['js', 'js']
]);

module.exports = function(queues, map, meta) {
    queues && queues.forEach(({ code, path: filePath, type, isDefault, extraModules }) => {
        const relativePath = filePath.replace(/\.\w+$/, `.${extMap.get(type)}`);
        this.emitFile(relativePath, code, map);
        // console.log(chalk`{green webpack生成：${relativePath}}`, code);
        if (isDefault) {
            // if (type === 'css') {
            //     code = `module.exports='${code}'`;
            // }
            extraModules && extraModules.forEach(m => {
                // TODO: windows?
                code = `import '${m}';\n` + code;
            });
            // console.log(code);
            // loader需要返回带有isDefault字段的数据，才会根据code继续向下解析依赖
            this.callback(null, code, map, meta);
        }
    });
    return;
};