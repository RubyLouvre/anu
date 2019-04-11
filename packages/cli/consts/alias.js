const path = require('path');
const cwd = process.cwd();

module.exports = (platform) => {
    const { REACT_LIB_MAP } = require('./index');

    const baseAlias = {
        'react': './source/' + REACT_LIB_MAP[platform],
        '@react': './source/' + REACT_LIB_MAP[platform],
        '@components': './source/components'
    };
    const json = require(path.resolve(cwd, 'package.json'));
    const userAlias = json && json.nanachi && json.nanachi.alias || {};
    Object.keys(userAlias).forEach(alias => {
        userAlias[alias] = userAlias[alias].replace(/^(?=[^./\\])/, './');
    });
    return Object.assign({}, baseAlias, userAlias);
};