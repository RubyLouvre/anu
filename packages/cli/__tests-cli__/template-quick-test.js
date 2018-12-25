const { getXml } = require('./utils/utils');
const prettifyXml = require('prettify-xml');

describe('属性模版测试 -quick', () => {
    test('className1 -quick', async () => {
        let code = 'return <div class={this.state.flag === \'checked\' ? \'checked\' : \'\'}></div>';
        let templateWX = await getXml(code, 'quick');

        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                `<template>
        <div class="{{state.flag === 'checked' ? 'checked' : ''}}"></div>
</template>`
            )
        );
    });

    test('className2 -quick', async () => {
        let code = 'return <div class={\'aaa \'+ (this.state.isOk && this.state.flag === \'checked\' ? \'checked\' : \'\') }></div>';
        let templateWX = await getXml(code, 'quick');

        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                `<template>
            <div class="aaa {{state.isOk && state.flag === 'checked' ? 'checked' : ''}}"></div>
    </template>`
            )
        );
    });

    test('hidden -quick', async () => {
        let code = 'return <div hidden={this.state.isOk}>hello world</div>';
        let template = await getXml(code, 'quick');

        expect(prettifyXml(template)).toMatch(
            prettifyXml(
                `<template>
        <div show="{{!state.isOk}}"><text>hello world</text></div>
    </template>`
            )
        );
    });

    test('canvas id-quick', async() => {
        let code = 'return <canvas id="myCanvas" />';
        let template = await getXml(code, 'quick');

        expect(prettifyXml(template)).toMatch(
            prettifyXml(`<template>
      <canvas id="myCanvas"></canvas>
  </template>`)
        );
    });
});
