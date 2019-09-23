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
const index_1 = require("../../consts/index");
const fs = __importStar(require("fs-extra"));
const index_2 = __importDefault(require("../../index"));
const config_1 = __importDefault(require("../../config/config"));
const { deepMerge } = require('../../packages/utils/index');
function default_1(args) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { beta, betaUi, watch, compress, huawei, analysis, silent, typescript } = args;
            let { buildType } = args;
            const nanachiConfig = {};
            if (buildType === '360') {
                buildType = 'h5';
                config_1.default['360mode'] = true;
            }
            const baseConfig = {
                platform: buildType,
                beta,
                betaUi,
                compress,
                watch,
                huawei,
                analysis,
                silent,
                typescript
            };
            if (fs.existsSync(index_1.NANACHI_CONFIG_PATH)) {
                const userConfig = require(index_1.NANACHI_CONFIG_PATH);
                deepMerge(nanachiConfig, userConfig);
            }
            deepMerge(nanachiConfig, baseConfig);
            index_2.default(nanachiConfig);
        }
        catch (e) {
            console.log(e);
            process.exit(1);
        }
    });
}
exports.default = default_1;
;
