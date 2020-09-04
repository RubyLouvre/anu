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
const envReg = /\s*if\s+process\.env\.ANU_ENV\s*={2,3}\s*\[(.*)\];?/;
let visitor = {
    Program: {
        enter(astPath) {
            const nodes = astPath.node.body;
            astPath.node.body = nodes.filter(node => {
                const leadingComments = node.leadingComments;
                if (node.type === 'ImportDeclaration' && leadingComments) {
                    for (let i = 0; i < leadingComments.length; i++) {
                        const { type, value: commentValue } = leadingComments[i];
                        const match = commentValue.match(envReg);
                        if (type === 'CommentLine' && match) {
                            const targetEnvs = match[1];
                            if (targetEnvs && !targetEnvs.includes(config_1.default.buildType)) {
                                return false;
                            }
                            t.removeComments(node);
                        }
                    }
                }
                return true;
            });
            console.log();
        }
    }
};
module.exports = function () {
    return {
        visitor: visitor
    };
};
