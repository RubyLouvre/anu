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
const js_beautify_1 = __importDefault(require("js-beautify"));
const quickFiles_1 = __importDefault(require("./quickFiles"));
const utils_1 = __importDefault(require("../utils"));
const calculateAlias_1 = __importDefault(require("../utils/calculateAlias"));
function beautifyUx(code) {
    return js_beautify_1.default.html(code, {
        indent: 4,
    });
}
let map = {
    getImportTag: function (uxFile, sourcePath) {
        let importTag = '';
        let using = uxFile.config && uxFile.config.usingComponents || {};
        Object.keys(using).forEach((i) => {
            let importerReletivePath = calculateAlias_1.default(sourcePath, using[i]);
            importTag += `<import name="${i}" src="${importerReletivePath}.ux"></import>`;
        });
        return importTag;
    },
    getJsCode: function (code) {
        if (!code)
            return '';
        code = js_beautify_1.default.js(code);
        return `<script>\n${code}\n</script>`;
    },
    resolveComponents: function (data, queue) {
        let { result, sourcePath, relativePath } = data;
        let isComponentReg = /[\\/]components[\\/]/;
        if (!isComponentReg.test(sourcePath))
            return;
        queue.push({
            code: js_beautify_1.default.js(result.code.replace('console.log(nanachi)', 'export {React}')),
            path: relativePath,
            type: 'js'
        });
        let reg = /components[\\/](\w+)/;
        var componentName = sourcePath.match(reg)[1];
        result.code = `import ${componentName}, { React } from './index.js';
        export default  React.registerComponent(${componentName}, '${componentName}');`;
    }
};
module.exports = (data, queue) => __awaiter(this, void 0, void 0, function* () {
    let { sourcePath, result } = data;
    sourcePath = utils_1.default.fixWinPath(sourcePath);
    var uxFile = quickFiles_1.default[sourcePath];
    if (!uxFile || (!uxFile.template && uxFile.type != 'App')) {
        return {
            type: 'js',
            code: result.code
        };
    }
    var ux = `${uxFile.template || ''}`;
    map.resolveComponents(data, queue);
    uxFile.header = beautifyUx(map.getImportTag(uxFile, sourcePath) + ux);
    uxFile.jsCode = map.getJsCode(result.code);
    uxFile.cssCode = uxFile.cssCode || '';
    return {
        type: 'ux',
    };
});
