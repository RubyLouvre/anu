const { getXml } = require('./utils/utils');
const prettifyXml = require('prettify-xml');

describe('属性模版测试 -wx', () => {
    test('className1 -wx', async () => {
        let code = 'return <div class={this.state.flag === \'checked\' ? \'checked\' : \'\'}></div>';
        let templateWX = await getXml(code, 'wx');

        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml('<view class="{{state.flag === \'checked\' ? \'checked\' : \'\'}}"></view>')
        );
    });

    test('className2 -wx', async () => {
        let code = 'return <div class={\'aaa \'+ (this.state.isOk && this.state.flag === \'checked\' ? \'checked\' : \'\') }></div>';
        let templateWX = await getXml(code, 'wx');

        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                '<view class="aaa {{state.isOk && state.flag === \'checked\' ? \'checked\' : \'\'}}"></view>'
            )
        );
    });

    test('hidden -wx', async () => {
        let code = 'return <div hidden={this.state.isOk}>hello world</div>;';

        let template = await getXml(code, 'wx');

        expect(prettifyXml(template)).toMatch(
            prettifyXml('<view hidden="{{state.isOk}}">hello world</view>')
        );
    });

    test('canvas id-wx', async() => {
        let code = 'return <canvas id="myCanvas"/>';
        let template = await getXml(code, 'wx');

        expect(prettifyXml(template)).toMatch(
            prettifyXml('<canvas id="myCanvas" canvas-id="myCanvas" />')
        );
    });
});
