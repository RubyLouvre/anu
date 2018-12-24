const { transform, getXml } = require('./utils/utils');
const prettifyXml = require('prettify-xml');

describe('if statement', () => {
  test('loop 简单情况-tt', () => {
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
    transform(code, 'tt');
    let templateTt = getXml();
    expect(prettifyXml(templateTt)).toMatch(
      prettifyXml(
        `<view>
        <block tt:for="{{state.array}}" tt:for-item="item" tt:for-index="index" tt:key="*this">
          <view>{{item.item}}</view>
        </block>
      </view>`
      )
    );
  });
  test('loop 简单情况，有key值1 -tt', () => {
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
    transform(code, 'tt');
    let templateTt = getXml();
    expect(prettifyXml(templateTt)).toMatch(
      prettifyXml(
        `<view>
        <block tt:for="{{state.array}}" tt:for-item="item" tt:for-index="index" tt:key="item">
          <view>{{item.item}}</view>
        </block>
      </view>`
      )
    );
  });

  test('loop 简单情况，有key值2 -tt', () => {
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
    transform(code, 'tt');
    let templateTt = getXml();
    expect(prettifyXml(templateTt)).toMatch(
      prettifyXml(
        `<view>
        <block tt:for="{{state.array}}" tt:for-item="item" tt:for-index="i190" tt:key="*this">
          <view>{{item.item}}</view>
        </block>
      </view>`
      )
    );
  });
});
