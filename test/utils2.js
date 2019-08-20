let babel = require('babel-core');

let queue = require('../packages/cli/packages/queue');
let config = require('../packages/cli/packages/config');
let mergeUx = require('../packages/cli/packages/quickHelpers/mergeUx');
let quickFiles = require('../packages/cli/packages/quickFiles');
let path = require('path');

function baseCode(code) {
  return `
    class P extends React.Component {
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

function transform(code, buildType) {
  return new Promise(async (resolve, reject) => {
    code = baseCode(code);
    config['buildType'] = checkBuildType(buildType);
    let id = '';
    if (buildType == 'quick') {
      id = path.join(process.cwd(), 'source', 'a.js');
      quickFiles[id] = {};
    }

    let result = babel.transform(code, {
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
            visitor: require('../packages/cli/packages/babelPlugins/miniappVisitor'),
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
              modules.sourcePath = id;
            }
          };
        }
      ]
    });

    result.code = '';

    if (buildType === 'quick') {
      let queueData = {
        code: await mergeUx({
          sourcePath: id,
          result: result
        })
      };
      queue.push(queueData);
    }

    resolve(1);
  });
}

//获取xml 数据
async function getXml(code, buildType) {
  await transform(code, buildType);

  return new Promise((resolve, reject) => {
    while (queue.length) {
      let { code, type } = queue.shift();
      // console.log('code', code)
      if (!type) {
        resolve(code);
      }

      resolve('');
    }
    resolve('');
  });

}

let code = `return (
 <input type="idcard"/>
)`;

// 定义执行平台

// console.log('======',config.buildType)
// transform();

// getXml(code, 'wx').then((res) => {
//   console.log('res',res)
// });

//  function aaa() {
//    getXml(code, 'wx').then(res => {
//      console.log(res)
//      return res
//   })
 
// }

// console.log(aaa());

async function demo() {
  let result = await getXml(code, 'quick');
  console.log(result);
  return result
}
// console.log(demo());
demo()


// console.log('1=====',getXml());
// console.log('2=====',getXml());
