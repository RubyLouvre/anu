"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const R = __importStar(require("ramda"));
const t = __importStar(require("@babel/types"));
const webComponentsMap = {
    text: 'span',
    view: 'div',
    stack: 'div',
    block: 'div',
    'web-view': 'iframe'
};
const nativeComponentsMap = {
    button: 'Button',
    checkbox: 'Checkbox',
    icon: 'Icon',
    progress: 'Progress',
    radio: 'Radio',
    switch: 'Switch',
    'checkbox-group': 'CheckboxGroup',
    label: 'Label',
    picker: 'Picker',
    'radio-group': 'RadioGroup'
};
const internalComponentsMap = {
    image: 'Image',
    slider: 'Slider',
    textarea: 'Textarea',
    swiper: 'Swiper',
    'swiper-item': 'SwiperItem',
    'rich-text': 'RichText',
    'scroll-view': 'ScrollView',
    audio: 'Audio',
};
const componentsNameMap = Object.assign(Object.assign(Object.assign({}, webComponentsMap), nativeComponentsMap), internalComponentsMap);
const utils = require('../../utils/index');
const fpath = require('path');
let styleKey = '';
module.exports = function () {
    return {
        pre(state) {
            styleKey = utils.getStyleNamespace(fpath.dirname(state.opts.filename));
        },
        visitor: {
            Program: {
                exit(astPath, state) {
                    if (state.internalComponents) {
                        for (let variableName of state.internalComponents) {
                            const internalComponentName = `@internalComponents/${variableName}`;
                            astPath.node.body.unshift(t.importDeclaration([t.importDefaultSpecifier(t.identifier(variableName))], t.stringLiteral(internalComponentName)));
                        }
                    }
                    if (state.externalComponents) {
                        for (let variableName of state.externalComponents) {
                            const externalComponentName = `schnee-ui/components/X${variableName}`;
                            astPath.node.body.unshift(t.importDeclaration([t.importDefaultSpecifier(t.identifier(variableName))], t.stringLiteral(externalComponentName)));
                        }
                    }
                }
            },
            ClassMethod(path) {
                if (path.get('key').isIdentifier({
                    name: 'render'
                })) {
                    path.traverse({
                        CallExpression(fn) {
                            const callee = fn.get('callee');
                            if (callee.isMemberExpression()) {
                                const property = callee.get('property');
                                if (property.isIdentifier()) {
                                    if (property.node.name === 'map') {
                                        const args = fn.node.arguments;
                                        if (args.length < 2) {
                                            args.push(t.thisExpression());
                                        }
                                    }
                                }
                            }
                        },
                        JSXAttribute(attr) {
                            const name = attr.get('name');
                            if (name.isJSXIdentifier()) {
                                let attrName = name.node.name;
                                if (/^catch/.test(attrName)) {
                                    attrName = name.node.name = attrName.replace(/^catch/, 'on');
                                }
                                if (attrName === 'onTap') {
                                    name.node.name = 'onClick';
                                }
                            }
                        },
                        JSXElement(astPath) {
                            astPath.get('openingElement').node.attributes.push(t.jsxAttribute(t.jsxIdentifier(styleKey), null));
                        }
                    });
                }
            },
            JSXAttribute: (path) => {
                const name = path.get('name');
                const value = path.get('value');
                const remoteUrlRegex = /^https?:\/\//;
                const assetsPathRegex = /(?:@?assets)([^\s]+)/;
                const isSrcJSXIdentifier = R.always(name.isJSXIdentifier({
                    name: 'src'
                }));
                const isValueStringLiteral = (node) => t.isStringLiteral(node);
                const isStringRemoteUrl = (node) => R.test(remoteUrlRegex, node.value);
                const isStringLocal = R.compose(R.not, isStringRemoteUrl);
                const isStringStartsWithAssets = (node) => R.test(assetsPathRegex, node.value);
                const shouldReplaceAssets = R.allPass([
                    isSrcJSXIdentifier,
                    isValueStringLiteral,
                    isStringLocal,
                    isStringStartsWithAssets
                ]);
                if (shouldReplaceAssets(value.node)) {
                    const originalAssetsFilePath = value.node.value;
                    const [, replacedAssetsFilePath] = assetsPathRegex.exec(originalAssetsFilePath);
                    path
                        .get('value')
                        .replaceWith(t.jsxExpressionContainer(t.callExpression(t.identifier('require'), [
                        t.stringLiteral(`@assets${replacedAssetsFilePath}`)
                    ])));
                }
            },
            JSXOpeningElement: (path, state) => {
                const componentAttr = path.get('name');
                if (t.isJSXIdentifier(componentAttr)) {
                    const componentName = componentAttr.node.name;
                    const replaceName = componentsNameMap[componentName];
                    if (replaceName) {
                        componentAttr.node.name = replaceName;
                        if (!path.node.selfClosing) {
                            const closingElement = path.container.closingElement;
                            closingElement.name.name = replaceName;
                        }
                        const internalComponentName = internalComponentsMap[componentName];
                        if (internalComponentName) {
                            state.internalComponents = state.internalComponents || new Set();
                            state.internalComponents.add(internalComponentName);
                        }
                        const externalComponentName = nativeComponentsMap[componentName];
                        if (externalComponentName) {
                            state.externalComponents = state.externalComponents || new Set();
                            state.externalComponents.add(externalComponentName);
                        }
                    }
                }
            },
            ClassProperty(astPath) {
                if (astPath.get('key').isIdentifier({
                    name: 'config'
                }) && astPath.get('value').isObjectExpression()) {
                    if (!astPath.node.static)
                        astPath.node.static = true;
                    astPath.traverse({
                        ObjectProperty: (property) => {
                            const { key } = property.node;
                            let name;
                            if (t.isIdentifier(key))
                                name = key.name;
                            if (t.isStringLiteral(key))
                                name = key.value;
                            if (name === 'webList') {
                                property.get('key').replaceWith(t.identifier('list'));
                            }
                        }
                    });
                }
            },
            CallExpression(astPath) {
                let args = astPath.node.arguments;
                if (utils.isLoopMap(astPath)) {
                    if (!args[1] && args[0].type === 'FunctionExpression') {
                        args.push(t.thisExpression());
                    }
                }
            }
        },
        manipulateOptions(opts) {
            opts.anu = {
                pageIndex: 0,
                extraModules: [],
                queue: []
            };
        }
    };
};
