/*
 * @Author: hibad 
 * @Date: 2018-06-24 10:37:08 
 * @Last Modified by:   hibad 
 * @Last Modified time: 2018-06-24 10:37:08 
 */
// http://web.jobbole.com/91277/
const traverse = require('babel-traverse').default
const generate = require('babel-generator').default
const babel = require('babel-core')
const t = require('babel-types');
const transformPlugin = require('./plugin');
const sharedState = require('./sharedState');
//const parseCode = require('./plugin/utils').parseCode;

function transform(code, sourcePath) {
  let output = {
    wxml:'',
    wxss:'',
    js:'',
    json:'',
    type:''//App||page||component
  }
  sharedState.sourcePath = sourcePath;
  const result = babel.transform(code, {
    babelrc: false,
    plugins: [
      'syntax-jsx', 
    //  "transform-react-jsx",
      'transform-decorators-legacy',
      'transform-object-rest-spread',  
      transformPlugin, 
    ]
  })
  // tranform后, 结果都会写入sharedState.output
  output = sharedState.output;
  output.js = result.code;
  sharedState.reset();

  return output;
}

module.exports = {
  transform
 // parseCode
}