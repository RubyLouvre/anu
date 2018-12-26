const {  getXml } = require('./utils/utils');
const prettifyXml = require('prettify-xml');
const BUILD_TYPE = 'tt';

describe('loop 简单情况', () => {
    test('loop 简单情况-tt', async () => {
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
        
        let templateTt = await getXml(code, BUILD_TYPE);
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
    test('loop 简单情况，有key值1 -tt', async () => {
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
        
        let templateTt = await getXml(code, BUILD_TYPE);
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

    test('loop 简单情况，有key值2 -tt', async () => {
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
        
        let templateTt = await getXml(code, BUILD_TYPE);
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

    test('loop 二重循环-tt', async () => {
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
          <block tt:for="{{state.multiArr}}" tt:for-item="item" tt:for-index="i185" tt:key="*this">
            <view>
              <block tt:for="{{item.list}}" tt:for-item="item2" tt:for-index="i284" tt:key="*this">
                <text>{{item2}}</text>
              </block>
            </view>
          </block>
        </view>`
            )
        );
    });

    test('calee 之前可以使用逻辑表达式 -tt', async () => {
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
                <block tt:if="{{state.array.length}}">
                  <block tt:for="{{state.array}}" tt:for-item="item" tt:for-index="index" tt:key="*this">
                    <view>{{item.item}}</view>
                  </block>
                </block>
              </view>`
            )
        );
    });

    test('calee 之前可以使用逻辑表达式2 -tt', async () => {
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
          <block tt:if="{{state.array && state.array.length}}">
            <block tt:for="{{state.array}}" tt:for-item="item" tt:for-index="i252" tt:key="*this">
              <view>{{item.item}}</view>
            </block>
          </block>
        </view>`
            )
        );
    });

    test('loop 二重循环并支持条件表达式-tt', async () => {
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
          <block tt:for="{{state.multiArr}}" tt:for-item="item" tt:for-index="i185" tt:key="*this">
            <view>
              <block tt:for="{{item.list}}" tt:for-item="item2" tt:for-index="i284" tt:key="*this">
                <block tt:if="{{state.isOk}}">
                  <text>{{item2}}</text>
                </block>
                <block tt:else="true">
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
