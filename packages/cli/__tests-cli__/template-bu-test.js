const { getXml } = require('./utils/utils');
const prettifyXml = require('prettify-xml');


describe('属性模版测试 -bu', () => {
  
    test('className1 -bu', async() => {

        let code = 'return <div class={this.state.flag === \'checked\' ? \'checked\' : \'\'}></div>';
        let templateWX = await getXml(code, 'bu');

        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                '<view class="{{state.flag === \'checked\' ? \'checked\' : \'\'}}"></view>'
            ));
    });

    test('className2 -bu', async() => {

        let code = 'return <div class={\'aaa \'+ (this.state.isOk && this.state.flag === \'checked\' ? \'checked\' : \'\') }></div>';
        let templateWX = await getXml(code, 'bu');

        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                '<view class="aaa {{state.isOk && state.flag === \'checked\' ? \'checked\' : \'\'}}"></view>'
            ));
    });

    test('canvas id-bu', async() => {
        let code = 'return <canvas id="myCanvas" />';
        let template = await getXml(code, 'bu');

        expect(prettifyXml(template)).toMatch(
            prettifyXml('<canvas id="myCanvas" canvas-id="myCanvas" />')
        );
    });

});