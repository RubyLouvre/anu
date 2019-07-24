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
const config_1 = __importDefault(require("../../config/config"));
const traverse_1 = __importDefault(require("@babel/traverse"));
const generator_1 = __importDefault(require("@babel/generator"));
const json5_1 = __importDefault(require("json5"));
const path = __importStar(require("path"));
const buildType = process.env.ANU_ENV;
const cwd = process.cwd();
let WebViewRules = {
    pages: [],
    allowthirdpartycookies: false,
    trustedurl: [],
    showTitleBar: true
};
module.exports = () => {
    return {
        visitor: {
            ClassDeclaration(astPath, state) {
                if (buildType !== 'quick')
                    return;
                let fileId = state.file.opts.filename;
                traverse_1.default(astPath.node, {
                    AssignmentExpression(astPath) {
                        let node = astPath.node;
                        if (generator_1.default(node.left).code !== 'this.config')
                            return;
                        if (node.right.type !== 'ObjectExpression')
                            return;
                        let webViewConfig = (json5_1.default.parse(generator_1.default(node.right).code) || {})['webview'];
                        if (!(webViewConfig && webViewConfig[buildType]))
                            return;
                        webViewConfig = webViewConfig[buildType];
                        Object.assign(WebViewRules, {
                            allowthirdpartycookies: webViewConfig.allowthirdpartycookies,
                            trustedurl: webViewConfig.trustedurl,
                            showTitleBar: webViewConfig.showTitleBar
                        });
                        if (Array.isArray(webViewConfig.pages)) {
                            WebViewRules.pages = WebViewRules.pages.concat(webViewConfig.pages.map((el) => {
                                return path.join(cwd, 'source', /\.js$/.test(el) ? el : el + '.js');
                            }));
                            return;
                        }
                        if (Object.prototype.toString.call(webViewConfig.pages) === '[object Boolean]'
                            && webViewConfig.pages) {
                            let startPath = path.join(path.dirname(fileId), '..');
                            let reg = new RegExp('^' + startPath);
                            WebViewRules.pages.push(reg);
                        }
                    }
                }, astPath.scope);
            }
        },
        post: function () {
            config_1.default.WebViewRules = WebViewRules;
        }
    };
};
