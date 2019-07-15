"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SassParser_1 = __importDefault(require("./SassParser"));
const LessParser_1 = __importDefault(require("./LessParser"));
const CssParser_1 = __importDefault(require("./CssParser"));
class StyleParserFactory {
    static create(_a) {
        var { type } = _a, options = __rest(_a, ["type"]);
        switch (type) {
            case 'sass':
            case 'scss':
                return new SassParser_1.default(Object.assign({ type: 'sass' }, options));
            case 'css':
                return new CssParser_1.default(Object.assign({ type }, options));
            case 'less':
                return new LessParser_1.default(Object.assign({ type }, options));
        }
    }
}
module.exports = StyleParserFactory;
exports.default = StyleParserFactory;
