import * as path from 'path';
import { REACT_LIB_MAP } from './index';
const cwd = process.cwd();

export interface Alias {
    [propsName: string]: string;
}

export default (platform: string) => {
    const baseAlias: Alias = {
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