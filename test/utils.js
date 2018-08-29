let babel = require('babel-core');
let jsTransform = require('../packages/cli/packages/translator/jsTransform');
let helpers = require('../packages/cli/packages/translator/helpers');
let q = require('../packages/cli/packages/translator/queue');

function baseCode(code) {
  return `
    import React from '@react'

    class Index extends React.Component {
      constructor(props) {
        super(props);
        this.state={
            flag: null,
            array1: [
                {
                  name: "动物1"
                },
                {
                  name: "动物2"
                },
                {
                  name: "动物3"
                }
              ]
        }
      }
     
      render() {
       ${code}
      }
    }
    React.createPage(Index, 'pages/index/index', {});
    `;
}

function transform(code) {
  code = baseCode(code);
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

function evalClass(template) {
  return eval(template);
}

//   let result = evalClass(template);
//   console.log('result',result.data);

function getPropsStyle(props) {
  for (let key in props) {
    if (/^style\d{8}$/.test(key)) {
      return key;
    }
  }
}

//   console.log(getPropsStyle(result.data.props))

let template = transform(`return (
    <div> {this.state.text || this.props.children} </div>
     )`);
console.log(q.wxml[0].code);
//   console.log('template', template)
//   let result = evalClass(template);
//   console.log('result',result.data);
