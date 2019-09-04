"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
function injectChaikEnv() {
    let pkg = {};
    try {
        pkg = require(path.join(process.cwd(), 'package.json'));
    }
    catch (err) {
    }
    let chaikaMode = pkg.nanachi && pkg.nanachi.chaika_mode
        ? 'CHAIK_MODE'
        : 'NOT_CHAIK_MODE';
    process.env.NANACHI_CHAIK_MODE = process.env.NANACHI_CHAIK_MODE || chaikaMode;
}
injectChaikEnv();
