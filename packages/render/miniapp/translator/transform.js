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
let modules = require('./modules');
//const parseCode = require('./plugin/utils').parseCode;

function transform(code, sourcePath) {
  let output = {
    wxml:'',
    wxss:'',
    js:'',
    json:'',
    type:''//App||page||component
  }
  modules.current = sourcePath.replace(process.cwd(),"")
  var ret = modules[modules.current] = {
    useComponents: {}
  }
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
  ret.js = result.code;
  modules.reset();
  return ret;
}

module.exports = transform