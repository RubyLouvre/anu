"use strict";
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
const template_1 = __importDefault(require("@babel/template"));
const t = __importStar(require("@babel/types"));
const extraImportedPath = template_1.default(`
import dynamicPage from '@internalComponents/HOC/dynamicPage';
`)();
module.exports = function () {
    return {
        visitor: {
            Program: {
                exit(astPath) {
                    astPath.node.body.unshift(extraImportedPath);
                }
            },
            ExportDefaultDeclaration(astPath) {
                const declaration = astPath.node.declaration;
                astPath.node.declaration = t.callExpression(t.identifier('dynamicPage'), [declaration]);
            }
        }
    };
};
