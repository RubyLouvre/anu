"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const index_1 = require("./index");
const cwd = process.cwd();
exports.default = (platform) => {
    const baseAlias = {
        'react': './source/' + index_1.REACT_LIB_MAP[platform],
        '@react': './source/' + index_1.REACT_LIB_MAP[platform],
        '@components': './source/components'
    };
    const json = require(path.resolve(cwd, 'package.json'));
    const userAlias = json && json.nanachi && json.nanachi.alias || {};
    Object.keys(userAlias).forEach(alias => {
        userAlias[alias] = userAlias[alias].replace(/^(?=[^./\\])/, './');
    });
    return Object.assign({}, baseAlias, userAlias);
};
