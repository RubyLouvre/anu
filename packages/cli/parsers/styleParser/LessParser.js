"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const StyleParser_1 = __importDefault(require("./StyleParser"));
const index_1 = require("../../consts/index");
const path = __importStar(require("path"));
const calculateAlias = require('../../packages/utils/calculateAlias');
class LessParser extends StyleParser_1.default {
    constructor(props) {
        super(props);
        this._postcssPlugins = this._postcssPlugins.concat([
            require('postcss-import')({
                resolve: function (importer, baseDir) {
                    if (!/\.less$/.test(importer)) {
                        importer = importer + '.less';
                    }
                    var filePathAbPath = path.join(baseDir, calculateAlias(props.filepath, importer));
                    return filePathAbPath;
                },
                plugins: this.platform !== 'h5' ? [
                    require('../../packages/postcssPlugins/postCssPluginRemoveRules')
                ] : []
            }),
            require('../../packages/postcssPlugins/postCssPluginLessParser'),
            ...this.platform !== 'h5' ? [require('../../packages/postcssPlugins/postCssPluginAddImport')({
                    extName: index_1.MAP[this.platform]['EXT_NAME'][this.type],
                    type: this.type,
                })] : [
                require('../../packages/postcssPlugins/postCssPluginRpxToRem'),
                require('../../packages/postcssPlugins/postCssPluginAddStyleHash')
            ],
            require('../../packages/postcssPlugins/postCssPluginFixNumber'),
            require('../../packages/postcssPlugins/postCssPluginValidateStyle'),
            require('../../packages/postcssPlugins/postCssPluginTransformKeyFrames'),
            require('../../packages/postcssPlugins/postCssPluginRemoveComments')
        ]);
        this._postcssOptions = {
            from: this.filepath,
            parser: require('postcss-less')
        };
    }
}
exports.default = LessParser;
