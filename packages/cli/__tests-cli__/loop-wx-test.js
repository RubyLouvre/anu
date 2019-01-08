const { getXml } = require('./utils/utils');
const prettifyXml = require('prettify-xml');
const BUILD_TYPE = 'wx';

describe('loop 简单情况', () => {
    test('loop 简单情况-wx', async () => {
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

        let templateWX = await getXml(code, BUILD_TYPE);
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
    test('loop 简单情况，有key值1 -wx', async () => {
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

        let templateWX = await getXml(code, BUILD_TYPE);
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

    test('loop 简单情况，有key值2 -wx', async () => {
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

        let templateWX = await getXml(code, BUILD_TYPE);
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

    test('calee 之前可以使用逻辑表达式 -wx', async () => {
        let code = `
      return (
        <div>
          {
            this.state.array.length ? this.state.array.map(function(item, index) {
              return <div key={index}>{item.item}</div>
            }) : null
          }
        </div>
      )
      `;

        let templateWX = await getXml(code, BUILD_TYPE);
        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                `<view>
              <block wx:if="{{state.array.length}}">
                <block wx:for="{{state.array}}" wx:for-item="item" wx:for-index="index" wx:key="*this">
                  <view>{{item.item}}</view>
                </block>
              </block>
            </view>`
            )
        );
    });

    test('calee 之前可以使用逻辑表达式2 -wx', async () => {
        let code = `
      return (
        <div>
          {
            this.state.array&& this.state.array.length && this.state.array.map(function(item) {
              return <div >{item.item}</div>
            })
          }
        </div>
      )
      `;

        let templateWX = await getXml(code, BUILD_TYPE);
        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                `<view>
        <block wx:if="{{state.array && state.array.length}}">
          <block wx:for="{{state.array}}" wx:for-item="item" wx:for-index="i244" wx:key="*this">
            <view>{{item.item}}</view>
          </block>
        </block>
      </view>`
            )
        );
    });

    test('loop 二重循环-wx', async () => {
        let code = `
    return (
      <div>
        {this.state.multiArr.map(function(item) {
          return (
            <div>
              {item.list.map(function(item2) {
                return <span>{item2}</span>;
              })}
            </div>
          );
        })}
      </div>
    );
    `;
        let templateWX = await getXml(code, BUILD_TYPE);
        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                `<view>
        <block wx:for="{{state.multiArr}}" wx:for-item="item" wx:for-index="i179" wx:key="*this">
          <view>
            <block wx:for="{{item.list}}" wx:for-item="item2" wx:for-index="i272" wx:key="*this">
              <text>{{item2}}</text>
            </block>
          </view>
        </block>
      </view>`
            )
        );
    });

    test('loop 二重循环并支持条件表达式-wx', async () => {
        let code = `
    return (
      <div>
        {this.state.multiArr.map(function(item) {
          return (
            <div>
              {item.list.map(function(item2) {
                return this.state.isOk ? <span>{item2}</span> : <div>noOk</div>;
              })}
            </div>
          );
        })}
      </div>
    );
    `;
        let templateWX = await getXml(code, BUILD_TYPE);
        expect(prettifyXml(templateWX)).toMatch(
            prettifyXml(
                `<view>
        <block wx:for="{{state.multiArr}}" wx:for-item="item" wx:for-index="i179" wx:key="*this">
          <view>
            <block wx:for="{{item.list}}" wx:for-item="item2" wx:for-index="i272" wx:key="*this">
              <block wx:if="{{state.isOk}}">
                <text>{{item2}}</text>
              </block>
              <block wx:else="true">
                <view>noOk</view>
              </block>
            </block>
          </view>
        </block>
      </view>`
            )
        );
    });
});
