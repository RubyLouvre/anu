const { transform, getXml } = require('./utils/utils');
const prettifyXml = require('prettify-xml');

describe('if statement', () => {
    test('if 简单情况', () => {
        let code = ` 
    if (this.state.tasks !== null) {
      return <view class='page-body'>tasks</view>
    }
    return (
        <div class="page-body"><span>Hello world!</span></div>
     )
   `;
        transform(code, 'wx');
        let templateWX = getXml();
        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                `<block wx:if="{{state.tasks !== null}}">
        <view class="page-body">tasks</view>
      </block>
      <block wx:else="true">
        <view class="page-body">
          <text>Hello world!</text>
        </view>
      </block>`
            )
        );
        transform(code, 'ali');
        let templateAli = getXml();
        expect(prettifyXml(templateAli)).toMatch(
            prettifyXml(
                `<block a:if="{{state.tasks !== null}}">
        <view class="page-body">tasks</view>
      </block>
      <block a:else="true">
        <view class="page-body">
          <text>Hello world!</text>
        </view>
      </block>`
            )
        );
    });
});
