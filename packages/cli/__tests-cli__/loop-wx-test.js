const { transform, getXml } = require('./utils/utils');
const prettifyXml = require('prettify-xml');

describe('if statement', () => {
  test('loop 简单情况-wx', () => {
    let code = `
    return (
      <div>
        {
          this.state.array.map(function(item, index) {
            return <div>{item.item}</div>
          })
        }
      </div>
    )
    `;
    transform(code, 'wx');
    let templateWX = getXml();
    expect(prettifyXml(templateWX)).toMatch(
      prettifyXml(
        `<view>
        <block wx:for="{{state.array}}" wx:for-item="item" wx:for-index="index" wx:key="*this">
          <view>{{item.item}}</view>
        </block>
      </view>`
      )
    );
  });
  test('loop 简单情况，有key值1 -wx', () => {
    let code = `
    return (
      <div>
        {
          this.state.array.map(function(item, index) {
            return <div key={item.item}>{item.item}</div>
          })
        }
      </div>
    )
    `;
    transform(code, 'wx');
    let templateWX = getXml();
    expect(prettifyXml(templateWX)).toMatch(
      prettifyXml(
        `<view>
        <block wx:for="{{state.array}}" wx:for-item="item" wx:for-index="index" wx:key="item">
          <view>{{item.item}}</view>
        </block>
      </view>`
      )
    );
  });

  test('loop 简单情况，有key值2 -wx', () => {
    let code = `
    return (
      <div>
        {
          this.state.array.map(function(item) {
            return <div key={item}>{item.item}</div>
          })
        }
      </div>
    )
    `;
    transform(code, 'wx');
    let templateWX = getXml();
    expect(prettifyXml(templateWX)).toMatch(
      prettifyXml(
        `<view>
        <block wx:for="{{state.array}}" wx:for-item="item" wx:for-index="i190" wx:key="*this">
          <view>{{item.item}}</view>
        </block>
      </view>`
      )
    );
  });
});
