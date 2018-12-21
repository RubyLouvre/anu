let babel = require('babel-core');

let queue = require('../packages/cli/packages/queue');
let config = require('../packages/cli/packages/config');

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
  if(value) {
    return type
  }
  return 'wx';
}

function transform(code, buildType, cb) {
  code = baseCode(code);
  config['buildType'] = checkBuildType(buildType);
  console.log('type', config.buildType)
  let p = '../packages/cli/packages/babelPlugins/miniappVisitor';
  // 清缓存
  delete require.cache[require.resolve(p)];
  let s = require(p);
  babel.transform(
    code,
    {
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
            visitor: s,
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
              
            }

          };
        }
      ]
    },
   
  );
  cb && cb()
}

// 获取xml 数据
// function getXml() {
//   console.log('queue', queue)
//   while(queue.length) {
//     let {code, path, type } = queue.shift();
//     // console.log('code', code)
//     if(!type) {
//       return code
//     } 

//     return ''
//   }
// }

let code = `return (
  <View>{this.state.array.map(function(item) {
    return <CoverView>{item.list.map(function(item2) {return <Text>{item2}</Text>})}</CoverView>
  })}</View>
)`;

// 定义执行平台

// console.log('======',config.buildType)
// transform(code, 'wx', ()=>{
//   console.log('1111', queue);
//   //queue = [];

  
// });

transform(code, 'bu', ()=>{
  console.log('queue', queue);
});





// console.log('1=====',getXml());
// console.log('2=====',getXml());
