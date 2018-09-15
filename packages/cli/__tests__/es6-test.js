const babel = require('babel-core');
const { transform, getTemplate, evalClass } = require('./utils/utils');
let q = require('../packages/translator/queue');
const prettifyXml = require('prettify-xml');


describe('es6 support', ()=>{
    test('work with es6 template string', ()=>{
        let code = transform(
            `
                return (
                <div>Hello, {\`beautiful girl, \${this.state.msg}\`}</div>
                )
            `

        )
    
        let template = getTemplate(q);
        expect(template).toMatch(
            prettifyXml(
                '<view>Hello, {{"beautiful girl, " + state.msg}}</view>'
            )
        );
    });


    test('work with object rest spread', ()=>{
        let fnString = `
           function rest(){
                let tree = {
                    a: 1,
                    b: 2,
                }
                tree = {
                    ...tree,
                    c: 3
                }
                return tree;
           }
        `
        let result = babel.transform(
            fnString,
            {
                plugins: [
                    'transform-object-rest-spread'
                ]
            }
        )

         eval(result.code);
         expect(rest()).toEqual(expect.objectContaining({
             a: 1,
             b: 2,
             c: 3
         }))

    })

})