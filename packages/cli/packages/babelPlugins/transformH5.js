const utils = require('../utils/index');

module.exports = function(){
    return {
        manipulateOptions(opts) {
            //解析每个文件前执行一次
            opts.anu = {
                pageIndex: 0,
                extraModules: [], // 用于webpack分析依赖，将babel中删除的依赖关系暂存
                queue: []
            };
        }
    };
};
    