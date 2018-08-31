const syntaxJSX = require('babel-plugin-syntax-jsx');
const babel = require('babel-core');
const t = require('babel-types');
const generate = require('babel-generator').default;
const attrValueHelper = require('./attrValue');
const attrNameHelper = require('./attrName');
const logicHelper = require('./logic');
const utils = require('../utils');
const chineseHelper = require('./chinese');
const slotHelper = require('./slot');

var chineseHack = chineseHelper();
/**
 * 必须符合babel-transfrom-xxx的格式，使用declare声明
 */
function wxml(code, modules) {
	var result = babel.transform(code, {
		babelrc: false,
		plugins: [
			function wxmlPlugin() {
				return {
					inherits: syntaxJSX,
					visitor: visitor,
					manipulateOptions(opts) {
						//解析每个文件前执行一次
						opts.anu = modules;
					},
				};
			},
		],
	});
	var html = result.code;
	if (chineseHack.unicodeNumber) {
		return chineseHack.recovery(html);
	}
	return html;
}
var visitor = {
	JSXOpeningElement: {
		exit: function(astPath, state) {
			var openTag = astPath.node.name;
			if (
				openTag.type === 'JSXMemberExpression' &&
				openTag.object.name === 'React' &&
				openTag.property.name === 'template'
			) {
				var modules = utils.getAnu(state);
				var array, is, key;
				astPath.node.attributes.forEach(function(el) {
					var attrName = el.name.name;
					var attrValue = el.value.value;
					if (/^\{\{.+\}\}/.test(attrValue)) {
						attrValue = attrValue.slice(2, -2);
					}
					if (attrName === 'fragmentUid') {
						slotHelper(astPath.parentPath.node.children, el.value.value, modules, wxml);
						// console.log('fragmentUid');
					} else if (attrName === 'templatedata') {
						array = attrValue;
					} else if (attrName === 'is') {
						is = attrValue;
					} else if (attrName === 'wx:key') {
						key = attrValue;
					} else if (attrName === 'key') {
						key = attrValue;
					}
				});
				var attributes = [];
				var template = utils.createElement('template', attributes, []);
				template.key = key;

				//将组件变成template标签
				if (!modules.indexName) {
					attributes.push(
						utils.createAttribute('is', is),
						utils.createAttribute('data', `{{...${dataName}}}`),
						utils.createAttribute('wx:for', `{{${array}}}`),
						utils.createAttribute('wx:for-item', 'data'),
						utils.createAttribute('wx:for-index', 'index'),
						utils.createAttribute('wx:key', '*this')
					);
				} else {
					if (modules.insideTheLoopIsComponent) {
						attributes.push(
							utils.createAttribute('is', is),
							utils.createAttribute('wx:for', `{{${array}}}`),
							utils.createAttribute('wx:for-item', modules.dataName),
							utils.createAttribute('wx:for-index', modules.indexName),
							utils.createAttribute('wx:key', (key.split(".") || ['','*this'])[1])
						);
						modules.replaceComponent = template;
					} else {
						attributes.push(
							utils.createAttribute('is', is),
							utils.createAttribute('wx:if', `{{${array}[${modules.indexName}]}}`),
							utils.createAttribute('data', `{{...${array}[${modules.indexName}]}}`)
						);
					}
				}

				astPath.parentPath.replaceWith(template);
			}
		},
	},
	CallExpression: {
		enter(astPath, state) {
			let node = astPath.node;
			let args = node.arguments;
			let callee = node.callee;
			//移除super()语句
			if (callee.type == 'MemberExpression' && callee.property.name === 'map') {
				let modules = utils.getAnu(state);
				modules.indexName = args[0].params[1].name;
				modules.dataName = args[0].params[0].name;
			}
		},
		exit(astPath, state) {
			let modules = utils.getAnu(state);
			if (modules.indexName) {
				modules.indexName = null;
			}
		},
	},
	JSXAttribute(astPath) {
		chineseHack.collect(astPath);
		if (astPath.node.name.name === 'key') {
			let node = astPath.node.value;
			let value;

			if (t.isStringLiteral(node)) {
				value = node.value;
			} else {
				if (/\./.test(node.expression.value)) {
					value = '*this';
				} else {
					value = `{{${generate(node.expression).code}}}`;
				}
			}
			astPath.parentPath.node.attributes.push(utils.createAttribute('wx:key', value));
			astPath.remove();
			return;
		}
		attrNameHelper(astPath);
	},

	JSXExpressionContainer: {
		enter() {},
		exit(astPath, state) {
			var expr = astPath.node.expression;
			if (t.isJSXAttribute(astPath.parent)) {
				attrValueHelper(astPath);
			} else if (expr.type === 'MemberExpression' && /props\.children/.test(generate(expr).code)) {
				var attributes = [];
				var template = utils.createElement('template', attributes, []);
				attributes.push(
					utils.createAttribute('is', '{{props.fragmentUid}}'),
					utils.createAttribute('data', '{{...props.fragmentData}}')
				);
				astPath.replaceWith(template);
				//  console.warn("小程序暂时不支持{this.props.children}");
			} else {
				var modules = utils.getAnu(state);
				//返回block元素或template元素
				var block = logicHelper(expr, modules);
				astPath.replaceWith(block);
				if (modules.replaceComponent) {
					astPath.replaceWith(modules.replaceComponent);
					modules.replaceComponent = false;
					return;
				}
			}
		},
	},
};
module.exports = wxml;
