const { getXml } = require('./utils/utils');
const prettifyXml = require('prettify-xml');
const BUILD_TYPE = 'quick';

describe('if statement', () => {
    test('if 简单情况-quick', async () => {
        let code = ` 
    if (this.state.tasks !== null) {
      return <view class='page-body'>tasks</view>
    }
    return (
        <div class="page-body"><span>Hello world!</span></div>
     )
   `;
        let templateWX = await getXml(code, BUILD_TYPE);
        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                `<template>
            <block if="{{state.tasks !== null}}">
                <div class="page-body"><text>tasks</text></div>
            </block>
            <block elif="true">
                <div class="page-body"><text>Hello world!</text></div>
            </block>
    </template>`
            )
        );
    });

    test('if-eles quick', async () => {
        let code = `
    if (this.state.tasks !== null) {
      return <view class="page-body">tasks</view>;
    } else if (this.state.task.length === 0) {
      return (
        <view class="page-body">
          <text>{tasks.length}</text>
        </view>
      );
    } else {
      return (
        <div class="page-body">
          <span>Hello world!</span>
        </div>
      );
    }
    `;
        let templateWX = await getXml(code, BUILD_TYPE);
        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                `<template>
            <block if="{{state.tasks !== null}}">
                <div class="page-body"><text>tasks</text></div>
            </block>
            <block elif="true">
                <block if="{{state.task.length === 0}}">
                    <div class="page-body"><text>{{tasks.length}}</text></div>
                </block>
                <block elif="true">
                    <div class="page-body"><text>Hello world!</text></div>
                </block>
            </block>
    </template>`
            )
        );
    });
});

describe('逻辑表达式-二元', () => {
    test('二元表达式-简单情况-quick', async () => {
        let code = 'return <div>{this.state.show && <div>hello word</div>}</div>;';
        let templateWX = await getXml(code, BUILD_TYPE);
        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                `<template>
            <div>
                <block if="{{state.show}}">
                    <div><text>hello word</text></div>
                </block>
            </div>
    </template>`
            )
        );
    });

    test('二元表达式-多重1-quick', async () => {
        let code = 'return <div>{(this.state.show && this.state.isOk) && <div>hello word</div>}</div>;';
        let templateWX = await getXml(code, BUILD_TYPE);
        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                `<template>
            <div>
                <block if="{{state.show && state.isOk}}">
                    <div><text>hello word</text></div>
                </block>
            </div>
    </template>`
            )
        );
    });
    test('二元表达式-多重2-quick', async () => {
        let code = 'return <div>{(this.state.show || this.state.isOk) && <div>hello word</div>}</div>;';
        let templateWX = await getXml(code, BUILD_TYPE);
        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                `<template>
          <div>
              <block if="{{state.show || state.isOk}}">
                  <div><text>hello word</text></div>
              </block>
          </div>
  </template>`
            )
        );
    });
});

describe('逻辑表达式-三元', () => {
    test('三元表达式-简单情况-quick', async () => {
        let code = 'return <div>{this.state.show ? <div>hello word</div>: <div>hello nanachi</div>}</div> ;';
        let templateWX = await getXml(code, BUILD_TYPE);
        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                `<template>
        <div>
        <block if="{{state.show}}">
            <div><text>hello word</text></div>
        </block>
        <block elif="true">
            <div><text>hello nanachi</text></div>
        </block>
    </div>
    </template>`
            )
        );
    });

    test('三元表达式-多重-quick', async () => {
        let code = `return (
      <div>
        {this.state.show ? (
          this.state.isOk ? (
            <div>hello word</div>
          ) : (
            <div>hello</div>
          )
        ) : (
          <div>nanachi</div>
        )}
      </div>
    );`;
        let templateWX = await getXml(code, BUILD_TYPE);
        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                `<template>
            <div>
                <block if="{{state.show}}">
                    <block if="{{state.isOk}}">
                        <div><text>hello word</text></div>
                    </block>
                    <block elif="true">
                        <div><text>hello</text></div>
                    </block>
                </block>
                <block elif="true">
                    <div><text>nanachi</text></div>
                </block>
            </div>
    </template>`
            )
        );
    });
});
