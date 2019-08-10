/* eslint no-console: 0 */
import generate from '@babel/generator';
import * as t from '@babel/types';
import chalk from 'chalk';
import { transform, NodePath, PluginObj } from '@babel/core';
import utils from '../utils';
import config from '../../config/config';
import beautify from 'js-beautify';
//const he = require('he');//转义库
const buildType = config.buildType;
const helper = config[buildType].helpers
const attrNameHelper = require(`../${helper}/attrName`);
const attrValueHelper = require(`../${helper}/attrValue`);
const logicHelper = require(`../${helper}/logic`);

function beautifyXml(code: string){
    return beautify.html(code, {
        indent: 4
    } as any);
}
const rcomponentName = /^[A-Z].+/ //必须大写开头
const quickTextContainer: {
    [props: string]: number
} = {
    text: 1,
    a: 1,
    span: 1,
    label: 1,
    option: 1
};
/**
 * 必须符合babel-transfrom-xxx的格式，使用declare声明
 */

function wxml(code: string, modules: any) {
    let result = transform(code, {
        configFile: false,
        comments: false,
        babelrc: false,
        plugins: [
            require('@babel/plugin-syntax-jsx'),
            function wxmlPlugin(): PluginObj {
                return {
                    visitor: visitor,
                    manipulateOptions(opts) {
                        //解析每个文件前执行一次
                        opts.anu = modules;
                    }
                };
            }
        ]
    });
    var text = result.code.replace(/\\?(?:\\u)([\da-f]{4})/gi, function(a, b) {
       return unescape(`%u${b}`);
    });
    return beautifyXml(text).trim();
}

