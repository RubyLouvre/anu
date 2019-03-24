/**
 * 用于收集要生成的文件，格式为 {code, path}
 */
let utils = require('./utils/index');
let queue = [];
const getSize = (code)=>{
    let Bytes = Buffer.byteLength(code, 'utf8');
    return Bytes < 1000 ? `${Bytes} Bytes` : `${(Bytes/1000).toFixed(1)} Kb`;
};
let _push = queue.push;
queue.push = function(data){
    _push.call(this, data);
    const { code, path: filepath } = data;
    const size = getSize(code);
    utils.emit('build', {
        filepath,
        size,
        index: queue.length
    });
};
module.exports = queue;

