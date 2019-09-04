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
const generator_1 = __importDefault(require("@babel/generator"));
const template_1 = __importDefault(require("@babel/template"));
const utils_1 = __importDefault(require("../utils"));
module.exports = {
    enter(astPath, state) {
        let modules = utils_1.default.getAnu(state);
        modules.className = astPath.node.id.name;
        modules.parentName = generator_1.default(astPath.node.superClass).code || 'Object';
        modules.classUid = 'c' + utils_1.default.createUUID(astPath);
    },
    exit(astPath, state) {
        let modules = utils_1.default.getAnu(state);
        if (!modules.ctorFn) {
            modules.ctorFn = template_1.default('function X(){B}')({
                X: t.identifier(modules.className),
                B: modules.thisProperties
            });
        }
        if (astPath.parent.type === 'Program') {
            astPath.insertBefore(modules.ctorFn);
        }
        else {
            let tempPath;
            astPath.findParent(function (astPath) {
                if (astPath.type !== 'Program') {
                    tempPath = astPath;
                    return false;
                }
                return true;
            });
            let tempExp = tempPath.get('declarations')[0];
            let left = tempExp.get('id').node, right = tempExp.get('init').node;
            tempPath.replaceWith(t.expressionStatement(t.assignmentExpression('=', left, right)));
            tempPath.insertBefore(modules.ctorFn);
        }
        modules.thisMethods.push(t.objectProperty(t.identifier('classUid'), t.stringLiteral(modules.classUid)));
        const classDeclarationAst = t.assignmentExpression('=', t.identifier(modules.className), t.callExpression(t.identifier('React.toClass'), [
            t.identifier(modules.className),
            t.identifier(modules.parentName),
            t.objectExpression(modules.thisMethods),
            t.objectExpression(modules.staticMethods)
        ]));
        if (modules.componentType === 'App') {
            if (!/this.globalData/.test(generator_1.default(modules.ctorFn).code)) {
                throw 'app.js没有设置globalData对象';
            }
        }
        astPath.replaceWith(classDeclarationAst);
        if (astPath.type == 'CallExpression') {
            if (astPath.parentPath.type === 'VariableDeclarator') {
                if (parent.type == 'VariableDeclaration') {
                    parent.node.kind = 'var';
                }
            }
        }
        if (modules.componentType === 'Page') {
            modules.registerStatement = utils_1.default.createRegisterStatement(modules.className, modules.current
                .replace(/.+pages/, 'pages')
                .replace(/\.js$/, ''), true);
        }
        else if (modules.componentType === 'Component') {
            modules.registerStatement = utils_1.default.createRegisterStatement(modules.className, modules.className);
        }
    }
};
