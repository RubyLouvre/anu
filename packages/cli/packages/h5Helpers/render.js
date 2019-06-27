/* eslint no-console: 0 */

const generate = require('@babel/generator').default;
const t = require('@babel/types');
const babel = require('@babel/core');


/**
 * 将return后面的内容进行转换，再变成wxml
 *
 * @param {Path} astPath ast节点
 * @param {String} type 有状态组件｜无状态组件
 * @param {String} componentName 组件名
 */
const deps = [];
exports.enter = function () {};

exports.exit = function (astPath, type, componentName, modules) {
    const body = astPath.node.body.body;
    let expr;

    if (!body.length) {
        return;
    }
    for (let i = 0, n = body.length; i < n; i++) {
        expr = body[i];
        if (t.isReturnStatement(expr)) {
            break;
        }
    }

    if (t.isReturnStatement(expr)) {
        var jsx = generate(expr.argument).code;
        /**
         * [babel 6 to 7]
         * babel -> Options
         * babel7 default ast:false
         */
        var jsxAst = babel.transform(jsx, {
            configFile: false,
            comments: false,
            babelrc: false,
            plugins: [[ require('@babel/plugin-transform-react-jsx'), { pragma: 'h' }]],
            ast: true
        });

        expr.argument = jsxAst.ast.program.body[0];
        if (modules.componentType === 'Component') {
            //  wxml = `<template name="${componentName}">${wxml}</template>`;
            deps[componentName] = deps[componentName] || {
                set: new Set()
            };
        }
        //支付宝的自定义组件机制实现有问题，必须要在json.usingComponents引入了这个类
        //这个类所在的JS 文件才会加入Component全局函数，否则会报Component不存在的BUG
        //一般来说，我们在页面引入了某个组件，它肯定在json.usingComponents中，只有少数间接引入的父类没有引入
        //因此在子类的json.usingComponents添加父类名

    }
};

