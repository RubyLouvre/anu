"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const StyleParserFactory_1 = __importDefault(require("../../parsers/styleParser/StyleParserFactory"));
module.exports = function (code, map, meta) {
    return __awaiter(this, void 0, void 0, function* () {
        const callback = this.async();
        const parser = StyleParserFactory_1.default.create({
            type: path.extname(this.resourcePath).replace(/^\./, ''),
            platform: this.nanachiOptions.platform,
            code,
            map,
            meta,
            filepath: this.resourcePath,
            loaderContext: this
        });
        try {
            yield parser.parse();
            const result = {
                queues: parser.getExtraFiles(),
                exportCode: parser.getExportCode()
            };
            callback(null, result, map, meta);
        }
        catch (e) {
            callback(e);
        }
    });
};
