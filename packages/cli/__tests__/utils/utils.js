let babel = require('babel-core');
let jsTransform = require('../../packages/translator/jsTransform');
let helpers = require('../../packages/translator/helpers');
// let React = require('../../../../dist')
function baseCode(code, classMethod='', head='') {
  return `
    ${head}
    import React from '@react'
    class Index extends React.Component {
      constructor(props) {
        super(props);
      }
      ${classMethod}
      config = {
        navigationBarTextStyle: '#fff',
        navigationBarBackgroundColor: '#0088a4',
        navigationBarTitleText: 'Demo',
        backgroundColor: '#eeeeee',
        backgroundTextStyle: 'light'
      };
      render() {
       ${code}
      }
    }
    React.createPage(Index, 'pages/index/index', {});
    `;
}



exports.transform = function(code, classMethod, head) {

  code = baseCode(code, classMethod, head);
  var result = babel.transform(code, {
    babelrc: false,
    plugins: [
      'syntax-jsx',
      'transform-decorators-legacy',
      'transform-object-rest-spread',
      jsTransform.miniappPlugin
    ]
  });

  return helpers.moduleToCjs.byCode(result.code).code;
}

exports.evalClass = function(template) {
    return eval(template);
}

exports.getPropsStyle = function (props) {
    for(let key in props) {
        if(/^style\d{8}$/.test(key)) {
            return props[key]
        }
    }
}

