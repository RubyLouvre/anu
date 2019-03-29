const chalk = require('chalk');
const { EXT_MAP } = require('../../cli/consts/index');

module.exports = function(queues, map, meta) {
    const callback = this.callback.bind(this);
    if (queues) {
        // queues.then((res) => {
        //     console.log(res);
        // }).catch((e) => {
        //     console.log(err)
        // })
        // console.log(queues);
        queues.forEach(({ code, path: filePath, type }) => {
            const relativePath = filePath.replace(/\.\w+$/, `.${EXT_MAP.get(type) || type}`);
            this.emitFile(relativePath, code, map);
            console.log(chalk`{green webpack生成：${relativePath}}`);
        });
        const defaultFile = queues.find(({ isDefault }) => isDefault);
        if (defaultFile) {
            if (defaultFile.type === 'css') {
                defaultFile.code = `module.exports=${JSON.stringify(defaultFile.code)}`;
            }
            defaultFile.extraModules && defaultFile.extraModules.forEach(m => {
                // TODO: windows?
                defaultFile.code = `import '${m}';\n` + defaultFile.code;
            });
            // loader需要返回带有isDefault字段的数据，才会根据code继续向下解析依赖
            callback(null, defaultFile.code, map, meta);
            return;
        }
    }
    callback(null, '', map, meta);
    return;
};