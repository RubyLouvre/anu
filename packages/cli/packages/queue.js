/**
 * 用于收集要生成的文件，格式为 {code, path}
 */
let utils = require('./utils/index');
let queue = [];
queue.size = 0;
let _push = queue.push;
queue.push = function(data){
    _push.call(this, data);
    queue.size++;
    utils.emit('build');
};
module.exports = queue;
