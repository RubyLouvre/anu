const { EXT_MAP } = require('../../consts/index');
const { successLog } = require('../logger/index');

module.exports = async function(queues, map, meta) {
    const callback = this.async();
    if (queues) {
        queues.forEach(({ code, path: filePath, type }) => {
            const relativePath = filePath.replace(/\.\w+$/, `.${EXT_MAP.get(type) || type}`);
            this.emitFile(relativePath, code, map);
            successLog(relativePath, code);
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