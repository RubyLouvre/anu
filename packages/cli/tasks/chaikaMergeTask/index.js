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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const copySource_1 = __importDefault(require("./copySource"));
const mergeFiles_1 = __importDefault(require("./mergeFiles"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
const cwd = process.cwd();
function changeWorkingDir() {
    process.chdir(path.join(cwd, '.CACHE/nanachi'));
}
function makeSymLink() {
    let currentNpmDir = path.join(cwd, 'node_modules');
    let targetNpmDir = path.join(cwd, '.CACHE/nanachi/node_modules');
    if (!fs.existsSync(targetNpmDir)) {
        fs.symlinkSync(currentNpmDir, targetNpmDir);
        return;
    }
}
function default_1() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield copySource_1.default();
            yield mergeFiles_1.default();
            makeSymLink();
        }
        catch (err) {
            console.log(err);
        }
    });
}
exports.default = default_1;
;
