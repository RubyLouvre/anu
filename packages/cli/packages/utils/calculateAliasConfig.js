const { REACT_LIB_MAP } = require('../../consts/index');
const path = require('path');

module.exports = function calculateAliasConfig(config, userConfig, cwd){
    let React = REACT_LIB_MAP[config.buildType];
    let sourceDir = config.sourceDir;
    let ret = {};
    //用户自定义的alias配置设置成绝对路径
    let userAlias = userConfig.alias;
    if(userAlias){
        Object.keys(userAlias).forEach(function(key){
            if(key[0] !== '@'){
                throw '别名必须以@开头';
            }
            ret[key] = path.join(cwd, userAlias[key]);
        });
    }
    return Object.assign( {
        'react': path.join(cwd, `${sourceDir}/${React}`),
        '@react': path.join(cwd, `${sourceDir}/${React}`),
        '@common': path.join(cwd, `${sourceDir}/common`),
        '@assets': path.join(cwd, `${sourceDir}/assets`),
        '@components': path.join(cwd, `${sourceDir}/components`)
    },
        ret);
}