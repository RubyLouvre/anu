const { transform, getXml } = require('./utils/utils');
const prettifyXml = require('prettify-xml');

describe('if statement', () => {
    test('loop 简单情况-ali', () => {
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
        transform(code, 'ali');
        let templateAli = getXml();
        expect(prettifyXml(templateAli)).toMatch(
            prettifyXml(
                `<view>
        <block a:for="{{state.array}}" a:for-item="item" a:for-index="index" a:key="*this">
          <view>{{item.item}}</view>
        </block>
      </view>`
            )
        );
    });
    test('loop 简单情况，有key值1 -ali', () => {
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
        transform(code, 'ali');
        let templateAli = getXml();
        expect(prettifyXml(templateAli)).toMatch(
            prettifyXml(
                `<view>
        <block a:for="{{state.array}}" a:for-item="item" a:for-index="index" a:key="item">
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
        transform(code, 'ali');
        let templateAli = getXml();
        expect(prettifyXml(templateAli)).toMatch(
            prettifyXml(
                `<view>
        <block a:for="{{state.array}}" a:for-item="item" a:for-index="i190" a:key="*this">
          <view>{{item.item}}</view>
        </block>
      </view>`
            )
        );
    });
});
