"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config/config"));
const envReg = /\s*if\s+process\.env\.ANU_ENV\s*={2,3}\s*'([\w|]*)';?/;
let visitor = {
    Program: {
        enter(astPath) {
            const nodes = astPath.node.body;
            astPath.node.body = nodes.filter((node) => {
                const leadingComments = node.leadingComments;
                if (node.type === 'ImportDeclaration' && leadingComments) {
                    for (let i = 0; i < leadingComments.length; i++) {
                        let commentValue = leadingComments[i].value;
                        const match = commentValue.match(envReg);
                        if (leadingComments[i].type === 'CommentLine'
                            && match) {
                            const targetEnvs = match[1] && match[1].split('|');
                            if (targetEnvs && !targetEnvs.includes(config_1.default.buildType)) {
                                return false;
                            }
                        }
                    }
                }
                return true;
            });
        }
    }
};
module.exports = function () {
    return {
        visitor: visitor
    };
};
