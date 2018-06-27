/*
 * @Author: hibad 
 * @Date: 2018-06-24 10:36:14 
 * @Last Modified by: hibad
 * @Last Modified time: 2018-06-24 23:59:51
 * @Description: 
 */

const sharedState = require("../sharedState");
const t = require("babel-types");
const generate = require("babel-generator").default;


/**
 * 收集constructor state. 
 * 需要考虑的情况包括 this.state = {xxx:yyy} this.state.zzz= aaa 
 * @param {ExpressionStatement} expression  括号部分(this.state) = xxx
 */
module.exports = function state2data (expression) {
  if (!t.isExpressionStatement(expression)){
    throw new Error('传入参数不正确, 请传入ExpressionStatement');
  } 
console.log(expression)
  /**
   * identifier (this.state = {}) or memberexpression (this.state.xxx = yyy) 
   * property太多变了,可能是identifier又可能是MemberExpression的嵌套,不如用generate
   */
  const property = expression.expression.left.property;
  const code = generate(expression).code;

  if(code.startsWith('this.state')) {
    if(!sharedState.compiled.data) {
      sharedState.compiled.data = _initDataProperty(expression);
    } else {
      const stack = []
      _memberIterator(expression.expression.left, stack);
      _walkData2Insert(expression, stack, sharedState.compiled.data.value.properties, 0);
      console.log(generate(sharedState.compiled.data).code)
      // sharedState.compiled.data = t.objectProperty(
      //   t.identifier(property.name),
      //   expression.expression.right
      // )
    }
  }
}

function _walkData2Insert(originExpression, stack, properties, index) {
  for(const property of properties){
    if(t.isObjectExpression(property.value) && stack.length - 2 === index){
      if(property.value.properties.length === 0) {  // 如this.state.name.a = {} 但未定义b
        property.value.properties.push(
          t.objectProperty(t.identifier(stack[index+1].property.name), originExpression.expression.right)
        );
      }
    } else if(property.key.name === stack[index].property.name){
      _walkData2Insert(originExpression, stack, property.value.properties, ++index);
    }
  }
}

/**
 * memberexpression.left.object => memberexpression || identifier =>
 * @param {*} memberExpression 
 */
function _memberIterator(memberExpression, stack) {
  if (t.isThisExpression(memberExpression.object)) {
    return;
  } else { //member expression
    stack.unshift(memberExpression);
    _memberIterator(memberExpression.object, stack);
  }
} 

function _initDataProperty(expression){
  return t.objectProperty(
    t.identifier('data'),
    expression.expression.right
  );
}
