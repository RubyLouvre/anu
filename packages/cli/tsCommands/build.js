"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../ts-consts/index");
const fs = require("fs-extra");
const { deepMerge } = require('../packages/utils/index');
function default_1(args) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { buildType, beta, betaUi, watch, compress, huawei, analysis, silent } = args;
            const nanachiConfig = {};
            const baseConfig = {
                platform: buildType,
                beta,
                betaUi,
                compress,
                watch,
                huawei,
                analysis,
                silent
            };
            if (fs.existsSync(index_1.NANACHI_CONFIG_PATH)) {
                const userConfig = require(index_1.NANACHI_CONFIG_PATH);
                deepMerge(nanachiConfig, userConfig);
            }
            deepMerge(nanachiConfig, baseConfig);
            require('../index')(nanachiConfig);
        }
        catch (e) {
            console.log(e);
            process.exit(1);
        }
    });
}
exports.default = default_1;
;
