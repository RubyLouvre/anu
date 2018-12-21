let babel = require('babel-core');
let queue = require('../../packages/queue');
let config = require('../../packages/config');

function baseCode(code) {
  return `
    class P extends React.Component {
      constructor(props) {
        super(props);
        this.state = {}
      }
      render() {
       ${code}
      }
    }
    export default P;

    `;
}

function checkBuildType(type) {
  let value = /^(wx|bu|ali|quick|tt)$/gi.test(type);
  if (value) {
    return type;
  }
  return 'wx';
}

exports.transform = function(code, buildType) {
  code = baseCode(code);
  config['buildType'] = checkBuildType(buildType);
  babel.transform(code, {
    babelrc: false,
    comments: false,
    plugins: [
      require('babel-plugin-syntax-jsx'),
      require('babel-plugin-transform-decorators-legacy').default,
      require('babel-plugin-transform-object-rest-spread'),
      require('babel-plugin-transform-es2015-template-literals'),
      require('babel-plugin-transform-async-to-generator'),

      () => {
        return {
          visitor: require('../../packages/babelPlugins/miniappVisitor'),
          manipulateOptions(opts) {
            //解析每个文件前执行一次
            var modules = (opts.anu = {
              thisMethods: [],
              staticMethods: [],
              thisProperties: [],
              config: {}, //用于生成对象
              importComponents: {}, //import xxx form path进来的组件
              usedComponents: {}, //在<wxml/>中使用<import src="path">的组件
              customComponents: [] //定义在page.json中usingComponents对象的自定义组件
            });
            modules.sourcePath = '';
            console.log(config.buildType);
          }
        };
      }
    ]
  });
};

// 获取xml 数据
exports.getXml = function() {
  while (queue.length) {
    let { code, path, type } = queue.shift();

    if (!type) {
      
      return code;
    }

    return '';
  }
};
