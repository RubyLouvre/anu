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
const path = __importStar(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const utils_1 = __importDefault(require("../utils"));
const calculateComponentsPath_1 = __importDefault(require("../utils/calculateComponentsPath"));
const config_1 = __importDefault(require("../../config/config"));
const transformConfig_1 = __importDefault(require("./transformConfig"));
const buildType = config_1.default['buildType'];
const quickhuaweiStyle = require('../quickHelpers/huaweiStyle');
const ignoreAttri = require('../quickHelpers/ignoreAttri');
const ignorePrevAttri = require('../quickHelpers/ignorePrevAttri');
const cwd = process.cwd();
const quickFiles = require('../quickHelpers/quickFiles');
const quickConfig = require('../quickHelpers/config');
const helpers = require(`../${config_1.default[buildType].helpers}/index`);
const inlineElement = {
    text: 1,
    span: 1,
    b: 1,
    strong: 1,
    s: 1,
    em: 1,
    bdo: 1,
    q: 1
};
let needRegisterApp = false;
let cache = {};
if (buildType == 'quick') {
    utils_1.default.createRegisterStatement = function (className, path, isPage) {
        var templateString = isPage ?
            'CLASSNAME = React.registerPage(CLASSNAME,ASTPATH)' :
            'console.log(nanachi)';
        return isPage ? template_1.default(templateString)({
            CLASSNAME: t.identifier(className),
            ASTPATH: t.stringLiteral(path)
        }) : template_1.default(templateString)();
    };
}
function registerPageOrComponent(name, path, modules) {
    if (name == modules.className) {
        path.insertBefore(modules.registerStatement);
    }
}
const visitor = {
    ClassDeclaration: helpers.classDeclaration,
    ClassExpression: helpers.classDeclaration,
    ClassMethod: {
        enter(astPath, state) {
            if (!astPath.node) {
                return;
            }
            let modules = utils_1.default.getAnu(state);
            let methodName = astPath.node.key.name;
            modules.walkingMethod = methodName;
            if (methodName !== 'constructor') {
                if (buildType == 'quick' && modules.componentType === 'App') {
                    if (methodName === 'onLaunch') {
                        methodName = 'onCreate';
                    }
                    else if (methodName === 'onHide') {
                        methodName = 'onDestroy';
                    }
                    let dist = path.join('components', 'PageWrapper', 'index.ux');
                    if (!cache[dist]) {
                        modules.queue.push({
                            code: fs_extra_1.default.readFileSync(path.resolve(__dirname, '../quickHelpers/PageWrapper.ux')),
                            path: dist,
                            type: 'ux'
                        });
                        cache[dist] = true;
                    }
                }
                let fn = utils_1.default.createMethod(astPath, methodName);
                let isStaticMethod = astPath.node.static;
                if (methodName === 'render') {
                    helpers.render.enter(astPath, '有状态组件', modules.className, modules);
                }
                else {
                    astPath.remove();
                }
                if (isStaticMethod) {
                    modules.staticMethods.push(fn);
                }
                else {
                    modules.thisMethods.push(fn);
                }
            }
            else {
                let node = astPath.node;
                modules.ctorFn = t.functionDeclaration(t.identifier(modules.className), node.params, node.body, node.generator, false);
            }
        },
        exit(astPath, state) {
            let methodName = astPath.node.key.name;
            if (methodName === 'render') {
                let modules = utils_1.default.getAnu(state);
                if (modules.componentType === 'App') {
                    needRegisterApp = true;
                }
                helpers.render.exit(astPath, '有状态组件', modules.className, modules);
                astPath.node.body.body.unshift(template_1.default(utils_1.default.shortcutOfCreateElement())());
            }
        }
    },
    FunctionDeclaration: {
        exit(astPath, state) {
            let modules = utils_1.default.getAnu(state);
            let name = astPath.node.id.name;
            if (/^[A-Z]/.test(name) &&
                modules.componentType === 'Component' &&
                !modules.parentName &&
                !modules.registerStatement) {
                modules.className = name;
                helpers.render.exit(astPath, '无状态组件', name, modules);
                modules.registerStatement = utils_1.default.createRegisterStatement(name, name);
            }
            if (astPath.parentPath.type === 'ExportDefaultDeclaration' &&
                modules.componentType === 'Component') {
                astPath.node.body.body.unshift(template_1.default(utils_1.default.shortcutOfCreateElement())());
            }
        }
    },
    ImportDeclaration(astPath, state) {
        let node = astPath.node;
        let modules = utils_1.default.getAnu(state);
        let source = node.source.value;
        let specifiers = node.specifiers;
        var extraModules = modules.extraModules;
        if (/\.(less|scss|sass|css)$/.test(path.extname(source))) {
            if (modules.componentType === 'Component') {
                if (/\/pages\//.test(source)) {
                    throw '"' + modules.className + '"组件越级不能引用pages下面的样式\n\t' + source;
                }
            }
            extraModules.push(source);
            astPath.remove();
        }
        if (modules.componentType === 'App') {
            if (/\/pages\//.test(source)) {
                if (/\/(common|components)\//.test(source)) {
                    return;
                }
                var pages = modules.pages || (modules.pages = []);
                pages.push(source.replace(/^\.\//, ''));
                extraModules.push(source);
                astPath.remove();
            }
        }
        else {
            if (/\.js$/.test(source)) {
                source = source.replace(/\.js$/, '');
            }
            if (/\/components\//.test(modules.current)) {
                if (!modules.className) {
                    var segments = modules.current.match(/[\w\.-]+/g);
                    modules.className = segments[segments.length - 2];
                }
            }
        }
        if (modules.componentType !== 'App') {
            specifiers.forEach(item => {
                modules.importComponents[item.local.name] = {
                    astPath: astPath,
                    source: source,
                    sourcePath: modules.sourcePath
                };
            });
        }
    },
    Program: {
        exit(astPath, state) {
            var modules = utils_1.default.getAnu(state);
            const parentClass = modules.parentName;
            if (config_1.default.buildType === 'ali' &&
                modules.componentType === 'Component' &&
                parentClass !== 'Object') {
                for (var i in modules.importComponents) {
                    var value = modules.importComponents[i];
                    if (value.astPath && i === parentClass) {
                        modules.usedComponents['anu-' + i.toLowerCase()] =
                            calculateComponentsPath_1.default(value);
                        value.astPath = null;
                    }
                }
            }
            if (!/App|Page|Component/.test(modules.componentType)) {
                return;
            }
            var json = modules.config;
            if (modules.componentType === 'App') {
                json.pages = modules.pages;
                delete modules.pages;
            }
            helpers.configName(json, modules.componentType);
            var keys = Object.keys(modules.usedComponents), usings;
            if (keys.length) {
                usings = json.usingComponents || (json.usingComponents = {});
                keys.forEach(function (name) {
                    usings[name] = modules.usedComponents[name];
                });
            }
            if (buildType == 'quick') {
                var obj = quickFiles[modules.sourcePath];
                if (obj) {
                    quickConfig(json, modules, modules.queue, utils_1.default);
                    obj.config = Object.assign({}, json);
                }
                return;
            }
            else {
                if (modules.componentType === 'Component') {
                    json.component = true;
                }
            }
            if (Object.keys(json).length) {
                json = require('../utils/setSubPackage')(modules, json);
                json = require('../utils/mergeConfigJson')(modules, json);
                let relPath = '';
                if (/\/node_modules\//.test(modules.sourcePath.replace(/\\/g, '/'))) {
                    relPath = 'npm/' + path.relative(path.join(cwd, 'node_modules'), modules.sourcePath);
                }
                else {
                    relPath = path.relative(path.resolve(cwd, 'source'), modules.sourcePath);
                }
                modules.queue.push({
                    path: relPath,
                    code: JSON.stringify(json, null, 4),
                    type: 'json'
                });
            }
        }
    },
    ExportDefaultDeclaration: {
        exit(astPath, state) {
            var modules = utils_1.default.getAnu(state);
            if (/Page|Component/.test(modules.componentType)) {
                let declaration = astPath.node.declaration;
                let name = declaration.name;
                if (declaration.type == 'FunctionDeclaration') {
                    astPath.insertBefore(declaration);
                    astPath.node.declaration = declaration.id;
                    name = declaration.id.name;
                }
                registerPageOrComponent(name, astPath, modules);
            }
            if (modules.componentType === 'App' && buildType !== 'quick' && needRegisterApp) {
                const args = astPath.get('declaration').node.arguments;
                astPath.get('declaration').node.arguments = [
                    t.callExpression(t.memberExpression(t.identifier('React'), t.identifier('registerApp')), args)
                ];
            }
        }
    },
    ExportNamedDeclaration: {
        exit(astPath) {
            let declaration = astPath.node.declaration || {
                type: '{}'
            };
            switch (declaration.type) {
                case 'Identifier':
                    astPath.replaceWith(utils_1.default.exportExpr(declaration.name));
                    break;
                case 'VariableDeclaration':
                    var id = declaration.declarations[0].id.name;
                    declaration.kind = 'var';
                    astPath.replaceWithMultiple([
                        declaration,
                        utils_1.default.exportExpr(id)
                    ]);
                    break;
                case 'FunctionDeclaration':
                    astPath.replaceWithMultiple([
                        declaration,
                        utils_1.default.exportExpr(declaration.id.name)
                    ]);
                    break;
                case '{}':
                    astPath.replaceWithMultiple(astPath.node.specifiers.map(function (el) {
                        return utils_1.default.exportExpr(el.local.name);
                    }));
                    break;
            }
        }
    },
    ThisExpression: {
        exit(astPath, state) {
            let modules = utils_1.default.getAnu(state);
            if (modules.walkingMethod == 'constructor') {
                var expression = astPath.parentPath.parentPath;
                if (expression.type === 'AssignmentExpression') {
                    var right = expression.node.right;
                    if (!t.isObjectExpression(right)) {
                        return;
                    }
                    var propertyName = astPath.container.property.name;
                    if (propertyName === 'config' && !modules.configIsReady) {
                        transformConfig_1.default(modules, expression, buildType);
                        var staticConfig = template_1.default(`${modules.className}.config = %%CONFIGS%%;`, {
                            syntacticPlaceholders: true
                        })({
                            CONFIGS: right
                        });
                        var classAstPath = expression.findParent(function (parent) {
                            return parent.type === 'ClassDeclaration';
                        });
                        classAstPath.insertAfter(staticConfig);
                        expression.remove();
                    }
                    if (propertyName === 'globalData') {
                        if (modules.componentType === 'App') {
                            var properties = right.properties;
                            var hasBuildType = properties.some(function (el) {
                                return el.key.name === 'buildType';
                            });
                            if (!hasBuildType) {
                                properties.push(t.objectProperty(t.identifier('buildType'), t.stringLiteral(buildType)));
                                if (buildType === 'quick') {
                                    properties.push(t.objectProperty(t.identifier('__quickQuery'), t.objectExpression([])));
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    MemberExpression(astPath, state) {
        if (astPath.parentPath.type === 'AssignmentExpression') {
            let modules = utils_1.default.getAnu(state);
            if (!modules.configIsReady &&
                astPath.node.object.name === modules.className &&
                astPath.node.property.name === 'config') {
                transformConfig_1.default(modules, astPath.parentPath, buildType);
            }
        }
    },
    CallExpression: {
        enter(astPath, state) {
            let node = astPath.node;
            let args = node.arguments;
            let callee = node.callee;
            let modules = utils_1.default.getAnu(state);
            if (modules.walkingMethod == 'constructor') {
                if (callee.type === 'Super') {
                    astPath.remove();
                    return;
                }
            }
            if (modules.componentType == 'App' &&
                buildType == 'quick' &&
                callee.type === 'Identifier' &&
                callee.name === 'App') {
                callee.name = 'React.registerApp';
                if (needRegisterApp) {
                    node.arguments.push(t.booleanLiteral(true));
                }
                return;
            }
            if (utils_1.default.isLoopMap(astPath)) {
                if (!args[1] && args[0].type === 'FunctionExpression') {
                    args[1] = t.identifier('this');
                }
                let params = args[0].params;
                if (!params[0]) {
                    params[0] = t.identifier('j' + astPath.node.start);
                }
                if (!params[1]) {
                    params[1] = t.identifier('i' + astPath.node.start);
                }
                var indexName = args[0].params[1].name;
                if (modules.indexArr) {
                    modules.indexArr.push(indexName);
                }
                else {
                    modules.indexArr = [indexName];
                }
                modules.indexName = indexName;
            }
        },
        exit(astPath, state) {
            let modules = utils_1.default.getAnu(state);
            if (utils_1.default.isLoopMap(astPath)) {
                var indexArr = modules.indexArr;
                if (indexArr) {
                    indexArr.pop();
                    if (!indexArr.length) {
                        delete modules.indexArr;
                        modules.indexName = null;
                    }
                    else {
                        modules.indexName = indexArr[indexArr.length - 1];
                    }
                }
            }
        }
    },
    JSXElement(astPath) {
        let node = astPath.node;
        let nodeName = utils_1.default.getNodeName(node);
        if (buildType == 'quick' && !node.closingElement) {
            node.openingElement.selfClosing = false;
            node.closingElement = t.jsxClosingElement(t.jsxIdentifier(nodeName));
        }
    },
    JSXOpeningElement: {
        enter: function (astPath, state) {
            let nodeName = astPath.node.name.name;
            if (buildType === 'quick') {
                ignorePrevAttri(astPath, nodeName);
            }
            if (nodeName === 'span' && buildType === 'quick') {
                let p = astPath.parentPath.findParent(function (parent) {
                    return parent.type === 'JSXElement';
                });
                let parentTagName = p && utils_1.default.getNodeName(p.node);
                if (parentTagName === 'text' || parentTagName === 'a') {
                    return;
                }
            }
            if (buildType !== 'quick' && nodeName === 'text') {
                var children = astPath.parentPath.node.children;
                if (children.length === 1) {
                    let iconValue = t.isJSXText(children[0]) ? children[0].extra.raw : '';
                    let iconReg = /\s*&#x/i;
                    if (iconReg.test(iconValue)) {
                        children.length = 0;
                    }
                }
            }
            let modules = utils_1.default.getAnu(state);
            nodeName = helpers.nodeName(astPath, modules) || nodeName;
            if (buildType === 'wx' && config_1.default.pluginTags && config_1.default.pluginTags[nodeName]) {
                modules.usedComponents[nodeName] = config_1.default.pluginTags[nodeName];
                return;
            }
            let bag = modules.importComponents[nodeName];
            if (!bag) {
                var oldName = nodeName;
                nodeName = helpers.nodeName(astPath, modules) || oldName;
                if (oldName !== oldName) {
                    bag = modules.importComponents[nodeName];
                }
            }
            if (buildType === 'quick') {
                ignoreAttri(astPath, nodeName);
            }
            if (bag) {
                try {
                    if (bag.source !== 'schnee-ui')
                        modules.extraModules.push(bag.source);
                    bag.astPath.remove();
                    bag.astPath = null;
                }
                catch (err) {
                }
                let useComponentsPath = calculateComponentsPath_1.default(bag);
                modules.usedComponents['anu-' + nodeName.toLowerCase()] = useComponentsPath;
                astPath.node.name.name = 'React.useComponent';
                var attrs = astPath.node.attributes;
                modules.is && modules.is.push(nodeName);
                attrs.push(t.jsxAttribute(t.jsxIdentifier('is'), t.jsxExpressionContainer(t.stringLiteral(nodeName))));
                attrs.push(utils_1.default.createAttribute('data-instance-uid', utils_1.default.createDynamicAttributeValue('i', astPath, modules.indexArr || ['0'])));
            }
            else {
                if (nodeName != 'React.useComponent') {
                    helpers.nodeName(astPath, modules);
                }
            }
        }
    },
    JSXClosingElement: function (astPath) {
        var tagName = utils_1.default.getNodeName(astPath.parentPath.node);
        astPath.node.name.name = tagName;
    },
    JSXAttribute: {
        enter: function (astPath, state) {
            let attrName = astPath.node.name.name;
            let attrValue = astPath.node.value;
            let parentPath = astPath.parentPath;
            let modules = utils_1.default.getAnu(state);
            if (t.isStringLiteral(attrValue)) {
                let srcValue = attrValue && attrValue.value;
                if (attrName === 'src' && /^(@assets)/.test(srcValue)) {
                    let realAssetsPath = path.join(process.cwd(), 'source', srcValue.replace(/@/, ''));
                    let relativePath = path.relative(path.dirname(modules.sourcePath), realAssetsPath);
                    astPath.node.value.value = relativePath;
                }
                if (attrName === 'open-type' && srcValue === 'getUserInfo' && buildType == 'ali') {
                    astPath.node.value.value = "getAuthorize";
                    let attrs = parentPath.node.attributes;
                    attrs.push(utils_1.default.createAttribute('scope', t.stringLiteral('userInfo')));
                }
                if (attrName === 'style' && buildType == 'quick') {
                    let value = quickhuaweiStyle(attrValue, true);
                    astPath.node.value = t.stringLiteral(value.slice(1, -1));
                }
            }
            else if (t.isJSXExpressionContainer(attrValue)) {
                let attrs = parentPath.node.attributes;
                let expr = attrValue.expression;
                let nodeName = parentPath.node.name.name;
                if (attrName === 'style') {
                    var styleType = expr.type;
                    var MemberExpression = styleType === 'MemberExpression';
                    var isIdentifier = styleType === 'Identifier';
                    if (isIdentifier ||
                        MemberExpression ||
                        styleType === 'ObjectExpression') {
                        var ii = modules.indexArr ?
                            modules.indexArr.join('+\'-\'+') :
                            '';
                        var styleRandName = `'style${utils_1.default.createUUID(astPath)}'` +
                            (ii ? ' +' + ii : '');
                        var styleName = isIdentifier ?
                            expr.name :
                            generator_1.default(expr).code;
                        attrs.push(utils_1.default.createAttribute('style', t.jsxExpressionContainer(t.identifier(`React.toStyle(${styleName}, this.props, ${styleRandName})`))));
                        astPath.remove();
                    }
                }
                else if (attrName == 'hidden') {
                    if (buildType === 'quick') {
                        astPath.node.name.name = 'show';
                        attrValue.expression = t.unaryExpression('!', expr, true);
                    }
                }
                else if (/^(?:on|catch)[A-Z]/.test(attrName) &&
                    !/[A-Z]/.test(nodeName)) {
                    var prefix = attrName.charAt(0) == 'o' ? 'on' : 'catch';
                    var eventName = attrName.replace(prefix, '');
                    var otherEventName = utils_1.default.getEventName(eventName, nodeName, buildType);
                    if (otherEventName !== eventName) {
                        astPath.node.name.name = prefix + otherEventName;
                        eventName = otherEventName;
                    }
                    var name = `data-${eventName.toLowerCase()}-uid`;
                    attrs.push(utils_1.default.createAttribute(name, utils_1.default.createDynamicAttributeValue('e', astPath, modules.indexArr)));
                    if (!attrs.setClassCode &&
                        !attrs.some(function (el) {
                            return el.name.name == 'data-beacon-uid';
                        })) {
                        attrs.push(utils_1.default.createAttribute('data-beacon-uid', 'default'));
                    }
                    attrs.setClassCode = true;
                }
            }
        }
    },
    JSXText(astPath) {
        if (astPath.parentPath.type == 'JSXElement') {
            var textNode = astPath.node;
            var value = textNode.extra.raw = textNode.extra.rawValue.trim();
            if (value === '') {
                astPath.remove();
                return;
            }
            var parentTagName = utils_1.default.getNodeName(astPath.parentPath.node);
            if (/quick|wx/.test(config_1.default.buildType) &&
                inlineElement[parentTagName]) {
                textNode.value = value;
            }
        }
    },
    JSXExpressionContainer(astPath) {
        var expr = astPath.node.expression;
        if (expr && expr.type == 'JSXEmptyExpression') {
            if (expr.innerComments && expr.innerComments.length) {
                astPath.remove();
            }
        }
    }
};
exports.default = visitor;
module.exports = visitor;
