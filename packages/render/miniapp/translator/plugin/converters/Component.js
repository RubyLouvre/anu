/*
 * @Author: hibad 
 * @Date: 2018-06-24 10:36:14 
 * @Last Modified by: hibad
 * @Last Modified time: 2018-06-24 23:59:51
 * @Description: 
 */

const sharedState = require("../sharedState");
const t = require("@babel/types");

/**
 *
 * @param {*} node path.node
 */
function convertComponent(node) {
  const methods = sharedState.compiled.methods;
  const data = sharedState.compiled.data;

  const call = t.expressionStatement(
    t.callExpression(t.identifier(sharedState.output.type), [
      t.objectExpression(data),
      t.objectExpression(methods)
    ])
  );
}

/**
 *
 * @param {MemberExpression} expression  括号部分(this.state) = xxx
 */
function dataHandler(expression) {
  /*
  if (!t.isMemberExpression(expression)) throw new Error('传入参数不正确, 请传入MemberExpression');
  if(
    t.isThisExpression(expression.object) 
    && t.isIdentifier(expression.property) 
    && expression.property.name == state
  ) {
    
  }
  */
}

module.exports = {
  convertComponent,
  dataHandler
};