let visitor = {
    CallExpression:{
        exit: function(astPath: NodePath<t.CallExpression>, state: any){
            var callee = astPath.node.callee;
            let modules = utils.getAnu(state);
            if(modules.isInAttribute){
               if(!modules.isInTag){
                    return
                }
               if( modules.isInAttribute == 'style'|| /^(on|catch|style)/.test(modules.isInAttribute)){
                   return
               }
               console.warn(chalk.red("请不要在JSX中的 "+modules.isInAttribute," 属性中调用函数 "+ generate(astPath.node).code+"\n\n"));
               return

            }
            if(callee.type === 'MemberExpression' && callee.property.name === 'map'){
               //这是map循环
            }else{
                console.log(chalk.red("请不要在JSX中调用函数 " + generate(astPath.node).code +"\n\n"))
            }
       }
       
    },
    JSXOpeningElement: {
        enter: function(astPath: NodePath<t.JSXOpeningElement>, state: any) {
            let modules = utils.getAnu(state);
            modules.isInTag = (astPath.node.name as t.JSXIdentifier).name ;
        },
        exit: function(astPath: NodePath<t.JSXOpeningElement>, state: any) {
            let modules = utils.getAnu(state);
          //  modules.isInTag = astPath.node.name.name ;
            modules.isInTag = false
            let openTag = astPath.node.name, 
                newTagName: boolean | string = false, 
                attributes: any = [],
                childNodes = (astPath.parentPath.node as any).children;
            if ( openTag.type === 'JSXMemberExpression' ) {
                if ((openTag.object as t.JSXIdentifier).name === 'React' && openTag.property.name === 'useComponent') {
                    let instanceUid;
                    astPath.node.attributes.forEach(function(el: t.JSXAttribute) {
                        let attrName = el.name.name;
                        if (!el.value) {
                            //如果用户只写属性名，不写属性值，默认为true
                            el.value = {
                                type: 'StringLiteral',
                                value: '{{true}}',
                                trailingComments: [],
                                leadingComments: [],
                                innerComments: []
                            } as any;
                        }
                        let attrValue = (el.value as any).value; //这里要重构
                        if (/^\{\{.+\}\}/.test(attrValue)) {
                            attrValue = attrValue.slice(2, -2);
                        }

                        if (attrName === 'is') {
                            newTagName = 'anu-' + attrValue.slice(1, -1).toLowerCase();
                        }
                        if (attrName === 'data-instance-uid') {
                            instanceUid = attrValue;
                            attributes.push(utils.createAttribute('data-instance-uid', `{{${instanceUid}}}`));
                        }
                    });
                    //将组件变成template标签
                }else{
                    //将<GlobalTheme.Provider />, <React.Fragment /> 变成<block/>
                    newTagName = 'block';
                    //将组件变成template标签
                }
            } else if(openTag.type === 'JSXIdentifier' && rcomponentName.test(openTag.name) ){
                 //将<Login /> 变成<block/>
                newTagName = 'block';
            }
            if(newTagName){
                let container = utils.createElement(newTagName, attributes, childNodes);
                astPath.parentPath.replaceWith(container);
            }
        }
    },
    JSXAttribute:{
        enter: function (astPath: NodePath<t.JSXAttribute>, state: any) {
            let attrName = astPath.node.name.name;
            let attrValue: any = astPath.node.value;
            let modules = utils.getAnu(state);
            modules.isInAttribute = attrName
            if (attrName === 'key') {
                let value;

                if (t.isStringLiteral(attrValue)) {
                    value = attrValue.value;
                } else {
                    value = generate(attrValue.expression).code;
                    if ((buildType === 'qq' || buildType === 'wx') && value.indexOf('+') > 0) {
                        var fixKey = value.replace(/\+.+/, '').trim();
                        console.log(chalk.cyan(`微信/QQ小程序的key不支持加号表达式${value}-->${fixKey}`));
                        value = fixKey;
                    }
                }
                //冒泡找到最近的一个map调用函数，找到其中的callee(如：xxx.map)作为键值对储存jsx key属性的值。
                var CallExpression = astPath.findParent(t.isCallExpression);
                if (CallExpression) {
                    var callee = (CallExpression.node as t.CallExpression).callee;
                    modules.key = modules.key || {};
                    //this.state.xxx.map
                    let calleeCode = generate(callee).code;
                    modules.key[calleeCode] = value;
                    astPath.remove();
                }
                return;
            }
            attrNameHelper(astPath, attrName, (astPath.parentPath.node as any).name.name);
        },
        exit: function (astPath: NodePath<t.JSXAttribute>, state: any) {
            let modules = utils.getAnu(state);
            modules.isInAttribute = false;
        },
    },
    JSXText: {
        exit(astPath: NodePath<t.JSXText>) {
            if (buildType == 'quick') {
                let textNode = astPath.node, children, parentTag;
                let hasBlockTag = false;
                //快应用文本节点必须放在特定标签的问题
                // 情况1. <div><span>xxx</span></div>  --> <div><text>xxx</text></div>
                // 情况2. <div><strong>xxx</strong></div>  --> <div><text>xxx</text></div>
                // 情况3. <div><b>xxx</b></div>  --> <div><text>xxx</text></div>
                // 情况4. <div><s>xxx</s></div>  --> <div><text>xxx</text></div>
                // 1~4是将除a, option, label外的内联元素全部变成text标签
                // 情况5. <div>yyy</div>  --> <div><text>yyy</text></div>
                // 块状元素下直接放文本，需要插入一个text标签
                // 情况6. <div><span><block if="true">yyy</block></span></div>  --> 
                //    <div><text><block if="true"><span>yyy</span></block></text></div>
                // if for指令所在的block标签下的文本需要包一个span标签
                while (astPath.parentPath){
                    let parentNode: any = astPath.parentPath.node;
                    if (!children){
                        children = parentNode.children;
                    }
                    if (!parentNode.openingElement){
                        astPath = astPath.parentPath as any;
                        continue;
                    }
                    parentTag = parentNode.openingElement.name.name;
                    if (parentTag === 'block'){
                        astPath = astPath.parentPath as any;
                        hasBlockTag = true;
                    } else {
                        break;
                    }
                }
                //如果文本节点的父节点不是text, a, option, span并且不是组件, 我们在外面生成一个text
                if (hasBlockTag || !quickTextContainer[parentTag] && !/^anu-/.test(parentTag)) {
                    let index = children.indexOf(textNode);
                    let trimValue = textNode.value.trim();
                    if (trimValue == '') {
                        children.splice(index, 1);
                    } else {
                        textNode.value = trimValue;
                        children.splice(index, 1, utils.createElement(hasBlockTag ? 'span' : 'text', [], [textNode]));
                    }
                }
            }
        }
    },
    JSXExpressionContainer: {
        exit(astPath: any, state: any) {
            let expr = astPath.node.expression;

        
            //如果是位于属性中
            if (t.isJSXAttribute(astPath.parent)) {
                attrValueHelper(astPath);
                // "{{variable + \"a\"}}"语法会报错 需将字符串双引号转为单引号"{{variable + 'a'}}"
                if (astPath.node.type === 'StringLiteral') {
                    astPath.node.value = astPath.node.value.replace(/"/g, "'");
                }
            } else if (
                expr.type === 'MemberExpression' &&
        /props\.children\s*$/.test(generate(expr).code)
            ) {
                
                let attributes: any = [];
                let template = utils.createElement('slot', attributes, []);
                astPath.replaceWith(template);
            } else {
               
                let modules = utils.getAnu(state);
                
                //返回block元素或template元素
                let isWrapText = false;
                if (astPath.parentPath.type === 'JSXElement'){
                    let tag = astPath.parentPath.node.openingElement;
                    let tagName = tag && tag.name && tag.name.name;
                    //对<text>{aaa ? 111: 2}</text>的情况进行优化，不插入block标签
                    //只是将单花括号变成双花括号
                    if (tagName === 'text' || tagName === 'span'){
                        if (t.isConditionalExpression(expr) || t.isLogicalExpression(expr)) {
                            var hasTag = /<[^>]+>/.test( generate(expr).code);
                            isWrapText = !hasTag;
                        } 
                    }
                }
                
               
                let block = logicHelper(expr, modules, isWrapText);

                try {
                    astPath.replaceWithMultiple(block);
                } catch (e) {
                    //快应用将文本节点包一层text，可能在这里引发BUG
                    astPath.replaceWith(block[0]);
                }
            }
        }
    }
};
module.exports = wxml;

