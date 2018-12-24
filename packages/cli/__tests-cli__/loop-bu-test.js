const { transform, getXml } = require('./utils/utils');
const prettifyXml = require('prettify-xml');

describe('if statement', () => {
  test('loop 简单情况-bu', () => {
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
    transform(code, 'bu');
    let templateBu = getXml();
    expect(prettifyXml(templateBu)).toMatch(
      prettifyXml(
        `<view>
        <block s-for="{{state.array}}" s-for-item="item" s-for-index="index">
        <view>{{item.item}}</view>
        </block>
        </view>`
      )
    );
  });
  test('loop 简单情况，有key值1 -bu', () => {
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
    transform(code, 'bu');
    let templateBu = getXml();
    expect(prettifyXml(templateBu)).toMatch(
      prettifyXml(
        `<view>
        <block s-for="{{state.array}}" s-for-item="item" s-for-index="index" s-key="item">
          <view>{{item.item}}</view>
        </block>
      </view>`
      )
    );
  });

  test('loop 简单情况，有key值2 -ali', () => {
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
    transform(code, 'bu');
    let templateBu = getXml();
    expect(prettifyXml(templateBu)).toMatch(
      prettifyXml(
        `<view>
        <block s-for="{{state.array}}" s-for-item="item" s-for-index="i190" s-key="*this">
          <view>{{item.item}}</view>
        </block>
      </view>`
      )
    );
  });
});
