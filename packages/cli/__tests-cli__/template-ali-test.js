const { getXml } = require('./utils/utils');
const prettifyXml = require('prettify-xml');


describe('属性模版测试 -ali', () => {
  
    test('className1 -ali', async() => {

        let code = 'return <div class={this.state.flag === \'checked\' ? \'checked\' : \'\'}></div>';
        let templateWX = await getXml(code, 'ali');

        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                '<view class="{{state.flag === \'checked\' ? \'checked\' : \'\'}}"></view>'
            ));
    });

    test('className2 -ali', async() => {

        let code = 'return <div class={\'aaa \'+ (this.state.isOk && this.state.flag === \'checked\' ? \'checked\' : \'\') }></div>';
        let templateWX = await getXml(code, 'ali');

        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                '<view class="aaa {{state.isOk && state.flag === \'checked\' ? \'checked\' : \'\'}}"></view>'
            ));
    });

    test('canvas id-ali', async() => {
        let code = 'return <canvas id="myCanvas"/>';
        let template = await getXml(code, 'ali');

        expect(prettifyXml(template)).toMatch(
            prettifyXml('<canvas id="myCanvas" />')
        );
    });

});