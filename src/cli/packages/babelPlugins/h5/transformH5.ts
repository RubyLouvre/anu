import * as R from 'ramda';
import { NodePath, PluginObj } from '@babel/core';
import * as t from '@babel/types';
const webComponentsMap: {
    [props: string]: string;
} = {
    text: 'span',
    view: 'div',
    stack: 'div',
    block: 'div',
    'web-view': 'iframe'
};

const nativeComponentsMap: {
    [props: string]: string;
} = {
    button: 'Button',
    checkbox: 'Checkbox',
    icon: 'Icon',
    progress: 'Progress',
    radio: 'Radio',
    switch: 'Switch',
    'checkbox-group': 'CheckboxGroup',
    label: 'Label',
    'radio-group': 'RadioGroup'
};

const internalComponentsMap: {
    [props: string]: string;
} = {
    image: 'Image',
    slider: 'Slider',
    textarea: 'Textarea',
    swiper: 'Swiper',
    'swiper-item': 'SwiperItem',
    'rich-text': 'RichText',
    'scroll-view': 'ScrollView',
    audio: 'Audio',
    picker: 'Picker'
};

const componentsNameMap: {
    [props: string]: string;
} = {
    ...webComponentsMap,
    ...nativeComponentsMap,
    ...internalComponentsMap
};

const utils = require('../../utils/index');
const fpath = require('path');
let styleKey = '';

