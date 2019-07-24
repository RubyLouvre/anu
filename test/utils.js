let babel = require('babel-core');
let jsTransform = require('../packages/cli/packages/translator/jsTransform');
let helpers = require('../packages/cli/packages/translator/helpers');
let q = require('../packages/cli/packages/translator/queue');
// let react = require('../dist/ReactWXTest')

function baseCode(code) {
  return `
    import React from '../dist/ReactWXTest'

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
              ],
              
            array: [{ list: [1,2,3] }],
            b1: true,
            b2: true,
            b3: true,
            b4: true
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
  console.log('code', code)
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
  //   return testObject
}

//   let result = evalClass(template);
//   console.log('result',result.data);

function getPropsStyle(props) {
  let styles = [];
  for (let key in props) {
    if (/^style\d{2,}/.test(key)) {
      styles.push(props[key]);
    }
  }

  return styles
}

//   console.log(getPropsStyle(result.data.props))

let template = transform(`return (
    <div>
    {this.state.array.map( (item) => {
      return (
        this.state.b1 && <div></div>
      );
    })}
  </div>
  )`);
// console.log(q.wxml[0].code);
console.log('template', template)
// let result = evalClass(template);
// console.log('result', result);

// console.log(getPropsStyle(result.data.props));
