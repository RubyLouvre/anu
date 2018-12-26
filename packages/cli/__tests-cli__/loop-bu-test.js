const {  getXml } = require('./utils/utils');
const prettifyXml = require('prettify-xml');

const BUILD_TYPE = 'bu';

describe('loop 简单情况', () => {
    test('loop 简单情况-bu', async () => {
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
        
        let templateBu = await getXml(code, BUILD_TYPE);
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
    test('loop 简单情况，有key值1 -bu', async () => {
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
        
        let templateBu = await getXml(code, BUILD_TYPE);
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

    test('loop 简单情况，有key值2 -bu', async () => {
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
        
        let templateBu = await getXml(code, BUILD_TYPE);
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

    test('loop 二重循环 -bu', async () => {
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
          <block s-for="{{state.multiArr}}" s-for-item="item" s-for-index="i185">
            <view>
              <block s-for="{{item.list}}" s-for-item="item2" s-for-index="i284">
                <text>{{item2}}</text>
              </block>
            </view>
          </block>
        </view>`
            )
        );
    });

    test('calee 之前可以使用逻辑表达式 -bu', async () => {
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
          <block s-if="state.array.length">
          <block s-for="{{state.array}}" s-for-item="item" s-for-index="index" s-key="*this">
          <view>{{item.item}}</view>
          </block>
          </block>
          </view>`
            )
        );
    });

    test('calee 之前可以使用逻辑表达式2 -bu', async () => {
        let code = `
        return (
          <div>
            {
              this.state.array && this.state.array.length && this.state.array.map(function(item) {
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
          <block s-if="state.array && state.array.length">
            <block s-for="{{state.array}}" s-for-item="item" s-for-index="i253">
              <view>{{item.item}}</view>
            </block>
          </block>
        </view>`
            )
        );
    });

    test('loop 二重循环并支持条件表达式-bu', async () => {
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
        let templatett = await getXml(code, BUILD_TYPE);
        expect(prettifyXml(templatett)).toMatch(
            prettifyXml(
                `<view>
          <block s-for="{{state.multiArr}}" s-for-item="item" s-for-index="i185">
            <view>
              <block s-for="{{item.list}}" s-for-item="item2" s-for-index="i284">
                <block s-if="state.isOk">
                  <text>{{item2}}</text>
                </block>
                <block s-elif="true">
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
