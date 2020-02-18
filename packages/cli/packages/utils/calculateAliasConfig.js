"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const { REACT_LIB_MAP } = require('../../consts/index');
const path = __importStar(require("path"));
const config = require('../../config/config');
const cwd = process.cwd();
const fs = require('fs');
let userConfig = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'))).nanachi || {};
let userAlias = userConfig.alias || {};
module.exports = function calculateAliasConfig() {
    let React = REACT_LIB_MAP[config.buildType];
    let ret = {};
    if (userAlias) {
        Object.keys(userAlias).forEach(function (key) {
            if (key[0] !== '@') {
                throw '别名必须以@开头';
            }
            ret[key] = path.join(cwd, userAlias[key]);
        });
    }
    return Object.assign({
        'react': path.join(cwd, `source/${React}`),
        '@react': path.join(cwd, `source/${React}`),
        'react-dom': path.join(cwd, `source/${React}`),
        '@common': path.join(cwd, 'source/common'),
        '@assets': path.join(cwd, 'source/assets'),
        '@components': path.join(cwd, 'source/components')
    }, ret);
};
