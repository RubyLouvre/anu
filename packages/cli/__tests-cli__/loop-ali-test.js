const {  getXml } = require('./utils/utils');
const prettifyXml = require('prettify-xml');
const BUILD_TYPE = 'ali';

describe('loop 简单情况', () => {
    test('loop 简单情况-ali', async () => {
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
        
        let templateAli = await getXml(code, BUILD_TYPE);
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
    test('loop 简单情况，有key值1 -ali', async () => {
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
        
        let templateAli = await getXml(code, BUILD_TYPE);
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

    test('loop 简单情况，有key值2 -ali', async () => {
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
        
        let templateAli = await getXml(code, BUILD_TYPE);
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

    test('loop 二重循环 -ali', async () => {
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
          <block a:for="{{state.multiArr}}" a:for-item="item" a:for-index="i185" a:key="*this">
            <view>
              <block a:for="{{item.list}}" a:for-item="item2" a:for-index="i284" a:key="*this">
                <text>{{item2}}</text>
              </block>
            </view>
          </block>
        </view>`
            )
        );
    });

    test('calee 之前可以使用逻辑表达式 -ali', async () => {
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
                <block a:if="{{state.array.length}}">
                  <block a:for="{{state.array}}" a:for-item="item" a:for-index="index" a:key="*this">
                    <view>{{item.item}}</view>
                  </block>
                </block>
              </view>`
            )
        );
    });

    test('calee 之前可以使用逻辑表达式2 -ali', async () => {
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
          <block a:if="{{state.array && state.array.length}}">
            <block a:for="{{state.array}}" a:for-item="item" a:for-index="i252" a:key="*this">
              <view>{{item.item}}</view>
            </block>
          </block>
        </view>`
            )
        );
    });

    test('loop 二重循环并支持条件表达式-ali', async () => {
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
          <block a:for="{{state.multiArr}}" a:for-item="item" a:for-index="i185" a:key="*this">
            <view>
              <block a:for="{{item.list}}" a:for-item="item2" a:for-index="i284" a:key="*this">
                <block a:if="{{state.isOk}}">
                  <text>{{item2}}</text>
                </block>
                <block a:elif="true">
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
