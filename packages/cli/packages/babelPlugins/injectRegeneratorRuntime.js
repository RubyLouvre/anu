let config = require('../config');
let t = require('babel-types');
let hackList = ['wx', 'bu', 'tt', 'quick'];


//插入regenerator-runtime/runtime'
let visitor = {
    FunctionDeclaration: {
        exit(astPath) {
            //微信，百度小程序async/await语法需要插入var regeneratorRuntime = require('regenerator-runtime/runtime');
            let name = astPath.node.id.name;
            if ( !(name === '_asyncToGenerator' && hackList.includes(config.buildType))  ) {
                return;
            }
            let root = astPath.findParent(t.isProgram);
            root.node.body.unshift(
                t.variableDeclaration('var', [
                    t.variableDeclarator(
                        t.identifier('regeneratorRuntime'),
                        t.callExpression(t.identifier('require'), [
                            t.stringLiteral('regenerator-runtime/runtime')
                        ])
                    )
                ])
            );
        }
    }
};

/**
 *  async function a(){
 *      var t =  await m();
 *  }
 *  
 *  转换成
 * 
 *  let a = async function(){
 *     var t =  await m();
 *  }
 * 
 */
let visitor2 = {
    FunctionDeclaration: {
        enter(astPath){
            let node = astPath.node;
            if (!node.async) return;
            let id = node.id.name;
            let params = node.params;
            let body = node.body;
            astPath.replaceWith(
                t.variableDeclaration('let', [
                    t.variableDeclarator(
                        t.identifier(id),
                        t.functionExpression(
                            null,
                            params,
                            body,
                            false,  //generator
                            true    //async
                        )
                    )
                ])
            );
        },
    }
};


module.exports = [
    function(){
        return {
            visitor: visitor2
        };
    },
    require('babel-plugin-transform-async-to-generator'),
    function(){
        return {
            visitor: visitor
        };
    }
];
