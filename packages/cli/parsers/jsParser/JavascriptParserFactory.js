"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WxParser_1 = __importDefault(require("./WxParser"));
const QqParser_1 = __importDefault(require("./QqParser"));
const AliParser_1 = __importDefault(require("./AliParser"));
const BuParser_1 = __importDefault(require("./BuParser"));
const TtParser_1 = __importDefault(require("./TtParser"));
const QuickParser_1 = __importDefault(require("./QuickParser"));
const H5Parser_1 = __importDefault(require("./H5Parser"));
class JavascriptParserFactory {
    static create(options) {
        const { platform } = options;
        switch (platform) {
            case 'wx':
                return new WxParser_1.default(options);
            case 'qq':
                return new QqParser_1.default(options);
            case 'ali':
                return new AliParser_1.default(options);
            case 'bu':
                return new BuParser_1.default(options);
            case 'tt':
                return new TtParser_1.default(options);
            case 'quick':
                return new QuickParser_1.default(options);
            case 'h5':
                return new H5Parser_1.default(options);
            default:
                return new WxParser_1.default(options);
        }
    }
}
exports.default = JavascriptParserFactory;
module.exports = JavascriptParserFactory;
