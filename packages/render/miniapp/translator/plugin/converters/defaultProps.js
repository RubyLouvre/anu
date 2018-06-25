/*
 * @Author: hibad 
 * @Date: 2018-06-24 10:37:20 
 * @Last Modified by: hibad
 * @Last Modified time: 2018-06-24 22:15:35
 * @Description: 
 */
const sharedState = require('../sharedState')
const t = require('@babel/types');
const generate = require('@babel/generator').default;

/**
	* properties的type: ：String, Number, Boolean, Object, Array, null
	* NumericLiteral: Number
	* StringLiteral: String
	* BooleanLiteral: Boolean
	* ArrayExpression: Array
	* ObjectExpression: Object
	* NullLiteral: null
	*/
const typeMap = {
	NumericLiteral: "Number",
	StringLiteral: "String",
	BooleanLiteral: "Boolean",
	ArrayExpression: "Array",
	ObjectExpression: "Object",
	NullLiteral: "null"
}

/**
 * convert defaultProps to Component Properties
 * @param {Array} properties AssignmentExpression right properties || ClassProperty's property (Array of objectProperty)
 */
module.exports = function (properties) {
  if(sharedState.output.type !== 'Component'){
    throw new Error('Only Component can use defaultProps, please check wechat miniapp doc/Component chapter for details')
	} 
	var astList = []
	properties.forEach(function(el){
		const propertyAst = t.objectProperty(
			t.identifier(el.key.name), 
			t.objectExpression([
				t.objectProperty(
					t.identifier('type'),
					t.identifier(typeMap[el.value.type])
				),
				t.objectProperty(
					t.identifier('value'),
					el.value
				),
			])
		)
		astList.push(propertyAst)
	})

	sharedState.compiled.methods.push(
		t.objectProperty(
			t.identifier('properties'), 
			t.objectPattern(astList)
		)
	)
}