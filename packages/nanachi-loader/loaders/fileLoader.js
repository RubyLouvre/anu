const extMap = new Map([
    ['css', 'wxss'],
    ['html', 'wxml'],
    ['js', 'js']
]);

module.exports = function(queues, map, meta) {
    queues.forEach(({ code, path: filePath, type, isDefault }) => {
        const relativePath = filePath.replace(/\.\w+$/, `.${extMap.get(type)}`);
        this.emitFile(relativePath, code, map);
        if (isDefault) { 
            // loader需要返回带有isDefault字段的数据，才会根据code继续向下解析依赖
            this.callback(null, code, map, meta);
        }
    });
    return;
};