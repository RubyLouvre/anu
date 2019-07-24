/**
 * 获取所有的alias配置，包括用户自定义的。
 */
const { REACT_LIB_MAP } = require('../../consts/index');
import * as path from 'path';
const config = require('../../config/config');
const cwd = process.cwd();
const fs = require('fs');
let userConfig = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'))).nanachi || {};
let userAlias = userConfig.alias || {};

module.exports = function calculateAliasConfig(){
    let React = REACT_LIB_MAP[config.buildType];
    let ret: {
        [props: string]: string;
    } = {};
    //用户自定义的alias配置计算成成绝对路径
    if (userAlias) {
        Object.keys(userAlias).forEach(function(key){
            if ( key[0] !== '@') {
                throw '别名必须以@开头';
            }
            ret[key] = path.join(cwd, userAlias[key]);
        });
    }
     
    return Object.assign( {
        'react': path.join(cwd, `source/${React}`),
        '@react': path.join(cwd, `source/${React}`),
        'react-dom': path.join(cwd, `source/${React}`),
        '@common': path.join(cwd, 'source/common'),
        '@assets': path.join(cwd, 'source/assets'),
        '@components': path.join(cwd, 'source/components')
    },
    ret);
};