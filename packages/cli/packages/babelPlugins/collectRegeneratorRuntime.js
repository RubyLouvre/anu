"use strict";
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
const t = __importStar(require("@babel/types"));
const config_1 = __importDefault(require("../../config/config"));
let hackList = ['wx', 'bu', 'tt', 'quick', 'qq'];
let visitor = {
    FunctionDeclaration: {
        exit(astPath) {
            let name = astPath.node.id.name;
            if (!(name === '_asyncToGenerator' && hackList.includes(config_1.default.buildType))) {
                return;
            }
            let root = astPath.findParent(t.isProgram);
            root.node.body.unshift(t.variableDeclaration('var', [
                t.variableDeclarator(t.identifier('regeneratorRuntime'), t.callExpression(t.identifier('require'), [
                    t.stringLiteral('regenerator-runtime/runtime')
                ]))
            ]));
        }
    }
};
module.exports = [
    require('@babel/plugin-transform-async-to-generator'),
    function () {
        return {
            visitor: visitor
        };
    }
];
