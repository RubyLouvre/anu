let babel = require('babel-core');
let jsTransform = require('../../packages/translator/jsTransform');
let helpers = require('../../packages/translator/helpers');

function baseCode(code, classMethod='', head='') {
  return `
    ${head}
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

