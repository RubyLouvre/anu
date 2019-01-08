const { getXml } = require('./utils/utils');
const prettifyXml = require('prettify-xml');
const BUILD_TYPE = 'quick';

describe('属性模版测试 -quick', () => {
    test('className1 -quick', async () => {
        let code = 'return <div class={this.state.flag === \'checked\' ? \'checked\' : \'\'}></div>';
        let templateWX = await getXml(code, BUILD_TYPE);

        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                `<template>
        <div class="{{state.flag === 'checked' ? 'checked' : ''}}"></div>
</template>`
            )
        );
    });

    test('className2 -quick', async () => {
        let code =
      'return <div class={\'aaa \'+ (this.state.isOk && this.state.flag === \'checked\' ? \'checked\' : \'\') }></div>';
        let templateWX = await getXml(code, BUILD_TYPE);

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
        let template = await getXml(code, BUILD_TYPE);

        expect(prettifyXml(template)).toMatch(
            prettifyXml(
                `<template>
        <div show="{{!state.isOk}}"><text>hello world</text></div>
    </template>`
            )
        );
    });

    test('canvas id-quick', async () => {
        let code = 'return <canvas id="myCanvas" />';
        let template = await getXml(code, BUILD_TYPE);

        expect(prettifyXml(template)).toMatch(
            prettifyXml(`<template>
      <canvas id="myCanvas"></canvas>
  </template>`)
        );
    });

    test('input type-quick', async () => {
        let code = 'return <input type="idcard" />';
        let template = await getXml(code, BUILD_TYPE);

        expect(prettifyXml(template)).toMatch(
            prettifyXml(`<template>
      <input type="idcard"></input>
  </template>`)
        );
    });
});

describe('事件模版 -quick', () => {
    test('点击事件1 -quick', async () => {
        let code = 'return <div onTap={this.tap.bind(this)}>hello world</div>;';

        let template = await getXml(code, BUILD_TYPE);
        expect(prettifyXml(template)).toMatch(
            prettifyXml(`<template>
          <div onclick="dispatchEvent" data-click-uid="e8_19" data-beacon-uid="default"><text>hello world</text></div>
  </template>`)
        );
    });

    test('点击事件2 -quick', async () => {
        let code = 'return <div catchTap={this.tap.bind(this)}>hello world</div>;';

        let template = await getXml(code, BUILD_TYPE);
        expect(prettifyXml(template)).toMatch(
            prettifyXml(`<template>
          <div onclick="dispatchEvent" data-click-uid="e8_19" data-beacon-uid="default"><text>hello world</text></div>
  </template>`)
        );
    });

    test('input change 事件 -quick', async () => {
        let code = 'return <input onChange={this.change.bind(this)} />';

        let template = await getXml(code, BUILD_TYPE);
        expect(prettifyXml(template)).toMatch(
            prettifyXml(`
      <template>
        <input onchange="dispatchEvent" data-change-uid="e8_21" data-beacon-uid="default"></input>
</template>
      `)
        );
    });
});

describe('slot', () => {
    test('slot 测试-quick', async () => {
        let code = `return (<div>
    {this.props.children}
  </div>);`;
        let template = await getXml(code, BUILD_TYPE);
        expect(prettifyXml(template)).toMatch(
            prettifyXml(`<template>
    <div>
        <slot></slot>
    </div>
</template>`)
        );
    });
});
