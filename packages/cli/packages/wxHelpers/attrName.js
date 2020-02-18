"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __importDefault(require("../utils"));
module.exports = function mapPropName(astPath, attrName, parentName) {
    let attrNameNode = astPath.node.name;
    if (parentName === 'canvas' && attrName === 'id') {
        if (!astPath.addCanvas) {
            astPath.addCanvas = true;
            astPath.container.push(utils_1.default.createAttribute('canvas-id', astPath.node.value));
        }
        return;
    }
    if (/^catch[A-Z]/.test(attrName)) {
        attrNameNode.name = 'catch' + attrName.slice(5).toLowerCase();
    }
    else if (/^on[A-Z]/.test(attrName)) {
        attrNameNode.name = 'bind' + attrName.slice(2).toLowerCase();
    }
    else {
        if (attrName === 'className') {
            attrNameNode.name = 'class';
        }
    }
};
