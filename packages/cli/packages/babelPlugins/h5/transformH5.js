const R = require('ramda');
const webComponentsMap = {
    text: 'span',
    view: 'div',
    stack: 'div',
    block: 'div',
    'web-view': 'iframe',
    'scroll-view': 'div'
};

const nativeComponentsMap = {
    button: 'Button',
    checkbox: 'Checkbox',
    icon: 'Icon',
    progress: 'Progress',
    radio: 'Radio',
    'scorll-view': 'ScorllView',
    switch: 'Switch',
    'checkbox-group': 'CheckboxGroup',
    label: 'Label',
    'radio-group': 'RadioGroup'
};

const internalComponentsMap = {
    image: 'Image',
    slider: 'Slider',
    textarea: 'Textarea',
    swiper: 'Swiper',
    'swiper-item': 'SwiperItem',
    'rich-text': 'RichText',
    audio: 'Audio',
    picker: 'Picker'
};

const componentsNameMap = {
    ...webComponentsMap,
    ...nativeComponentsMap,
    ...internalComponentsMap
};

const utils = require('../../utils/index');

module.exports = function ({ types: t }) {
    return {
        visitor: {
            Program: {
                exit(astPath, state) {
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
            ClassMethod(path) {
                if (
                    path.get('key').isIdentifier({
                        name: 'render'
                    })
                ) {
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
                                const attrName = name.node.name;
                                if (/^catch/.test(attrName)) {
                                    name.node.name = attrName.replace(/^catch/, 'on');
                                }

                                if (attrName === 'onTap') {
                                    name.node.name = 'onClick';
                                }
                            }
                        }
                    });
                }
            },
            JSXAttribute: path => {
                const name = path.get('name');
                const value = path.get('value');
                const remoteUrlRegex = /^https?:\/\//;
                const assetsPathRegex = /(?:@?assets)([^\s]+)/;

                const isSrcJSXIdentifier = R.always(
                    name.isJSXIdentifier({
                        name: 'src'
                    })
                );
                const isValueStringLiteral = (node) => t.isStringLiteral(node);
                const isStringRemoteUrl = (node) =>
                    R.test(remoteUrlRegex, node.value);
                const isStringLocal = R.compose(
                    R.not,
                    isStringRemoteUrl
                );
                const isStringStartsWithAssets = (node) =>
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
            }
        },
        manipulateOptions(opts) {
            //解析每个文件前执行一次
            opts.anu = {
                pageIndex: 0,
                extraModules: [], // 用于webpack分析依赖，将babel中删除的依赖关系暂存
                queue: []
            };
        }
    };
};
