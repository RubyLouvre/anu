let babel = require('babel-core');
let jsTransform = require('../packages/cli/packages/translator/jsTransform');
let helpers = require('../packages/cli/packages/translator/helpers');
let q = require('../packages/cli/packages/translator/queue')

function baseCode(code) {
  return `
    const array = [{ list: [] }]
    class Index extends React.Component {
      constructor(props) {
        super(props);
      }
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



function transform (code) {

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


transform(`return (
    <div>{Array.from({length: 9}).map(function(e, i) {
      return (
        Array.from({length: 9}).length > 1 ? null :
        <div
          key={i}
          className="ratio-16-9 image-company-album"
        >
          loop1: {i}
        </div>
      )
    })}</div>
  )`)

  console.log(q.wxml[0].code)