module.exports = function (): PluginObj {
    return {
        pre(state: any) {
            styleKey = utils.getStyleNamespace(fpath.dirname(state.opts.filename));
        },
        visitor: {
            Program: {
                exit(astPath: NodePath<t.Program>, state: any) {
                    if (state.internalComponents) {
                        for (let variableName of state.internalComponents) {
                            const internalComponentName = `@internalComponents/${variableName}`;
                            astPath.node.body.unshift(
                                t.importDeclaration(
                                    [t.importDefaultSpecifier(t.identifier(variableName))],
                                    t.stringLiteral(internalComponentName)
                                )
                            );
                        }
                    }
                    if (state.externalComponents) {
                        for (let variableName of state.externalComponents) {
                            const externalComponentName = `schnee-ui/components/X${variableName}`;
                            astPath.node.body.unshift(
                                t.importDeclaration(
                                    [t.importDefaultSpecifier(t.identifier(variableName))],
                                    t.stringLiteral(externalComponentName)
                                )
                            );
                        }
                    }
                }
            },
            ClassMethod(path: NodePath<t.ClassMethod>) {
                if (
                    path.get('key').isIdentifier({
                        name: 'render'
                    })
                ) {
                    path.traverse({
                        CallExpression(fn: NodePath<t.CallExpression>) {
                            const callee: NodePath<t.Expression> = fn.get('callee') as any;

                            if (callee.isMemberExpression()) {
                                const property = callee.get('property');

                                if ((property as NodePath<t.Identifier>).isIdentifier()) {
                                    if ((property as NodePath<t.Identifier>).node.name === 'map') {
                                        const args = fn.node.arguments;

                                        if (args.length < 2) {
                                            args.push(t.thisExpression());
                                        }
                                    }
                                }
                            }
                        },
                        JSXAttribute(attr: NodePath<t.JSXAttribute>) {
                            const name = attr.get('name');
                            if (name.isJSXIdentifier()) {
                                const attrName = name.node.name;
                                if (/^catch/.test(attrName)) {
                                    name.node.name = attrName.replace(/^catch/, 'on');
                                }

                                if (attrName === 'onTap') {
                                    name.node.name = 'onClick';
                                }
                            }
                        },
                        JSXElement(astPath: NodePath<t.JSXElement>) {
                            astPath.get('openingElement').node.attributes.push(t.jsxAttribute(t.jsxIdentifier(styleKey), null));
                        }
                    });
                }
            },
            JSXAttribute: (path: NodePath<t.JSXAttribute>) => {
                const name = path.get('name');
                const value: any = path.get('value');
                const remoteUrlRegex = /^https?:\/\//;
                const assetsPathRegex = /(?:@?assets)([^\s]+)/;

                const isSrcJSXIdentifier = R.always(
                    name.isJSXIdentifier({
                        name: 'src'
                    })
                );
                const isValueStringLiteral = (node: any) => t.isStringLiteral(node);
                const isStringRemoteUrl = (node: any) =>
                    R.test(remoteUrlRegex, node.value);
                const isStringLocal = R.compose(
                    R.not,
                    isStringRemoteUrl
                );
                const isStringStartsWithAssets = (node: any) =>
                    R.test(assetsPathRegex, node.value);
                const shouldReplaceAssets = R.allPass([
                    isSrcJSXIdentifier,
                    isValueStringLiteral,
                    isStringLocal,
                    isStringStartsWithAssets
                ]);

                if (shouldReplaceAssets(value.node)) {
                    const originalAssetsFilePath = value.node.value;
                    const [, replacedAssetsFilePath] = assetsPathRegex.exec(
                        originalAssetsFilePath
                    );

                    path
                        .get('value')
                        .replaceWith(
                            t.jsxExpressionContainer(
                                t.callExpression(t.identifier('require'), [
                                    t.stringLiteral(`@assets${replacedAssetsFilePath}`)
                                ])
                            )
                        );
                }
            },
            JSXOpeningElement: (path: NodePath<t.JSXOpeningElement>, state: any) => {
                const componentAttr = path.get('name');

                if (t.isJSXIdentifier(componentAttr)) {
                    const componentName = (componentAttr as NodePath<t.JSXIdentifier>).node.name;
                    const replaceName = componentsNameMap[componentName];

                    if (replaceName) {
                        (componentAttr as NodePath<t.JSXIdentifier>).node.name = replaceName;

                        if (!path.node.selfClosing) {
                            const closingElement = (path.container as any).closingElement;

                            closingElement.name.name = replaceName;
                        }
                        // 插入内部组件import语句
                        const internalComponentName = internalComponentsMap[componentName];
                        if (internalComponentName) {
                            state.internalComponents = state.internalComponents || new Set();
                            state.internalComponents.add(internalComponentName);
                        }
                        // 插入补丁组件import语句
                        const externalComponentName = nativeComponentsMap[componentName];
                        if (externalComponentName) {
                            const SCHNEE_UI = 'schnee-ui';
                            if (!utils.hasNpm(SCHNEE_UI)) {
                                utils.installer(SCHNEE_UI);
                            }
                            state.externalComponents = state.externalComponents || new Set();
                            state.externalComponents.add(externalComponentName);
                        }
                    }
                }
            },
            ClassProperty(astPath: NodePath<t.ClassProperty>) {
                if (astPath.get('key').isIdentifier({
                    name: 'config'
                }) && astPath.get('value').isObjectExpression()) {
                    if (!astPath.node.static) astPath.node.static = true;
                    astPath.traverse({
                        ObjectProperty: (property: NodePath<t.ObjectProperty>) => {
                            const { key } = property.node;
                            let name;
                            if (t.isIdentifier(key)) name = key.name;
                            if (t.isStringLiteral(key)) name = key.value;
                            if (name === 'webList') {
                                (property.get('key') as any).replaceWith(
                                    t.identifier('list')
                                );
                            }
                        }
                    });
                }
            },
            CallExpression(astPath: NodePath<t.CallExpression>) {
                let args = astPath.node.arguments;
                if (utils.isLoopMap(astPath)) {
                    //添加上第二参数
                    if (!args[1] && args[0].type === 'FunctionExpression') {
                        args.push(t.thisExpression());
                    }
                }
            }
        },
        manipulateOptions(opts: any) {
            //解析每个文件前执行一次
            opts.anu = {
                pageIndex: 0,
                extraModules: [], // 用于webpack分析依赖，将babel中删除的依赖关系暂存
                queue: []
            };
        }
    };
};
