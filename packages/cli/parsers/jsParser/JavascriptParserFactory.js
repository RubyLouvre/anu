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
const maps = {
    wx: WxParser_1.default,
    qq: QqParser_1.default,
    ali: AliParser_1.default,
    bu: BuParser_1.default,
    tt: TtParser_1.default,
    quick: QuickParser_1.default,
    h5: H5Parser_1.default
};
class JavascriptParserFactory {
    static create(options) {
        const { platform } = options;
        const Parser = maps[platform];
        return new Parser(options);
    }
}
exports.default = JavascriptParserFactory;
module.exports = JavascriptParserFactory;
