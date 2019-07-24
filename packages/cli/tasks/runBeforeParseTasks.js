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
const index_1 = __importDefault(require("./chaikaMergeTask/index"));
const pretasks_1 = __importDefault(require("./pretasks"));
let cwd = process.cwd();
function changeWorkingDir() {
    process.chdir(path.join(cwd, '.CACHE/nanachi'));
}
function isChaikaMode() {
    return process.env.NANACHI_CHAIK_MODE === 'CHAIK_MODE';
}
function default_1(args) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (isChaikaMode()) {
                yield index_1.default();
            }
            yield pretasks_1.default(args);
            if (isChaikaMode()) {
                changeWorkingDir();
            }
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.default = default_1;
;
