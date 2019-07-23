import postCss from 'postcss';
import parser from 'postcss-selector-parser';
import config from '../../config/config';
const ignoreCss = require('../quickHelpers/ignoreCss');

const postCssPluginValidateStyle = postCss.plugin('postcss-plugin-validate-style', () => {
    return (root, result) => {
        const from = result.opts.from;
        
        function removeCss(declaration: postCss.Declaration) {
            let value = declaration.value;
            let prop = declaration.prop;
            let webkitReg = /^-webkit|^-moz|^-ms/i;
            var isRemove = false;
        
            if (ignoreCss[prop] && ignoreCss[prop] === true) {
                isRemove = true;
            } else if (ignoreCss[prop] && ignoreCss[prop](value)) {
                isRemove = true;
            } else if (webkitReg.test(prop)) {
                isRemove = true;
            }
        
            if (isRemove) {
                declaration.remove();
            }
        }
        
        // function parseSelector(css) {
        //     let result = [];
        //     parser((selector) => {
        //         if (selector.nodes && selector.nodes.length) {
        //             // 遍历选择器
        //             for (var i = 0, length = selector.nodes.length; i < length; i++) {
        //                 result = result.concat(selector.nodes[i].toString().split(/\s+/));
        //             }
        //         }
        //     }).processSync(css, {
        //         lossless: false
        //     });
        //     return result;
        // }
        
        function findInvalidateRule(css: string, { 
            invalidatePseudos
         }: { invalidatePseudos: Array<string>}) {
            const selectorReg = /^tag|class|id$/;
            let find = false;
            parser((selector: any) => {
                if (selector.nodes && selector.nodes.length) {
                    // 遍历选择器
                    for (var i = 0, length = selector.nodes.length; i < length; i++) {
                        find = selector.nodes[i].nodes.some((node: parser.Node) => {
                            if (node.type === 'pseudo' && node.value.match(new RegExp(invalidatePseudos.join('|')))) {
                                // logQueue.warning.push({
                                //     id: from,
                                //     level: 'warning',
                                //     msg: `快应用不支持${invalidatePseudos.join('、')}伪类选择器`
                                // });
                                return true;
                            }
                            if (selectorReg.test(node.type)) {
                                const next = node.next();
                                if (next && selectorReg.test(next.type)) {
                                    // logQueue.warning.push({
                                    //     id: from,
                                    //     level: 'warning',
                                    //     msg: `快应用不支持${selector.toString()}选择器`
                                    // });
                                    return true;
                                }
                            }
                            return false;
                        });
                        // 如果找到非法属性，停止查找
                        if (find) {
                            return;
                        }
                    }
                }
            }).processSync(css, {
                lossless: false
            });
            return find;
        }
        
        function rpxToPx(value: string) {
            return value.replace(/(-?\d*\.?\d+)(r?px)/g, function (match, numberStr, unit) {
        
                const number = Number(numberStr.trim());
                if (unit === 'rpx') {
                    return `${number}px`;
                } else {
                    return `${number * 2}px`;
                }
            });
        }
        
        // function validateMargin(decl) {
        //     if (decl.value.indexOf('auto') !== -1) {
        //         logQueue.warning.push({
        //             id: from,
        //             level: 'warning',
        //             msg: `在快应用中无法在 margin 中使用 auto 居中，请使用 flex 布局。`
        //         });
        //     }
        // }
        
        function splitBorder(decl: postCss.Declaration) {
            if (decl.value === 'none') {
                // logQueue.warning.push({
                //     id: from,
                //     level: 'warning',
                //     msg: `快应用不支持border: none`
                // });
                decl.value = '0';
            }
            const properties = ['width', 'style', 'color'];
            let values = decl.value.replace(/(,\s+)/g, ',').trim().split(/\s+/);
            if (values) {
                if (values.length > 3) {
                    // eslint-disable-next-line
                    // logQueue.warning.push({
                    //     id: from,
                    //     level: 'warning',
                    //     msg: `${decl.prop} 参数个数错误, ${values}, 只保留前三个参数 ${values.slice(0, 3)})`
                    // });
                    values = values.slice(0, 3);
                }
                values.map((value, index) => {
                    const res: any = {};
                    let prop = decl.prop + '-' + properties[index];
                    // border-style  情况特殊
                    if (properties[index] === 'style') {
                        prop = 'border-style';
                    }
                    res[prop] = value;
                    decl.cloneBefore(postCss.decl({
                        prop,
                        value
                    }));
                });
                decl.remove();
            }
        }
        
        function generateConflictDeclarations(declName: string, conflictRegex: RegExp) {
            return (decl: postCss.Declaration) => {
                const parent = decl.parent;
                parent.each((node: any) => { // tsc todo
                    if (conflictRegex.test(node.prop)) {
                        // eslint-disable-next-line
                        // logQueue.warning.push({
                        //     id: from,
                        //     level: 'warning',
                        //     msg: `if ${declName} is set, ${node.prop} will be removed.`
                        // });
                        node.remove();
                    }
                });
            };
        }
        
        function transformBorderRadius(decl: postCss.Declaration) {
            const props = [
                'border-top-left-radius',
                'border-top-right-radius',
                'border-bottom-right-radius',
                'border-bottom-left-radius'
            ];
            const values = decl.value.replace(/(,\s+)/g, ',').trim().split(/\s+/);
            let res = values;
            if (values.length > 4) {
                // logQueue.warning.push({
                //     id: from,
                //     level: 'warning',
                //     msg: `${decl.prop} 参数个数错误, ${values}`
                // });
                return;
            }
            switch (values.length) {
                case 1:
                    res = transformSingle(values);
                    break;
                case 2:
                    res = transformDouble(values);
                    break;
                case 3:
                    res = transformTriple(values);
                    break;
                default:
                    break;
            }
            res.forEach((value, index) => {
                decl.cloneBefore(postCss.decl({
                    prop: props[index],
                    value
                }));
            });
            decl.remove();
        }
        
        function transformBackground(decl: postCss.Declaration) {
            const value = decl.value;
            if (+value == 0) {
                decl.remove();  // 不支持 background: 0
            }
            let match = [
                /^#[a-zA-Z0-9]{3,6}$/i, //16进制
                /^[a-z]{3,}$/i //语意化颜色 [ blue | green | ...]
            ];
            for (let i = 0; i < match.length; i++) {
                if (match[i].test(value)) {
                    decl.prop = 'background-color';
                    break;
                }
            }
        }
        
        function transformSingle(values: Array<string>) {
            return [values[0], values[0], values[0], values[0]];
        }
        
        function transformDouble(values: Array<string>) {
            return [values[0], values[1], values[0], values[1]];
        }
        
        function transformTriple(values: Array<string>) {
            return [values[0], values[1], values[2], values[1]];
        }
        
        const visitors: {
            [props: string]: Function
        } = {
            'border-style'(decl: postCss.Declaration) {
                const match = decl.value.match(/[a-z]+/gi);
                if (match && match.length > 1) {
                    // logQueue.warning.push({
                    //     id: from,
                    //     level: 'warning',
                    //     msg: `border-style should only have one value, got ${decl.value}, only keeps the first value ${match[0]}`
                    // });
                    decl.value = match[0];
                }
            },
            'border'(decl: postCss.Declaration) {
                if (decl.value === 'none') {
                    // logQueue.warning.push({
                    //     id: from,
                    //     level: 'warning',
                    //     msg: '快应用不支持border: none'
                    // });
                    decl.value = '0';
                }
        
            },
            'border-radius'(decl: postCss.Declaration) {
                generateConflictDeclarations(
                    'border-radius',
                    /border-(left|bottom|right|top)-(color|width)/i
                )(decl);
                transformBorderRadius(decl);
            },
            'background': (decl: postCss.Declaration) => {
                generateConflictDeclarations(
                    'background',
                    /(background|border)-color/i
                )(decl);
                transformBackground(decl);
            },
            'background-image'(decl: postCss.Declaration) {
                if (config.huawei) {
                    // 华为url()中必须有引号，否则报错，此处兼容处理
                    decl.value = decl.value.replace(/\(([^)]+)\)/, function(match, uri) {
                        uri = uri.trim();
                        if (!/^['"]/.test(uri)) {
                            uri = `("${uri}")`
                        }
                        return uri;
                    });
                }
                generateConflictDeclarations(
                    'background-image',
                    /(background|border)-color/i
                )(decl);
            },
            // margin: validateMargin,
            'border-left': splitBorder,
            'border-right': splitBorder,
            'border-bottom': splitBorder,
            'border-top': splitBorder,
            'animation': (declaration: postCss.Declaration) => {
                generateConflictDeclarations(
                    'animation',
                    /animation-(name|duration|timing-function|delay|iteration-count|direction)/i
                )(declaration);
                transformAnimation(declaration);
            }
        };
        
        let transformAnimation = (declaration: postCss.Declaration) => {
            const properties = [{
                name: 'name',
                reg: /[a-zA-Z0-9]/gi
            },
            {
                name: 'duration',
                reg: /(\d[\d\.]*)(m?s)/i
            },
            {
                name: 'timing-function',
                reg: /linear|ease|ease-in|ease-out|ease-in-out/i
            },
            {
                name: 'delay',
                reg: /(\d[\d\.]*)(m?s)/i
            },
            {
                name: 'iteration-count',
                reg: /^\d|infinite/i
            },
            {
                name: 'fill-mode',
                reg: /none|forwards/i
            }
            ];
            let decl = declaration.value.split(',')[0];   // 多个片段的animation动画的情况 quick好像不支持
            let values = decl.replace(/(,\s+)/g, ',').trim().split(/\s+/);
            let index = 0;
            for (let i = 0; i < properties.length; i++) {
                const {
                    name,
                    reg
                } = properties[i];
                const res: any = {};
                let value = values[index];
                if (!reg.test(value)) {
                    if (i === properties.length-1) {
                        i = index;
                        index++;
                    }
                    continue;
                }
                const prop = declaration.prop + '-' + name;
                value = value.replace(/^(\d+(?:\.\d+)?)s$/, (match, value) => value * 1000 + 'ms'); // 1s -> 1000ms
                res[prop] = value;
                declaration.cloneBefore(postCss.decl({
                    prop,
                    value
                }));
                index++;
            }
        
            declaration.remove();
        };

        if (config.buildType === 'quick') {
            
            root.walkAtRules(atrule => {
                if (atrule.name === 'media') {
                    atrule.params = rpxToPx(atrule.params);
                }
            });
            root.walkDecls(decl => {
                if (visitors[decl.prop]) {
                    visitors[decl.prop](decl);
                }
            });
            // 再进行一次遍历保证所有px都被正确转换
            root.walkDecls(decl => {
                decl.value = rpxToPx(decl.value);
                // 快应用不支持!important
                if (decl.important) { 
                    // logQueue.warning.push({
                    //     id: from,
                    //     level: 'warning',
                    //     msg: '快应用不支持!important'
                    // });
                    decl.important = false;
                }
            });

            // 对快应用没有用的属性进行过滤
            root.walkDecls(decl => {
                removeCss(decl);
            });
            // 快应用移除包含before、after伪类的选择器
            const invalidatePseudos = ['after', 'before', 'hover', 'first-child','active', 'last-child'];
            root.walkRules(rule => {
                const find = findInvalidateRule(rule.selector, { invalidatePseudos });
                if (find) { rule.remove(); }
            });
        }
        // root.walkRules(rule => {
        //     const selectors = parseSelector(rule.selector);
        //     const patchComponents = config[config.buildType].patchComponents || [];
        //     patchComponents.forEach(comp => {
        //         if (selectors.indexOf(comp) !== -1) {
        //             logQueue.warning.push({
        //                 id: from,
        //                 level: 'warning',
        //                 msg: `补丁组件${comp}不支持标签选择器`
        //             });
        //         }
        //     });
        // });
    };
});

module.exports = postCssPluginValidateStyle;