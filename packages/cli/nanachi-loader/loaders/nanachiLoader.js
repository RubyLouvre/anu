"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JavascriptParserFactory_1 = __importDefault(require("../../parsers/jsParser/JavascriptParserFactory"));
const utils = require('../../packages/utils/index');
module.exports = function (code, map, meta) {
    return __awaiter(this, void 0, void 0, function* () {
        const callback = this.async();
        try {
            const parser = JavascriptParserFactory_1.default.create({
                platform: this.nanachiOptions.platform,
                filepath: this.resourcePath,
                code,
                map,
                meta
            });
            try {
                yield parser.parse();
            }
            catch (err) {
                if (utils.isMportalEnv()) {
                    console.log(err);
                    process.exit(1);
                }
                console.log(this.resourcePath, '\n', err);
            }
            let result = {
                queues: parser.getExtraFiles(),
                exportCode: parser.getExportCode()
            };
            callback(null, result, map, meta);
            return;
        }
        catch (e) {
            callback(e, { queues: [], exportCode: '' }, map, meta);
            return;
        }
    });
};
