const { getXml } = require('./utils/utils');
const prettifyXml = require('prettify-xml');
const BUILD_TYPE = 'tt';

describe('if statement', () => {
    test('if 简单情况-tt', async () => {
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
                `<block tt:if="{{state.tasks !== null}}">
        <view class="page-body">tasks</view>
        </block>
        <block tt:else="true">
        <view class="page-body">
        <text>Hello world!</text>
        </view>
        </block>`
            )
        );
    });

    test('if-eles tt', async () => {
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
                `<block tt:if="{{state.tasks !== null}}">
        <view class="page-body">tasks</view>
      </block>
      <block tt:else="true">
        <block tt:if="{{state.task.length === 0}}">
          <view class="page-body">
            <text>{{tasks.length}}</text>
          </view>
        </block>
        <block tt:else="true">
          <view class="page-body">
            <text>Hello world!</text>
          </view>
        </block>
      </block>`
            )
        );
    });
});

describe('逻辑表达式-二元', () => {
    test('二元表达式-简单情况-tt', async () => {
        let code = 'return <div>{this.state.show && <div>hello word</div>}</div>;';
        let templateWX = await getXml(code, BUILD_TYPE);
        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                `<view>
        <block tt:if="{{state.show}}">
          <view>hello word</view>
        </block>
      </view>`
            )
        );
    });

    test('二元表达式-多重1-tt', async () => {
        let code = 'return <div>{(this.state.show && this.state.isOk) &&<div>hello word</div>}</div> ;';
        let templateWX = await getXml(code, BUILD_TYPE);
        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                `<view>
        <block tt:if="{{state.show && state.isOk}}">
          <view>hello word</view>
        </block>
      </view>`
            )
        );
    });

    test('二元表达式-多重2-tt', async () => {
        let code = 'return <div>{(this.state.show || this.state.isOk) &&<div>hello word</div>}</div> ;';
        let templateWX = await getXml(code, BUILD_TYPE);
        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                `<view>
      <block tt:if="{{state.show || state.isOk}}">
        <view>hello word</view>
      </block>
    </view>`
            )
        );
    });
});

describe('逻辑表达式-三元', () => {
    test('三元表达式-简单情况-tt', async () => {
        let code = 'return <div>{this.state.show ? <div>hello word</div>: <div>hello nanachi</div>}</div> ;';
        let templateWX = await getXml(code, BUILD_TYPE);
        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                `<view>
        <block tt:if="{{state.show}}">
          <view>hello word</view>
        </block>
        <block tt:else="true">
          <view>hello nanachi</view>
        </block>
      </view>`
            )
        );
    });

    test('三元表达式-多重-tt', async () => {
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
                `<view>
        <block tt:if="{{state.show}}">
          <block tt:if="{{state.isOk}}">
            <view>hello word</view>
          </block>
          <block tt:else="true">
            <view>hello</view>
          </block>
        </block>
        <block tt:else="true">
          <view>nanachi</view>
        </block>
      </view>`
            )
        );
    });
});
